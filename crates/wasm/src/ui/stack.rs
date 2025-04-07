use milost_ui::stack::{
    LayoutPriority, 
    VStackAlignment, 
    HStackAlignment, 
    Gradient
};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use serde_json;
use web_sys::console;

use milost_ui::{
    Color, 
    UIComponent, 
    VStackProps, 
    HStackProps, 
    EdgeInsets
};

#[wasm_bindgen]
pub struct VStackBuilder {
    props: VStackProps,
}

#[wasm_bindgen]
impl VStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: VStackProps::default(),
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
        self.props.background = match color_str.to_lowercase().as_str() {
            "white" | "#ffffff" => Some(Color::White),
            "blue" | "#0000ff" => Some(Color::Blue),
            "black" | "#000000" => Some(Color::Black),
            "gray" | "#808080" => Some(Color::Gray),
            "red" | "#ff0000" => Some(Color::Red),
            "yellow" | "#ffff00" => Some(Color::Yellow),
            "green" | "#00ff00" => Some(Color::Green),
            _ => Color::from_hex(color_str).ok(),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        self.props.alignment = match alignment_str.to_lowercase().as_str() {
            "leading" => Some(VStackAlignment::Leading),
            "trailing" => Some(VStackAlignment::Trailing),
            "center" => Some(VStackAlignment::Center),
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
    pub fn min_width(mut self, width: f32) -> Self {
        self.props.min_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_width(mut self, width: f32) -> Self {
        self.props.max_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn min_height(mut self, height: f32) -> Self {
        self.props.min_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_height(mut self, height: f32) -> Self {
        self.props.max_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props.clip_to_bounds = Some(clip);
        self
    }

    #[wasm_bindgen(method)]
    pub fn layout_priority(mut self, priority: f32) -> Self {
        self.props.layout_priority = Some(match priority {
            0.0 => LayoutPriority::Low,
            1.0 => LayoutPriority::Medium,
            2.0 => LayoutPriority::High,
            _ => LayoutPriority::Custom(priority),
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn equal_spacing(mut self, value: bool) -> Self {
        self.props.equal_spacing = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color: &str, offset_x: f32, offset_y: f32) -> Self {
        let shadow_color = match color.to_lowercase().as_str() {
            "primary" => Color::Primary,
            "secondary" => Color::Secondary,
            _ => Color::from_hex(color).unwrap_or(Color::Black),
        };

        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = Some(shadow_color);
        self.props.shadow_offset = Some((offset_x, offset_y));
        self
    }

    #[wasm_bindgen(method)]
    pub fn gradient(mut self, colors: Vec<JsValue>, is_radial: bool) -> Self {
        let parsed_colors: Result<Vec<Color>, _> = colors
            .iter()
            .map(|color_val| {
                color_val
                    .as_string()
                    .and_then(|s| Color::from_hex(&s).ok())
                    .ok_or_else(|| "Invalid color".to_string())
            })
            .collect();

        if let Ok(gradient_colors) = parsed_colors {
            let gradient = Gradient {
                colors: gradient_colors,
                positions: (0..gradient_colors.len())
                    .map(|i| i as f32 / (gradient_colors.len() - 1) as f32)
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
    pub fn border(mut self, width: f32, color: &str, radius: Option<f32>) -> Self {
        let border_color = match color.to_lowercase().as_str() {
            "primary" => Color::Primary,
            "secondary" => Color::Secondary,
            _ => Color::from_hex(color).unwrap_or(Color::Black),
        };

        self.props.border_width = Some(width);
        self.props.border_color = Some(border_color);
        self.props.border_radius = radius;
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        if let Some(component_str) = component_js.as_string() {
            match serde_json::from_str::<UIComponent>(&component_str) {
                Ok(component) => {
                    self.props.children.push(component);
                }
                Err(e) => {
                    console::error_1(&format!("JSON parse error: {}", e).into());
                }
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let stack_props = self.props.clone();
        let component = UIComponent::VStack(stack_props);

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

#[wasm_bindgen]
pub struct HStackBuilder {
    props: HStackProps,
}

#[wasm_bindgen]
impl HStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: HStackProps::default(),
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
        self.props.background = match color_str.to_lowercase().as_str() {
            "white" | "#ffffff" => Some(Color::White),
            "blue" | "#0000ff" => Some(Color::Blue),
            "black" | "#000000" => Some(Color::Black),
            "gray" | "#808080" => Some(Color::Gray),
            "red" | "#ff0000" => Some(Color::Red),
            "yellow" | "#ffff00" => Some(Color::Yellow),
            "green" | "#00ff00" => Some(Color::Green),
            _ => Color::from_hex(color_str).ok(),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        self.props.alignment = match alignment_str.to_lowercase().as_str() {
            "top" => Some(HStackAlignment::Top),
            "center" => Some(HStackAlignment::Center),
            "bottom" => Some(HStackAlignment::Bottom),
            "first_text_baseline" => Some(HStackAlignment::FirstTextBaseline),
            "last_text_baseline" => Some(HStackAlignment::LastTextBaseline),
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
    pub fn min_width(mut self, width: f32) -> Self {
        self.props.min_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_width(mut self, width: f32) -> Self {
        self.props.max_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn min_height(mut self, height: f32) -> Self {
        self.props.min_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_height(mut self, height: f32) -> Self {
        self.props.max_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props.clip_to_bounds = Some(clip);
        self
    }

    #[wasm_bindgen(method)]
    pub fn layout_priority(mut self, priority: f32) -> Self {
        self.props.layout_priority = Some(match priority {
            0.0 => LayoutPriority::Low,
            1.0 => LayoutPriority::Medium,
            2.0 => LayoutPriority::High,
            _ => LayoutPriority::Custom(priority),
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn equal_spacing(mut self, value: bool) -> Self {
        self.props.equal_spacing = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color: &str, offset_x: f32, offset_y: f32) -> Self {
        let shadow_color = match color.to_lowercase().as_str() {
            "primary" => Color::Primary,
            "secondary" => Color::Secondary,
            _ => Color::from_hex(color).unwrap_or(Color::Black),
        };

        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = Some(shadow_color);
        self.props.shadow_offset = Some((offset_x, offset_y));
        self
    }

    #[wasm_bindgen(method)]
    pub fn gradient(mut self, colors: Vec<JsValue>, is_radial: bool) -> Self {
        let parsed_colors: Result<Vec<Color>, _> = colors
            .iter()
            .map(|color_val| {
                color_val
                    .as_string()
                    .and_then(|s| Color::from_hex(&s).ok())
                    .ok_or_else(|| "Invalid color".to_string())
            })
            .collect();

        if let Ok(gradient_colors) = parsed_colors {
            let gradient = Gradient {
                colors: gradient_colors,
                positions: (0..gradient_colors.len())
                    .map(|i| i as f32 / (gradient_colors.len() - 1) as f32)
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
    pub fn border(mut self, width: f32, color: &str, radius: Option<f32>) -> Self {
        let border_color = match color.to_lowercase().as_str() {
            "primary" => Color::Primary,
            "secondary" => Color::Secondary,
            _ => Color::from_hex(color).unwrap_or(Color::Black),
        };

        self.props.border_width = Some(width);
        self.props.border_color = Some(border_color);
        self.props.border_radius = radius;
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        if let Some(component_str) = component_js.as_string() {
            match serde_json::from_str::<UIComponent>(&component_str) {
                Ok(component) => {
                    self.props.children.push(component);
                }
                Err(e) => {
                    console::error_1(&format!("JSON parse error: {}", e).into());
                }
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let stack_props = self.props.clone();
        let component = UIComponent::HStack(stack_props);

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}