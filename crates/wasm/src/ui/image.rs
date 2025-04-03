use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{ImageProps, UIComponent};

#[wasm_bindgen]
pub struct ImageBuilder {
    src: String,
    alt: Option<String>,
    width: Option<f32>,
    height: Option<f32>,
    aspect_ratio: Option<f32>,
    resize_mode: Option<String>,
    corner_radius: Option<f32>,
    border_width: Option<f32>,
    border_color: Option<String>,
}

#[wasm_bindgen]
impl ImageBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(src: &str) -> Self {
        Self {
            src: src.to_string(),
            alt: None,
            width: None,
            height: None,
            aspect_ratio: None,
            resize_mode: None,
            corner_radius: None,
            border_width: None,
            border_color: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn alt(mut self, alt_text: &str) -> Self {
        self.alt = Some(alt_text.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn width(mut self, width: f32) -> Self {
        self.width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn height(mut self, height: f32) -> Self {
        self.height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn aspect_ratio(mut self, ratio: f32) -> Self {
        self.aspect_ratio = Some(ratio);
        self
    }

    #[wasm_bindgen(method)]
    pub fn resize_mode(mut self, mode: &str) -> Self {
        self.resize_mode = Some(mode.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.corner_radius = Some(radius);
        self
    }

    #[wasm_bindgen(method)]
    pub fn border_width(mut self, width: f32) -> Self {
        self.border_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn border_color(mut self, color: &str) -> Self {
        self.border_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        // Create the base image component
        let mut component = UIComponent::Image(ImageProps {
            src: self.src.clone(),
            alt: self.alt.clone(),
            width: None,
            height: None,
            aspect_ratio: None,
            resize_mode: None,
            corner_radius: None,
            border_width: None,
            border_color: None,
        });

        // Add additional properties
        if let UIComponent::Image(ref mut props) = component {
            if let Some(width) = self.width {
                props.width = Some(width);
            }
            if let Some(height) = self.height {
                props.height = Some(height);
            }
            if let Some(ratio) = self.aspect_ratio {
                props.aspect_ratio = Some(ratio);
            }
            if let Some(mode) = &self.resize_mode {
                props.resize_mode = Some(mode.clone());
            }
            if let Some(radius) = self.corner_radius {
                props.corner_radius = Some(radius);
            }
            if let Some(width) = self.border_width {
                props.border_width = Some(width);
            }
            if let Some(color) = &self.border_color {
                props.border_color = Some(color.clone());
            }
        }

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}