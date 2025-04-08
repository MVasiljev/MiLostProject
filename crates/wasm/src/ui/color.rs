use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json;

use milost_ui::shared::color::{Color, ColorScheme, color_schemes};

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ColorJs {
    // Basic colors
    White,
    Black,
    
    // Primary colors
    Red,
    Green,
    Blue,
    Yellow,
    
    // Secondary colors
    Orange,
    Purple,
    Pink,
    Teal,
    Indigo,
    Cyan,
    
    // Gray shades
    Gray,
    LightGray,
    DarkGray,
    
    // Material colors
    Primary,
    Secondary,
    Accent,
    Background,
    Surface,
    Error,
    OnPrimary,
    OnSecondary,
    OnBackground,
    OnSurface,
    OnError,
    
    // Semantic colors
    Success,
    Warning,
    Info,
    Danger,
    
    // Social media colors
    Twitter,
    Facebook,
    LinkedIn,
    Instagram,
    
    // Common UI colors
    Link,
    Disabled,
    Placeholder,
    
    // Advanced colors
    Transparent,
    Custom,
    CustomWithAlpha,
    Hex,
}

impl From<ColorJs> for Color {
    fn from(color_js: ColorJs) -> Self {
        match color_js {
            ColorJs::White => Color::White,
            ColorJs::Black => Color::Black,
            ColorJs::Red => Color::Red,
            ColorJs::Green => Color::Green,
            ColorJs::Blue => Color::Blue,
            ColorJs::Yellow => Color::Yellow,
            ColorJs::Orange => Color::Orange,
            ColorJs::Purple => Color::Purple,
            ColorJs::Pink => Color::Pink,
            ColorJs::Teal => Color::Teal,
            ColorJs::Indigo => Color::Indigo,
            ColorJs::Cyan => Color::Cyan,
            ColorJs::Gray => Color::Gray,
            ColorJs::LightGray => Color::LightGray,
            ColorJs::DarkGray => Color::DarkGray,
            ColorJs::Primary => Color::Primary,
            ColorJs::Secondary => Color::Secondary,
            ColorJs::Accent => Color::Accent,
            ColorJs::Background => Color::Background,
            ColorJs::Surface => Color::Surface,
            ColorJs::Error => Color::Error,
            ColorJs::OnPrimary => Color::OnPrimary,
            ColorJs::OnSecondary => Color::OnSecondary,
            ColorJs::OnBackground => Color::OnBackground,
            ColorJs::OnSurface => Color::OnSurface,
            ColorJs::OnError => Color::OnError,
            ColorJs::Success => Color::Success,
            ColorJs::Warning => Color::Warning,
            ColorJs::Info => Color::Info,
            ColorJs::Danger => Color::Danger,
            ColorJs::Twitter => Color::Twitter,
            ColorJs::Facebook => Color::Facebook,
            ColorJs::LinkedIn => Color::LinkedIn,
            ColorJs::Instagram => Color::Instagram,
            ColorJs::Link => Color::Link,
            ColorJs::Disabled => Color::Disabled,
            ColorJs::Placeholder => Color::Placeholder,
            ColorJs::Transparent => Color::Transparent,
            ColorJs::Custom => Color::Custom(0, 0, 0),
            ColorJs::CustomWithAlpha => Color::CustomWithAlpha(0, 0, 0, 1.0),
            ColorJs::Hex => Color::Hex("#000000".to_string()),
        }
    }
}

#[wasm_bindgen]
pub struct ColorBuilder {
    color: Color,
}

#[wasm_bindgen]
impl ColorBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(color: ColorJs) -> Self {
        Self {
            color: color.into(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn with_rgb(mut self, r: u8, g: u8, b: u8) -> Self {
        self.color = Color::Custom(r, g, b);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_rgba(mut self, r: u8, g: u8, b: u8, a: f32) -> Self {
        self.color = Color::CustomWithAlpha(r, g, b, a.max(0.0).min(1.0));
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_hex(mut self, hex: &str) -> Self {
        self.color = Color::Hex(hex.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn to_css_string(&self) -> String {
        self.color.to_css_string()
    }

    #[wasm_bindgen(method)]
    pub fn is_dark(&self) -> bool {
        self.color.is_dark()
    }

    #[wasm_bindgen(method)]
    pub fn contrasting_text_color(&self) -> ColorJs {
        match self.color.contrasting_text_color() {
            Color::White => ColorJs::White,
            Color::Black => ColorJs::Black,
            _ => ColorJs::Black, // Fallback
        }
    }

    #[wasm_bindgen(method)]
    pub fn lighten(mut self, amount: f32) -> Self {
        self.color = self.color.lighten(amount);
        self
    }

    #[wasm_bindgen(method)]
    pub fn darken(mut self, amount: f32) -> Self {
        self.color = self.color.darken(amount);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.color = self.color.with_opacity(opacity);
        self
    }
}

#[wasm_bindgen]
pub struct ColorSchemeBuilder {
    scheme: ColorScheme,
}

#[wasm_bindgen]
impl ColorSchemeBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            scheme: ColorScheme::default()
        }
    }

    #[wasm_bindgen(method)]
    pub fn with_primary(mut self, color: &ColorBuilder) -> Self {
        self.scheme.primary = color.color.clone();
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_secondary(mut self, color: &ColorBuilder) -> Self {
        self.scheme.secondary = color.color.clone();
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_background(mut self, color: &ColorBuilder) -> Self {
        self.scheme.background = color.color.clone();
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_surface(mut self, color: &ColorBuilder) -> Self {
        self.scheme.surface = color.color.clone();
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_error(mut self, color: &ColorBuilder) -> Self {
        self.scheme.error = color.color.clone();
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        serde_json::to_string(&self.scheme)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

#[wasm_bindgen]
pub fn light_color_scheme() -> Result<JsValue, JsValue> {
    serde_json::to_string(&color_schemes::light())
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn dark_color_scheme() -> Result<JsValue, JsValue> {
    serde_json::to_string(&color_schemes::dark())
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn blue_light_color_scheme() -> Result<JsValue, JsValue> {
    serde_json::to_string(&color_schemes::blue_light())
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn red_light_color_scheme() -> Result<JsValue, JsValue> {
    serde_json::to_string(&color_schemes::red_light())
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn green_light_color_scheme() -> Result<JsValue, JsValue> {
    serde_json::to_string(&color_schemes::green_light())
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn convert_color_to_css(color: ColorJs) -> String {
    ColorBuilder::new(color).to_css_string()
}