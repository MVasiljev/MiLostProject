use crate::render::node::RenderNode;
use crate::layout::types::Size;
use crate::render::property::keys;
use crate::layout::layout_utils::parse_edge_insets;

pub fn measure_image(node: &RenderNode, available_size: Size) -> Size {
    let width = node.get_prop_f32(keys::WIDTH);
    let height = node.get_prop_f32(keys::HEIGHT);
    let aspect_ratio = node.get_prop_f32("aspect_ratio");
    
    let insets = parse_edge_insets(node);
    let content_width = available_size.width - insets.horizontal_insets();
    let content_height = available_size.height - insets.vertical_insets();
    let content_size = Size::new(content_width, content_height);
    
    let padding = node.get_prop_f32(keys::PADDING).unwrap_or(0.0);
    let padded_size = Size::new(
        content_size.width - (padding * 2.0),
        content_size.height - (padding * 2.0)
    );
    
    let base_size = match (width, height, aspect_ratio) {
        (Some(w), Some(h), _) => {
            Size::new(w, h)
        },
        (Some(w), None, Some(ratio)) => {
            let h = w / ratio;
            Size::new(w, h)
        },
        (None, Some(h), Some(ratio)) => {
            let w = h * ratio;
            Size::new(w, h)
        },
        (Some(w), None, None) => {
            Size::new(w, w)
        },
        (None, Some(h), None) => {
            Size::new(h, h)
        },
        (None, None, Some(ratio)) => {
            if padded_size.width > 0.0 && padded_size.height > 0.0 {
                let container_ratio = padded_size.width / padded_size.height;
                
                if container_ratio > ratio {
                    let h = padded_size.height;
                    let w = h * ratio;
                    Size::new(w, h)
                } else {
                    let w = padded_size.width;
                    let h = w / ratio;
                    Size::new(w, h)
                }
            } else {
                let default_size = 200.0;
                Size::new(default_size, default_size / ratio)
            }
        },
        (None, None, None) => {
            if padded_size.width > 0.0 && padded_size.height > 0.0 {
                padded_size
            } else {
                let default_size = 200.0;
                Size::new(default_size, default_size)
            }
        }
    };
    
    let min_width = node.get_prop_f32(keys::MIN_WIDTH).unwrap_or(0.0);
    let max_width = node.get_prop_f32(keys::MAX_WIDTH).unwrap_or(f32::MAX);
    let min_height = node.get_prop_f32(keys::MIN_HEIGHT).unwrap_or(0.0);
    let max_height = node.get_prop_f32(keys::MAX_HEIGHT).unwrap_or(f32::MAX);
    
    let constrained_width = base_size.width.max(min_width).min(max_width).min(content_size.width);
    let constrained_height = base_size.height.max(min_height).min(max_height).min(content_size.height);
    
    let resize_mode = node.get_prop_as_string("resize_mode");
    let preserve_aspect_ratio = node.get_prop_bool("preserve_aspect_ratio").unwrap_or(true);
    
    let final_size = if preserve_aspect_ratio && aspect_ratio.is_some() {
        let ratio = aspect_ratio.unwrap();
        
        match resize_mode.as_deref() {
            Some("fill") | Some("Fill") => {
                Size::new(constrained_width, constrained_height)
            },
            Some("fit") | Some("Fit") => {
                let container_ratio = constrained_width / constrained_height;
                
                if container_ratio > ratio {
                    let h = constrained_height;
                    let w = h * ratio;
                    Size::new(w, h)
                } else {
                    let w = constrained_width;
                    let h = w / ratio;
                    Size::new(w, h)
                }
            },
            Some("cover") | Some("Cover") => {
                let container_ratio = constrained_width / constrained_height;
                
                if container_ratio < ratio {
                    let h = constrained_height;
                    let w = h * ratio;
                    Size::new(w, h)
                } else {
                    let w = constrained_width;
                    let h = w / ratio;
                    Size::new(w, h)
                }
            },
            _ => Size::new(constrained_width, constrained_height)
        }
    } else {
        Size::new(constrained_width, constrained_height)
    };
    
    Size::new(
        final_size.width + (padding * 2.0) + insets.horizontal_insets(),
        final_size.height + (padding * 2.0) + insets.vertical_insets()
    )
}