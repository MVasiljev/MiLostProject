use crate::render::node::RenderNode;
use super::layout_engine::{LayoutMeasurement, LayoutPositioning};
use super::layout_info::LayoutInfo;
use super::layout_utils::parse_edge_insets;
use super::types::{Rect, Size};
use std::collections::HashMap;

pub enum FlexDirection {
    Horizontal,
    Vertical,
}

pub enum MainAxisAlignment {
    Start,
    End,
    Center,
    SpaceBetween,
    SpaceAround,
    SpaceEvenly,
}

pub enum CrossAxisAlignment {
    Stretch,
    Start,
    End,
    Center,
    Baseline,
}

fn parse_main_axis_alignment(alignment: &str) -> MainAxisAlignment {
    match alignment.to_lowercase().as_str() {
        "start" | "leading" => MainAxisAlignment::Start,
        "end" | "trailing" => MainAxisAlignment::End,
        "center" => MainAxisAlignment::Center,
        "space-between" => MainAxisAlignment::SpaceBetween,
        "space-around" => MainAxisAlignment::SpaceAround,
        "space-evenly" => MainAxisAlignment::SpaceEvenly,
        _ => MainAxisAlignment::Start,
    }
}

fn parse_cross_axis_alignment(alignment: &str, direction: &FlexDirection) -> CrossAxisAlignment {
    match direction {
        FlexDirection::Horizontal => {
            match alignment.to_lowercase().as_str() {
                "stretch" => CrossAxisAlignment::Stretch,
                "start" | "top" => CrossAxisAlignment::Start,
                "end" | "bottom" => CrossAxisAlignment::End,
                "center" => CrossAxisAlignment::Center,
                "baseline" | "first_text_baseline" | "last_text_baseline" => CrossAxisAlignment::Baseline,
                _ => CrossAxisAlignment::Center,
            }
        },
        FlexDirection::Vertical => {
            match alignment.to_lowercase().as_str() {
                "stretch" => CrossAxisAlignment::Stretch,
                "start" | "leading" => CrossAxisAlignment::Start,
                "end" | "trailing" => CrossAxisAlignment::End,
                "center" => CrossAxisAlignment::Center,
                _ => CrossAxisAlignment::Start,
            }
        }
    }
}

pub fn measure_flex(
    node: &RenderNode, 
    available_size: Size, 
    engine: &mut impl LayoutMeasurement,
    direction: FlexDirection
) -> Size {
    let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
    let equal_spacing = node.get_prop("equal_spacing")
        .and_then(|val| val.as_boolean())
        .unwrap_or(false);
            
    let insets = parse_edge_insets(node);
    
    let content_width = available_size.width - insets.horizontal_insets();
    let content_height = available_size.height - insets.vertical_insets();
    let content_size = Size::new(content_width, content_height);
    
    let is_horizontal = matches!(direction, FlexDirection::Horizontal);
    
    let mut main_size: f32 = 0.0;
    let mut cross_size: f32 = 0.0;
    let mut flex_items: Vec<(usize, f32)> = Vec::new();
    let mut non_flex_count = 0;
    
    for (i, child) in node.children.iter().enumerate() {
        let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
        
        if flex_grow > 0.0 {
            flex_items.push((i, flex_grow));
        } else {
            let child_size = engine.measure_node(child, content_size);
            
            if is_horizontal {
                main_size += child_size.width;
                cross_size = cross_size.max(child_size.height);
            } else {
                main_size += child_size.height;
                cross_size = cross_size.max(child_size.width);
            }
            
            non_flex_count += 1;
        }
    }
    
    let spacing_count = if equal_spacing {
        node.children.len().saturating_sub(1) as f32
    } else {
        (non_flex_count + flex_items.len()).saturating_sub(1) as f32
    };
    
    let total_spacing = spacing * spacing_count;
    main_size += total_spacing;
    
    let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
    let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
    
    let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
    let max_height = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
    
    let (width, height) = if is_horizontal {
        let width = main_size.max(min_width).min(max_width_constraint);
        let height = cross_size.max(min_height).min(max_height);
        (width, height)
    } else {
        let width = cross_size.max(min_width).min(max_width_constraint);
        let height = main_size.max(min_height).min(max_height);
        (width, height)
    };
    
    Size::new(
        width + insets.horizontal_insets(),
        height + insets.vertical_insets()
    )
}

pub fn position_flex_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning,
    direction: FlexDirection
) {
    let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
    let equal_spacing = node.get_prop("equal_spacing")
        .and_then(|val| val.as_boolean())
        .unwrap_or(false);
    let insets = parse_edge_insets(node);
    
    let content_frame = Rect::new(
        frame.x + insets.left,
        frame.y + insets.top,
        frame.width - insets.horizontal_insets(),
        frame.height - insets.vertical_insets()
    );
    
    let is_horizontal = matches!(direction, FlexDirection::Horizontal);
    
    let alignment_str = node.get_prop("alignment").map_or(
        if is_horizontal { "center" } else { "leading" },
        |v| v.as_string().map_or(
            if is_horizontal { "center" } else { "leading" },
            |s| s.as_str()
        )
    );
    
    let main_axis_alignment = parse_main_axis_alignment(alignment_str);
    let cross_axis_alignment = parse_cross_axis_alignment(alignment_str, &direction);
    
    let mut total_fixed_main = 0.0;
    let mut total_flex_grow = 0.0;
    let mut flex_items = Vec::new();
    let mut fixed_sizes = Vec::new();
    
    let layout_cache = engine.get_layout_cache();
    
    for (i, child) in node.children.iter().enumerate() {
        if let Some(mut child_layout) = layout_cache.get_mut(&child.id) {
            child_layout.parent_type = Some(
                if is_horizontal { "HStack" } else { "VStack" }.to_string()
            );
        }
        
        let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
        
        if flex_grow > 0.0 {
            total_flex_grow += flex_grow;
            flex_items.push((i, flex_grow));
        } else if let Some(child_layout) = layout_cache.get(&child.id) {
            let main_size = if is_horizontal {
                child_layout.content_size.width
            } else {
                child_layout.content_size.height
            };
            
            total_fixed_main += main_size;
            fixed_sizes.push((i, main_size));
        }
    }
    
    let mut total_spacing = 0.0;
    if equal_spacing && node.children.len() > 1 {
        let items_count = node.children.len() - 1;
        let available_space = if is_horizontal {
            content_frame.width - total_fixed_main
        } else {
            content_frame.height - total_fixed_main
        };
        
        let flex_space = if total_flex_grow > 0.0 {
            available_space * 0.5
        } else {
            0.0
        };
        
        total_spacing = (available_space - flex_space).max(0.0);
    } else if node.children.len() > 1 {
        total_spacing = spacing * (node.children.len() - 1) as f32;
    }
    
    let available_flex_main = if is_horizontal {
        (content_frame.width - total_fixed_main - total_spacing).max(0.0)
    } else {
        (content_frame.height - total_fixed_main - total_spacing).max(0.0)
    };
    
    let equal_space = if equal_spacing && node.children.len() > 1 {
        total_spacing / (node.children.len() - 1) as f32
    } else {
        spacing
    };
    
    let main_axis_start = match main_axis_alignment {
        MainAxisAlignment::Start => if is_horizontal { content_frame.x } else { content_frame.y },
        MainAxisAlignment::End => {
            let content_size = total_fixed_main + 
                (if total_flex_grow > 0.0 { available_flex_main } else { 0.0 }) +
                total_spacing;
            
            if is_horizontal {
                content_frame.x + content_frame.width - content_size
            } else {
                content_frame.y + content_frame.height - content_size
            }
        },
        MainAxisAlignment::Center => {
            let content_size = total_fixed_main + 
                (if total_flex_grow > 0.0 { available_flex_main } else { 0.0 }) +
                total_spacing;
            
            if is_horizontal {
                content_frame.x + (content_frame.width - content_size) / 2.0
            } else {
                content_frame.y + (content_frame.height - content_size) / 2.0
            }
        },
        MainAxisAlignment::SpaceBetween => {
            if node.children.len() <= 1 {
                if is_horizontal { content_frame.x } else { content_frame.y }
            } else {
                if is_horizontal { content_frame.x } else { content_frame.y }
            }
        },
        MainAxisAlignment::SpaceAround | MainAxisAlignment::SpaceEvenly => {
            if is_horizontal { content_frame.x } else { content_frame.y }
        }
    };
    
    let (item_spacing, edge_spacing) = match main_axis_alignment {
        MainAxisAlignment::SpaceBetween => {
            if node.children.len() <= 1 {
                (0.0, 0.0)
            } else {
                let total_main = if is_horizontal { content_frame.width } else { content_frame.height };
                let remaining = total_main - total_fixed_main - 
                    (if total_flex_grow > 0.0 { available_flex_main } else { 0.0 });
                
                (remaining / (node.children.len() - 1) as f32, 0.0)
            }
        },
        MainAxisAlignment::SpaceAround => {
            if node.children.len() == 0 {
                (0.0, 0.0)
            } else {
                let total_main = if is_horizontal { content_frame.width } else { content_frame.height };
                let remaining = total_main - total_fixed_main - 
                    (if total_flex_grow > 0.0 { available_flex_main } else { 0.0 });
                
                let space = remaining / (node.children.len() * 2) as f32;
                (space * 2.0, space)
            }
        },
        MainAxisAlignment::SpaceEvenly => {
            if node.children.len() == 0 {
                (0.0, 0.0)
            } else {
                let total_main = if is_horizontal { content_frame.width } else { content_frame.height };
                let remaining = total_main - total_fixed_main - 
                    (if total_flex_grow > 0.0 { available_flex_main } else { 0.0 });
                
                let space = remaining / (node.children.len() + 1) as f32;
                (space, space)
            }
        },
        _ => (equal_space, 0.0),
    };
    
    let mut main_offset = main_axis_start + edge_spacing;
    
    for (i, child) in node.children.iter().enumerate() {
        let layout_cache = engine.get_layout_cache();
        if let Some(child_layout) = layout_cache.get(&child.id) {
            let mut child_main = if is_horizontal {
                child_layout.content_size.width
            } else {
                child_layout.content_size.height
            };
            
            let child_cross = if is_horizontal {
                child_layout.content_size.height
            } else {
                child_layout.content_size.width
            };
            
            if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                if total_flex_grow > 0.0 {
                    child_main = (available_flex_main * flex_grow / total_flex_grow).max(0.0);
                }
            }
            
            let cross_pos = match cross_axis_alignment {
                CrossAxisAlignment::Start => {
                    if is_horizontal { content_frame.y } else { content_frame.x }
                },
                CrossAxisAlignment::End => {
                    if is_horizontal { 
                        content_frame.y + content_frame.height - child_cross 
                    } else { 
                        content_frame.x + content_frame.width - child_cross 
                    }
                },
                CrossAxisAlignment::Center => {
                    if is_horizontal {
                        content_frame.y + (content_frame.height - child_cross) / 2.0
                    } else {
                        content_frame.x + (content_frame.width - child_cross) / 2.0
                    }
                },
                CrossAxisAlignment::Stretch => {
                    if is_horizontal {
                        content_frame.y
                    } else {
                        content_frame.x
                    }
                },
                CrossAxisAlignment::Baseline => {
                    if is_horizontal {
                        content_frame.y + (content_frame.height - child_cross) / 2.0
                    } else {
                        content_frame.x + (content_frame.width - child_cross) / 2.0
                    }
                }
            };
            
            let child_frame = if is_horizontal {
                Rect::new(
                    main_offset,
                    cross_pos,
                    child_main,
                    if matches!(cross_axis_alignment, CrossAxisAlignment::Stretch) {
                        content_frame.height
                    } else {
                        child_cross
                    }
                )
            } else {
                Rect::new(
                    cross_pos,
                    main_offset,
                    if matches!(cross_axis_alignment, CrossAxisAlignment::Stretch) {
                        content_frame.width
                    } else {
                        child_cross
                    },
                    child_main
                )
            };
            
            engine.position_node(child, child_frame);
            
            main_offset += child_main + item_spacing;
        }
    }
}