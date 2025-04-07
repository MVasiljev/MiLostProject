use crate::render::node::RenderNode;
use crate::layout::types::Size;
use crate::render::property::keys;

pub fn measure_divider(node: &RenderNode, available_size: Size) -> Size {
    let thickness = node.get_prop_f32(keys::THICKNESS).unwrap_or(1.0);
    
    let padding = node.get_prop_f32(keys::PADDING).unwrap_or(0.0);
    
    let total_height = thickness + (padding * 2.0);
    
    Size::new(available_size.width, total_height)
}