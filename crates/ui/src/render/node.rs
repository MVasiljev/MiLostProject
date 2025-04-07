use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use crate::events::{EventType, ButtonEventHandler};
use crate::render::property::{Property, PropertyBag};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventHandler {
    pub event_type: EventType,
    pub handler_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeEventHandlers {
    pub on_tap: Option<String>,
    pub on_double_tap: Option<String>,
    pub on_long_press: Option<String>,
    pub on_hover_enter: Option<String>,
    pub on_hover_exit: Option<String>,
    pub on_focus: Option<String>,
    pub on_blur: Option<String>,
    pub on_value_change: Option<String>,
    pub on_submit: Option<String>,
    pub on_swipe: HashMap<String, String>,
}

impl Default for NodeEventHandlers {
    fn default() -> Self {
        Self {
            on_tap: None,
            on_double_tap: None,
            on_long_press: None,
            on_hover_enter: None,
            on_hover_exit: None,
            on_focus: None,
            on_blur: None,
            on_value_change: None,
            on_submit: None,
            on_swipe: HashMap::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderNode {
    pub id: String,
    pub type_name: String,
    pub properties: PropertyBag,
    pub children: Vec<RenderNode>,
    pub event_handlers: Vec<EventHandler>,
    #[serde(default)]
    pub node_events: NodeEventHandlers,
}

impl RenderNode {
    pub fn new(id: &str, type_name: &str) -> Self {
        Self {
            id: id.to_string(),
            type_name: type_name.to_string(),
            properties: PropertyBag::new(),
            children: Vec::new(),
            event_handlers: Vec::new(),
            node_events: NodeEventHandlers::default(),
        }
    }

    pub fn add_event_handler(&mut self, handler: EventHandler) -> &mut Self {
        self.event_handlers.push(handler);
        self
    }

    pub fn on_event(&mut self, event_type: EventType, handler_id: &str) -> &mut Self {
        self.add_event_handler(EventHandler {
            event_type: event_type.clone(),
            handler_id: handler_id.to_string(),
        })
    }

    pub fn get_node_events(&self) -> Option<&NodeEventHandlers> {
        Some(&self.node_events)
    }

    pub fn on_tap(&mut self, handler_id: &str) -> &mut Self {
        self.on_event(EventType::Tap, handler_id);
        self.node_events.on_tap = Some(handler_id.to_string());
        self
    }

    pub fn on_double_tap(&mut self, handler_id: &str) -> &mut Self {
        self.on_event(EventType::DoubleTap, handler_id);
        self.node_events.on_double_tap = Some(handler_id.to_string());
        self
    }

    pub fn on_long_press(&mut self, handler_id: &str) -> &mut Self {
        self.on_event(EventType::LongPress, handler_id);
        self.node_events.on_long_press = Some(handler_id.to_string());
        self
    }

    pub fn on_hover_enter(&mut self, handler_id: &str) -> &mut Self {
        self.on_event(EventType::HoverEnter, handler_id);
        self.node_events.on_hover_enter = Some(handler_id.to_string());
        self
    }

    pub fn on_hover_exit(&mut self, handler_id: &str) -> &mut Self {
        self.on_event(EventType::HoverExit, handler_id);
        self.node_events.on_hover_exit = Some(handler_id.to_string());
        self
    }

    pub fn on_swipe(&mut self, direction: &str, handler_id: &str) -> &mut Self {
        use crate::events::SwipeDirection;
        
        let swipe_direction = match direction.to_lowercase().as_str() {
            "left" => SwipeDirection::Left,
            "right" => SwipeDirection::Right, 
            "up" => SwipeDirection::Up,
            "down" => SwipeDirection::Down,
            _ => return self,
        };
        
        self.on_event(EventType::Swipe(swipe_direction), handler_id);
        self.node_events.on_swipe.insert(direction.to_string(), handler_id.to_string());
        self
    }

    pub fn to_button_event_handler(&self) -> ButtonEventHandler {
        let mut handler = ButtonEventHandler::new();
        
        if let Some(ref tap_id) = self.node_events.on_tap {
            handler = handler.with_tap_handler(tap_id);
        }
        
        if let Some(ref double_tap_id) = self.node_events.on_double_tap {
            handler = handler.with_double_tap_handler(double_tap_id);
        }
        
        if let Some(ref long_press_id) = self.node_events.on_long_press {
            handler = handler.with_long_press_handler(long_press_id);
        }
        
        if let Some(ref hover_enter_id) = self.node_events.on_hover_enter {
            handler = handler.with_hover_enter_handler(hover_enter_id);
        }
        
        if let Some(ref hover_exit_id) = self.node_events.on_hover_exit {
            handler = handler.with_hover_exit_handler(hover_exit_id);
        }
        
        if let Some(ref focus_id) = self.node_events.on_focus {
            handler = handler.with_focus_handler(focus_id);
        }
        
        if let Some(ref blur_id) = self.node_events.on_blur {
            handler = handler.with_blur_handler(blur_id);
        }
        
        handler
    }
    
    pub fn add_child(&mut self, child: RenderNode) -> &mut Self {
        self.children.push(child);
        self
    }
    
    
    pub fn set_prop<T: Into<Property>>(&mut self, key: &str, value: T) -> &mut Self {
        self.properties.set(key, value);
        self
    }
    
    pub fn get_prop(&self, key: &str) -> Option<&Property> {
        self.properties.get(key)
    }
    
    pub fn get_prop_string(&self, key: &str) -> Option<&String> {
        self.properties.get_string(key)
    }
    
    pub fn get_prop_f32(&self, key: &str) -> Option<f32> {
        self.properties.get_number(key)
    }
    
    pub fn get_prop_bool(&self, key: &str) -> Option<bool> {
        self.properties.get_boolean(key)
    }
    
    pub fn get_prop_as_string(&self, key: &str) -> Option<String> {
        self.properties.get_as_string(key)
    }
    
    pub fn get_prop_compat(&self, key: &str) -> Option<String> {
        self.properties.get_as_string(key)
    }
    
    pub fn has_children(&self) -> bool {
        !self.children.is_empty()
    }
    
    pub fn child_count(&self) -> usize {
        self.children.len()
    }
    
    pub fn find_child_by_id(&self, id: &str) -> Option<&RenderNode> {
        if self.id == id {
            return Some(self);
        }
        
        for child in &self.children {
            if child.id == id {
                return Some(child);
            }
            
            if let Some(found) = child.find_child_by_id(id) {
                return Some(found);
            }
        }
        
        None
    }
    
    pub fn find_child_by_id_mut(&mut self, id: &str) -> Option<&mut RenderNode> {
        if self.id == id {
            return Some(self);
        }
        
        for child in &mut self.children {
            if child.id == id {
                return Some(child);
            }
            
            if let Some(found) = child.find_child_by_id_mut(id) {
                return Some(found);
            }
        }
        
        None
    }
    
    pub fn from_legacy(id: &str, type_name: &str, resolved_props: HashMap<String, String>, 
                      children: Vec<RenderNode>, event_handlers: Vec<EventHandler>,
                      node_events: NodeEventHandlers) -> Self {
        let properties = PropertyBag::from_string_map(&resolved_props);
        
        Self {
            id: id.to_string(),
            type_name: type_name.to_string(),
            properties,
            children,
            event_handlers,
            node_events,
        }
    }
    
    pub fn to_legacy_props(&self) -> HashMap<String, String> {
        self.properties.to_string_map()
    }
}

#[deprecated(since = "1.0.0", note = "Use the new property system instead")]
pub mod legacy {
    use super::*;
    
    pub fn create_node_with_string_props(id: &str, type_name: &str, 
                                         props: HashMap<String, String>,
                                         children: Vec<RenderNode>) -> RenderNode {
        RenderNode::from_legacy(
            id, 
            type_name, 
            props, 
            children, 
            Vec::new(), 
            NodeEventHandlers::default()
        )
    }
    
    pub fn get_prop_string(node: &RenderNode, key: &str) -> Option<String> {
        node.get_prop_as_string(key)
    }
}