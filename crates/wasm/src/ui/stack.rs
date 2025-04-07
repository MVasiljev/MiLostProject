use wasm_bindgen::prelude::*;
use serde_wasm_bindgen::to_value;
use crate::shared::{
    color::Color,
    edge_insets::EdgeInsets,
};
use crate::components::stack::{
    VStackProps, HStackProps, VStackAlignment, HStackAlignment, 
    LayoutPriority, Gradient
};
use crate::components::UIComponent;

/// WebAssembly bindings for VStackProps
#[wasm_bindgen]
pub struct VStackBuilder {
    props: VStackProps,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl VStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: VStackProps::default(),
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.props.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props.padding = Some(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.props.background = Color::from_hex(color_str).ok();
        self
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        self.props.alignment = match alignment_str.to_lowercase().as_str() {
            "leading" => Some(VStackAlignment::Leading),
            "center" => Some(VStackAlignment::Center),
            "trailing" => Some(VStackAlignment::Trailing),
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
    pub fn equal_spacing(mut self, equal: bool) -> Self {
        self.props.equal_spacing = Some(equal);
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
    pub fn layout_priority(mut self, priority_value: f32) -> Self {
        self.props.layout_priority = match priority_value {
            0.0 => Some(LayoutPriority::Low),
            1.0 => Some(LayoutPriority::Medium),
            2.0 => Some(LayoutPriority::High),
            _ => Some(LayoutPriority::Custom(priority_value)),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color_str: &str, offset_x: f32, offset_y: f32) -> Self {
        let color = Color::from_hex(color_str).unwrap_or(Color::Black);
        
        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = Some(color);
        self.props.shadow_offset = Some((offset_x, offset_y));
        
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
    pub fn gradient(mut self, colors: Vec<JsValue>, is_radial: bool) -> Self {
        let mut parsed_colors = Vec::new();
        
        for color_val in colors {
            if let Some(color_str) = color_val.as_string() {
                if let Some(color) = Color::from_hex(&color_str).ok() {
                    parsed_colors.push(color);
                }
            }
        }
        
        if !parsed_colors.is_empty() {
            let gradient = Gradient {
                colors: parsed_colors,
                positions: (0..parsed_colors.len())
                    .map(|i| i as f32 / (parsed_colors.len() - 1) as f32)
                    .collect(),
                start_point: (0.0, 0.0),
                end_point: (1.0, 1.0),
                is_radial,
            };
            
            self.props.gradient = Some(gradient);
        }
        
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
        
        let component = UIComponent::VStack(props);
        
        to_value(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

/// WebAssembly bindings for HStackProps
#[wasm_bindgen]
pub struct HStackBuilder {
    props: HStackProps,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl HStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: HStackProps::default(),
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.props.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props.padding = Some(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.props.background = Color::from_hex(color_str).ok();
        self
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        self.props.alignment = match alignment_str.to_lowercase().as_str() {
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
        self.props.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
        self
    }

    #[wasm_bindgen(method)]
    pub fn equal_spacing(mut self, equal: bool) -> Self {
        self.props.equal_spacing = Some(equal);
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
    pub fn layout_priority(mut self, priority_value: f32) -> Self {
        self.props.layout_priority = match priority_value {
            0.0 => Some(LayoutPriority::Low),
            1.0 => Some(LayoutPriority::Medium),
            2.0 => Some(LayoutPriority::High),
            _ => Some(LayoutPriority::Custom(priority_value)),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color_str: &str, offset_x: f32, offset_y: f32) -> Self {
        let color = Color::from_hex(color_str).unwrap_or(Color::Black);
        
        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = Some(color);
        self.props.shadow_offset = Some((offset_x, offset_y));
        
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
    pub fn gradient(mut self, colors: Vec<JsValue>, is_radial: bool) -> Self {
        let mut parsed_colors = Vec::new();
        
        for color_val in colors {
            if let Some(color_str) = color_val.as_string() {
                if let Some(color) = Color::from_hex(&color_str).ok() {
                    parsed_colors.push(color);
                }
            }
        }
        
        if !parsed_colors.is_empty() {
            let gradient = Gradient {
                colors: parsed_colors,
                positions: (0..parsed_colors.len())
                    .map(|i| i as f32 / (parsed_colors.len() - 1) as f32)
                    .collect(),
                start_point: (0.0, 0.0),
                end_point: (1.0, 1.0),
                is_radial,
            };
            
            self.props.gradient = Some(gradient);
        }
        
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
        
        let component = UIComponent::HStack(props);
        
        to_value(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

// Factory methods for common stack layouts
#[wasm_bindgen]
pub fn create_vertical_stack() -> VStackBuilder {
    VStackBuilder::new()
}

#[wasm_bindgen]
pub fn create_horizontal_stack() -> HStackBuilder {
    HStackBuilder::new()
}

// Helper method to create a card-like container
#[wasm_bindgen]
pub fn create_card_container() -> VStackBuilder {
    VStackBuilder::new()
        .background("#FFFFFF")
        .padding(16.0)
        .border(1.0, "#DDDDDD", Some(8.0))
        .shadow(2.0, "#00000033", 0.0, 2.0)
}