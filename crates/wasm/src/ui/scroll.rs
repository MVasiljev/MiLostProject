use wasm_bindgen::prelude::*;
use milost_ui::{
    components::scroll::{DecelerationRate, ScrollDirection, ScrollIndicatorStyle, ScrollInsets, ScrollProps}, shared::{color::Color, EdgeInsets}, BorderStyle, UIComponent
};

#[wasm_bindgen]
pub struct Scroll {
    props: ScrollProps,
}

#[wasm_bindgen]
impl Scroll {
    #[wasm_bindgen(constructor)]
    pub fn new(direction: &str) -> Self {
        let mut props = ScrollProps::default();
        
        props.direction = match direction.to_lowercase().as_str() {
            "horizontal" => ScrollDirection::Horizontal,
            _ => ScrollDirection::Vertical,
        };
        
        Self { props }
    }
    
    #[wasm_bindgen]
    pub fn vertical() -> Self {
        Self {
            props: ScrollProps::vertical(),
        }
    }
    
    #[wasm_bindgen]
    pub fn horizontal() -> Self {
        Self {
            props: ScrollProps::horizontal(),
        }
    }

    #[wasm_bindgen]
    pub fn add_child(mut self, component_json: &str) -> Self {
        if let Ok(component) = serde_json::from_str::<UIComponent>(component_json) {
            self.props.children.push(component);
        }
        self
    }
    
    #[wasm_bindgen]
    pub fn shows_indicators(mut self, shows: bool) -> Self {
        self.props.shows_indicators = Some(shows);
        self
    }
    
    #[wasm_bindgen]
    pub fn scrollbar_color(mut self, color: &str) -> Self {
        self.props.scrollbar_color = parse_color(color);
        self
    }
    
    #[wasm_bindgen]
    pub fn scrollbar_width(mut self, width: f32) -> Self {
        self.props.scrollbar_width = Some(width);
        self
    }
    
    #[wasm_bindgen]
    pub fn scrollbar_margin(mut self, margin: f32) -> Self {
        self.props.scrollbar_margin = Some(margin);
        self
    }
    
    #[wasm_bindgen]
    pub fn always_bounces_horizontal(mut self, bounces: bool) -> Self {
        self.props.always_bounces_horizontal = Some(bounces);
        self
    }
    
    #[wasm_bindgen]
    pub fn always_bounces_vertical(mut self, bounces: bool) -> Self {
        self.props.always_bounces_vertical = Some(bounces);
        self
    }
    
    #[wasm_bindgen]
    pub fn scroll_enabled(mut self, enabled: bool) -> Self {
        self.props.scroll_enabled = Some(enabled);
        self
    }
    
    #[wasm_bindgen]
    pub fn paging_enabled(mut self, enabled: bool) -> Self {
        self.props.paging_enabled = Some(enabled);
        self
    }
    
    #[wasm_bindgen]
    pub fn deceleration_rate(mut self, rate: &str) -> Self {
        self.props.deceleration_rate = match rate.to_lowercase().as_str() {
            "normal" => Some(DecelerationRate::Normal),
            "fast" => Some(DecelerationRate::Fast),
            _ => {
                if let Ok(value) = rate.parse::<f32>() {
                    Some(DecelerationRate::Custom(value))
                } else {
                    Some(DecelerationRate::Normal)
                }
            }
        };
        self
    }
    
    #[wasm_bindgen]
    pub fn content_insets(mut self, top: f32, left: f32, bottom: f32, right: f32) -> Self {
        self.props.content_insets = Some(ScrollInsets {
            top: Some(top),
            left: Some(left),
            bottom: Some(bottom),
            right: Some(right),
        });
        self
    }
    
    #[wasm_bindgen]
    pub fn content_inset_top(mut self, top: f32) -> Self {
        if self.props.content_insets.is_none() {
            self.props.content_insets = Some(ScrollInsets::default());
        }
        
        if let Some(insets) = &mut self.props.content_insets {
            insets.top = Some(top);
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn content_inset_left(mut self, left: f32) -> Self {
        if self.props.content_insets.is_none() {
            self.props.content_insets = Some(ScrollInsets::default());
        }
        
        if let Some(insets) = &mut self.props.content_insets {
            insets.left = Some(left);
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn content_inset_bottom(mut self, bottom: f32) -> Self {
        if self.props.content_insets.is_none() {
            self.props.content_insets = Some(ScrollInsets::default());
        }
        
        if let Some(insets) = &mut self.props.content_insets {
            insets.bottom = Some(bottom);
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn content_inset_right(mut self, right: f32) -> Self {
        if self.props.content_insets.is_none() {
            self.props.content_insets = Some(ScrollInsets::default());
        }
        
        if let Some(insets) = &mut self.props.content_insets {
            insets.right = Some(right);
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn indicator_style(mut self, style: &str) -> Self {
        self.props.indicator_style = match style.to_lowercase().as_str() {
            "light" => Some(ScrollIndicatorStyle::Light),
            "dark" => Some(ScrollIndicatorStyle::Dark),
            _ => Some(ScrollIndicatorStyle::Default),
        };
        self
    }
    
    #[wasm_bindgen]
    pub fn custom_indicator_style(mut self, color: &str) -> Self {
        if let Some(color_obj) = parse_color(color) {
            self.props.indicator_style = Some(ScrollIndicatorStyle::Custom(color_obj));
        }
        self
    }
    
    #[wasm_bindgen]
    pub fn accessibility_label(mut self, label: &str) -> Self {
        self.props.accessibility_label = Some(label.to_string());
        self
    }
    
    #[wasm_bindgen]
    pub fn width(mut self, width: f32) -> Self {
        self.props.width = Some(width);
        self
    }
    
    #[wasm_bindgen]
    pub fn height(mut self, height: f32) -> Self {
        self.props.height = Some(height);
        self
    }
    
    #[wasm_bindgen]
    pub fn min_width(mut self, min_width: f32) -> Self {
        self.props.min_width = Some(min_width);
        self
    }
    
    #[wasm_bindgen]
    pub fn max_width(mut self, max_width: f32) -> Self {
        self.props.max_width = Some(max_width);
        self
    }
    
    #[wasm_bindgen]
    pub fn min_height(mut self, min_height: f32) -> Self {
        self.props.min_height = Some(min_height);
        self
    }
    
    #[wasm_bindgen]
    pub fn max_height(mut self, max_height: f32) -> Self {
        self.props.max_height = Some(max_height);
        self
    }
    
    #[wasm_bindgen]
    pub fn background_color(mut self, color: &str) -> Self {
        self.props.background_color = parse_color(color);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_width(mut self, width: f32) -> Self {
        self.props.border_width = Some(width);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_color(mut self, color: &str) -> Self {
        self.props.border_color = parse_color(color);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_radius(mut self, radius: f32) -> Self {
        self.props.border_radius = Some(radius);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_style(mut self, style: &str) -> Self {
        self.props.border_style = match style.to_lowercase().as_str() {
            "solid" => Some(BorderStyle::Solid),
            "dashed" => Some(BorderStyle::Dashed),
            "dotted" => Some(BorderStyle::Dotted),
            "none" => Some(BorderStyle::None),
            _ => Some(BorderStyle::Solid),
        };
        self
    }
    
    #[wasm_bindgen]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props.padding = Some(padding);
        self
    }
    
    #[wasm_bindgen]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
        self
    }
    
    #[wasm_bindgen]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }
    
    #[wasm_bindgen]
    pub fn to_json(&self) -> String {
        serde_json::to_string(&UIComponent::Scroll(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
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