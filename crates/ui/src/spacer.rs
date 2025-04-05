use serde::{Serialize, Deserialize};
use crate::UIComponent;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpacerStrategy {
    Fixed(f32),
    
    Flexible(f32),
    
    Minimum(f32),
    
    Maximum(f32),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpacerProps {
    pub strategy: Option<SpacerStrategy>,
    
    pub children: Vec<UIComponent>,
    
    pub accessibility_label: Option<String>,
}

impl Default for SpacerProps {
    fn default() -> Self {
        Self {
            strategy: None,
            children: Vec::new(),
            accessibility_label: None,
        }
    }
}

impl SpacerProps {
    pub fn new() -> Self {
        Self::default()
    }
    
    pub fn fixed(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Fixed(size)),
            ..Default::default()
        }
    }
    
    pub fn flexible(grow: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Flexible(grow)),
            ..Default::default()
        }
    }
    
    pub fn min(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Minimum(size)),
            ..Default::default()
        }
    }
    
    pub fn max(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Maximum(size)),
            ..Default::default()
        }
    }
    
    pub fn accessibility_label(mut self, label: impl Into<String>) -> Self {
        self.accessibility_label = Some(label.into());
        self
    }
}