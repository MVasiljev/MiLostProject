use std::collections::HashMap;
use std::fmt;
use serde::{Serialize, Deserialize};
use crate::shared::color::Color;
use crate::shared::edge_insets::EdgeInsets;
use crate::components::styles::{Gradient, ShadowEffect, BorderStyle, TextAlign, TextTransform, Overflow};
use crate::components::font::{FontWeight, FontSlant, FontWidth, FontFeatures};

pub mod keys {
    pub const THICKNESS: &str = "thickness";
    pub const BACKGROUND: &str = "background";
    pub const OPACITY: &str = "opacity";
    
    pub const WIDTH: &str = "width";
    pub const HEIGHT: &str = "height";
    pub const MIN_WIDTH: &str = "min_width";
    pub const MAX_WIDTH: &str = "max_width";
    pub const MIN_HEIGHT: &str = "min_height";
    pub const MAX_HEIGHT: &str = "max_height";
    pub const PADDING: &str = "padding";
    pub const EDGE_INSETS: &str = "edge_insets";
    pub const ALIGNMENT: &str = "alignment";
    pub const SPACING: &str = "spacing";
    pub const EQUAL_SPACING: &str = "equal_spacing";
    pub const FLEX_GROW: &str = "flex_grow";
    
    pub const BORDER_WIDTH: &str = "border_width";
    pub const BORDER_COLOR: &str = "border_color";
    pub const BORDER_RADIUS: &str = "border_radius";
    pub const BORDER_STYLE: &str = "border_style";
    
    pub const SHADOW_RADIUS: &str = "shadow_radius";
    pub const SHADOW_COLOR: &str = "shadow_color";
    pub const SHADOW_OFFSET_X: &str = "shadow_offset_x";
    pub const SHADOW_OFFSET_Y: &str = "shadow_offset_y";
    
    pub const TEXT: &str = "text";
    pub const FONT_SIZE: &str = "font_size";
    pub const FONT_WEIGHT: &str = "font_weight";
    pub const FONT_SLANT: &str = "font_slant";
    pub const FONT_WIDTH: &str = "font_width";
    pub const TEXT_COLOR: &str = "text_color";
    pub const TEXT_ALIGNMENT: &str = "text_alignment";
    pub const LINE_HEIGHT: &str = "line_height";
    pub const LETTER_SPACING: &str = "letter_spacing";
    pub const TEXT_TRANSFORM: &str = "text_transform";
    
    pub const SOURCE: &str = "source";
    pub const CONTENT_MODE: &str = "content_mode";
    pub const TINT_COLOR: &str = "tint_color";
    
    pub const ENABLED: &str = "enabled";
    pub const FOCUSABLE: &str = "focusable";
    pub const PRESSED: &str = "pressed";
    pub const HOVERED: &str = "hovered";
    pub const FOCUSED: &str = "focused";
    
    pub const ACCESSIBILITY_LABEL: &str = "accessibility_label";
    pub const ACCESSIBILITY_HINT: &str = "accessibility_hint";
    pub const IS_ACCESSIBILITY_ELEMENT: &str = "is_accessibility_element";
    
    pub const LABEL: &str = "label";
    pub const BUTTON_STYLE: &str = "button_style";
    pub const IS_LOADING: &str = "is_loading";
    
    pub const CLIP_TO_BOUNDS: &str = "clip_to_bounds";
    pub const OVERFLOW: &str = "overflow";
    
    pub const X: &str = "x";
    pub const Y: &str = "y";
    
    pub const ANIMATION_DURATION: &str = "animation_duration";
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Property {
    String(String),
    Number(f32),
    Boolean(bool),
    Integer(i32),
    Color(Color),
    EdgeInsets(EdgeInsets),
    Gradient(Gradient),
    ShadowEffect(ShadowEffect),
    FontWeight(FontWeight),
    FontSlant(FontSlant),
    FontWidth(FontWidth),
    FontFeatures(FontFeatures),
    BorderStyle(BorderStyle),
    TextAlign(TextAlign),
    TextTransform(TextTransform),
    Overflow(Overflow),
    Array(Vec<Property>),
    Map(HashMap<String, Property>),
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
            Property::Integer(value) => Some(*value as f32),
            _ => None,
        }
    }

    pub fn as_integer(&self) -> Option<i32> {
        match self {
            Property::Integer(value) => Some(*value),
            Property::Number(value) => {
                if *value == (*value as i32) as f32 {
                    Some(*value as i32)
                } else {
                    None
                }
            },
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
    
    pub fn as_gradient(&self) -> Option<&Gradient> {
        match self {
            Property::Gradient(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_shadow_effect(&self) -> Option<&ShadowEffect> {
        match self {
            Property::ShadowEffect(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_font_weight(&self) -> Option<&FontWeight> {
        match self {
            Property::FontWeight(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_font_slant(&self) -> Option<&FontSlant> {
        match self {
            Property::FontSlant(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_font_width(&self) -> Option<&FontWidth> {
        match self {
            Property::FontWidth(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_font_features(&self) -> Option<&FontFeatures> {
        match self {
            Property::FontFeatures(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_border_style(&self) -> Option<&BorderStyle> {
        match self {
            Property::BorderStyle(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_text_align(&self) -> Option<&TextAlign> {
        match self {
            Property::TextAlign(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_text_transform(&self) -> Option<&TextTransform> {
        match self {
            Property::TextTransform(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_overflow(&self) -> Option<&Overflow> {
        match self {
            Property::Overflow(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_array(&self) -> Option<&Vec<Property>> {
        match self {
            Property::Array(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn as_map(&self) -> Option<&HashMap<String, Property>> {
        match self {
            Property::Map(value) => Some(value),
            _ => None,
        }
    }
    
    pub fn to_string_value(&self) -> String {
        match self {
            Property::String(value) => value.clone(),
            Property::Number(value) => value.to_string(),
            Property::Integer(value) => value.to_string(),
            Property::Boolean(value) => value.to_string(),
            Property::Color(value) => value.to_css_string(),
            Property::EdgeInsets(value) => format!("{}", value),
            Property::Gradient(_) => "gradient".to_string(),
            Property::ShadowEffect(_) => "shadow".to_string(),
            Property::FontWeight(value) => format!("{:?}", value),
            Property::FontSlant(value) => format!("{:?}", value),
            Property::FontWidth(value) => format!("{:?}", value),
            Property::FontFeatures(_) => "font-features".to_string(),
            Property::BorderStyle(value) => format!("{:?}", value),
            Property::TextAlign(value) => format!("{:?}", value),
            Property::TextTransform(value) => format!("{:?}", value),
            Property::Overflow(value) => format!("{:?}", value),
            Property::Array(_) => "array".to_string(),
            Property::Map(_) => "map".to_string(),
            Property::None => "none".to_string(),
        }
    }
}

impl fmt::Display for Property {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_string_value())
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
        Property::Integer(value)
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

impl From<Gradient> for Property {
    fn from(value: Gradient) -> Self {
        Property::Gradient(value)
    }
}

impl From<ShadowEffect> for Property {
    fn from(value: ShadowEffect) -> Self {
        Property::ShadowEffect(value)
    }
}

impl From<FontWeight> for Property {
    fn from(value: FontWeight) -> Self {
        Property::FontWeight(value)
    }
}

impl From<FontSlant> for Property {
    fn from(value: FontSlant) -> Self {
        Property::FontSlant(value)
    }
}

impl From<FontWidth> for Property {
    fn from(value: FontWidth) -> Self {
        Property::FontWidth(value)
    }
}

impl From<FontFeatures> for Property {
    fn from(value: FontFeatures) -> Self {
        Property::FontFeatures(value)
    }
}

impl From<BorderStyle> for Property {
    fn from(value: BorderStyle) -> Self {
        Property::BorderStyle(value)
    }
}

impl From<TextAlign> for Property {
    fn from(value: TextAlign) -> Self {
        Property::TextAlign(value)
    }
}

impl From<TextTransform> for Property {
    fn from(value: TextTransform) -> Self {
        Property::TextTransform(value)
    }
}

impl From<Overflow> for Property {
    fn from(value: Overflow) -> Self {
        Property::Overflow(value)
    }
}

impl From<Vec<Property>> for Property {
    fn from(value: Vec<Property>) -> Self {
        Property::Array(value)
    }
}

impl From<HashMap<String, Property>> for Property {
    fn from(value: HashMap<String, Property>) -> Self {
        Property::Map(value)
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

    pub fn get_integer(&self, key: &str) -> Option<i32> {
        self.get(key).and_then(|prop| prop.as_integer())
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

    pub fn get_gradient(&self, key: &str) -> Option<&Gradient> {
        self.get(key).and_then(|prop| prop.as_gradient())
    }

    pub fn get_shadow_effect(&self, key: &str) -> Option<&ShadowEffect> {
        self.get(key).and_then(|prop| prop.as_shadow_effect())
    }

    pub fn get_font_weight(&self, key: &str) -> Option<&FontWeight> {
        self.get(key).and_then(|prop| prop.as_font_weight())
    }

    pub fn get_font_slant(&self, key: &str) -> Option<&FontSlant> {
        self.get(key).and_then(|prop| prop.as_font_slant())
    }

    pub fn get_font_width(&self, key: &str) -> Option<&FontWidth> {
        self.get(key).and_then(|prop| prop.as_font_width())
    }

    pub fn get_font_features(&self, key: &str) -> Option<&FontFeatures> {
        self.get(key).and_then(|prop| prop.as_font_features())
    }

    pub fn get_border_style(&self, key: &str) -> Option<&BorderStyle> {
        self.get(key).and_then(|prop| prop.as_border_style())
    }

    pub fn get_text_align(&self, key: &str) -> Option<&TextAlign> {
        self.get(key).and_then(|prop| prop.as_text_align())
    }

    pub fn get_text_transform(&self, key: &str) -> Option<&TextTransform> {
        self.get(key).and_then(|prop| prop.as_text_transform())
    }

    pub fn get_overflow(&self, key: &str) -> Option<&Overflow> {
        self.get(key).and_then(|prop| prop.as_overflow())
    }

    pub fn get_array(&self, key: &str) -> Option<&Vec<Property>> {
        self.get(key).and_then(|prop| prop.as_array())
    }

    pub fn get_map(&self, key: &str) -> Option<&HashMap<String, Property>> {
        self.get(key).and_then(|prop| prop.as_map())
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
            } else if let Some(edge_insets) = crate::shared::edge_insets::parse_edge_insets(value) {
                bag.set(key, Property::EdgeInsets(edge_insets));
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
    
    pub fn merge(&mut self, other: &PropertyBag) {
        for (key, value) in other.entries() {
            self.properties.insert(key.clone(), value.clone());
        }
    }
    
    pub fn merged(self, other: &PropertyBag) -> Self {
        let mut result = self;
        result.merge(other);
        result
    }
}

pub mod utils {
    use super::*;
    
    pub fn set_optional_prop<T: Into<Property> + Clone>(
        bag: &mut PropertyBag, 
        key: &str, 
        value: &Option<T>
    ) {
        if let Some(val) = value {
            bag.set(key, val.clone());
        }
    }
    
    pub fn parse_property_value(value: &str) -> Property {
        if value == "true" || value == "false" {
            if let Ok(bool_val) = value.parse::<bool>() {
                return Property::Boolean(bool_val);
            }
        }
        
        if let Ok(num_val) = value.parse::<f32>() {
            return Property::Number(num_val);
        }
        
        if let Some(insets) = crate::shared::edge_insets::parse_edge_insets(value) {
            return Property::EdgeInsets(insets);
        }
        
        Property::String(value.to_string())
    }
    
    pub fn get_property_with_default<T>(
        bag: &PropertyBag,
        key: &str,
        extractor: fn(&Property) -> Option<T>,
        default: T
    ) -> T {
        bag.get(key).and_then(extractor).unwrap_or(default)
    }
}