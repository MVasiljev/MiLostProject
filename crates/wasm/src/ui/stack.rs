use milost_ui::stack::LayoutPriority;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{Color, UIComponent, VStackProps, HStackProps, VStackAlignment, HStackAlignment, EdgeInsets};

#[wasm_bindgen]
pub struct VStackBuilder {
    spacing: Option<f32>,
    padding: Option<f32>,
    background: Option<Color>,
    alignment: Option<VStackAlignment>,
    edge_insets: Option<EdgeInsets>,
    min_width: Option<f32>,
    ideal_width: Option<f32>,
    max_width: Option<f32>,
    min_height: Option<f32>,
    ideal_height: Option<f32>,
    max_height: Option<f32>,
    clip_to_bounds: Option<bool>,
    layout_priority: Option<LayoutPriority>,
    equal_spacing: Option<bool>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl VStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            spacing: None,
            padding: None,
            background: None,
            alignment: None,
            edge_insets: None,
            min_width: None,
            ideal_width: None,
            max_width: None,
            min_height: None,
            ideal_height: None,
            max_height: None,
            clip_to_bounds: None,
            layout_priority: None,
            equal_spacing: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
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
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        // Only accept valid VStack alignments
        self.alignment = match alignment_str.to_lowercase().as_str() {
            "leading" => Some(VStackAlignment::Leading),
            "trailing" => Some(VStackAlignment::Trailing),
            "center" => Some(VStackAlignment::Center),
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
        self.layout_priority = Some(match priority {
            0.0 => LayoutPriority::Low,
            1.0 => LayoutPriority::Medium,
            2.0 => LayoutPriority::High,
            _ => LayoutPriority::Custom(priority),
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn equal_spacing(mut self, value: bool) -> Self {
        self.equal_spacing = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        if let Some(component_str) = component_js.as_string() {
            match serde_json::from_str::<UIComponent>(&component_str) {
                Ok(component) => {
                    self.children.push(component);
                }
                Err(e) => {
                    web_sys::console::log_1(&format!("JSON parse error: {}", e).into());
                }
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        // Make sure all fields are properly initialized
        let stack_props = VStackProps {
            // Original properties
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
            
            // Enhanced properties
            alignment: self.alignment.clone(),
            edge_insets: self.edge_insets.clone(),
            min_width: self.min_width,
            ideal_width: self.ideal_width,
            max_width: self.max_width,
            min_height: self.min_height,
            ideal_height: self.ideal_height,
            max_height: self.max_height,
            clip_to_bounds: self.clip_to_bounds,
            layout_priority: self.layout_priority.clone(),
            equal_spacing: self.equal_spacing,
        };
    
        let component = UIComponent::VStack(stack_props);
    
        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

#[wasm_bindgen]
pub struct HStackBuilder {
    spacing: Option<f32>,
    padding: Option<f32>,
    background: Option<Color>,
    alignment: Option<HStackAlignment>,
    edge_insets: Option<EdgeInsets>,
    min_width: Option<f32>,
    ideal_width: Option<f32>,
    max_width: Option<f32>,
    min_height: Option<f32>,
    ideal_height: Option<f32>,
    max_height: Option<f32>,
    clip_to_bounds: Option<bool>,
    layout_priority: Option<LayoutPriority>,
    equal_spacing: Option<bool>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl HStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            spacing: None,
            padding: None,
            background: None,
            alignment: None,
            edge_insets: None,
            min_width: None,
            ideal_width: None,
            max_width: None,
            min_height: None,
            ideal_height: None,
            max_height: None,
            clip_to_bounds: None,
            layout_priority: None,
            equal_spacing: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
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
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        // Only accept valid HStack alignments
        self.alignment = match alignment_str.to_lowercase().as_str() {
            "top" => Some(HStackAlignment::Top),
            "center" => Some(HStackAlignment::Center),
            "bottom" => Some(HStackAlignment::Bottom),
            "firsttextbaseline" => Some(HStackAlignment::FirstTextBaseline),
            "lasttextbaseline" => Some(HStackAlignment::LastTextBaseline),
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
        self.layout_priority = Some(match priority {
            0.0 => LayoutPriority::Low,
            1.0 => LayoutPriority::Medium,
            2.0 => LayoutPriority::High,
            _ => LayoutPriority::Custom(priority),
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn equal_spacing(mut self, value: bool) -> Self {
        self.equal_spacing = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        if let Some(component_str) = component_js.as_string() {
            match serde_json::from_str::<UIComponent>(&component_str) {
                Ok(component) => {
                    self.children.push(component);
                }
                Err(e) => {
                    web_sys::console::log_1(&format!("JSON parse error: {}", e).into());
                }
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let stack_props = HStackProps {
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
            alignment: self.alignment.clone(),
            edge_insets: self.edge_insets.clone(),
            min_width: self.min_width,
            ideal_width: self.ideal_width,
            max_width: self.max_width,
            min_height: self.min_height,
            ideal_height: self.ideal_height,
            max_height: self.max_height,
            clip_to_bounds: self.clip_to_bounds,
            layout_priority: self.layout_priority.clone(),
            equal_spacing: self.equal_spacing,
        };

        let component = UIComponent::HStack(stack_props);

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}