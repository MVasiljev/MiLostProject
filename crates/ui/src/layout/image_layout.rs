use crate::render::node::RenderNode;
use super::types::{Size};

pub fn measure_image(node: &RenderNode, available_size: Size) -> Size {
    let width = node.get_prop_f32("width");
    let height = node.get_prop_f32("height");
    let aspect_ratio = node.get_prop_f32("aspect_ratio");
    
    match (width, height, aspect_ratio) {
        (Some(w), Some(h), _) => {
            Size::new(w.min(available_size.width), h.min(available_size.height))
        },
        (Some(w), None, Some(ratio)) => {
            let h = w / ratio;
            Size::new(w.min(available_size.width), h.min(available_size.height))
        },
        (None, Some(h), Some(ratio)) => {
            let w = h * ratio;
            Size::new(w.min(available_size.width), h.min(available_size.height))
        },
        (Some(w), None, None) => {
            Size::new(w.min(available_size.width), w.min(available_size.width))
        },
        (None, Some(h), None) => {
            Size::new(h.min(available_size.height), h.min(available_size.height))
        },
        (None, None, Some(ratio)) => {
            let w:f32 = available_size.width;
            let h:f32 = w / ratio;
            Size::new(w, h.min(available_size.height))
        },
        (None, None, None) => {
            let default_size = 200.0_f32.min(available_size.width).min(available_size.height);
            Size::new(default_size, default_size)
        }
    }
}