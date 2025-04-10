
use milost_ui::{
    components::{
        UIComponent,
        stack::{HStackProps, HStackAlignment, LayoutPriority},
    },
    shared::{Color, EdgeInsets},
};
use wasm_bindgen::prelude::*;
use super::stack_utils::{parse_layout_priority, create_gradient, create_edge_insets};

#[wasm_bindgen]
pub struct HStack {
    props: HStackProps,
}

#[wasm_bindgen]
impl HStack {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: HStackProps::default(),
        }
    }

    #[wasm_bindgen]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.props.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props.padding = Some(padding);
        self
    }

    #[wasm_bindgen]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        let alignment = match alignment_str {
            "top" => HStackAlignment::Top,
            "center" => HStackAlignment::Center,
            "bottom" => HStackAlignment::Bottom,
            "firstTextBaseline" => HStackAlignment::FirstTextBaseline,
            "lastTextBaseline" => HStackAlignment::LastTextBaseline,
            _ => HStackAlignment::Center,
        };
        
        self.props.alignment = Some(alignment);
        self
    }

    #[wasm_bindgen]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props.edge_insets = create_edge_insets(
            Some(top), Some(right), Some(bottom), Some(left)
        );
        self
    }

    #[wasm_bindgen]
    pub fn background(mut self, color: &str) -> Self {
        self.props.background = Some(Color::from_hex(color));
        self
    }

    #[wasm_bindgen]
    pub fn min_width(mut self, width: f32) -> Self {
        self.props.min_width = Some(width);
        self
    }
    
    #[wasm_bindgen]
    pub fn max_width(mut self, width: f32) -> Self {
        self.props.max_width = Some(width);
        self
    }
    
    #[wasm_bindgen]
    pub fn min_height(mut self, height: f32) -> Self {
        self.props.min_height = Some(height);
        self
    }
    
    #[wasm_bindgen]
    pub fn max_height(mut self, height: f32) -> Self {
        self.props.max_height = Some(height);
        self
    }

    #[wasm_bindgen]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props.clip_to_bounds = Some(clip);
        self
    }

    #[wasm_bindgen]
    pub fn layout_priority(mut self, priority: f32) -> Self {
        self.props.layout_priority = Some(parse_layout_priority(priority));
        self
    }

    #[wasm_bindgen]
    pub fn equal_spacing(mut self, equal: bool) -> Self {
        self.props.equal_spacing = Some(equal);
        self
    }

    #[wasm_bindgen]
    pub fn shadow(mut self, radius: f32, color: &str, offset_x: f32, offset_y: f32) -> Self {
        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = Some(Color::from_hex(color));
        self.props.shadow_offset = Some((offset_x, offset_y));
        self
    }

    #[wasm_bindgen]
    pub fn gradient(mut self, colors_json: &str, is_radial: bool) -> Self {
        let colors: Vec<Color> = serde_json::from_str(colors_json)
            .unwrap_or_else(|_| Vec::new());
        
        self.props.gradient = create_gradient(
            &colors, 
            is_radial, 
            None, 
            None
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn border(mut self, width: f32, color: &str, radius: f32) -> Self {
        self.props.border_width = Some(width);
        self.props.border_color = Some(Color::from_hex(color));
        self.props.border_radius = Some(radius);
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
        serde_json::to_string(&UIComponent::HStack(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}