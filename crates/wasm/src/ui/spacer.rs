use milost_ui::UIComponent;
use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;

/// Spacer sizing strategies
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpacerStrategy {
    /// Fixed size in pixels
    Fixed(f32),
    
    /// Flexible growth factor
    Flexible(f32),
    
    /// Minimum size constraint
    Minimum(f32),
    
    /// Maximum size constraint
    Maximum(f32),
}

/// Spacer configuration properties
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpacerProps {
    /// Sizing strategy for the spacer
    pub strategy: Option<SpacerStrategy>,
    
    /// Child components (rare for spacers, but possible)
    pub children: Vec<UIComponent>,
    
    /// Accessibility label
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
    /// Create a new spacer with default properties
    pub fn new() -> Self {
        Self::default()
    }
    
    /// Create a fixed-size spacer
    pub fn fixed(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Fixed(size)),
            ..Default::default()
        }
    }
    
    /// Create a flexible spacer
    pub fn flexible(grow: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Flexible(grow)),
            ..Default::default()
        }
    }
    
    /// Create a minimum-size spacer
    pub fn min(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Minimum(size)),
            ..Default::default()
        }
    }
    
    /// Create a maximum-size spacer
    pub fn max(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Maximum(size)),
            ..Default::default()
        }
    }
    
    /// Set an accessibility label
    pub fn accessibility_label(mut self, label: impl Into<String>) -> Self {
        self.accessibility_label = Some(label.into());
        self
    }
}

/// WASM-specific spacer builder
#[wasm_bindgen]
pub struct SpacerBuilder {
    props: SpacerProps,
}

#[wasm_bindgen]
impl SpacerBuilder {
    /// Create a new spacer builder
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: SpacerProps::new(),
        }
    }

    /// Set fixed size
    #[wasm_bindgen(method)]
    pub fn fixed(mut self, size: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Fixed(size));
        self
    }

    /// Set flexible grow
    #[wasm_bindgen(method)]
    pub fn flexible(mut self, grow: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Flexible(grow));
        self
    }

    /// Set minimum size
    #[wasm_bindgen(method)]
    pub fn min(mut self, size: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Minimum(size));
        self
    }

    /// Set maximum size
    #[wasm_bindgen(method)]
    pub fn max(mut self, size: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Maximum(size));
        self
    }

    /// Set accessibility label
    #[wasm_bindgen(method)]
    pub fn accessibility_label(mut self, label: &str) -> Self {
        self.props.accessibility_label = Some(label.to_string());
        self
    }

    /// Add a child component
    #[wasm_bindgen(method)]
    pub fn child(mut self, component_str: &str) -> Self {
        if let Ok(component) = serde_json::from_str::<UIComponent>(component_str) {
            self.props.children.push(component);
        }
        self
    }

    /// Build the spacer
    #[wasm_bindgen(method)]
    pub fn build(self) -> Result<String, JsValue> {
        let component = UIComponent::Spacer(self.props);

        serde_json::to_string(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

/// Default spacer creation functions for WASM
#[wasm_bindgen]
pub fn default_fixed_spacer(size: f32) -> Result<String, JsValue> {
    let component = UIComponent::Spacer(SpacerProps::fixed(size));

    serde_json::to_string(&component)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn default_flexible_spacer(grow: f32) -> Result<String, JsValue> {
    let component = UIComponent::Spacer(SpacerProps::flexible(grow));

    serde_json::to_string(&component)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}