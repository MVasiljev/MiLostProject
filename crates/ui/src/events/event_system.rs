use serde::{Serialize, Deserialize};
use std::any::Any;
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

use super::event_types::EventMetadata;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EventPhase {
    Capturing,
    AtTarget,
    Bubbling,
}

pub trait EventPayload: Any + Send + Sync {
    fn as_any(&self) -> &dyn Any;
    
    fn clone_box(&self) -> Box<dyn EventPayload>;
}

impl Clone for Box<dyn EventPayload> {
    fn clone(&self) -> Self {
        self.clone_box()
    }
}

#[derive(Clone)]
pub struct GenericPayload<T: Clone + 'static> {
    pub value: T,
}

impl<T: Clone + 'static + std::marker::Sync + std::marker::Send> EventPayload for GenericPayload<T> {
    fn as_any(&self) -> &dyn Any {
        self
    }
    
    fn clone_box(&self) -> Box<dyn EventPayload> {
        Box::new(self.clone())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum EventType {
    Tap,
    DoubleTap,
    LongPress,
    
    PointerDown,
    PointerUp,
    PointerMove,
    
    TouchStart,
    TouchEnd,
    TouchMove,
    
    Focus,
    Blur,
    
    HoverEnter,
    HoverExit,
    
    ValueChange,
    Submit,
    
    Swipe(SwipeDirection),
    Pinch,
    Rotate,
    
    DragStart,
    Drag,
    DragEnd,
    
    KeyDown,
    KeyUp,
    
    LoadingStart,
    LoadingEnd,
    
    Custom(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum SwipeDirection {
    Left,
    Right,
    Up,
    Down,
}

#[derive(Clone)]
pub struct Event {
    pub id: String,
    
    pub event_type: EventType,
    
    pub timestamp: u128,
    
    pub phase: EventPhase,
    
    pub position: Option<(f32, f32)>,
    
    pub target_id: Option<String>,
    
    pub properties: HashMap<String, String>,
    
    pub payload: Option<Box<dyn EventPayload>>,
    
    pub metadata: EventMetadata,
    
    pub is_stopped: bool,
    pub is_prevented: bool,
}

impl Event {
    pub fn new(event_type: EventType, source: super::event_types::EventSource) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            event_type,
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or(0),
            phase: EventPhase::Capturing,
            position: None,
            target_id: None,
            properties: HashMap::new(),
            payload: None,
            metadata: EventMetadata::new(source),
            is_stopped: false,
            is_prevented: false,
        }
    }
    
    pub fn with_position(mut self, x: f32, y: f32) -> Self {
        self.position = Some((x, y));
        self
    }
    
    pub fn with_target(mut self, target_id: String) -> Self {
        self.target_id = Some(target_id);
        self
    }
    
    pub fn with_property(mut self, key: &str, value: &str) -> Self {
        self.properties.insert(key.to_string(), value.to_string());
        self
    }
    
    pub fn with_payload<T: EventPayload>(mut self, payload: T) -> Self {
        self.payload = Some(Box::new(payload));
        self
    }
    
    pub fn stop_propagation(&mut self) {
        self.is_stopped = true;
    }
    
    pub fn prevent_default(&mut self) {
        self.is_prevented = true;
    }
    
    pub fn get_payload<T: 'static>(&self) -> Option<&T> {
        self.payload
            .as_ref()
            .and_then(|payload| payload.as_any().downcast_ref())
    }
}

impl Serialize for Event {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        #[derive(Serialize)]
        struct SerializableEvent<'a> {
            id: &'a str,
            event_type: &'a EventType,
            timestamp: u128,
            phase: &'a EventPhase,
            position: Option<(f32, f32)>,
            target_id: Option<&'a str>,
            properties: &'a HashMap<String, String>,
            metadata: &'a EventMetadata,
            is_stopped: bool,
            is_prevented: bool,
        }

        let serializable = SerializableEvent {
            id: &self.id,
            event_type: &self.event_type,
            timestamp: self.timestamp,
            phase: &self.phase,
            position: self.position,
            target_id: self.target_id.as_deref(),
            properties: &self.properties,
            metadata: &self.metadata,
            is_stopped: self.is_stopped,
            is_prevented: self.is_prevented,
        };

        serializable.serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for Event {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        #[derive(Deserialize)]
        struct SerializableEvent {
            id: String,
            event_type: EventType,
            timestamp: u128,
            phase: EventPhase,
            position: Option<(f32, f32)>,
            target_id: Option<String>,
            properties: HashMap<String, String>,
            metadata: EventMetadata,
            is_stopped: bool,
            is_prevented: bool,
        }

        let event = SerializableEvent::deserialize(deserializer)?;

        Ok(Event {
            id: event.id,
            event_type: event.event_type,
            timestamp: event.timestamp,
            phase: event.phase,
            position: event.position,
            target_id: event.target_id,
            properties: event.properties,
            payload: None,
            metadata: event.metadata,
            is_stopped: event.is_stopped,
            is_prevented: event.is_prevented,
        })
    }
}

impl Event {
    pub fn tap(source: super::event_types::EventSource) -> Self {
        Self::new(EventType::Tap, source)
    }

    pub fn double_tap(source: super::event_types::EventSource) -> Self {
        Self::new(EventType::DoubleTap, source)
    }

    pub fn long_press(source: super::event_types::EventSource) -> Self {
        Self::new(EventType::LongPress, source)
    }
}