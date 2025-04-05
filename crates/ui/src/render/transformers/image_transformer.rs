use crate::image::{ImageProps, ImageFilter, ImageSource};
use crate::render::node::RenderNode;
use super::utils::{generate_unique_id, set_optional_prop};

pub fn transform_image(props: &ImageProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("image"), "Image");
    
    match &props.source {
        ImageSource::Remote(url) => {
            node.set_prop("src", url.clone());
            node.set_prop("source_type", "remote".to_string());
        },
        ImageSource::Asset(path) => {
            node.set_prop("src", path.clone());
            node.set_prop("source_type", "asset".to_string());
            node.set_prop("source_path", path.clone());
        },
        ImageSource::Memory(_) => {
            node.set_prop("src", "memory://image".to_string());
            node.set_prop("source_type", "memory".to_string());
        }
    }
    
    if let Some(alt) = &props.alt {
        node.set_prop("alt", alt.clone());
    }
    
    set_optional_prop(&mut node, "width", &props.width);
    set_optional_prop(&mut node, "height", &props.height);
    set_optional_prop(&mut node, "aspect_ratio", &props.aspect_ratio);
    
    if let Some(resize_mode) = &props.resize_mode {
        node.set_prop("resize_mode", format!("{:?}", resize_mode).to_lowercase());
    }
    
    if let Some(content_mode) = &props.content_mode {
        node.set_prop("content_mode", format!("{:?}", content_mode));
    }
    
    set_optional_prop(&mut node, "corner_radius", &props.corner_radius);
    set_optional_prop(&mut node, "border_width", &props.border_width);
    
    if let Some(border_color) = &props.border_color {
        node.set_prop("border_color", border_color.clone());
    }
    
    set_optional_prop(&mut node, "shadow_radius", &props.shadow_radius);
    
    if let Some(shadow_color) = &props.shadow_color {
        node.set_prop("shadow_color", shadow_color.clone());
    }
    
    if let Some(shadow_offset) = props.shadow_offset {
        node.set_prop("shadow_offset_x", shadow_offset.0.to_string());
        node.set_prop("shadow_offset_y", shadow_offset.1.to_string());
    }
    
    if let Some(tint_color) = &props.tint_color {
        node.set_prop("tint_color", tint_color.clone());
    }
    
    if let Some(filters) = &props.filters {
        for (i, filter) in filters.iter().enumerate() {
            let type_prop = format!("filter_{}_type", i);
            let value_prop = format!("filter_{}_value", i);
            
            match filter {
                ImageFilter::Blur(radius) => {
                    node.set_prop(&type_prop, "blur".to_string());
                    node.set_prop(&value_prop, radius.to_string());
                },
                ImageFilter::Grayscale(intensity) => {
                    node.set_prop(&type_prop, "grayscale".to_string());
                    node.set_prop(&value_prop, intensity.to_string());
                },
                ImageFilter::Sepia(intensity) => {
                    node.set_prop(&type_prop, "sepia".to_string());
                    node.set_prop(&value_prop, intensity.to_string());
                },
                ImageFilter::Saturation(value) => {
                    node.set_prop(&type_prop, "saturation".to_string());
                    node.set_prop(&value_prop, value.to_string());
                },
                ImageFilter::Brightness(value) => {
                    node.set_prop(&type_prop, "brightness".to_string());
                    node.set_prop(&value_prop, value.to_string());
                },
                ImageFilter::Contrast(value) => {
                    node.set_prop(&type_prop, "contrast".to_string());
                    node.set_prop(&value_prop, value.to_string());
                },
                ImageFilter::Hue(value) => {
                    node.set_prop(&type_prop, "hue".to_string());
                    node.set_prop(&value_prop, value.to_string());
                },
                ImageFilter::Invert(enabled) => {
                    node.set_prop(&type_prop, "invert".to_string());
                    node.set_prop(&value_prop, enabled.to_string());
                },
            }
        }
    }
    
    set_optional_prop(&mut node, "opacity", &props.opacity);
    set_optional_prop(&mut node, "blur_radius", &props.blur_radius);
    
    if let Some(loading_placeholder) = &props.loading_placeholder {
        node.set_prop("loading_placeholder", loading_placeholder.clone());
    }
    
    if let Some(error_placeholder) = &props.error_placeholder {
        node.set_prop("error_placeholder", error_placeholder.clone());
    }
    
    set_optional_prop(&mut node, "clip_to_bounds", &props.clip_to_bounds);
    set_optional_prop(&mut node, "preserve_aspect_ratio", &props.preserve_aspect_ratio);
    
    set_optional_prop(&mut node, "animation_duration", &props.animation_duration);
    set_optional_prop(&mut node, "is_animating", &props.is_animating);
    
    if let Some(cache_policy) = &props.cache_policy {
        node.set_prop("cache_policy", cache_policy.clone());
    }
    
    node
}