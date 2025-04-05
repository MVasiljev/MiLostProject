use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{
    Color, FontStyle, TextProps, UIComponent, 
    text::{TextAlign, TextDecoration, TextOverflow, TextTransform, FontWeight, TextShadow}
};

#[wasm_bindgen]
pub struct TextBuilder {
    props: TextProps,
}

#[wasm_bindgen]
impl TextBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(content: &str) -> Self {
        Self {
            props: TextProps {
                content: content.to_string(),
                ..Default::default()
            }
        }
    }

    #[wasm_bindgen(method)]
    pub fn font_style(mut self, style_str: &str) -> Self {
        self.props.font_style = match style_str {
            "Title" => Some(FontStyle::Title),
            "Body" => Some(FontStyle::Body),
            "Caption" => Some(FontStyle::Caption),
            "Headline" => Some(FontStyle::Headline),
            "Subheadline" => Some(FontStyle::Subheadline),
            "Footnote" => Some(FontStyle::Footnote),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn color(mut self, color_str: &str) -> Self {
        self.props.color = match color_str {
            "White" => Some(Color::White),
            "Black" => Some(Color::Black),
            
            "Red" => Some(Color::Red),
            "Green" => Some(Color::Green),
            "Blue" => Some(Color::Blue),
            "Yellow" => Some(Color::Yellow),
            
            "Orange" => Some(Color::Orange),
            "Purple" => Some(Color::Purple),
            "Pink" => Some(Color::Pink),
            "Teal" => Some(Color::Teal),
            "Indigo" => Some(Color::Indigo),
            "Cyan" => Some(Color::Cyan),
            
            "Gray" => Some(Color::Gray),
            "LightGray" => Some(Color::LightGray),
            "DarkGray" => Some(Color::DarkGray),
            
            "Primary" => Some(Color::Primary),
            "Secondary" => Some(Color::Secondary),
            "Accent" => Some(Color::Accent),
            "Background" => Some(Color::Background),
            "Surface" => Some(Color::Surface),
            "Error" => Some(Color::Error),
            "OnPrimary" => Some(Color::OnPrimary),
            "OnSecondary" => Some(Color::OnSecondary),
            "OnBackground" => Some(Color::OnBackground),
            "OnSurface" => Some(Color::OnSurface),
            "OnError" => Some(Color::OnError),
            
            "Success" => Some(Color::Success),
            "Warning" => Some(Color::Warning),
            "Info" => Some(Color::Info),
            "Danger" => Some(Color::Danger),
            
            "Twitter" => Some(Color::Twitter),
            "Facebook" => Some(Color::Facebook),
            "LinkedIn" => Some(Color::LinkedIn),
            "Instagram" => Some(Color::Instagram),
            
            "Link" => Some(Color::Link),
            "Disabled" => Some(Color::Disabled),
            "Placeholder" => Some(Color::Placeholder),
            
            "Transparent" => Some(Color::Transparent),
            
            hex if hex.starts_with('#') => Some(Color::Hex(hex.to_string())),
            
            _ => None,
        };
        self
    }
    
    
    #[wasm_bindgen(method)]
    pub fn rgb_color(mut self, r: u8, g: u8, b: u8) -> Self {
        self.props.color = Some(Color::Custom(r, g, b));
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn rgba_color(mut self, r: u8, g: u8, b: u8, a: f32) -> Self {
        self.props.color = Some(Color::CustomWithAlpha(r, g, b, a.max(0.0).min(1.0)));
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn hex_color(mut self, hex: &str) -> Self {
        self.props.color = Some(Color::Hex(hex.to_string()));
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn font_size(mut self, size: f32) -> Self {
        self.props.font_size = Some(size);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn font_family(mut self, family: &str) -> Self {
        self.props.font_family = Some(family.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn font_weight(mut self, weight_str: &str) -> Self {
        self.props.font_weight = match weight_str {
            "Thin" => Some(FontWeight::Thin),
            "ExtraLight" => Some(FontWeight::ExtraLight),
            "Light" => Some(FontWeight::Light),
            "Regular" => Some(FontWeight::Regular),
            "Medium" => Some(FontWeight::Medium),
            "SemiBold" => Some(FontWeight::SemiBold),
            "Bold" => Some(FontWeight::Bold),
            "ExtraBold" => Some(FontWeight::ExtraBold),
            "Black" => Some(FontWeight::Black),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn custom_font_weight(mut self, weight: u16) -> Self {
        if weight >= 100 && weight <= 900 {
            self.props.font_weight = Some(FontWeight::Custom(weight));
        }
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn line_height(mut self, height: f32) -> Self {
        self.props.line_height = Some(height);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn letter_spacing(mut self, spacing: f32) -> Self {
        self.props.letter_spacing = Some(spacing);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn word_spacing(mut self, spacing: f32) -> Self {
        self.props.word_spacing = Some(spacing);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn italic(mut self, is_italic: bool) -> Self {
        self.props.italic = Some(is_italic);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn text_align(mut self, align_str: &str) -> Self {
        self.props.text_align = match align_str.to_lowercase().as_str() {
            "left" => Some(TextAlign::Left),
            "center" => Some(TextAlign::Center),
            "right" => Some(TextAlign::Right),
            "justify" => Some(TextAlign::Justify),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn text_decoration(mut self, decoration_str: &str) -> Self {
        self.props.text_decoration = match decoration_str.to_lowercase().as_str() {
            "none" => Some(TextDecoration::None),
            "underline" => Some(TextDecoration::Underline),
            "overline" => Some(TextDecoration::Overline),
            "linethrough" => Some(TextDecoration::LineThrough),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn decoration_color(mut self, color_str: &str) -> Self {
        self.props.decoration_color = match color_str {
            "White" => Some(Color::White),
            "Black" => Some(Color::Black),
            
            "Red" => Some(Color::Red),
            "Green" => Some(Color::Green),
            "Blue" => Some(Color::Blue),
            "Yellow" => Some(Color::Yellow),
            
            "Orange" => Some(Color::Orange),
            "Purple" => Some(Color::Purple),
            "Pink" => Some(Color::Pink),
            "Teal" => Some(Color::Teal),
            "Indigo" => Some(Color::Indigo),
            "Cyan" => Some(Color::Cyan),
            
            "Gray" => Some(Color::Gray),
            "LightGray" => Some(Color::LightGray),
            "DarkGray" => Some(Color::DarkGray),
            
            "Primary" => Some(Color::Primary),
            "Secondary" => Some(Color::Secondary),
            "Accent" => Some(Color::Accent),
            "Error" => Some(Color::Error),
            
            "Success" => Some(Color::Success),
            "Warning" => Some(Color::Warning),
            "Info" => Some(Color::Info),
            "Danger" => Some(Color::Danger),
            
            hex if hex.starts_with('#') => Some(Color::Hex(hex.to_string())),
            
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn decoration_style(mut self, style: &str) -> Self {
        self.props.decoration_style = Some(style.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn decoration_thickness(mut self, thickness: f32) -> Self {
        self.props.decoration_thickness = Some(thickness);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn text_transform(mut self, transform_str: &str) -> Self {
        self.props.text_transform = match transform_str.to_lowercase().as_str() {
            "none" => Some(TextTransform::None),
            "uppercase" => Some(TextTransform::Uppercase),
            "lowercase" => Some(TextTransform::Lowercase),
            "capitalize" => Some(TextTransform::Capitalize),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn max_lines(mut self, lines: u32) -> Self {
        self.props.max_lines = Some(lines);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn min_font_size(mut self, size: f32) -> Self {
        self.props.min_font_size = Some(size);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn max_font_size(mut self, size: f32) -> Self {
        self.props.max_font_size = Some(size);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn truncation_mode(mut self, mode_str: &str) -> Self {
        self.props.truncation_mode = match mode_str.to_lowercase().as_str() {
            "clip" => Some(TextOverflow::Clip),
            "ellipsis" => Some(TextOverflow::Ellipsis),
            "fade" => Some(TextOverflow::Fade),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn soft_wrap(mut self, wrap: bool) -> Self {
        self.props.soft_wrap = Some(wrap);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn background_color(mut self, color_str: &str) -> Self {
        self.props.background_color = match color_str {
            "White" => Some(Color::White),
            "Black" => Some(Color::Black),
            
            "Red" => Some(Color::Red),
            "Green" => Some(Color::Green),
            "Blue" => Some(Color::Blue),
            "Yellow" => Some(Color::Yellow),
            
            "Orange" => Some(Color::Orange),
            "Purple" => Some(Color::Purple),
            "Pink" => Some(Color::Pink),
            "Teal" => Some(Color::Teal),
            
            "Gray" => Some(Color::Gray),
            "LightGray" => Some(Color::LightGray),
            "DarkGray" => Some(Color::DarkGray),
            
            "Primary" => Some(Color::Primary),
            "Secondary" => Some(Color::Secondary),
            "Background" => Some(Color::Background),
            "Surface" => Some(Color::Surface),
            
            "Transparent" => Some(Color::Transparent),
            
            hex if hex.starts_with('#') => Some(Color::Hex(hex.to_string())),
            
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn background_rgb(mut self, r: u8, g: u8, b: u8) -> Self {
        self.props.background_color = Some(Color::Custom(r, g, b));
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn shadow(mut self, color_str: &str, offset_x: f32, offset_y: f32, blur_radius: f32) -> Self {
        let color = match color_str {
            "White" => Color::White,
            "Black" => Color::Black,
            
            "Red" => Color::Red,
            "Green" => Color::Green,
            "Blue" => Color::Blue,
            "Yellow" => Color::Yellow,
            
            "Orange" => Color::Orange,
            "Purple" => Color::Purple,
            "Gray" => Color::Gray,
            "DarkGray" => Color::DarkGray,
            
            hex if hex.starts_with('#') => Color::Hex(hex.to_string()),
            
            _ => Color::Black,
        };
        
        self.props.shadow = Some(TextShadow {
            color,
            offset_x,
            offset_y,
            blur_radius,
        });
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn shadow_rgb(mut self, r: u8, g: u8, b: u8, offset_x: f32, offset_y: f32, blur_radius: f32) -> Self {
        self.props.shadow = Some(TextShadow {
            color: Color::Custom(r, g, b),
            offset_x,
            offset_y,
            blur_radius,
        });
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn semantic_label(mut self, label: &str) -> Self {
        self.props.semantic_label = Some(label.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn exclude_from_semantics(mut self, exclude: bool) -> Self {
        self.props.exclude_from_semantics = Some(exclude);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props.padding = Some(padding);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn width(mut self, width: f32) -> Self {
        self.props.width = Some(width);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn height(mut self, height: f32) -> Self {
        self.props.height = Some(height);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn fixed_size(mut self, fixed: bool) -> Self {
        self.props.fixed_size = Some(fixed);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn selectable(mut self, selectable: bool) -> Self {
        self.props.selectable = Some(selectable);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn locale(mut self, locale: &str) -> Self {
        self.props.locale = Some(locale.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn text_direction(mut self, direction: &str) -> Self {
        self.props.text_direction = Some(direction.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn text_scaling_factor(mut self, factor: f32) -> Self {
        self.props.text_scaling_factor = Some(factor);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn underline(mut self, underline: bool) -> Self {
        self.props.underline = Some(underline);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn strikethrough(mut self, strikethrough: bool) -> Self {
        self.props.strikethrough = Some(strikethrough);
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Text(self.props.clone());

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}