use crate::button::ButtonProps;
use crate::render::node::RenderNode;
use super::utils::{generate_unique_id, set_optional_prop};

pub fn transform_button(props: &ButtonProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("button"), "Button");
    
    node.set_prop("label", props.label.clone());
    
    if let Some(style) = &props.style {
        node.set_prop("button_style", format!("{:?}", style));
    }
    
    if let Some(on_tap) = &props.on_tap {
        node.add_event_handler(on_tap.clone());
        node.set_prop("on_tap", on_tap.handler_id.clone());
    }
    
    set_optional_prop(&mut node, "disabled", &props.disabled);
    
    if let Some(bg_color) = &props.background_color {
        node.set_prop("background_color", bg_color.clone());
    }
    
    if let Some(text_color) = &props.text_color {
        node.set_prop("text_color", text_color.clone());
    }
    
    if let Some(border_color) = &props.border_color {
        node.set_prop("border_color", border_color.clone());
    }
    
    set_optional_prop(&mut node, "corner_radius", &props.corner_radius);
    set_optional_prop(&mut node, "padding", &props.padding);
    
    if let Some(icon) = &props.icon {
        node.set_prop("icon", icon.clone());
    }
    
    if let Some(icon_position) = &props.icon_position {
        node.set_prop("icon_position", icon_position.clone());
    }
    
    if let Some(size) = &props.size {
        node.set_prop("size", format!("{:?}", size));
    }
    
    set_optional_prop(&mut node, "is_loading", &props.is_loading);
    
    if let Some(loading_indicator_type) = &props.loading_indicator_type {
        node.set_prop("loading_indicator_type", format!("{:?}", loading_indicator_type));
    }
    
    set_optional_prop(&mut node, "hide_text_while_loading", &props.hide_text_while_loading);
    set_optional_prop(&mut node, "loading_indicator_size", &props.loading_indicator_size);
    
    set_optional_prop(&mut node, "border_width", &props.border_width);
    
    if let Some(border_style) = &props.border_style {
        node.set_prop("border_style", format!("{:?}", border_style));
    }
    
    set_optional_prop(&mut node, "font_size", &props.font_size);
    
    if let Some(font_weight) = &props.font_weight {
        node.set_prop("font_weight", format!("{:?}", font_weight));
    }
    
    set_optional_prop(&mut node, "shadow_radius", &props.shadow_radius);
    
    if let Some(shadow_color) = &props.shadow_color {
        node.set_prop("shadow_color", shadow_color.clone());
    }
    
    if let Some(shadow_offset) = &props.shadow_offset {
        node.set_prop("shadow_offset_x", shadow_offset.0.to_string());
        node.set_prop("shadow_offset_y", shadow_offset.1.to_string());
    }
    
    node
}