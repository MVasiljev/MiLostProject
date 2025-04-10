use crate::components::button::{ButtonProps, ButtonState};
use crate::render::node::RenderNode;
use crate::events::event_system::EventType;
use crate::render::property::{Property, keys};
use crate::components::base_props::{BaseComponentProps, utils::apply_base_props};
use super::utils::generate_unique_id;

pub fn transform_button(props: &ButtonProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("button"), "Button");
    
    node.set_prop(keys::LABEL, props.label.clone());
    
    if let Some(style) = &props.style {
        node.set_prop(keys::BUTTON_STYLE, format!("{:?}", style));
    }
    
    if let Some(button_state) = &props.button_state {
        node.set_prop("button_state", format!("{:?}", button_state));
        
        match button_state {
            ButtonState::Disabled => {
                node.set_prop(keys::ENABLED, false);
            },
            ButtonState::Pressed => {
                node.set_prop(keys::PRESSED, true);
            },
            ButtonState::Hovered => {
                node.set_prop(keys::HOVERED, true);
            },
            ButtonState::Focused => {
                node.set_prop(keys::FOCUSED, true);
            },
            _ => {}
        }
    }
    
    if let Some(bg_color) = &props.background_color {
        node.set_prop(keys::BACKGROUND, bg_color.clone());
    }
    
    if let Some(text_color) = &props.text_color {
        node.set_prop(keys::TEXT_COLOR, text_color.clone());
    }
    
    if let Some(border_color) = &props.border_color {
        node.set_prop(keys::BORDER_COLOR, border_color.clone());
    }
    
    if let Some(corner_radius) = props.corner_radius {
        node.set_prop(keys::BORDER_RADIUS, corner_radius);
    }
    
    if let Some(border_width) = props.border_width {
        node.set_prop(keys::BORDER_WIDTH, border_width);
    }
    
    if let Some(border_style) = &props.border_style {
        node.set_prop(keys::BORDER_STYLE, format!("{:?}", border_style));
    }
    
    if let Some(text_transform) = &props.text_transform {
        node.set_prop(keys::TEXT_TRANSFORM, format!("{:?}", text_transform));
    }
    
    if let Some(text_align) = &props.text_align {
        node.set_prop(keys::TEXT_ALIGNMENT, format!("{:?}", text_align));
    }
    
    if let Some(font_weight) = &props.font_weight {
        node.set_prop(keys::FONT_WEIGHT, format!("{:?}", font_weight));
    }
    
    if let Some(font_size) = props.font_size {
        node.set_prop(keys::FONT_SIZE, font_size);
    }
    
    if let Some(letter_spacing) = props.letter_spacing {
        node.set_prop(keys::LETTER_SPACING, letter_spacing);
    }
    
    if let Some(overflow) = &props.overflow {
        node.set_prop(keys::OVERFLOW, format!("{:?}", overflow));
    }
    
    if let Some(is_loading) = props.is_loading {
        node.set_prop(keys::IS_LOADING, is_loading);
    }
    
    if let Some(indicator_type) = &props.loading_indicator_type {
        node.set_prop("loading_indicator_type", format!("{:?}", indicator_type));
    }
    
    if let Some(indicator_color) = &props.loading_indicator_color {
        node.set_prop("loading_indicator_color", indicator_color.clone());
    }
    
    if let Some(indicator_size) = props.loading_indicator_size {
        node.set_prop("loading_indicator_size", indicator_size);
    }
    
    if let Some(hide_text) = props.hide_text_while_loading {
        node.set_prop("hide_text_while_loading", hide_text);
    }
    
    if let Some(icon) = &props.icon {
        node.set_prop("icon", icon.clone());
    }
    
    if let Some(icon_position) = &props.icon_position {
        node.set_prop("icon_position", icon_position.clone());
    }
    
    if let Some(shadow_color) = &props.shadow_color {
        node.set_prop(keys::SHADOW_COLOR, shadow_color.clone());
    }
    
    if let Some(shadow_offset) = &props.shadow_offset {
        node.set_prop(keys::SHADOW_OFFSET_X, shadow_offset.0);
        node.set_prop(keys::SHADOW_OFFSET_Y, shadow_offset.1);
    }
    
    if let Some(shadow_radius) = props.shadow_radius {
        node.set_prop(keys::SHADOW_RADIUS, shadow_radius);
    }
    
    if let Some(press_effect) = props.press_effect {
        node.set_prop("press_effect", press_effect);
    }
    
    if let Some(press_scale) = props.press_scale {
        node.set_prop("press_scale", press_scale);
    }
    
    if let Some(press_color_change) = &props.press_color_change {
        node.set_prop("press_color_change", press_color_change.clone());
    }
    
    if let Some(press_offset) = &props.press_offset {
        node.set_prop("press_offset_x", press_offset.0);
        node.set_prop("press_offset_y", press_offset.1);
    }
    
    if let Some(on_tap) = &props.on_tap {
        node.on_event(EventType::Tap, &on_tap.handler_id);
    }
    
    let event_handlers = [
        ("on_double_tap", &props.on_double_tap, EventType::DoubleTap),
        ("on_long_press", &props.on_long_press, EventType::LongPress),
        ("on_hover_enter", &props.on_hover_enter, EventType::HoverEnter),
        ("on_hover_exit", &props.on_hover_exit, EventType::HoverExit),
        ("on_focus", &props.on_focus, EventType::Focus),
        ("on_blur", &props.on_blur, EventType::Blur),
    ];
    
    for (_, handler, event_type) in &event_handlers {
        if let Some(handler_data) = handler {
            node.on_event(event_type.clone(), &handler_data.handler_id);
        }
    }
    
    let mut base_props = BaseComponentProps::new();
    
    if let Some(disabled) = props.disabled {
        base_props.enabled = Some(!disabled);
    }
    
    if let Some(bg) = &props.background_color {
        base_props.background = Some(bg.clone());
    }
    
    if let Some(o) = props.opacity {
        base_props.opacity = Some(o);
    }
    
    if let Some(r) = props.corner_radius {
        base_props.border_radius = Some(r);
    }
    
    if let Some(bw) = props.border_width {
        base_props.border_width = Some(bw);
    }
    
    if let Some(bc) = &props.border_color {
        base_props.border_color = Some(bc.clone());
    }
    
    if let Some(bs) = &props.border_style {
        base_props.border_style = Some(bs.clone());
    }
    
    if let Some(sr) = props.shadow_radius {
        base_props.shadow_radius = Some(sr);
    }
    
    if let Some(sc) = &props.shadow_color {
        base_props.shadow_color = Some(sc.clone());
    }
    
    if let Some(so) = &props.shadow_offset {
        base_props.shadow_offset_x = Some(so.0);
        base_props.shadow_offset_y = Some(so.1);
    }
    
    if let Some(p) = props.padding {
        base_props.padding = Some(p);
    }
    
    if let Some(mw) = props.min_width {
        base_props.min_width = Some(mw);
    }
    
    if let Some(maxw) = props.max_width {
        base_props.max_width = Some(maxw);
    }
    
    if let Some(fw) = props.fixed_width {
        base_props.width = Some(fw);
    }
    
    if let Some(fh) = props.fixed_height {
        base_props.height = Some(fh);
    }
    
    if let Some(a_label) = &props.accessibility_label {
        base_props.accessibility_label = Some(a_label.clone());
    }
    
    if let Some(a_hint) = &props.accessibility_hint {
        base_props.accessibility_hint = Some(a_hint.clone());
    }
    
    if let Some(a_element) = props.is_accessibility_element {
        base_props.is_accessibility_element = Some(a_element);
    }
    
    if let Some(ad) = props.animation_duration {
        base_props.animation_duration = Some(ad);
    }
    
    if let Some(ei) = &props.edge_insets {
        base_props.edge_insets = Some(ei.clone());
    }
    
    apply_base_props(&mut node, &base_props);
    
    node
}