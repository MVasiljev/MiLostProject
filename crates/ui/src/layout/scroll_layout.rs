use crate::render::node::RenderNode;
use super::{
    layout_engine::{LayoutMeasurement, LayoutPositioning}, 
    types::{Rect, Size}
};

pub fn measure_scroll(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    if node.children.is_empty() {
        return Size::new(available_size.width, available_size.height);
    }
    
    let direction = node.get_prop("direction")
        .map(|d| d.as_str())
        .unwrap_or("Vertical");
    
    let paging_enabled = node.get_prop("paging_enabled")
        .and_then(|v| v.parse::<bool>().ok())
        .unwrap_or(false);
    
    let content_inset = node.get_prop("content_inset")
        .and_then(|inset_str| {
            let parts: Vec<f32> = inset_str.split(',')
                .filter_map(|s| s.parse().ok())
                .collect();
            
            if parts.len() == 4 {
                Some((parts[0], parts[1], parts[2], parts[3]))
            } else {
                None
            }
        });
    
    let child = &node.children[0];
    let mut child_size = engine.measure_node(child, available_size);
    
    if let Some((top, left, bottom, right)) = content_inset {
        child_size.width += left + right;
        child_size.height += top + bottom;
    }
    
    if paging_enabled {
        match direction {
            "Horizontal" => {
                let page_width = available_size.width;
                let total_pages = (child_size.width / page_width).ceil();
                child_size.width = total_pages * page_width;
            },
            _ => {
                let page_height = available_size.height;
                let total_pages = (child_size.height / page_height).ceil();
                child_size.height = total_pages * page_height;
            }
        }
    }
    
    match direction {
        "Horizontal" => Size::new(available_size.width, child_size.height),
        _ => Size::new(available_size.width, child_size.height)
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
                
                let content_inset = node.get_prop("content_inset")
                    .and_then(|inset_str| {
                        let parts: Vec<f32> = inset_str.split(',')
                            .filter_map(|s| s.parse().ok())
                            .collect();
                        
                        if parts.len() == 4 {
                            Some((parts[0], parts[1], parts[2], parts[3]))
                        } else {
                            None
                        }
                    });
                
                child_frame = if direction == "Horizontal" {
                    let x = frame.x + content_inset.map(|i| i.1).unwrap_or(0.0);
                    let y = frame.y + content_inset.map(|i| i.0).unwrap_or(0.0);
                    Rect::new(x, y, child_size.width, frame.height)
                } else {
                    let x = frame.x + content_inset.map(|i| i.1).unwrap_or(0.0);
                    let y = frame.y + content_inset.map(|i| i.0).unwrap_or(0.0);
                    Rect::new(x, y, frame.width, child_size.height)
                };
            } else {
                return;
            }
        }
        
        engine.position_node(child, child_frame);
    }
}