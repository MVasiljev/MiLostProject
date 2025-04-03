// First, let's create an events.rs file to define the event system
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

use crate::button::ButtonStyle;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EventType {
    Tap,
    DoubleTap,
    LongPress,
    Drag,
    Focus,
    Blur,
    ValueChange,
    Custom(String),
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
}

// Let's add event handlers to all components that need interaction
// Example for Button component


// Now let's make a JavaScript event handler for the canvas renderer
// This will go in the TypeScript files