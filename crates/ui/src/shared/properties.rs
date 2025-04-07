use std::collections::HashMap;
use std::fmt;
use serde::{Serialize, Deserialize};
use crate::{shared::color::Color, EdgeInsets};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Property {
    String(String),
    Number(f32),
    Boolean(bool),
    Color(Color),
    EdgeInsets(EdgeInsets),
    None,
}

impl Property {
    pub fn as_string(&self) -> Option<&String> {
        match self {
            Property::String(value) => Some(value),
            _ => None,
        }
    }

    pub fn as_number(&self) -> Option<f32> {
        match self {
            Property::Number(value) => Some(*value),
            _ => None,
        }
    }

    pub fn as_boolean(&self) -> Option<bool> {
        match self {
            Property::Boolean(value) => Some(*value),
            _ => None,
        }
    }

    pub fn as_color(&self) -> Option<&Color> {
        match self {
            Property::Color(value) => Some(value),
            _ => None,
        }
    }

    pub fn as_edge_insets(&self) -> Option<&EdgeInsets> {
        match self {
            Property::EdgeInsets(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn to_string_value(&self) -> String {
        match self {
            Property::String(value) => value.clone(),
            Property::Number(value) => value.to_string(),
            Property::Boolean(value) => value.to_string(),
            Property::Color(value) => value.to_css_string(),
            Property::EdgeInsets(value) => format!("{},{},{},{}", 
                value.top, value.right, value.bottom, value.left),
            Property::None => "none".to_string(),
        }
    }
}

impl fmt::Display for Property {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Property::String(value) => write!(f, "{}", value),
            Property::Number(value) => write!(f, "{}", value),
            Property::Boolean(value) => write!(f, "{}", value),
            Property::Color(value) => write!(f, "{:?}", value),
            Property::EdgeInsets(value) => write!(f, "{},{},{},{}", 
                value.top, value.right, value.bottom, value.left),
            Property::None => write!(f, "None"),
        }
    }
}

impl From<String> for Property {
    fn from(value: String) -> Self {
        Property::String(value)
    }
}

impl From<&str> for Property {
    fn from(value: &str) -> Self {
        Property::String(value.to_string())
    }
}

impl From<f32> for Property {
    fn from(value: f32) -> Self {
        Property::Number(value)
    }
}

impl From<i32> for Property {
    fn from(value: i32) -> Self {
        Property::Number(value as f32)
    }
}

impl From<bool> for Property {
    fn from(value: bool) -> Self {
        Property::Boolean(value)
    }
}

impl From<Color> for Property {
    fn from(value: Color) -> Self {
        Property::Color(value)
    }
}

impl From<EdgeInsets> for Property {
    fn from(value: EdgeInsets) -> Self {
        Property::EdgeInsets(value)
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct PropertyBag {
    properties: HashMap<String, Property>,
}

impl PropertyBag {
    pub fn new() -> Self {
        Self {
            properties: HashMap::new(),
        }
    }

    pub fn set<T: Into<Property>>(&mut self, key: &str, value: T) {
        self.properties.insert(key.to_string(), value.into());
    }

    pub fn get(&self, key: &str) -> Option<&Property> {
        self.properties.get(key)
    }

    pub fn get_string(&self, key: &str) -> Option<&String> {
        self.get(key).and_then(|prop| prop.as_string())
    }

    pub fn get_number(&self, key: &str) -> Option<f32> {
        self.get(key).and_then(|prop| prop.as_number())
    }

    pub fn get_boolean(&self, key: &str) -> Option<bool> {
        self.get(key).and_then(|prop| prop.as_boolean())
    }

    pub fn get_color(&self, key: &str) -> Option<&Color> {
        self.get(key).and_then(|prop| prop.as_color())
    }

    pub fn get_edge_insets(&self, key: &str) -> Option<&EdgeInsets> {
        self.get(key).and_then(|prop| prop.as_edge_insets())
    }

    pub fn has(&self, key: &str) -> bool {
        self.properties.contains_key(key)
    }

    pub fn remove(&mut self, key: &str) -> Option<Property> {
        self.properties.remove(key)
    }

    pub fn keys(&self) -> impl Iterator<Item = &String> {
        self.properties.keys()
    }

    pub fn values(&self) -> impl Iterator<Item = &Property> {
        self.properties.values()
    }

    pub fn entries(&self) -> impl Iterator<Item = (&String, &Property)> {
        self.properties.iter()
    }

    pub fn len(&self) -> usize {
        self.properties.len()
    }

    pub fn is_empty(&self) -> bool {
        self.properties.is_empty()
    }
    
    pub fn get_as_string(&self, key: &str) -> Option<String> {
        self.get(key).map(|prop| prop.to_string_value())
    }
    
    pub fn from_string_map(map: &HashMap<String, String>) -> Self {
        let mut bag = Self::new();
        for (key, value) in map {
            if let Ok(num) = value.parse::<f32>() {
                bag.set(key, Property::Number(num));
            } else if let Ok(bool_val) = value.parse::<bool>() {
                bag.set(key, Property::Boolean(bool_val));
            } else if let Some(edge_insets) = parse_edge_insets(value) {
                bag.set(key, Property::EdgeInsets(edge_insets));
            } else if let Some(color) = parse_color(value) {
                bag.set(key, Property::Color(color));
            } else {
                bag.set(key, Property::String(value.clone()));
            }
        }
        bag
    }
    
    pub fn to_string_map(&self) -> HashMap<String, String> {
        let mut map = HashMap::new();
        for (key, value) in &self.properties {
            map.insert(key.clone(), value.to_string_value());
        }
        map
    }
}

pub fn parse_edge_insets(value: &str) -> Option<EdgeInsets> {
    let parts: Vec<&str> = value.split(',').collect();
    if parts.len() == 4 {
        let top = parts[0].trim().parse::<f32>().ok()?;
        let right = parts[1].trim().parse::<f32>().ok()?;
        let bottom = parts[2].trim().parse::<f32>().ok()?;
        let left = parts[3].trim().parse::<f32>().ok()?;
        Some(EdgeInsets::new(top, right, bottom, left))
    } else {
        None
    }
}

pub fn parse_color(value: &str) -> Option<Color> {
    match value.trim().to_lowercase().as_str() {
        "white" => Some(Color::White),
        "black" => Some(Color::Black),
        "red" => Some(Color::Red),
        "green" => Some(Color::Green),
        "blue" => Some(Color::Blue),
        "yellow" => Some(Color::Yellow),
        "orange" => Some(Color::Orange),
        "purple" => Some(Color::Purple),
        "pink" => Some(Color::Pink),
        "teal" => Some(Color::Teal),
        "gray" | "grey" => Some(Color::Gray),
        "lightgray" | "lightgrey" => Some(Color::LightGray),
        "darkgray" | "darkgrey" => Some(Color::DarkGray),
        "transparent" => Some(Color::Transparent),
        _ => {
            if value.starts_with('#') {
                Some(Color::Hex(value.to_string()))
            } else if value.starts_with("rgb(") || value.starts_with("rgba(") {
                let inner = value.trim_start_matches("rgb(").trim_start_matches("rgba(").trim_end_matches(')');
                let parts: Vec<&str> = inner.split(',').collect();
                
                if parts.len() >= 3 {
                    if let (Ok(r), Ok(g), Ok(b)) = (
                        parts[0].trim().parse::<u8>(),
                        parts[1].trim().parse::<u8>(),
                        parts[2].trim().parse::<u8>(),
                    ) {
                        if parts.len() >= 4 {
                            if let Ok(a) = parts[3].trim().parse::<f32>() {
                                return Some(Color::CustomWithAlpha(r, g, b, a));
                            }
                        }
                        return Some(Color::Custom(r, g, b));
                    }
                }
                None
            } else {
                None
            }
        }
    }
}

pub mod utils {
    use super::*;
    
    pub fn set_optional_prop<T: Into<Property> + Clone>(bag: &mut PropertyBag, key: &str, value: &Option<T>) {
        if let Some(val) = value {
            bag.set(key, val.clone());
        }
    }
    
    pub fn get_prop_with_default<T, F>(bag: &PropertyBag, key: &str, converter: F, default: T) -> T 
    where 
        F: FnOnce(&Property) -> Option<T> 
    {
        bag.get(key).and_then(converter).unwrap_or(default)
    }
}

