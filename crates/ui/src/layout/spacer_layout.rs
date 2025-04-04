use crate::render::node::RenderNode;
use super::types::{Size};

/// Measure Spacer component
pub fn measure_spacer(node: &RenderNode, available_size: Size) -> Size {
    let size = node.get_prop_f32("size");
    
    let min_size = node.get_prop_f32("min_size").unwrap_or(0.0);
    let max_size = node.get_prop_f32("max_size").unwrap_or(f32::MAX);
    
    let parent_type = node.get_prop("_parent_type")
        .cloned()
        .unwrap_or_else(|| "Unknown".to_string());
    
    match parent_type.as_str() {
        "VStack" => {
            let height = if let Some(s) = size {
                s.max(min_size).min(max_size)
            } else {
                min_size
            };
            Size::new(available_size.width, height)
        },
        "HStack" => {
            let width = if let Some(s) = size {
                s.max(min_size).min(max_size)
            } else {
                min_size
            };
            Size::new(width, available_size.height)
        },
        _ => {
            let dimension = size.unwrap_or(0.0).max(min_size).min(max_size);
            Size::new(dimension, dimension)
        }
    }
}