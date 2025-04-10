// text.rs

use milost_ui::{
    components::{
        UIComponent,
        text::{TextProps, TextDecoration, TextOverflow},
        font::{FontWeight, FontSlant, FontWidth, FontStyle},
    },
    shared::{Color, EdgeInsets, TextAlign, TextTransform},
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Text {
    props: TextProps,
}

#[wasm_bindgen]
impl Text {
    #[wasm_bindgen(constructor)]
    pub fn new(content: &str) -> Self {
        Self {
            props: TextProps::new(content),
        }
    }

    #[wasm_bindgen]
    pub fn color(mut self, color: &str) -> Self {
        self.props.color = Some(Color::from_hex(color));
        self
    }

    #[wasm_bindgen]
    pub fn font_style(mut self, style: &str) -> Self {
        self.props.font_style = match style.to_lowercase().as_str() {
            "largetitle" => Some(FontStyle::LargeTitle),
            "title1" => Some(FontStyle::Title1),
            "title2" => Some(FontStyle::Title2),
            "title3" => Some(FontStyle::Title3),
            "headline" => Some(FontStyle::Headline),
            "subheadline" => Some(FontStyle::Subheadline),
            "body" => Some(FontStyle::Body),
            "callout" => Some(FontStyle::Callout),
            "caption1" => Some(FontStyle::Caption1),
            "caption2" => Some(FontStyle::Caption2),
            "footnote" => Some(FontStyle::Footnote),
            "code" => Some(FontStyle::Code),
            "button" => Some(FontStyle::Button),
            "link" => Some(FontStyle::Link),
            "title" => Some(FontStyle::Title),
            "caption" => Some(FontStyle::Caption),
            _ => Some(FontStyle::Body),
        };
        self
    }

    #[wasm_bindgen]
    pub fn font_size(mut self, size: f32) -> Self {
        self.props.font_size = Some(size);
        self
    }

    #[wasm_bindgen]
    pub fn font_weight(mut self, weight: &str) -> Self {
        self.props.font_weight = match weight.to_lowercase().as_str() {
            "thin" => Some(FontWeight::Thin),
            "extralight" => Some(FontWeight::ExtraLight),
            "light" => Some(FontWeight::Light),
            "regular" | "normal" => Some(FontWeight::Regular),
            "medium" => Some(FontWeight::Medium),
            "semibold" => Some(FontWeight::SemiBold),
            "bold" => Some(FontWeight::Bold),
            "extrabold" => Some(FontWeight::ExtraBold),
            "black" => Some(FontWeight::Black),
            _ => {
                if let Ok(weight_val) = weight.parse::<u16>() {
                    Some(FontWeight::Custom(weight_val))
                } else {
                    Some(FontWeight::Regular)
                }
            }
        };
        self
    }

    #[wasm_bindgen]
    pub fn font_family(mut self, family: &str) -> Self {
        self.props.font_family = Some(family.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn font_slant(mut self, slant: &str) -> Self {
        self.props.font_slant = match slant.to_lowercase().as_str() {
            "normal" => Some(FontSlant::Normal),
            "italic" => Some(FontSlant::Italic),
            "oblique" => Some(FontSlant::Oblique),
            _ => Some(FontSlant::Normal),
        };
        self
    }

    #[wasm_bindgen]
    pub fn font_width(mut self, width: &str) -> Self {
        self.props.font_width = match width.to_lowercase().as_str() {
            "ultracondensed" => Some(FontWidth::UltraCondensed),
            "extracondensed" => Some(FontWidth::ExtraCondensed),
            "condensed" => Some(FontWidth::Condensed),
            "semicondensed" => Some(FontWidth::SemiCondensed),
            "normal" => Some(FontWidth::Normal),
            "semiexpanded" => Some(FontWidth::SemiExpanded),
            "expanded" => Some(FontWidth::Expanded),
            "extraexpanded" => Some(FontWidth::ExtraExpanded),
            "ultraexpanded" => Some(FontWidth::UltraExpanded),
            _ => Some(FontWidth::Normal),
        };
        self
    }

    #[wasm_bindgen]
    pub fn italic(mut self, is_italic: bool) -> Self {
        self.props.italic = Some(is_italic);
        self
    }

    #[wasm_bindgen]
    pub fn text_align(mut self, align: &str) -> Self {
        self.props.text_align = match align.to_lowercase().as_str() {
            "left" => Some(TextAlign::Left),
            "center" => Some(TextAlign::Center),
            "right" => Some(TextAlign::Right),
            _ => Some(TextAlign::Left),
        };
        self
    }

    #[wasm_bindgen]
    pub fn text_decoration(mut self, decoration: &str) -> Self {
        self.props.text_decoration = match decoration.to_lowercase().as_str() {
            "none" => Some(TextDecoration::None),
            "underline" => Some(TextDecoration::Underline),
            "overline" => Some(TextDecoration::Overline),
            "linethrough" => Some(TextDecoration::LineThrough),
            _ => Some(TextDecoration::None),
        };
        self
    }

    #[wasm_bindgen]
    pub fn decoration_color(mut self, color: &str) -> Self {
        self.props.decoration_color = Some(Color::from_hex(color));
        self
    }

    #[wasm_bindgen]
    pub fn decoration_thickness(mut self, thickness: f32) -> Self {
        self.props.decoration_thickness = Some(thickness);
        self
    }

    #[wasm_bindgen]
    pub fn text_transform(mut self, transform: &str) -> Self {
        self.props.text_transform = match transform.to_lowercase().as_str() {
            "none" => Some(TextTransform::None),
            "uppercase" => Some(TextTransform::Uppercase),
            "lowercase" => Some(TextTransform::Lowercase),
            "capitalize" => Some(TextTransform::Capitalize),
            _ => Some(TextTransform::None),
        };
        self
    }

    #[wasm_bindgen]
    pub fn line_height(mut self, height: f32) -> Self {
        self.props.line_height = Some(height);
        self
    }

    #[wasm_bindgen]
    pub fn letter_spacing(mut self, spacing: f32) -> Self {
        self.props.letter_spacing = Some(spacing);
        self
    }

    #[wasm_bindgen]
    pub fn word_spacing(mut self, spacing: f32) -> Self {
        self.props.word_spacing = Some(spacing);
        self
    }

    #[wasm_bindgen]
    pub fn max_lines(mut self, lines: u32) -> Self {
        self.props.max_lines = Some(lines);
        self
    }

    #[wasm_bindgen]
    pub fn truncation_mode(mut self, mode: &str) -> Self {
        self.props.truncation_mode = match mode.to_lowercase().as_str() {
            "clip" => Some(TextOverflow::Clip),
            "ellipsis" => Some(TextOverflow::Ellipsis),
            "fade" => Some(TextOverflow::Fade),
            _ => Some(TextOverflow::Ellipsis),
        };
        self
    }

    #[wasm_bindgen]
    pub fn soft_wrap(mut self, wrap: bool) -> Self {
        self.props.soft_wrap = Some(wrap);
        self
    }

    #[wasm_bindgen]
    pub fn background_color(mut self, color: &str) -> Self {
        self.props.background_color = Some(Color::from_hex(color));
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
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }

    #[wasm_bindgen]
    pub fn underline(mut self, underline: bool) -> Self {
        self.props.underline = Some(underline);
        self
    }

    #[wasm_bindgen]
    pub fn strikethrough(mut self, strikethrough: bool) -> Self {
        self.props.strikethrough = Some(strikethrough);
        self
    }

    #[wasm_bindgen]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props.clip_to_bounds = Some(clip);
        self
    }

    #[wasm_bindgen]
    pub fn accessibility_label(mut self, label: &str) -> Self {
        self.props.accessibility_label = Some(label.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn accessibility_hint(mut self, hint: &str) -> Self {
        self.props.accessibility_hint = Some(hint.to_string());
        self
    }

    #[wasm_bindgen]
    pub fn is_accessibility_element(mut self, is_element: bool) -> Self {
        self.props.is_accessibility_element = Some(is_element);
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
    pub fn to_json(&self) -> String {
        serde_json::to_string(&UIComponent::Text(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}

// Factory methods for common text patterns
#[wasm_bindgen]
pub fn create_heading(content: &str, level: u8) -> Text {
    let mut text = Text::new(content);
    
    match level {
        1 => text = text.font_style("largeTitle").font_weight("bold"),
        2 => text = text.font_style("title1").font_weight("bold"),
        3 => text = text.font_style("title2").font_weight("semibold"),
        4 => text = text.font_style("title3").font_weight("semibold"),
        5 => text = text.font_style("headline").font_weight("medium"),
        6 => text = text.font_style("subheadline").font_weight("medium"),
        _ => text = text.font_style("headline").font_weight("bold"),
    }
    
    text
}

#[wasm_bindgen]
pub fn create_paragraph(content: &str) -> Text {
    Text::new(content)
        .font_style("body")
        .line_height(1.5)
        .soft_wrap(true)
}

#[wasm_bindgen]
pub fn create_caption(content: &str) -> Text {
    Text::new(content)
        .font_style("caption")
        .color("#666666")
        .font_size(12.0)
}

#[wasm_bindgen]
pub fn create_code_block(content: &str) -> Text {
    Text::new(content)
        .font_style("code")
        .font_family("monospace")
        .background_color("#f5f5f5")
        .padding(8.0)
        .border(1.0, "#e0e0e0", 4.0)
}