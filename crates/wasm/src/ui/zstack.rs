use wasm_bindgen::prelude::*;
use serde_wasm_bindgen::to_value;
use crate::shared::{
    color::Color,
    edge_insets::EdgeInsets,
};
use crate::components::{
    zstack::{ZStackProps, ZStackAlignment},
    UIComponent
};

#[wasm_bindgen]
pub struct ZStackBuilder {
    props: ZStackProps,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl ZStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: ZStackProps::default(),
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        self.props.alignment = match alignment_str.to_lowercase().as_str() {
            "center" => Some(ZStackAlignment::Center),
            "topleading" => Some(ZStackAlignment::TopLeading),
            "top" => Some(ZStackAlignment::Top),
            "toptrailing" => Some(ZStackAlignment::TopTrailing),
            "leading" => Some(ZStackAlignment::Leading),
            "trailing" => Some(ZStackAlignment::Trailing),
            "bottomleading" => Some(ZStackAlignment::BottomLeading),
            "bottom" => Some(ZStackAlignment::Bottom),
            "bottomtrailing" => Some(ZStackAlignment::BottomTrailing),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.props.background = Color::from_hex(color_str).ok();
        self
    }

    #[wasm_bindgen(method)]
    pub fn dimensions(mut self, min_width: Option<f32>, ideal_width: Option<f32>, max_width: Option<f32>,
                     min_height: Option<f32>, ideal_height: Option<f32>, max_height: Option<f32>) -> Self {
        self.props.min_width = min_width;
        self.props.ideal_width = ideal_width;
        self.props.max_width = max_width;
        self.props.min_height = min_height;
        self.props.ideal_height = ideal_height;
        self.props.max_height = max_height;
        self
    }

    #[wasm_bindgen(method)]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props.clip_to_bounds = Some(clip);
        self
    }

    #[wasm_bindgen(method)]
    pub fn layout_priority(mut self, priority: f32) -> Self {
        self.props.layout_priority = Some(priority);
        self
    }

    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color_str: &str, offset_x: Option<f32>, offset_y: Option<f32>) -> Self {
        let color = Color::from_hex(color_str).unwrap_or(Color::Black);
        let offset = if let (Some(x), Some(y)) = (offset_x, offset_y) {
            Some((x, y))
        } else {
            None
        };
        
        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = Some(color);
        self.props.shadow_offset = offset;
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn border(mut self, width: f32, color_str: &str, radius: Option<f32>) -> Self {
        let color = Color::from_hex(color_str).unwrap_or(Color::Black);
        
        self.props.border_width = Some(width);
        self.props.border_color = Some(color);
        self.props.border_radius = radius;
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }

    #[wasm_bindgen(method)]
    pub fn accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.props.accessibility_label = label;
        self.props.accessibility_hint = hint;
        self.props.is_accessibility_element = is_element;
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn add_child(&mut self, component_json: &str) -> Result<(), JsValue> {
        let component: UIComponent = serde_json::from_str(component_json)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse component: {}", e)))?;
        
        self.children.push(component);
        Ok(())
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let mut props = self.props.clone();
        props.children = self.children.clone();
        
        let component = UIComponent::ZStack(props);
        
        to_value(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

// Factory methods for common ZStack patterns
#[wasm_bindgen]
pub fn create_centered_overlay() -> ZStackBuilder {
    ZStackBuilder::new()
        .alignment("center")
        .clip_to_bounds(true)
}

#[wasm_bindgen]
pub fn create_background_with_content(bg_color: &str, corner_radius: Option<f32>) -> ZStackBuilder {
    let mut stack = ZStackBuilder::new()
        .background(bg_color)
        .clip_to_bounds(true);
        
    if let Some(radius) = corner_radius {
        stack = stack.border(0.0, "transparent", Some(radius));
    }
    
    stack
}

#[wasm_bindgen]
pub fn create_layered_navigation() -> ZStackBuilder {
    ZStackBuilder::new()
        .clip_to_bounds(true)
}