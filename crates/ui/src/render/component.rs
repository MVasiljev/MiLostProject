use crate::UIComponent;
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
            
            node.set_prop("label", props.label.clone());
            
            if let Some(style) = &props.style {
                node.set_prop("button_style", format!("{:?}", style));
            }

            if let Some(on_tap) = &props.on_tap {
                node.add_event_handler(on_tap.clone());
        
                node.set_prop("on_tap", on_tap.handler_id.clone());
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
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::ZStack(props) => {
            let mut node = RenderNode::new(&generate_unique_id("zstack"), "ZStack");
            
            if let Some(alignment) = &props.alignment {
                node.set_prop("alignment", alignment.clone());
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::Image(props) => {
            let mut node = RenderNode::new(&generate_unique_id("image"), "Image");
            
            node.set_prop("src", props.src.clone());
            
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
            
            if let Some(resize_mode) = &props.resize_mode {
                node.set_prop("resize_mode", resize_mode.clone());
            }
            
            if let Some(corner_radius) = props.corner_radius {
                node.set_prop("corner_radius", corner_radius.to_string());
            }
            
            if let Some(border_width) = props.border_width {
                node.set_prop("border_width", border_width.to_string());
            }
            
            if let Some(border_color) = &props.border_color {
                node.set_prop("border_color", border_color.clone());
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