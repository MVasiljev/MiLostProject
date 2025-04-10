use wasm_bindgen::prelude::*;
use milost_ui::{
    components::divider::{DividerProps, DividerStyle, LabelPosition, divider_color_schemes},
    shared::color::Color,
    UIComponent
};

#[wasm_bindgen]
pub struct Divider {
    props: DividerProps,
}

#[wasm_bindgen]
impl Divider {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: DividerProps::default(),
        }
    }

    #[wasm_bindgen]
    pub fn thickness(mut self, value: f32) -> Self {
        self.props.thickness = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn color(mut self, color: &str) -> Self {
        self.props.color = parse_color(color);
        self
    }

    #[wasm_bindgen]
    pub fn style(mut self, style: &str) -> Self {
        self.props.style = match style.to_lowercase().as_str() {
            "solid" => Some(DividerStyle::Solid),
            "dashed" => Some(DividerStyle::Dashed),
            "dotted" => Some(DividerStyle::Dotted),
            "gradient" => Some(DividerStyle::Gradient),
            "inset" => Some(DividerStyle::Inset),
            "outset" => Some(DividerStyle::Outset),
            _ => Some(DividerStyle::Solid),
        };
        self
    }

    #[wasm_bindgen]
    pub fn padding(mut self, value: f32) -> Self {
        self.props.padding = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn dash_length(mut self, value: f32) -> Self {
        self.props.dash_length = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn gap_length(mut self, value: f32) -> Self {
        self.props.gap_length = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn dot_radius(mut self, value: f32) -> Self {
        self.props.dot_radius = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn dot_spacing(mut self, value: f32) -> Self {
        self.props.dot_spacing = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn label(mut self, text: &str) -> Self {
        self.props.label = Some(text.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn label_color(mut self, color: &str) -> Self {
        self.props.label_color = parse_color(color);
        self
    }

    #[wasm_bindgen]
    pub fn label_position(mut self, position: &str) -> Self {
        self.props.label_position = match position.to_lowercase().as_str() {
            "left" => Some(LabelPosition::Left),
            "center" => Some(LabelPosition::Center),
            "right" => Some(LabelPosition::Right),
            "overlay" => Some(LabelPosition::Overlay),
            _ => Some(LabelPosition::Center),
        };
        self
    }

    #[wasm_bindgen]
    pub fn label_padding(mut self, value: f32) -> Self {
        self.props.label_padding = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn label_background(mut self, color: &str) -> Self {
        self.props.label_background = parse_color(color);
        self
    }

    #[wasm_bindgen]
    pub fn add_gradient_color(mut self, color: &str) -> Self {
        if self.props.gradient_colors.is_none() {
            self.props.gradient_colors = Some(Vec::new());
        }
        
        if let Some(color_obj) = parse_color(color) {
            if let Some(gradient_colors) = &mut self.props.gradient_colors {
                gradient_colors.push(color_obj);
            }
        }
        
        self
    }

    #[wasm_bindgen]
    pub fn gradient_direction(mut self, direction: &str) -> Self {
        self.props.gradient_direction = Some(direction.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn opacity(mut self, value: f32) -> Self {
        self.props.opacity = Some(value.max(0.0).min(1.0));
        self
    }

    #[wasm_bindgen]
    pub fn border_radius(mut self, value: f32) -> Self {
        self.props.border_radius = Some(value);
        self
    }

    #[wasm_bindgen]
    pub fn semantic_label(mut self, label: &str) -> Self {
        self.props.semantic_label = Some(label.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn accessibility_hint(mut self, hint: &str) -> Self {
        self.props.accessibility_hint = Some(hint.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn to_json(&self) -> String {
        serde_json::to_string(&UIComponent::Divider(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}

#[wasm_bindgen]
pub fn light_divider() -> Divider {
    Divider {
        props: divider_color_schemes::light(),
    }
}

#[wasm_bindgen]
pub fn dark_divider() -> Divider {
    Divider {
        props: divider_color_schemes::dark(),
    }
}

#[wasm_bindgen]
pub fn accent_divider() -> Divider {
    Divider {
        props: divider_color_schemes::accent(),
    }
}

#[wasm_bindgen]
pub fn gradient_divider() -> Divider {
    Divider {
        props: divider_color_schemes::gradient(),
    }
}

fn parse_color(color: &str) -> Option<Color> {
    match color.to_lowercase().as_str() {
        "white" => Some(Color::White),
        "black" => Some(Color::Black),
        "gray" => Some(Color::Gray),
        "lightgray" => Some(Color::LightGray),
        "darkgray" => Some(Color::DarkGray),
        "red" => Some(Color::Red),
        "green" => Some(Color::Green),
        "blue" => Some(Color::Blue),
        "yellow" => Some(Color::Yellow),
        "orange" => Some(Color::Orange),
        "purple" => Some(Color::Purple),
        "pink" => Some(Color::Pink),
        "teal" => Some(Color::Teal),
        "indigo" => Some(Color::Indigo),
        "cyan" => Some(Color::Cyan),
        "primary" => Some(Color::Primary),
        "secondary" => Some(Color::Secondary),
        "transparent" => Some(Color::Transparent),
        _ => Some(Color::from_hex(color)),
    }
}