use crate::{image::{ImageFilter, ImageSource}, stack::LayoutPriority, zstack::ZStackAlignment, HStackAlignment, UIComponent, VStackAlignment};
use super::node::RenderNode;
use std::sync::atomic::{AtomicUsize, Ordering};

static NODE_COUNTER: AtomicUsize = AtomicUsize::new(0);

fn generate_unique_id(prefix: &str) -> String {
    let id = NODE_COUNTER.fetch_add(1, Ordering::SeqCst);
    format!("{}-{}", prefix, id)
}

pub fn render(component: &UIComponent) -> RenderNode {
    match component {
        UIComponent::Text(props) => {
            let mut node = RenderNode::new(&generate_unique_id("text"), "Text");
            node.set_prop("content", props.content.clone());
            
            if let Some(style) = &props.font_style {
                node.set_prop("font_style", format!("{:?}", style));
            }
            
            if let Some(color) = &props.color {
                node.set_prop("color", format!("{:?}", color));
            }
            
            node
        },

        UIComponent::Button(props) => {
            let mut node = RenderNode::new(&generate_unique_id("button"), "Button");

            println!("Button props: {:?}", props);
            
            node.set_prop("label", props.label.clone());
            
            if let Some(style) = &props.style {
                node.set_prop("button_style", format!("{:?}", style));
            }

            if let Some(on_tap) = &props.on_tap {
                println!("Adding on_tap handler: {:?}", on_tap);

                node.add_event_handler(on_tap.clone());        
                node.set_prop("on_tap", on_tap.handler_id.clone());
            } else {
                println!("No on_tap handler found");
            }
            
            if let Some(disabled) = props.disabled {
                node.set_prop("disabled", disabled.to_string());
            }
            
            if let Some(bg_color) = &props.background_color {
                node.set_prop("background_color", bg_color.clone());
            }
            
            if let Some(text_color) = &props.text_color {
                node.set_prop("text_color", text_color.clone());
            }
            
            if let Some(border_color) = &props.border_color {
                node.set_prop("border_color", border_color.clone());
            }
            
            if let Some(corner_radius) = props.corner_radius {
                node.set_prop("corner_radius", corner_radius.to_string());
            }
            
            if let Some(padding) = props.padding {
                node.set_prop("padding", padding.to_string());
            }
            
            if let Some(icon) = &props.icon {
                node.set_prop("icon", icon.clone());
            }
            
            if let Some(icon_position) = &props.icon_position {
                node.set_prop("icon_position", icon_position.clone());
            }
            
            node
        },

        UIComponent::VStack(props) => {
            let mut node = RenderNode::new(&generate_unique_id("vstack"), "VStack");
            
            if let Some(spacing) = props.spacing {
                node.set_prop("spacing", spacing.to_string());
            }
            
            if let Some(padding) = props.padding {
                node.set_prop("padding", padding.to_string());
            }
            
            if let Some(bg) = &props.background {
                node.set_prop("background", format!("{:?}", bg));
            }
            
            if let Some(alignment) = &props.alignment {
                let alignment_str = match alignment {
                    VStackAlignment::Leading => "leading",
                    VStackAlignment::Center => "center",
                    VStackAlignment::Trailing => "trailing",
                };
                
                node.set_prop("alignment", alignment_str.to_string());
            }
            
            if let Some(edge_insets) = &props.edge_insets {
                node.set_prop("edge_insets", format!("{},{},{},{}", 
                    edge_insets.top, edge_insets.right, edge_insets.bottom, edge_insets.left));
            }
            
            if let Some(value) = props.min_width {
                node.set_prop("min_width", value.to_string());
            }
            
            if let Some(value) = props.ideal_width {
                node.set_prop("ideal_width", value.to_string());
            }
            
            if let Some(value) = props.max_width {
                node.set_prop("max_width", value.to_string());
            }
            
            if let Some(value) = props.min_height {
                node.set_prop("min_height", value.to_string());
            }
            
            if let Some(value) = props.ideal_height {
                node.set_prop("ideal_height", value.to_string());
            }
            
            if let Some(value) = props.max_height {
                node.set_prop("max_height", value.to_string());
            }
            
            if let Some(value) = props.clip_to_bounds {
                node.set_prop("clip_to_bounds", value.to_string());
            }
            
            if let Some(priority) = &props.layout_priority {
                let priority_str = match priority {
                    LayoutPriority::Low => "low",
                    LayoutPriority::Medium => "medium",
                    LayoutPriority::High => "high",
                    LayoutPriority::Custom(value) => return node,
                };
                node.set_prop("layout_priority", priority_str.to_string());
            }
            
            if let Some(value) = props.equal_spacing {
                node.set_prop("equal_spacing", value.to_string());
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },
        

        UIComponent::HStack(props) => {
            let mut node = RenderNode::new(&generate_unique_id("hstack"), "HStack");
            
            if let Some(spacing) = props.spacing {
                node.set_prop("spacing", spacing.to_string());
            }
            
            if let Some(padding) = props.padding {
                node.set_prop("padding", padding.to_string());
            }
            
            if let Some(bg) = &props.background {
                node.set_prop("background", format!("{:?}", bg));
            }
            
            if let Some(alignment) = &props.alignment {
                let alignment_str = match alignment {
                    HStackAlignment::Top => "top",
                    HStackAlignment::Center => "center",
                    HStackAlignment::Bottom => "bottom",
                    HStackAlignment::FirstTextBaseline => "firsttextbaseline",
                    HStackAlignment::LastTextBaseline => "lasttextbaseline",
                };
                
                node.set_prop("alignment", alignment_str.to_string());
            }
            
            if let Some(edge_insets) = &props.edge_insets {
                node.set_prop("edge_insets", format!("{},{},{},{}", 
                    edge_insets.top, edge_insets.right, edge_insets.bottom, edge_insets.left));
            }
            
            if let Some(value) = props.min_width {
                node.set_prop("min_width", value.to_string());
            }
            
            if let Some(value) = props.ideal_width {
                node.set_prop("ideal_width", value.to_string());
            }
            
            if let Some(value) = props.max_width {
                node.set_prop("max_width", value.to_string());
            }
            
            if let Some(value) = props.min_height {
                node.set_prop("min_height", value.to_string());
            }
            
            if let Some(value) = props.ideal_height {
                node.set_prop("ideal_height", value.to_string());
            }
            
            if let Some(value) = props.max_height {
                node.set_prop("max_height", value.to_string());
            }
            
            if let Some(value) = props.clip_to_bounds {
                node.set_prop("clip_to_bounds", value.to_string());
            }
            
            if let Some(priority) = &props.layout_priority {
                let priority_str = match priority {
                    LayoutPriority::Low => "low",
                    LayoutPriority::Medium => "medium",
                    LayoutPriority::High => "high",
                    LayoutPriority::Custom(value) => return node,
                };
                node.set_prop("layout_priority", priority_str.to_string());
            }
            
            if let Some(value) = props.equal_spacing {
                node.set_prop("equal_spacing", value.to_string());
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::ZStack(props) => {
            let mut node = RenderNode::new(&generate_unique_id("zstack"), "ZStack");
            
            if let Some(alignment) = &props.alignment {
                let alignment_str = match alignment {
                    ZStackAlignment::Center => "center",
                    ZStackAlignment::TopLeading => "topleading",
                    ZStackAlignment::Top => "top",
                    ZStackAlignment::TopTrailing => "toptrailing",
                    ZStackAlignment::Leading => "leading",
                    ZStackAlignment::Trailing => "trailing",
                    ZStackAlignment::BottomLeading => "bottomleading",
                    ZStackAlignment::Bottom => "bottom",
                    ZStackAlignment::BottomTrailing => "bottomtrailing",
                };
                
                node.set_prop("alignment", alignment_str.to_string());
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::Image(props) => {
            let mut node = RenderNode::new(&generate_unique_id("image"), "Image");
            
            // Handle different image sources
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
            
            // Basic properties
            if let Some(alt) = &props.alt {
                node.set_prop("alt", alt.clone());
            }
            
            if let Some(width) = props.width {
                node.set_prop("width", width.to_string());
            }
            
            if let Some(height) = props.height {
                node.set_prop("height", height.to_string());
            }
            
            if let Some(aspect_ratio) = props.aspect_ratio {
                node.set_prop("aspect_ratio", aspect_ratio.to_string());
            }
            
            // Resize and content modes
            if let Some(resize_mode) = &props.resize_mode {
                node.set_prop("resize_mode", format!("{:?}", resize_mode).to_lowercase());
            }
            
            if let Some(content_mode) = &props.content_mode {
                node.set_prop("content_mode", format!("{:?}", content_mode));
            }
            
            // Styling properties
            if let Some(corner_radius) = props.corner_radius {
                node.set_prop("corner_radius", corner_radius.to_string());
            }
            
            if let Some(border_width) = props.border_width {
                node.set_prop("border_width", border_width.to_string());
            }
            
            if let Some(border_color) = &props.border_color {
                node.set_prop("border_color", border_color.clone());
            }
            
            // Shadow properties
            if let Some(shadow_radius) = props.shadow_radius {
                node.set_prop("shadow_radius", shadow_radius.to_string());
            }
            
            if let Some(shadow_color) = &props.shadow_color {
                node.set_prop("shadow_color", shadow_color.clone());
            }
            
            if let Some(shadow_offset) = props.shadow_offset {
                node.set_prop("shadow_offset_x", shadow_offset.0.to_string());
                node.set_prop("shadow_offset_y", shadow_offset.1.to_string());
            }
            
            // Tint and filters
            if let Some(tint_color) = &props.tint_color {
                node.set_prop("tint_color", tint_color.clone());
            }
            
            if let Some(filters) = &props.filters {
                for (i, filter) in filters.iter().enumerate() {
                    match filter {
                        ImageFilter::Blur(radius) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "blur".to_string());
                            node.set_prop(&value_prop, radius.to_string());
                        },
                        ImageFilter::Grayscale(intensity) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "grayscale".to_string());
                            node.set_prop(&value_prop, intensity.to_string());
                        },
                        ImageFilter::Sepia(intensity) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "sepia".to_string());
                            node.set_prop(&value_prop, intensity.to_string());
                        },
                        ImageFilter::Saturation(value) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "saturation".to_string());
                            node.set_prop(&value_prop, value.to_string());
                        },
                        ImageFilter::Brightness(value) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "brightness".to_string());
                            node.set_prop(&value_prop, value.to_string());
                        },
                        ImageFilter::Contrast(value) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "contrast".to_string());
                            node.set_prop(&value_prop, value.to_string());
                        },
                        ImageFilter::Hue(value) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "hue".to_string());
                            node.set_prop(&value_prop, value.to_string());
                        },
                        ImageFilter::Invert(enabled) => {
                            let type_prop = format!("filter_{}_type", i);
                            let value_prop = format!("filter_{}_value", i);
                            node.set_prop(&type_prop, "invert".to_string());
                            node.set_prop(&value_prop, enabled.to_string());
                        },
                    }
                }
            }
            
            if let Some(opacity) = props.opacity {
                node.set_prop("opacity", opacity.to_string());
            }
            
            if let Some(blur_radius) = props.blur_radius {
                node.set_prop("blur_radius", blur_radius.to_string());
            }
            
            // Placeholder images
            if let Some(loading_placeholder) = &props.loading_placeholder {
                node.set_prop("loading_placeholder", loading_placeholder.clone());
            }
            
            if let Some(error_placeholder) = &props.error_placeholder {
                node.set_prop("error_placeholder", error_placeholder.clone());
            }
            
            // Constraint properties
            if let Some(clip_to_bounds) = props.clip_to_bounds {
                node.set_prop("clip_to_bounds", clip_to_bounds.to_string());
            }
            
            if let Some(preserve_aspect_ratio) = props.preserve_aspect_ratio {
                node.set_prop("preserve_aspect_ratio", preserve_aspect_ratio.to_string());
            }
            
            // Animation properties
            if let Some(animation_duration) = props.animation_duration {
                node.set_prop("animation_duration", animation_duration.to_string());
            }
            
            if let Some(is_animating) = props.is_animating {
                node.set_prop("is_animating", is_animating.to_string());
            }
            
            // Cache policy
            if let Some(cache_policy) = &props.cache_policy {
                node.set_prop("cache_policy", cache_policy.clone());
            }
            
            node
        },

        UIComponent::Scroll(props) => {
            let mut node = RenderNode::new(&generate_unique_id("scroll"), "Scroll");
            
            node.set_prop("direction", format!("{:?}", props.direction));
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::Spacer(props) => {
            let mut node = RenderNode::new(&generate_unique_id("spacer"), "Spacer");
            
            if let Some(size) = props.size {
                node.set_prop("size", size.to_string());
            }
            
            if let Some(min_size) = props.min_size {
                node.set_prop("min_size", min_size.to_string());
            }
            
            if let Some(max_size) = props.max_size {
                node.set_prop("max_size", max_size.to_string());
            }
            
            if let Some(flex_grow) = props.flex_grow {
                node.set_prop("flex_grow", flex_grow.to_string());
            }
            
            node
        },

        UIComponent::Divider(props) => {
            let mut node = RenderNode::new(&generate_unique_id("divider"), "Divider");
            
            if let Some(thickness) = props.thickness {
                node.set_prop("thickness", thickness.to_string());
            }
            
            if let Some(color) = &props.color {
                node.set_prop("color", format!("{:?}", color));
            }
            
            if let Some(style) = &props.style {
                node.set_prop("style", format!("{:?}", style));
            }
            
            if let Some(padding) = props.padding {
                node.set_prop("padding", padding.to_string());
            }
            
            node
        },
    }
}