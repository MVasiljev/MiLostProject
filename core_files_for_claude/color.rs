use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "PascalCase")]
pub enum Color {
    White,
    Black,
    
    Red,
    Green,
    Blue,
    Yellow,
    
    Orange,
    Purple,
    Pink,
    Teal,
    Indigo,
    Cyan,
    
    Gray,
    LightGray,
    DarkGray,
    
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
    
    Success,
    Warning,
    Info,
    Danger,
    
    Twitter,
    Facebook,
    LinkedIn,
    Instagram,
    
    Link,
    Disabled,
    Placeholder,
    
    Transparent,
    Custom(u8, u8, u8),
    CustomWithAlpha(u8, u8, u8, f32),
    Hex(String),
}

impl Color {
    pub fn to_css_string(&self) -> String {
        match self {
            Color::White => "#FFFFFF".to_string(),
            Color::Black => "#000000".to_string(),
            
            Color::Red => "#FF0000".to_string(),
            Color::Green => "#00FF00".to_string(),
            Color::Blue => "#0000FF".to_string(),
            Color::Yellow => "#FFFF00".to_string(),
            
            Color::Orange => "#FFA500".to_string(),
            Color::Purple => "#800080".to_string(),
            Color::Pink => "#FFC0CB".to_string(),
            Color::Teal => "#008080".to_string(),
            Color::Indigo => "#4B0082".to_string(),
            Color::Cyan => "#00FFFF".to_string(),
            
            Color::Gray => "#808080".to_string(),
            Color::LightGray => "#D3D3D3".to_string(),
            Color::DarkGray => "#A9A9A9".to_string(),
            
            Color::Primary => "#6200EE".to_string(),
            Color::Secondary => "#03DAC6".to_string(),
            Color::Accent => "#03DAC6".to_string(),
            Color::Background => "#FFFFFF".to_string(),
            Color::Surface => "#FFFFFF".to_string(),
            Color::Error => "#B00020".to_string(),
            Color::OnPrimary => "#FFFFFF".to_string(),
            Color::OnSecondary => "#000000".to_string(),
            Color::OnBackground => "#000000".to_string(),
            Color::OnSurface => "#000000".to_string(),
            Color::OnError => "#FFFFFF".to_string(),
            
            Color::Success => "#4CAF50".to_string(),
            Color::Warning => "#FF9800".to_string(),
            Color::Info => "#2196F3".to_string(),
            Color::Danger => "#F44336".to_string(),
            
            Color::Twitter => "#1DA1F2".to_string(),
            Color::Facebook => "#1877F2".to_string(),
            Color::LinkedIn => "#0A66C2".to_string(),
            Color::Instagram => "#E4405F".to_string(),
            
            Color::Link => "#0000EE".to_string(),
            Color::Disabled => "#9E9E9E".to_string(),
            Color::Placeholder => "#9E9E9E".to_string(),
            
            Color::Transparent => "transparent".to_string(),
            Color::Custom(r, g, b) => format!("rgb({}, {}, {})", r, g, b),
            Color::CustomWithAlpha(r, g, b, a) => format!("rgba({}, {}, {}, {})", r, g, b, a),
            Color::Hex(hex) => {
                if hex.starts_with('#') {
                    hex.clone()
                } else {
                    format!("#{}", hex)
                }
            },
        }
    }
    
    pub fn rgb(r: u8, g: u8, b: u8) -> Self {
        Color::Custom(r, g, b)
    }
    
    pub fn rgba(r: u8, g: u8, b: u8, a: f32) -> Self {
        Color::CustomWithAlpha(r, g, b, a.max(0.0).min(1.0))
    }
    
    pub fn from_hex(hex: &str) -> Self {
        Color::Hex(hex.to_string())
    }
    
    pub fn is_dark(&self) -> bool {
        match self {
            Color::White | 
            Color::Yellow | 
            Color::LightGray | 
            Color::Background |
            Color::Surface | 
            Color::Secondary | 
            Color::Accent |
            Color::Warning => false,
            
            Color::Custom(r, g, b) => {
                let brightness = 0.299 * (*r as f32) + 0.587 * (*g as f32) + 0.114 * (*b as f32);
                brightness < 128.0
            },
            
            Color::CustomWithAlpha(r, g, b, _) => {
                let brightness = 0.299 * (*r as f32) + 0.587 * (*g as f32) + 0.114 * (*b as f32);
                brightness < 128.0
            },
            
            Color::Hex(hex) => {
                if hex.len() >= 7 {
                    let r = u8::from_str_radix(&hex[1..3], 16).unwrap_or(0);
                    let g = u8::from_str_radix(&hex[3..5], 16).unwrap_or(0);
                    let b = u8::from_str_radix(&hex[5..7], 16).unwrap_or(0);
                    
                    let brightness = 0.299 * (r as f32) + 0.587 * (g as f32) + 0.114 * (b as f32);
                    brightness < 128.0
                } else {
                    true
                }
            },
            
            _ => true,
        }
    }
    
    pub fn contrasting_text_color(&self) -> Self {
        if self.is_dark() {
            Color::White
        } else {
            Color::Black
        }
    }
    
    pub fn lighten(&self, amount: f32) -> Self {
        match self {
            Color::Custom(r, g, b) => {
                let amount = amount.max(0.0).min(1.0);
                let r = (*r as f32 + (255.0 - *r as f32) * amount) as u8;
                let g = (*g as f32 + (255.0 - *g as f32) * amount) as u8;
                let b = (*b as f32 + (255.0 - *b as f32) * amount) as u8;
                Color::Custom(r, g, b)
            },
            _ => self.clone(),
        }
    }
    
    pub fn darken(&self, amount: f32) -> Self {
        match self {
            Color::Custom(r, g, b) => {
                let amount = amount.max(0.0).min(1.0);
                let r = (*r as f32 * (1.0 - amount)) as u8;
                let g = (*g as f32 * (1.0 - amount)) as u8;
                let b = (*b as f32 * (1.0 - amount)) as u8;
                Color::Custom(r, g, b)
            },
            _ => self.clone(),
        }
    }
    
    pub fn with_opacity(&self, opacity: f32) -> Self {
        let opacity = opacity.max(0.0).min(1.0);
        match self {
            Color::Custom(r, g, b) => Color::CustomWithAlpha(*r, *g, *b, opacity),
            Color::CustomWithAlpha(r, g, b, _) => Color::CustomWithAlpha(*r, *g, *b, opacity),
            _ => self.clone(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ThemeMode {
    Light,
    Dark,
    System,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ColorScheme {
    pub primary: Color,
    pub secondary: Color,
    pub background: Color,
    pub surface: Color,
    pub error: Color,
    pub on_primary: Color,
    pub on_secondary: Color,
    pub on_background: Color,
    pub on_surface: Color,
    pub on_error: Color,
}

impl Default for ColorScheme {
    fn default() -> Self {
        Self {
            primary: Color::Primary,
            secondary: Color::Secondary,
            background: Color::Background,
            surface: Color::Surface,
            error: Color::Error,
            on_primary: Color::OnPrimary,
            on_secondary: Color::OnSecondary,
            on_background: Color::OnBackground,
            on_surface: Color::OnSurface,
            on_error: Color::OnError,
        }
    }
}

pub mod color_schemes {
    use super::{ColorScheme, Color};
    
    pub fn light() -> ColorScheme {
        ColorScheme::default()
    }
    
    pub fn dark() -> ColorScheme {
        ColorScheme {
            primary: Color::Primary,
            secondary: Color::Secondary,
            background: Color::Black,
            surface: Color::DarkGray,
            error: Color::Error,
            on_primary: Color::White,
            on_secondary: Color::Black,
            on_background: Color::White,
            on_surface: Color::White,
            on_error: Color::White,
        }
    }
    
    pub fn blue_light() -> ColorScheme {
        ColorScheme {
            primary: Color::Blue,
            secondary: Color::Cyan,
            background: Color::White,
            surface: Color::White,
            error: Color::Red,
            on_primary: Color::White,
            on_secondary: Color::Black,
            on_background: Color::Black,
            on_surface: Color::Black,
            on_error: Color::White,
        }
    }
    
    pub fn red_light() -> ColorScheme {
        ColorScheme {
            primary: Color::Red,
            secondary: Color::Pink,
            background: Color::White,
            surface: Color::White,
            error: Color::Error,
            on_primary: Color::White,
            on_secondary: Color::White,
            on_background: Color::Black,
            on_surface: Color::Black,
            on_error: Color::White,
        }
    }
    
    pub fn green_light() -> ColorScheme {
        ColorScheme {
            primary: Color::Green,
            secondary: Color::Teal,
            background: Color::White,
            surface: Color::White,
            error: Color::Red,
            on_primary: Color::Black,
            on_secondary: Color::White,
            on_background: Color::Black,
            on_surface: Color::Black,
            on_error: Color::White,
        }
    }
}