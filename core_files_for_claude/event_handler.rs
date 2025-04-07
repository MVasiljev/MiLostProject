use std::sync::{Arc, Mutex};
use std::collections::{HashMap, HashSet};

use super::event_system::{Event, EventType};
use super::event_types::EventSource;

pub trait EventHandlerFn: Send + Sync {
    fn call(&self, event: &mut Event) -> HandlerResult;
}

#[derive(Debug, PartialEq)]
pub enum HandlerResult {
    Handled,
    Partial,
    Unhandled,
}

impl<F> EventHandlerFn for F 
where 
    F: Fn(&mut Event) -> HandlerResult + Send + Sync + 'static 
{
    fn call(&self, event: &mut Event) -> HandlerResult {
        (self)(event)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum HandlerPriority {
    Low = 0,
    Normal = 10,
    High = 20,
    Critical = 30,
}

pub struct TypedEventHandler {
    pub id: String,
    
    pub handler: Arc<dyn EventHandlerFn>,
    
    pub filter: Option<Arc<dyn Fn(&Event) -> bool + Send + Sync>>,
    
    pub priority: HandlerPriority,
    
    pub allowed_sources: Option<Vec<EventSource>>,
    
    pub max_calls: Option<usize>,
    
    pub current_calls: usize,
}

impl TypedEventHandler {
    pub fn new<F>(
        id: &str, 
        handler: F
    ) -> Self 
    where 
        F: Fn(&mut Event) -> HandlerResult + Send + Sync + 'static 
    {
        Self {
            id: id.to_string(),
            handler: Arc::new(handler),
            filter: None,
            priority: HandlerPriority::Normal,
            allowed_sources: None,
            max_calls: None,
            current_calls: 0,
        }
    }
    
    pub fn with_filter<F>(mut self, filter: F) -> Self 
    where 
        F: Fn(&Event) -> bool + Send + Sync + 'static 
    {
        self.filter = Some(Arc::new(filter));
        self
    }
    
    pub fn with_priority(mut self, priority: HandlerPriority) -> Self {
        self.priority = priority;
        self
    }
    
    pub fn with_sources(mut self, sources: &[EventSource]) -> Self {
        self.allowed_sources = Some(sources.to_vec());
        self
    }
    
    pub fn with_max_calls(mut self, max_calls: usize) -> Self {
        self.max_calls = Some(max_calls);
        self
    }
    
    pub fn handle(&mut self, event: &mut Event) -> HandlerResult {
        if let Some(max_calls) = self.max_calls {
            if self.current_calls >= max_calls {
                return HandlerResult::Unhandled;
            }
        }
        
        if let Some(sources) = &self.allowed_sources {
            if !sources.iter().any(|source| *source == event.metadata.source) {
                return HandlerResult::Unhandled;
            }
        }
        
        if let Some(filter) = &self.filter {
            if !(filter)(event) {
                return HandlerResult::Unhandled;
            }
        }
        
        let result = self.handler.call(event);
        
        if result != HandlerResult::Unhandled {
            self.current_calls += 1;
        }
        
        result
    }
}

pub struct EventDispatcher {
    handlers: Mutex<HashMap<EventType, Vec<TypedEventHandler>>>,
    
    global_handlers: Mutex<Vec<TypedEventHandler>>,
}

impl EventDispatcher {
    pub fn new() -> Self {
        Self {
            handlers: Mutex::new(HashMap::new()),
            global_handlers: Mutex::new(Vec::new()),
        }
    }
    
    pub fn register_handler(
        &self, 
        event_type: EventType, 
        handler: TypedEventHandler
    ) {
        let mut handlers = self.handlers.lock().unwrap();
        handlers
            .entry(event_type.clone())
            .or_insert_with(Vec::new)
            .push(handler);
        
        handlers.get_mut(&event_type).unwrap()
            .sort_by(|a, b| b.priority.cmp(&a.priority));
    }
    
    pub fn register_global_handler(&self, handler: TypedEventHandler) {
        let mut global_handlers = self.global_handlers.lock().unwrap();
        global_handlers.push(handler);
        
        global_handlers.sort_by(|a, b| b.priority.cmp(&a.priority));
    }
    
    pub fn dispatch(&self, event: &mut Event) -> HandlerResult {
        let mut overall_result = HandlerResult::Unhandled;
        
        {
            let mut global_handlers = self.global_handlers.lock().unwrap();
            for handler in global_handlers.iter_mut() {
                let result = handler.handle(event);
                
                match result {
                    HandlerResult::Handled => {
                        overall_result = HandlerResult::Handled;
                        break;
                    },
                    HandlerResult::Partial => {
                        overall_result = HandlerResult::Partial;
                    },
                    HandlerResult::Unhandled => {}
                }
                
                if event.is_stopped {
                    break;
                }
            }
        }
        
        if overall_result != HandlerResult::Handled && !event.is_stopped {
            let mut handlers = self.handlers.lock().unwrap();
            
            if let Some(type_handlers) = handlers.get_mut(&event.event_type) {
                for handler in type_handlers {
                    let result = handler.handle(event);
                    
                    match result {
                        HandlerResult::Handled => {
                            overall_result = HandlerResult::Handled;
                            break;
                        },
                        HandlerResult::Partial => {
                            overall_result = HandlerResult::Partial;
                        },
                        HandlerResult::Unhandled => {}
                    }
                    
                    if event.is_stopped {
                        break;
                    }
                }
            }
        }
        
        overall_result
    }
    
    pub fn clear_handlers(&self, event_type: &EventType) {
        let mut handlers = self.handlers.lock().unwrap();
        handlers.remove(event_type);
    }
    
    pub fn remove_handler(&self, event_type: &EventType, handler_id: &str) {
        let mut handlers = self.handlers.lock().unwrap();
        
        if let Some(type_handlers) = handlers.get_mut(event_type) {
            type_handlers.retain(|handler| handler.id != handler_id);
        }
    }
}

pub struct ButtonEventHandler {
    pub on_tap: Option<String>,
    pub on_double_tap: Option<String>,
    pub on_long_press: Option<String>,
    pub on_hover_enter: Option<String>,
    pub on_hover_exit: Option<String>,
    pub on_focus: Option<String>,
    pub on_blur: Option<String>,
}

impl ButtonEventHandler {
    pub fn new() -> Self {
        Self {
            on_tap: None,
            on_double_tap: None,
            on_long_press: None,
            on_hover_enter: None,
            on_hover_exit: None,
            on_focus: None,
            on_blur: None,
        }
    }
    
    pub fn with_tap_handler(mut self, handler_id: &str) -> Self {
        self.on_tap = Some(handler_id.to_string());
        self
    }
    
    pub fn with_double_tap_handler(mut self, handler_id: &str) -> Self {
        self.on_double_tap = Some(handler_id.to_string());
        self
    }
    
    pub fn with_long_press_handler(mut self, handler_id: &str) -> Self {
        self.on_long_press = Some(handler_id.to_string());
        self
    }
    
    pub fn with_hover_enter_handler(mut self, handler_id: &str) -> Self {
        self.on_hover_enter = Some(handler_id.to_string());
        self
    }
    
    pub fn with_hover_exit_handler(mut self, handler_id: &str) -> Self {
        self.on_hover_exit = Some(handler_id.to_string());
        self
    }
    
    pub fn with_focus_handler(mut self, handler_id: &str) -> Self {
        self.on_focus = Some(handler_id.to_string());
        self
    }
    
    pub fn with_blur_handler(mut self, handler_id: &str) -> Self {
        self.on_blur = Some(handler_id.to_string());
        self
    }
    
    pub fn get_handler_id(&self, event_type: &EventType) -> Option<&String> {
        match event_type {
            EventType::Tap => self.on_tap.as_ref(),
            EventType::DoubleTap => self.on_double_tap.as_ref(),
            EventType::LongPress => self.on_long_press.as_ref(),
            EventType::HoverEnter => self.on_hover_enter.as_ref(),
            EventType::HoverExit => self.on_hover_exit.as_ref(),
            EventType::Focus => self.on_focus.as_ref(),
            EventType::Blur => self.on_blur.as_ref(),
            _ => None,
        }
    }
}