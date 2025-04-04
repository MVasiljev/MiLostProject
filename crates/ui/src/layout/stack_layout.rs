use std::collections::HashMap;

use crate::render::node::RenderNode;
use super::layout_engine::{LayoutMeasurement, LayoutPositioning};
use super::layout_info::LayoutInfo;
use super::layout_utils::parse_edge_insets;
use super::types::{Rect, Size};

/// Measure VStack component
pub fn measure_vstack(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
    let equal_spacing = node.get_prop("equal_spacing")
        .and_then(|val| val.parse::<bool>().ok())
        .unwrap_or(false);
            
    let insets = parse_edge_insets(node);
    
    let content_width = available_size.width - insets.left - insets.right;
    let content_height = available_size.height - insets.top - insets.bottom;
    let content_size = Size::new(content_width, content_height);
    
    let mut total_height: f32 = 0.0;
    let mut max_width: f32 = 0.0;
    let mut flex_items: Vec<(usize, f32)> = Vec::new();
    let mut non_flex_count = 0;
    
    for (i, child) in node.children.iter().enumerate() {
        let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
        
        if flex_grow > 0.0 {
            flex_items.push((i, flex_grow));
        } else {
            let child_size = engine.measure_node(child, content_size);
            total_height += child_size.height;
            max_width = max_width.max(child_size.width);
            non_flex_count += 1;
        }
    }
    
    let spacing_count = if equal_spacing {
        node.children.len().saturating_sub(1) as f32
    } else {
        (non_flex_count + flex_items.len()).saturating_sub(1) as f32
    };
    
    let total_spacing = spacing * spacing_count;
    total_height += total_spacing;
    
    let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
    let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
    max_width = max_width.max(min_width).min(max_width_constraint);
    
    let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
    let max_height = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
    total_height = total_height.max(min_height).min(max_height);
    
    Size::new(
        max_width + insets.left + insets.right,
        total_height + insets.top + insets.bottom
    )
}

/// Measure HStack component
pub fn measure_hstack(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
    let equal_spacing = node.get_prop("equal_spacing")
        .and_then(|val| val.parse::<bool>().ok())
        .unwrap_or(false);
            
    let insets = parse_edge_insets(node);
    
    let content_width = available_size.width - insets.left - insets.right;
    let content_height = available_size.height - insets.top - insets.bottom;
    let content_size = Size::new(content_width, content_height);
    
    let mut total_width: f32 = 0.0;
    let mut max_height: f32 = 0.0;
    let mut flex_items: Vec<(usize, f32)> = Vec::new();
    let mut non_flex_count = 0;
    
    for (i, child) in node.children.iter().enumerate() {
        let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
        
        if flex_grow > 0.0 {
            flex_items.push((i, flex_grow));
        } else {
            let child_size = engine.measure_node(child, content_size);
            total_width += child_size.width;
            max_height = max_height.max(child_size.height);
            non_flex_count += 1;
        }
    }
    
    let spacing_count = if equal_spacing {
        node.children.len().saturating_sub(1) as f32
    } else {
        (non_flex_count + flex_items.len()).saturating_sub(1) as f32
    };
    
    let total_spacing = spacing * spacing_count;
    total_width += total_spacing;
    
    let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
    let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
    total_width = total_width.max(min_width).min(max_width_constraint);
    
    let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
    let max_height_constraint = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
    max_height = max_height.max(min_height).min(max_height_constraint);
    
    Size::new(
        total_width + insets.left + insets.right,
        max_height + insets.top + insets.bottom
    )
}

/// Position VStack children
pub fn position_vstack_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning
) {
    let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
    let equal_spacing = node.get_prop("equal_spacing")
        .and_then(|val| val.parse::<bool>().ok())
        .unwrap_or(false);
    let insets = parse_edge_insets(node);
    
    let content_frame = Rect::new(
        frame.x + insets.left,
        frame.y + insets.top,
        frame.width - insets.left - insets.right,
        frame.height - insets.top - insets.bottom
    );
    
    let alignment_str = node.get_prop("alignment").map_or("Leading", |v| v.as_str());
    
    let mut total_fixed_height = 0.0;
    let mut total_flex_grow = 0.0;
    let mut flex_items = Vec::new();
    let mut fixed_heights = Vec::new();
    
    let layout_cache = engine.get_layout_cache();
    
    for (i, child) in node.children.iter().enumerate() {
        if let Some(mut child_layout) = layout_cache.get_mut(&child.id) {
            child_layout.parent_type = Some("VStack".to_string());
        }
        
        let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
        
        if flex_grow > 0.0 {
            total_flex_grow += flex_grow;
            flex_items.push((i, flex_grow));
        } else if let Some(child_layout) = layout_cache.get(&child.id) {
            total_fixed_height += child_layout.content_size.height;
            fixed_heights.push((i, child_layout.content_size.height));
        }
    }
    
    let mut total_spacing = 0.0;
    
    if equal_spacing && node.children.len() > 1 {
        let items_count = node.children.len() - 1;
        let available_space = content_frame.height - total_fixed_height;
        
        let flex_space = if total_flex_grow > 0.0 {
            available_space * 0.5
        } else {
            0.0
        };
        
        total_spacing = (available_space - flex_space).max(0.0);
    } else if node.children.len() > 1 {
        total_spacing = spacing * (node.children.len() - 1) as f32;
    }
    
    let available_flex_height = (content_frame.height - total_fixed_height - total_spacing).max(0.0);
    
    let mut y_offset = content_frame.y;
    let equal_space = if equal_spacing && node.children.len() > 1 {
        total_spacing / (node.children.len() - 1) as f32
    } else {
        spacing
    };
    
    for (i, child) in node.children.iter().enumerate() {
        let layout_cache = engine.get_layout_cache();
        if let Some(child_layout) = layout_cache.get(&child.id) {
            let mut child_height = child_layout.content_size.height;
            let child_width = child_layout.content_size.width;
            
            if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                if total_flex_grow > 0.0 {
                    child_height = (available_flex_height * flex_grow / total_flex_grow).max(0.0);
                }
            }
            
            let x_pos = match alignment_str {
                s if s.eq_ignore_ascii_case("leading") => content_frame.x,
                s if s.eq_ignore_ascii_case("trailing") => content_frame.x + content_frame.width - child_width,
                s if s.eq_ignore_ascii_case("center") => content_frame.x + (content_frame.width - child_width) / 2.0,
                _ => content_frame.x
            };
            
            let child_frame = Rect::new(
                x_pos,
                y_offset,
                child_width,
                child_height
            );
            
            engine.position_node(child, child_frame);
            
            y_offset += child_height + equal_space;
        }
    }
}

/// Position HStack children
pub fn position_hstack_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning
) {
    let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
    let equal_spacing = node.get_prop("equal_spacing")
        .and_then(|val| val.parse::<bool>().ok())
        .unwrap_or(false);
    let insets = parse_edge_insets(node);
    
    let content_frame = Rect::new(
        frame.x + insets.left,
        frame.y + insets.top,
        frame.width - insets.left - insets.right,
        frame.height - insets.top - insets.bottom
    );
    
    let alignment_str = node.get_prop("alignment").map_or("Center", |v| v.as_str());
    
    let mut total_fixed_width = 0.0;
    let mut total_flex_grow = 0.0;
    let mut flex_items = Vec::new();
    let mut fixed_widths = Vec::new();
    
    let layout_cache = engine.get_layout_cache();
    
    for (i, child) in node.children.iter().enumerate() {
        if let Some(mut child_layout) = layout_cache.get_mut(&child.id) {
            child_layout.parent_type = Some("HStack".to_string());
        }
        
        let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
        
        if flex_grow > 0.0 {
            total_flex_grow += flex_grow;
            flex_items.push((i, flex_grow));
        } else if let Some(child_layout) = layout_cache.get(&child.id) {
            total_fixed_width += child_layout.content_size.width;
            fixed_widths.push((i, child_layout.content_size.width));
        }
    }
    
    let mut total_spacing = 0.0;
    
    if equal_spacing && node.children.len() > 1 {
        let items_count = node.children.len() - 1;
        let available_space = content_frame.width - total_fixed_width;
        
        let flex_space = if total_flex_grow > 0.0 {
            available_space * 0.5
        } else {
            0.0
        };
        
        total_spacing = (available_space - flex_space).max(0.0);
    } else if node.children.len() > 1 {
        total_spacing = spacing * (node.children.len() - 1) as f32;
    }
    
    let available_flex_width = (content_frame.width - total_fixed_width - total_spacing).max(0.0);
    
    let mut x_offset = content_frame.x;
    let equal_space = if equal_spacing && node.children.len() > 1 {
        total_spacing / (node.children.len() - 1) as f32
    } else {
        spacing
    };
    
    for (i, child) in node.children.iter().enumerate() {
        let layout_cache = engine.get_layout_cache();
        if let Some(child_layout) = layout_cache.get(&child.id) {
            let mut child_width = child_layout.content_size.width;
            let child_height = child_layout.content_size.height;
            
            if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                if total_flex_grow > 0.0 {
                    child_width = (available_flex_width * flex_grow / total_flex_grow).max(0.0);
                }
            }
            
            let y_pos = match alignment_str {
                "Top" | "top" => content_frame.y,
                "Bottom" | "bottom" => content_frame.y + content_frame.height - child_height,
                "Center" | "center" => content_frame.y + (content_frame.height - child_height) / 2.0,
                _ => content_frame.y + (content_frame.height - child_height) / 2.0
            };
            
            let child_frame = Rect::new(
                x_offset,
                y_pos,
                child_width,
                child_height
            );
            
            engine.position_node(child, child_frame);
            
            x_offset += child_width + equal_space;
        }
    }
}