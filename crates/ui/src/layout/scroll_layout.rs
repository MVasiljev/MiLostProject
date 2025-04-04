use crate::render::node::RenderNode;
use super::{layout_engine::{LayoutMeasurement, LayoutPositioning}, types::{Rect, Size}};

pub fn measure_scroll(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    if node.children.is_empty() {
        return Size::new(available_size.width, available_size.height);
    }
    
    let direction = node.get_prop("direction")
        .map(|d| d.as_str())
        .unwrap_or("Vertical");
    
    let child = &node.children[0];
    let _child_size = engine.measure_node(child, available_size);
    
    match direction {
        "Horizontal" => Size::new(available_size.width, available_size.height),
        _ => Size::new(available_size.width, available_size.height)
    }
}

pub fn position_scroll_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning
) {
    if !node.children.is_empty() {
        let child = &node.children[0];
        
        let child_frame;
        {
            let layout_cache = engine.get_layout_cache();
            
            if let Some(child_layout) = layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let direction = node.get_prop("direction")
                    .map(|d| d.as_str())
                    .unwrap_or("Vertical");
                
                child_frame = if direction == "Horizontal" {
                    Rect::new(frame.x, frame.y, child_size.width, frame.height)
                } else {
                    Rect::new(frame.x, frame.y, frame.width, child_size.height)
                };
            } else {
                return;
            }
        }
        
        engine.position_node(child, child_frame);
    }
}