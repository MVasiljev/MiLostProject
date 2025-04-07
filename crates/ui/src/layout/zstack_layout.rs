use crate::render::node::RenderNode;
use super::layout_engine::{LayoutMeasurement, LayoutPositioning};
use super::types::{Alignment, Rect, Size};
use super::layout_utils::parse_edge_insets;

pub fn measure_zstack(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    let insets = parse_edge_insets(node);
    
    let content_width = available_size.width - insets.horizontal_insets();
    let content_height = available_size.height - insets.vertical_insets();
    let content_size = Size::new(content_width, content_height);
    
    let mut max_width: f32 = 0.0;
    let mut max_height: f32 = 0.0;
    
    for child in &node.children {
        let child_size = engine.measure_node(child, content_size);
        max_width = max_width.max(child_size.width);
        max_height = max_height.max(child_size.height);
    }
    
    let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
    let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
    max_width = max_width.max(min_width).min(max_width_constraint);
    
    let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
    let max_height_constraint = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
    max_height = max_height.max(min_height).min(max_height_constraint);
    
    Size::new(
        max_width + insets.horizontal_insets(),
        max_height + insets.vertical_insets()
    )
}

pub fn position_zstack_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning
) {
    let insets = parse_edge_insets(node);
    
    let content_frame = Rect::new(
        frame.x + insets.left,
        frame.y + insets.top,
        frame.width - insets.horizontal_insets(),
        frame.height - insets.vertical_insets()
    );
    
    let alignment_str = node.get_prop_as_string("alignment").unwrap_or_else(|| "Center".to_string());
    
    let alignment = match alignment_str.to_lowercase().as_str() {
        "topleading" => Alignment::TopLeading,
        "top" => Alignment::Top,
        "toptrailing" => Alignment::TopTrailing,
        "leading" => Alignment::Leading,
        "trailing" => Alignment::Trailing,
        "bottomleading" => Alignment::BottomLeading,
        "bottom" => Alignment::Bottom,
        "bottomtrailing" => Alignment::BottomTrailing,
        _ => Alignment::Center,
    };
    
    let mut child_frames = Vec::new();
    
    {
        let layout_cache = engine.get_layout_cache();
        
        for child in &node.children {
            if let Some(child_layout) = layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let (x, y) = match alignment {
                    Alignment::TopLeading => (content_frame.x, content_frame.y),
                    Alignment::Top => (content_frame.x + (content_frame.width - child_size.width) / 2.0, content_frame.y),
                    Alignment::TopTrailing => (content_frame.x + content_frame.width - child_size.width, content_frame.y),
                    Alignment::Leading => (content_frame.x, content_frame.y + (content_frame.height - child_size.height) / 2.0),
                    Alignment::Center => (
                        content_frame.x + (content_frame.width - child_size.width) / 2.0,
                        content_frame.y + (content_frame.height - child_size.height) / 2.0
                    ),
                    Alignment::Trailing => (content_frame.x + content_frame.width - child_size.width, content_frame.y + (content_frame.height - child_size.height) / 2.0),
                    Alignment::BottomLeading => (content_frame.x, content_frame.y + content_frame.height - child_size.height),
                    Alignment::Bottom => (content_frame.x + (content_frame.width - child_size.width) / 2.0, content_frame.y + content_frame.height - child_size.height),
                    Alignment::BottomTrailing => (content_frame.x + content_frame.width - child_size.width, content_frame.y + content_frame.height - child_size.height),
                };
                
                let child_frame = Rect::new(x, y, child_size.width, child_size.height);
                child_frames.push((child, child_frame));
            }
        }
    }
    
    for (child, child_frame) in child_frames {
        engine.position_node(child, child_frame);
    }
}