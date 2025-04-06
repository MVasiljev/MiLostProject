use crate::{components::button::ButtonProps, ButtonState};
use crate::render::node::RenderNode;
use crate::events::event_system::EventType;
use super::utils::{generate_unique_id, set_optional_prop};

pub fn transform_button(props: &ButtonProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("button"), "Button");
    
    node.set_prop("label", props.label.clone());
    
    if let Some(style) = &props.style {
        node.set_prop("button_style", format!("{:?}", style));
    }
    
    if let Some(on_tap) = &props.on_tap {
        node.on_event(EventType::Tap, &on_tap.handler_id);
    }
    
    set_optional_prop(&mut node, "disabled", &props.disabled);
    
    if let Some(bg_color) = &props.background_color {
        node.set_prop("background_color", bg_color.to_css_string());
    }
    
    if let Some(text_color) = &props.text_color {
        node.set_prop("text_color", text_color.to_css_string());
    }
    
    if let Some(border_color) = &props.border_color {
        node.set_prop("border_color", border_color.to_css_string());
    }
    
    set_optional_prop(&mut node, "corner_radius", &props.corner_radius);
    set_optional_prop(&mut node, "padding", &props.padding);
    set_optional_prop(&mut node, "min_width", &props.min_width);
    set_optional_prop(&mut node, "max_width", &props.max_width);
    set_optional_prop(&mut node, "fixed_width", &props.fixed_width);
    set_optional_prop(&mut node, "fixed_height", &props.fixed_height);
    
    if let Some(text_transform) = &props.text_transform {
        node.set_prop("text_transform", format!("{:?}", text_transform));
    }
    
    if let Some(text_align) = &props.text_align {
        node.set_prop("text_align", format!("{:?}", text_align));
    }
    
    if let Some(font_weight) = &props.font_weight {
        node.set_prop("font_weight", format!("{:?}", font_weight));
    }
    
    set_optional_prop(&mut node, "font_size", &props.font_size);
    set_optional_prop(&mut node, "letter_spacing", &props.letter_spacing);
    
    if let Some(button_state) = &props.button_state {
        node.set_prop("button_state", format!("{:?}", button_state));
        
        match button_state {
            ButtonState::Disabled => {
                node.set_prop("disabled", "true".to_string());
            },
            ButtonState::Pressed => {
                node.set_prop("pressed", "true".to_string());
            },
            ButtonState::Hovered => {
                node.set_prop("hovered", "true".to_string());
            },
            _ => {}
        }
    }
    
    set_optional_prop(&mut node, "is_loading", &props.is_loading);
    
    if let Some(loading_type) = &props.loading_indicator_type {
        node.set_prop("loading_indicator_type", format!("{:?}", loading_type));
    }
    
    if let Some(loading_color) = &props.loading_indicator_color {
        node.set_prop("loading_indicator_color", loading_color.to_css_string());
    }
    
    set_optional_prop(&mut node, "loading_indicator_size", &props.loading_indicator_size);
    set_optional_prop(&mut node, "hide_text_while_loading", &props.hide_text_while_loading);
    
    if let Some(icon) = &props.icon {
        node.set_prop("icon", icon.clone());
    }
    
    if let Some(icon_position) = &props.icon_position {
        node.set_prop("icon_position", icon_position.clone());
    }
    
    if let Some(label) = &props.accessibility_label {
        node.set_prop("accessibility_label", label.clone());
    }
    
    if let Some(hint) = &props.accessibility_hint {
        node.set_prop("accessibility_hint", hint.clone());
    }
    
    set_optional_prop(&mut node, "is_accessibility_element", &props.is_accessibility_element);
    
    set_optional_prop(&mut node, "elevation", &props.elevation);
    set_optional_prop(&mut node, "opacity", &props.opacity);
    
    if let Some(shadow_color) = &props.shadow_color {
        node.set_prop("shadow_color", shadow_color.to_css_string());
    }
    
    if let Some(shadow_offset) = &props.shadow_offset {
        node.set_prop("shadow_offset_x", shadow_offset.0.to_string());
        node.set_prop("shadow_offset_y", shadow_offset.1.to_string());
    }
    
    set_optional_prop(&mut node, "shadow_radius", &props.shadow_radius);
    
    let event_handlers = [
        ("on_double_tap", &props.on_double_tap, EventType::DoubleTap),
        ("on_long_press", &props.on_long_press, EventType::LongPress),
        ("on_hover_enter", &props.on_hover_enter, EventType::HoverEnter),
        ("on_hover_exit", &props.on_hover_exit, EventType::HoverExit),
        ("on_focus", &props.on_focus, EventType::Focus),
        ("on_blur", &props.on_blur, EventType::Blur),
    ];
    
    for (prop_name, handler, event_type) in &event_handlers {
        if let Some(handler_id) = handler {
            node.on_event(event_type.clone(), &handler_id.handler_id);
        }
    }
    
    node
}