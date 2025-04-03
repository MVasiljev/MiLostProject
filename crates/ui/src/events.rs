use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EventType {
    Tap,
    DoubleTap,
    LongPress,
    Drag,
    
    Focus,
    Blur,
    
    HoverEnter,
    HoverExit,
    
    ValueChange,
    Submit,
    
    PointerDown,
    PointerUp,
    PointerMove,
    
    TouchStart,
    TouchEnd,
    TouchMove,
    
    SwipeLeft,
    SwipeRight,
    SwipeUp,
    SwipeDown,
    Pinch,
    Rotate,
    
    LoadingStart,
    LoadingEnd,
    
    Custom(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventData {
    pub timestamp: Option<u64>,
    pub position: Option<(f32, f32)>,
    pub target_id: Option<String>,
    
    pub properties: HashMap<String, String>,
}

impl EventData {
    pub fn new() -> Self {
        Self {
            timestamp: None,
            position: None,
            target_id: None,
            properties: HashMap::new(),
        }
    }
    
    pub fn with_timestamp(mut self, timestamp: u64) -> Self {
        self.timestamp = Some(timestamp);
        self
    }
    
    pub fn with_position(mut self, x: f32, y: f32) -> Self {
        self.position = Some((x, y));
        self
    }
    
    pub fn with_target(mut self, id: String) -> Self {
        self.target_id = Some(id);
        self
    }
    
    pub fn with_property(mut self, key: &str, value: &str) -> Self {
        self.properties.insert(key.to_string(), value.to_string());
        self
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventHandler {
    pub event_type: EventType,
    pub handler_id: String,
    pub data: Option<HashMap<String, String>>,
}

impl EventHandler {
    pub fn new(event_type: EventType, handler_id: String) -> Self {
        Self {
            event_type,
            handler_id,
            data: None,
        }
    }
    
    pub fn with_data(mut self, key: &str, value: &str) -> Self {
        if self.data.is_none() {
            self.data = Some(HashMap::new());
        }
        
        if let Some(data) = &mut self.data {
            data.insert(key.to_string(), value.to_string());
        }
        
        self
    }
    
    pub fn with_data_map(mut self, map: HashMap<String, String>) -> Self {
        self.data = Some(map);
        self
    }
}

pub trait EventDispatcher {
    fn register_event_handler(&mut self, event_type: EventType, handler: EventHandler);
    fn dispatch_event(&self, event_type: EventType, data: Option<EventData>);
}

pub struct ButtonEventHandler {
    pub on_tap: Option<EventHandler>,
    pub on_double_tap: Option<EventHandler>,
    pub on_long_press: Option<EventHandler>,
    pub on_hover_enter: Option<EventHandler>,
    pub on_hover_exit: Option<EventHandler>,
    pub on_focus: Option<EventHandler>,
    pub on_blur: Option<EventHandler>,
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
    
    pub fn with_tap_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::Tap, "Handler must be for Tap event");
        self.on_tap = Some(handler);
        self
    }
    
    pub fn with_double_tap_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::DoubleTap, "Handler must be for DoubleTap event");
        self.on_double_tap = Some(handler);
        self
    }
    
    pub fn with_long_press_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::LongPress, "Handler must be for LongPress event");
        self.on_long_press = Some(handler);
        self
    }
    
    pub fn with_hover_enter_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::HoverEnter, "Handler must be for HoverEnter event");
        self.on_hover_enter = Some(handler);
        self
    }
    
    pub fn with_hover_exit_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::HoverExit, "Handler must be for HoverExit event");
        self.on_hover_exit = Some(handler);
        self
    }
    
    pub fn with_focus_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::Focus, "Handler must be for Focus event");
        self.on_focus = Some(handler);
        self
    }
    
    pub fn with_blur_handler(mut self, handler: EventHandler) -> Self {
        assert_eq!(handler.event_type, EventType::Blur, "Handler must be for Blur event");
        self.on_blur = Some(handler);
        self
    }
    
    pub fn get_handler(&self, event_type: &EventType) -> Option<&EventHandler> {
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventProcessor {
    pub events: Vec<(String, EventType, Option<EventData>)>,
}

impl EventProcessor {
    pub fn new() -> Self {
        Self {
            events: Vec::new(),
        }
    }
    
    pub fn add_event(&mut self, component_id: String, event_type: EventType, data: Option<EventData>) {
        self.events.push((component_id, event_type, data));
    }
    
    pub fn process(&self) -> String {
        serde_json::to_string(self).unwrap_or_else(|_| "[]".to_string())
    }
}

pub fn create_tap_handler(handler_id: &str) -> EventHandler {
    EventHandler::new(EventType::Tap, handler_id.to_string())
}

pub fn create_double_tap_handler(handler_id: &str) -> EventHandler {
    EventHandler::new(EventType::DoubleTap, handler_id.to_string())
}

pub fn create_long_press_handler(handler_id: &str) -> EventHandler {
    EventHandler::new(EventType::LongPress, handler_id.to_string())
}

pub fn create_hover_enter_handler(handler_id: &str) -> EventHandler {
    EventHandler::new(EventType::HoverEnter, handler_id.to_string())
}

pub fn create_hover_exit_handler(handler_id: &str) -> EventHandler {
    EventHandler::new(EventType::HoverExit, handler_id.to_string())
}