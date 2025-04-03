use milost_ui::zstack::ZStackAlignment;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{Color, UIComponent, ZStackProps, EdgeInsets};

#[wasm_bindgen]
pub struct ZStackBuilder {
    alignment: Option<ZStackAlignment>,
    edge_insets: Option<EdgeInsets>,
    background: Option<Color>,
    min_width: Option<f32>,
    ideal_width: Option<f32>,
    max_width: Option<f32>,
    min_height: Option<f32>,
    ideal_height: Option<f32>,
    max_height: Option<f32>,
    clip_to_bounds: Option<bool>,
    layout_priority: Option<f32>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl ZStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            alignment: None,
            edge_insets: None,
            background: None,
            min_width: None,
            ideal_width: None,
            max_width: None,
            min_height: None,
            ideal_height: None,
            max_height: None,
            clip_to_bounds: None,
            layout_priority: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        self.alignment = match alignment_str {
            "center" => Some(ZStackAlignment::Center),
            "topLeading" => Some(ZStackAlignment::TopLeading),
            "top" => Some(ZStackAlignment::Top),
            "topTrailing" => Some(ZStackAlignment::TopTrailing),
            "leading" => Some(ZStackAlignment::Leading),
            "trailing" => Some(ZStackAlignment::Trailing),
            "bottomLeading" => Some(ZStackAlignment::BottomLeading),
            "bottom" => Some(ZStackAlignment::Bottom),
            "bottomTrailing" => Some(ZStackAlignment::BottomTrailing),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            "Gray" => Some(Color::Gray),
            "Red" => Some(Color::Red),
            "Yellow" => Some(Color::Yellow),
            "Green" => Some(Color::Green),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn min_width(mut self, width: f32) -> Self {
        self.min_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn ideal_width(mut self, width: f32) -> Self {
        self.ideal_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_width(mut self, width: f32) -> Self {
        self.max_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn min_height(mut self, height: f32) -> Self {
        self.min_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn ideal_height(mut self, height: f32) -> Self {
        self.ideal_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_height(mut self, height: f32) -> Self {
        self.max_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.clip_to_bounds = Some(clip);
        self
    }

    #[wasm_bindgen(method)]
    pub fn layout_priority(mut self, priority: f32) -> Self {
        self.layout_priority = Some(priority);
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        if let Some(component_str) = component_js.as_string() {
            if let Ok(component) = serde_json::from_str::<UIComponent>(&component_str) {
                self.children.push(component);
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let stack_props = ZStackProps {
            alignment: self.alignment.clone(),
            children: self.children.clone(),
            edge_insets: self.edge_insets.clone(),
            background: self.background.clone(),
            min_width: self.min_width,
            ideal_width: self.ideal_width,
            max_width: self.max_width,
            min_height: self.min_height,
            ideal_height: self.ideal_height,
            max_height: self.max_height,
            clip_to_bounds: self.clip_to_bounds,
            layout_priority: self.layout_priority,
        };

        let component = UIComponent::ZStack(stack_props);

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}