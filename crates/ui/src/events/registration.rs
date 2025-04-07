use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use crate::render::node::EventHandler as NodeEventHandler;
use crate::events::{
    Event, EventType, HandlerResult, TypedEventHandler, EventDispatcher
};
use crate::render::node::RenderNode;

pub struct EventHandlerRegistry {
    dispatcher: EventDispatcher,
    
    handlers: HashMap<String, Arc<TypedEventHandler>>,
    
    node_handlers: HashMap<String, Vec<String>>,
}

impl EventHandlerRegistry {
    pub fn new() -> Self {
        Self {
            dispatcher: EventDispatcher::new(),
            handlers: HashMap::new(),
            node_handlers: HashMap::new(),
        }
    }
    
pub fn register_handler<F>(&mut self, handler_id: &str, event_type: EventType, handler_fn: F)
where
    F: Fn(&mut Event) -> HandlerResult + Send + Sync + 'static
{
    let handler = TypedEventHandler::new(handler_id, handler_fn);
    
    self.dispatcher.register_handler(event_type.clone(), handler);
    
    let dummy_handler = TypedEventHandler::new(handler_id, |_| HandlerResult::Unhandled);
    self.handlers.insert(handler_id.to_string(), Arc::new(dummy_handler));
}

    pub fn register_global_handler<F>(&mut self, handler_id: &str, handler_fn: F)
    where
        F: Fn(&mut Event) -> HandlerResult + Send + Sync + 'static
    {
        let handler = TypedEventHandler::new(handler_id, handler_fn);
        
        self.dispatcher.register_global_handler(handler);
        
        let dummy_handler = TypedEventHandler::new(handler_id, |_| HandlerResult::Unhandled);
        self.handlers.insert(handler_id.to_string(), Arc::new(dummy_handler));
    }
    
    pub fn register_from_node(&mut self, node: &RenderNode) {
        let mut node_handler_ids = Vec::new();
        
        if let Some(node_events) = node.get_node_events() {
            if let Some(ref tap_id) = node_events.on_tap {
                self.dispatcher.register_handler(
                    EventType::Tap,
                    TypedEventHandler::new(tap_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(tap_id.clone());
            }
            
            if let Some(ref double_tap_id) = node_events.on_double_tap {
                self.dispatcher.register_handler(
                    EventType::DoubleTap,
                    TypedEventHandler::new(double_tap_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(double_tap_id.clone());
            }
            
            if let Some(ref long_press_id) = node_events.on_long_press {
                self.dispatcher.register_handler(
                    EventType::LongPress,
                    TypedEventHandler::new(long_press_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(long_press_id.clone());
            }
            
            if let Some(ref hover_enter_id) = node_events.on_hover_enter {
                self.dispatcher.register_handler(
                    EventType::HoverEnter,
                    TypedEventHandler::new(hover_enter_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(hover_enter_id.clone());
            }
            
            if let Some(ref hover_exit_id) = node_events.on_hover_exit {
                self.dispatcher.register_handler(
                    EventType::HoverExit,
                    TypedEventHandler::new(hover_exit_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(hover_exit_id.clone());
            }
            
            if let Some(ref focus_id) = node_events.on_focus {
                self.dispatcher.register_handler(
                    EventType::Focus,
                    TypedEventHandler::new(focus_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(focus_id.clone());
            }
            
            if let Some(ref blur_id) = node_events.on_blur {
                self.dispatcher.register_handler(
                    EventType::Blur,
                    TypedEventHandler::new(blur_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(blur_id.clone());
            }
            
            if let Some(ref value_change_id) = node_events.on_value_change {
                self.dispatcher.register_handler(
                    EventType::ValueChange,
                    TypedEventHandler::new(value_change_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(value_change_id.clone());
            }
            
            if let Some(ref submit_id) = node_events.on_submit {
                self.dispatcher.register_handler(
                    EventType::Submit,
                    TypedEventHandler::new(submit_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(submit_id.clone());
            }
            
            for (direction, handler_id) in &node_events.on_swipe {
                use crate::events::SwipeDirection;
                let swipe_direction = match direction.to_lowercase().as_str() {
                    "left" => SwipeDirection::Left,
                    "right" => SwipeDirection::Right,
                    "up" => SwipeDirection::Up,
                    "down" => SwipeDirection::Down,
                    _ => continue,
                };
                
                self.dispatcher.register_handler(
                    EventType::Swipe(swipe_direction),
                    TypedEventHandler::new(handler_id, |_| HandlerResult::Handled)
                );
                node_handler_ids.push(handler_id.clone());
            }
        }
        
        for handler in &node.event_handlers {
            self.dispatcher.register_handler(
                handler.event_type.clone(),
                TypedEventHandler::new(&handler.handler_id, |_| HandlerResult::Handled)
            );
            node_handler_ids.push(handler.handler_id.clone());
        }
        
        if !node_handler_ids.is_empty() {
            self.node_handlers.insert(node.id.clone(), node_handler_ids);
        }
        
        for child in &node.children {
            self.register_from_node(child);
        }
    }
    
    pub fn process_event(&self, event: &mut Event) -> HandlerResult {
        self.dispatcher.dispatch(event)
    }
    
    pub fn unregister_node(&mut self, node_id: &str) {
        if let Some(handler_ids) = self.node_handlers.get(node_id) {
            for handler_id in handler_ids {
                self.handlers.remove(handler_id);
            }
            self.node_handlers.remove(node_id);
        }
    }
    
    pub fn clear(&mut self) {
        self.dispatcher = EventDispatcher::new();
        self.handlers.clear();
        self.node_handlers.clear();
    }
}

pub mod helpers {
    use super::*;
    use crate::render::node::RenderNode;
    
    pub struct EventHandlerBuilder<'a> {
        node: &'a mut RenderNode,
    }
    
    impl<'a> EventHandlerBuilder<'a> {
        pub fn new(node: &'a mut RenderNode) -> Self {
            Self { node }
        }
        
        pub fn on_tap(self, handler_id: Option<&str>) -> Self {
            if let Some(id) = handler_id {
                self.node.on_tap(id);
            }
            self
        }
        
        pub fn on_double_tap(self, handler_id: Option<&str>) -> Self {
            if let Some(id) = handler_id {
                self.node.on_double_tap(id);
            }
            self
        }
        
        pub fn on_long_press(self, handler_id: Option<&str>) -> Self {
            if let Some(id) = handler_id {
                self.node.on_long_press(id);
            }
            self
        }
        
        pub fn on_hover(self, enter_id: Option<&str>, exit_id: Option<&str>) -> Self {
            if let Some(id) = enter_id {
                self.node.on_hover_enter(id);
            }
            if let Some(id) = exit_id {
                self.node.on_hover_exit(id);
            }
            self
        }
        
        pub fn on_focus(self, focus_id: Option<&str>, blur_id: Option<&str>) -> Self {
            if let Some(id) = focus_id {
                self.node.on_event(EventType::Focus, id);
            }
            if let Some(id) = blur_id {
                self.node.on_event(EventType::Blur, id);
            }
            self
        }
        
        pub fn on_swipe(
            self, 
            left_id: Option<&str>, 
            right_id: Option<&str>,
            up_id: Option<&str>,
            down_id: Option<&str>
        ) -> Self {
            if let Some(id) = left_id {
                self.node.on_swipe("left", id);
            }
            if let Some(id) = right_id {
                self.node.on_swipe("right", id);
            }
            if let Some(id) = up_id {
                self.node.on_swipe("up", id);
            }
            if let Some(id) = down_id {
                self.node.on_swipe("down", id);
            }
            self
        }
        
        pub fn on_key(self, down_id: Option<&str>, up_id: Option<&str>) -> Self {
            if let Some(id) = down_id {
                self.node.on_event(EventType::KeyDown, id);
            }
            if let Some(id) = up_id {
                self.node.on_event(EventType::KeyUp, id);
            }
            self
        }
        
        pub fn on_input(self, change_id: Option<&str>, submit_id: Option<&str>) -> Self {
            if let Some(id) = change_id {
                self.node.on_event(EventType::ValueChange, id);
            }
            if let Some(id) = submit_id {
                self.node.on_event(EventType::Submit, id);
            }
            self
        }
        
        pub fn on_event(self, event_type: EventType, handler_id: Option<&str>) -> Self {
            if let Some(id) = handler_id {
                self.node.on_event(event_type, id);
            }
            self
        }
        
        pub fn build(self) -> &'a mut RenderNode {
            self.node
        }
    }
    
    pub fn add_common_handlers<'a>(
        node: &'a mut RenderNode,
        tap: Option<&'a str>,
        double_tap: Option<&'a str>,
        long_press: Option<&'a str>,
        hover_enter: Option<&'a str>,
        hover_exit: Option<&'a str>
    ) -> &'a mut RenderNode {
        EventHandlerBuilder::new(node)
            .on_tap(tap)
            .on_double_tap(double_tap)
            .on_long_press(long_press)
            .on_hover(hover_enter, hover_exit)
            .build()
    }
    
    pub fn add_gesture_handlers<'a>(
        node: &'a mut RenderNode,
        tap: Option<&'a str>,
        swipe_left: Option<&'a str>,
        swipe_right: Option<&'a str>,
        swipe_up: Option<&'a str>,
        swipe_down: Option<&'a str>
    ) -> &'a mut RenderNode {
        EventHandlerBuilder::new(node)
            .on_tap(tap)
            .on_swipe(swipe_left, swipe_right, swipe_up, swipe_down)
            .build()
    }
    
    pub fn add_form_handlers<'a>(
        node: &'a mut RenderNode,
        focus: Option<&'a str>,
        blur: Option<&'a str>,
        change: Option<&'a str>,
        submit: Option<&'a str>
    ) -> &'a mut RenderNode {
        EventHandlerBuilder::new(node)
            .on_focus(focus, blur)
            .on_input(change, submit)
            .build()
    }
}

use std::sync::OnceLock;

static EVENT_REGISTRY: OnceLock<RwLock<EventHandlerRegistry>> = OnceLock::new();

pub fn event_registry() -> &'static RwLock<EventHandlerRegistry> {
    EVENT_REGISTRY.get_or_init(|| {
        RwLock::new(EventHandlerRegistry::new())
    })
}

pub fn register_handlers_from_node(node: &RenderNode) {
    let mut registry = event_registry().write().unwrap();
    registry.register_from_node(node);
}

pub fn process_event(event: &mut Event) -> HandlerResult {
    let registry = event_registry().read().unwrap();
    registry.process_event(event)
}

pub fn register_handler<F>(handler_id: &str, event_type: EventType, handler_fn: F)
where
    F: Fn(&mut Event) -> HandlerResult + Send + Sync + 'static
{
    let mut registry = event_registry().write().unwrap();
    registry.register_handler(handler_id, event_type, handler_fn);
}

pub fn register_global_handler<F>(handler_id: &str, handler_fn: F)
where
    F: Fn(&mut Event) -> HandlerResult + Send + Sync + 'static
{
    let mut registry = event_registry().write().unwrap();
    registry.register_global_handler(handler_id, handler_fn);
}

pub fn clear_handlers() {
    let mut registry = event_registry().write().unwrap();
    registry.clear();
}