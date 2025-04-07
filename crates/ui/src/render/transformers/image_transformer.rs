use crate::image::{ImageProps, ImageFilter, ImageSource};
use crate::render::node::RenderNode;
use crate::render::property::{Property, keys};
use crate::components::base_props::{BaseComponentProps, utils::apply_base_props};
use super::utils::{generate_unique_id, set_optional_prop};

pub fn transform_image(props: &ImageProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("image"), "Image");
    
    // Source
    match &props.source {
        ImageSource::Remote(url) => {
            node.set_prop("src", url.clone());
            node.set_prop("source_type", "remote");
        },
        ImageSource::Asset(path) => {
            node.set_prop("src", path.clone());
            node.set_prop("source_type", "asset");
            node.set_prop("source_path", path.clone());
        },
        ImageSource::Memory(data) => {
            node.set_prop("src", "memory://image");
            node.set_prop("source_type", "memory");
            node.set_prop("memory_data_size", data.len() as i32);
            // Memory data would be handled separately or via a specialized approach
        }
    }
    
    // Alt text
    if let Some(alt) = &props.alt {
        node.set_prop("alt", alt.clone());
    }
    
    // Dimensions
    set_optional_prop(&mut node, keys::WIDTH, &props.width);
    set_optional_prop(&mut node, keys::HEIGHT, &props.height);
    set_optional_prop(&mut node, "aspect_ratio", &props.aspect_ratio);
    
    // Appearance
    if let Some(resize_mode) = &props.resize_mode {
        node.set_prop("resize_mode", format!("{:?}", resize_mode).to_lowercase());
    }
    
    if let Some(content_mode) = &props.content_mode {
        node.set_prop("content_mode", format!("{:?}", content_mode));
    }
    
    // Filters
    if let Some(filters) = &props.filters {
        node.set_prop("filter_count", filters.len() as i32);
        
        for (i, filter) in filters.iter().enumerate() {
            let type_prop = format!("filter_{}_type", i);
            let value_prop = format!("filter_{}_value", i);
            
            match filter {
                ImageFilter::Blur(radius) => {
                    node.set_prop(&type_prop, "blur");
                    node.set_prop(&value_prop, *radius);
                },
                ImageFilter::Grayscale(intensity) => {
                    node.set_prop(&type_prop, "grayscale");
                    node.set_prop(&value_prop, *intensity);
                },
                ImageFilter::Sepia(intensity) => {
                    node.set_prop(&type_prop, "sepia");
                    node.set_prop(&value_prop, *intensity);
                },
                ImageFilter::Saturation(value) => {
                    node.set_prop(&type_prop, "saturation");
                    node.set_prop(&value_prop, *value);
                },
                ImageFilter::Brightness(value) => {
                    node.set_prop(&type_prop, "brightness");
                    node.set_prop(&value_prop, *value);
                },
                ImageFilter::Contrast(value) => {
                    node.set_prop(&type_prop, "contrast");
                    node.set_prop(&value_prop, *value);
                },
                ImageFilter::Hue(value) => {
                    node.set_prop(&type_prop, "hue");
                    node.set_prop(&value_prop, *value);
                },
                ImageFilter::Invert(enabled) => {
                    node.set_prop(&type_prop, "invert");
                    node.set_prop(&value_prop, *enabled);
                },
            }
        }
    }
    
    set_optional_prop(&mut node, "tint_color", &props.tint_color);
    set_optional_prop(&mut node, "blur_radius", &props.blur_radius);
    
    // Loading states
    set_optional_prop(&mut node, "is_loading", &props.is_loading);
    set_optional_prop(&mut node, "has_error", &props.has_error);
    
    if let Some(loading_placeholder) = &props.loading_placeholder {
        node.set_prop("loading_placeholder", loading_placeholder.clone());
    }
    
    if let Some(error_placeholder) = &props.error_placeholder {
        node.set_prop("error_placeholder", error_placeholder.clone());
    }
    
    // Animation
    set_optional_prop(&mut node, "animation_duration", &props.animation_duration);
    set_optional_prop(&mut node, "is_animating", &props.is_animating);
    
    // Create base props
    let mut base_props = BaseComponentProps::new();
    
    // Set Dimensions
    base_props.width = props.width;
    base_props.height = props.height;
    base_props.min_width = props.min_width;
    base_props.max_width = props.max_width;
    base_props.min_height = props.min_height;
    base_props.max_height = props.max_height;
    
    // Appearance
    base_props.background = props.background_color.clone();
    base_props.opacity = props.opacity;
    
    // Border and Shadow
    base_props.border_radius = props.corner_radius;
    base_props.border_width = props.border_width;
    base_props.border_color = props.border_color.clone();
    base_props.border_style = props.border_style.clone();
    
    base_props.shadow_radius = props.shadow_radius;
    base_props.shadow_color = props.shadow_color.clone();
    
    if let Some(offset) = props.shadow_offset {
        base_props.shadow_offset_x = Some(offset.0);
        base_props.shadow_offset_y = Some(offset.1);
    }
    
    base_props.shadow_effect = props.shadow_effect.clone();
    
    // Layout
    base_props.padding = props.padding;
    base_props.edge_insets = props.edge_insets.clone();
    base_props.clip_to_bounds = props.clip_to_bounds;
    
    // Accessibility
    base_props.accessibility_label = props.accessibility_label.clone();
    base_props.accessibility_hint = props.accessibility_hint.clone();
    base_props.is_accessibility_element = props.is_accessibility_element;
    
    // Apply base props to node
    apply_base_props(&mut node, &base_props);
    
    // Cache policy
    if let Some(cache_policy) = &props.cache_policy {
        node.set_prop("cache_policy", cache_policy.clone());
    }
    
    // Preserve aspect ratio
    set_optional_prop(&mut node, "preserve_aspect_ratio", &props.preserve_aspect_ratio);
    
    node
}