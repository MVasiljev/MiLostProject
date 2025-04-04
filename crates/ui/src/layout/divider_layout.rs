use crate::render::node::RenderNode;
use super::types::{Size};

/// Measure Divider component
pub fn measure_divider(node: &RenderNode, available_size: Size) -> Size {
    let thickness = node.get_prop_f32("thickness").unwrap_or(1.0);
    let padding = node.get_prop_f32("padding").unwrap_or(0.0);
    
    let total_height = thickness + (padding * 2.0);
    
    Size::new(available_size.width, total_height)
}