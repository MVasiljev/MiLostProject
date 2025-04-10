
use milost_ui::{
    components::{
        UIComponent,
        spacer::{SpacerProps, SpacerStrategy},
    },
    shared::{Color, BorderStyle, EdgeInsets},
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Spacer {
    props: SpacerProps,
}

#[wasm_bindgen]
impl Spacer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: SpacerProps::new(),
        }
    }

    #[wasm_bindgen]
    pub fn fixed(mut self, size: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Fixed(size));
        self
    }

    #[wasm_bindgen]
    pub fn flexible(mut self, grow: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Flexible(grow));
        self
    }

    #[wasm_bindgen]
    pub fn minimum(mut self, size: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Minimum(size));
        self
    }

    #[wasm_bindgen]
    pub fn maximum(mut self, size: f32) -> Self {
        self.props.strategy = Some(SpacerStrategy::Maximum(size));
        self
    }

    #[wasm_bindgen]
    pub fn background(mut self, color: &str) -> Self {
        self.props.background = Some(Color::from_hex(color));
        self
    }

    #[wasm_bindgen]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }

    #[wasm_bindgen]
    pub fn border(mut self, width: f32, color: &str, radius: Option<f32>, style: Option<String>) -> Self {
        self.props.border_width = Some(width);
        self.props.border_color = Some(Color::from_hex(color));
        
        if let Some(r) = radius {
            self.props.border_radius = Some(r);
        }
        
        if let Some(s) = style {
            let border_style = match s.to_lowercase().as_str() {
                "solid" => BorderStyle::Solid,
                "dashed" => BorderStyle::Dashed,
                "dotted" => BorderStyle::Dotted,
                "none" => BorderStyle::None,
                _ => BorderStyle::Solid,
            };
            
            self.props.border_style = Some(border_style);
        }
        
        self
    }

    #[wasm_bindgen]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
        self
    }

    #[wasm_bindgen]
    pub fn accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.props.accessibility_label = label;
        self.props.accessibility_hint = hint;
        self.props.is_accessibility_element = is_element;
        self
    }

    #[wasm_bindgen]
    pub fn add_children(mut self, children_json: &str) -> Self {
        let children: Vec<UIComponent> = serde_json::from_str(children_json)
            .unwrap_or_else(|_| Vec::new());
        
        self.props.children = children;
        self
    }

    #[wasm_bindgen]
    pub fn to_json(&self) -> String {
        serde_json::to_string(&UIComponent::Spacer(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}

#[wasm_bindgen]
pub fn create_fixed_spacer(size: f32) -> Spacer {
    Spacer::new().fixed(size)
}

#[wasm_bindgen]
pub fn create_flexible_spacer(grow: f32) -> Spacer {
    Spacer::new().flexible(grow)
}

#[wasm_bindgen]
pub fn create_divider_spacer(height: f32, color: &str) -> Spacer {
    Spacer::new()
        .fixed(height)
        .background(color)
}

#[wasm_bindgen]
pub fn create_invisible_spacer(size: f32) -> Spacer {
    Spacer::new()
        .fixed(size)
        .opacity(0.0)
}