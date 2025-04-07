// src/render/component.rs
use crate::UIComponent;
use crate::render::node::RenderNode;
use crate::components::registry::transform_component;

pub fn render(component: &UIComponent) -> RenderNode {
    transform_component(component)
}

pub mod event_helpers {
    use super::*;
    use crate::{events::EventType, render::node::EventHandler};

    pub fn create_event_handler(event_type: EventType, handler_id: &str) -> EventHandler {
        EventHandler {
            event_type,
            handler_id: handler_id.to_string(),
        }
    }
    
    pub fn add_common_event_handlers(
        node: &mut RenderNode,
        on_tap: Option<&str>,
        on_double_tap: Option<&str>,
        on_long_press: Option<&str>,
        on_hover_enter: Option<&str>,
        on_hover_exit: Option<&str>
    ) {
        if let Some(handler_id) = on_tap {
            node.on_tap(handler_id);
        }
        
        if let Some(handler_id) = on_double_tap {
            node.on_double_tap(handler_id);
        }
        
        if let Some(handler_id) = on_long_press {
            node.on_long_press(handler_id);
        }
        
        if let Some(handler_id) = on_hover_enter {
            node.on_hover_enter(handler_id);
        }
        
        if let Some(handler_id) = on_hover_exit {
            node.on_hover_exit(handler_id);
        }
    }
    
    pub fn add_touch_event_handlers(
        node: &mut RenderNode,
        on_touch_start: Option<&str>,
        on_touch_move: Option<&str>,
        on_touch_end: Option<&str>
    ) {
        if let Some(handler_id) = on_touch_start {
            node.on_event(EventType::TouchStart, handler_id);
        }
        
        if let Some(handler_id) = on_touch_move {
            node.on_event(EventType::TouchMove, handler_id);
        }
        
        if let Some(handler_id) = on_touch_end {
            node.on_event(EventType::TouchEnd, handler_id);
        }
    }
    
    pub fn add_swipe_event_handlers(
        node: &mut RenderNode,
        on_swipe_left: Option<&str>,
        on_swipe_right: Option<&str>,
        on_swipe_up: Option<&str>,
        on_swipe_down: Option<&str>
    ) {
        if let Some(handler_id) = on_swipe_left {
            node.on_swipe("left", handler_id);
        }
        
        if let Some(handler_id) = on_swipe_right {
            node.on_swipe("right", handler_id);
        }
        
        if let Some(handler_id) = on_swipe_up {
            node.on_swipe("up", handler_id);
        }
        
        if let Some(handler_id) = on_swipe_down {
            node.on_swipe("down", handler_id);
        }
    }
    
    pub fn add_focus_event_handlers(
        node: &mut RenderNode,
        on_focus: Option<&str>,
        on_blur: Option<&str>
    ) {
        if let Some(handler_id) = on_focus {
            node.on_event(EventType::Focus, handler_id);
        }
        
        if let Some(handler_id) = on_blur {
            node.on_event(EventType::Blur, handler_id);
        }
    }
    
    pub fn add_keyboard_event_handlers(
        node: &mut RenderNode,
        on_key_down: Option<&str>,
        on_key_up: Option<&str>
    ) {
        if let Some(handler_id) = on_key_down {
            node.on_event(EventType::KeyDown, handler_id);
        }
        
        if let Some(handler_id) = on_key_up {
            node.on_event(EventType::KeyUp, handler_id);
        }
    }
    
    pub fn add_value_event_handlers(
        node: &mut RenderNode,
        on_value_change: Option<&str>,
        on_submit: Option<&str>
    ) {
        if let Some(handler_id) = on_value_change {
            node.on_event(EventType::ValueChange, handler_id);
        }
        
        if let Some(handler_id) = on_submit {
            node.on_event(EventType::Submit, handler_id);
        }
    }
}

