use serde::{Serialize, Deserialize};
use crate::{Color, FontStyle};
// Import shared enum types
use crate::shared::styles::{TextAlign, TextTransform};
use crate::shared::font::{FontWeight, FontSlant, FontWidth};

/// Text decoration options
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum TextDecoration {
    None,
    Underline,
    Overline,
    LineThrough,
}

/// Text overflow behavior
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum TextOverflow {
    Clip,
    Ellipsis,
    Fade,
}

/// Defines shadow properties for text
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct TextShadow {
    pub color: Color,
    pub offset_x: f32,
    pub offset_y: f32,
    pub blur_radius: f32,
}

/// Comprehensive properties for Text component
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TextProps {
    // Basic properties
    pub content: String,
    pub font_style: Option<FontStyle>,
    pub color: Option<Color>,
    
    // Typography properties
    pub font_size: Option<f32>,
    pub font_family: Option<String>,
    pub font_weight: Option<FontWeight>,
    pub line_height: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub word_spacing: Option<f32>,
    
    // Text appearance
    pub italic: Option<bool>,
    pub text_align: Option<TextAlign>,
    pub text_decoration: Option<TextDecoration>,
    pub decoration_color: Option<Color>,
    pub decoration_style: Option<String>, // solid, dashed, dotted, etc.
    pub decoration_thickness: Option<f32>,
    
    // Text transformations
    pub text_transform: Option<TextTransform>,
    
    // Text constraints
    pub max_lines: Option<u32>,
    pub min_font_size: Option<f32>,
    pub max_font_size: Option<f32>,
    pub truncation_mode: Option<TextOverflow>,
    pub soft_wrap: Option<bool>,
    
    // Visual effects
    pub background_color: Option<Color>,
    pub shadow: Option<TextShadow>,
    pub opacity: Option<f32>,
    
    // Accessibility
    pub semantic_label: Option<String>,
    pub exclude_from_semantics: Option<bool>,
    
    // Layout
    pub padding: Option<f32>,
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub fixed_size: Option<bool>,
    pub selectable: Option<bool>,
    
    // Advanced options
    pub locale: Option<String>,
    pub text_direction: Option<String>, // ltr, rtl
    pub text_scaling_factor: Option<f32>,
    pub underline: Option<bool>,     // Legacy, use text_decoration
    pub strikethrough: Option<bool>, // Legacy, use text_decoration
}

impl Default for TextProps {
    fn default() -> Self {
        Self {
            content: String::new(),
            font_style: None,
            color: None,
            font_size: None,
            font_family: None,
            font_weight: None,
            line_height: None,
            letter_spacing: None,
            word_spacing: None,
            italic: None,
            text_align: None,
            text_decoration: None,
            decoration_color: None,
            decoration_style: None,
            decoration_thickness: None,
            text_transform: None,
            max_lines: None,
            min_font_size: None,
            max_font_size: None,
            truncation_mode: None,
            soft_wrap: None,
            background_color: None,
            shadow: None,
            opacity: None,
            semantic_label: None,
            exclude_from_semantics: None,
            padding: None,
            width: None,
            height: None,
            fixed_size: None,
            selectable: None,
            locale: None,
            text_direction: None,
            text_scaling_factor: None,
            underline: None,
            strikethrough: None,
        }
    }
}

// Builder implementation for TextProps
impl TextProps {
    pub fn new(content: impl Into<String>) -> Self {
        TextProps {
            content: content.into(),
            ..Default::default()
        }
    }
    
    pub fn with_font_style(mut self, style: FontStyle) -> Self {
        self.font_style = Some(style);
        self
    }
    
    pub fn with_color(mut self, color: Color) -> Self {
        self.color = Some(color);
        self
    }
    
    pub fn with_font_size(mut self, size: f32) -> Self {
        self.font_size = Some(size);
        self
    }
    
    pub fn with_font_family(mut self, family: impl Into<String>) -> Self {
        self.font_family = Some(family.into());
        self
    }
    
    pub fn with_font_weight(mut self, weight: FontWeight) -> Self {
        self.font_weight = Some(weight);
        self
    }
    
    pub fn with_line_height(mut self, height: f32) -> Self {
        self.line_height = Some(height);
        self
    }
    
    pub fn with_letter_spacing(mut self, spacing: f32) -> Self {
        self.letter_spacing = Some(spacing);
        self
    }
    
    pub fn with_text_align(mut self, align: TextAlign) -> Self {
        self.text_align = Some(align);
        self
    }
    
    pub fn with_max_lines(mut self, lines: u32) -> Self {
        self.max_lines = Some(lines);
        self
    }
    
    pub fn with_truncation_mode(mut self, mode: TextOverflow) -> Self {
        self.truncation_mode = Some(mode);
        self
    }
    
    pub fn with_text_transform(mut self, transform: TextTransform) -> Self {
        self.text_transform = Some(transform);
        self
    }
    
    pub fn with_text_decoration(mut self, decoration: TextDecoration) -> Self {
        self.text_decoration = Some(decoration);
        self
    }
    
    pub fn with_background_color(mut self, color: Color) -> Self {
        self.background_color = Some(color);
        self
    }
    
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity);
        self
    }
    
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    pub fn with_dimensions(mut self, width: f32, height: f32) -> Self {
        self.width = Some(width);
        self.height = Some(height);
        self
    }
    
    pub fn with_semantic_label(mut self, label: impl Into<String>) -> Self {
        self.semantic_label = Some(label.into());
        self
    }
}