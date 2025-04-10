
use milost_ui::{
    components::{
        UIComponent,
        zstack::{ZStackProps, ZStackAlignment},
    },
    shared::{Color, EdgeInsets},
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ZStack {
    props: ZStackProps,
}

#[wasm_bindgen]
impl ZStack {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: ZStackProps::default(),
        }
    }

    #[wasm_bindgen]
    pub fn alignment(mut self, alignment_str: &str) -> Self {
        let alignment = match alignment_str.to_lowercase().as_str() {
            "center" => ZStackAlignment::Center,
            "topleading" => ZStackAlignment::TopLeading,
            "top" => ZStackAlignment::Top,
            "toptrailing" => ZStackAlignment::TopTrailing,
            "leading" => ZStackAlignment::Leading,
            "trailing" => ZStackAlignment::Trailing,
            "bottomleading" => ZStackAlignment::BottomLeading,
            "bottom" => ZStackAlignment::Bottom,
            "bottomtrailing" => ZStackAlignment::BottomTrailing,
            _ => ZStackAlignment::Center,
        };
        
        self.props.alignment = Some(alignment);
        self
    }

    #[wasm_bindgen]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
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
    pub fn ideal_width(mut self, width: f32) -> Self {
        self.props.ideal_width = Some(width);
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
    pub fn ideal_height(mut self, height: f32) -> Self {
        self.props.ideal_height = Some(height);
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
        self.props.layout_priority = Some(priority);
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
    pub fn border(mut self, width: f32, color: &str, radius: f32) -> Self {
        self.props.border_width = Some(width);
        self.props.border_color = Some(Color::from_hex(color));
        self.props.border_radius = Some(radius);
        self
    }

    #[wasm_bindgen]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
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
        serde_json::to_string(&UIComponent::ZStack(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}

#[wasm_bindgen]
pub fn create_centered_overlay() -> ZStack {
    ZStack::new()
        .alignment("center")
        .clip_to_bounds(true)
}

#[wasm_bindgen]
pub fn create_background_with_content(bg_color: &str, corner_radius: f32) -> ZStack {
    ZStack::new()
        .background(bg_color)
        .clip_to_bounds(true)
        .border(0.0, "transparent", corner_radius)
}

#[wasm_bindgen]
pub fn create_layered_navigation() -> ZStack {
    ZStack::new()
        .clip_to_bounds(true)
}