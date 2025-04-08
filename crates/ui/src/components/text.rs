use serde::{Serialize, Deserialize};
use crate::shared::styles::{TextAlign, TextTransform, BorderStyle, ShadowEffect};
use crate::shared::font::{FontWeight, FontSlant, FontWidth};
use crate::shared::edge_insets::EdgeInsets;

use super::{Color, FontStyle};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum TextDecoration {
    None,
    Underline,
    Overline,
    LineThrough,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum TextOverflow {
    Clip,
    Ellipsis,
    Fade,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct TextShadow {
    pub color: Color,
    pub offset_x: f32,
    pub offset_y: f32,
    pub blur_radius: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TextProps {
    pub content: String,
    pub font_style: Option<FontStyle>,
    pub color: Option<Color>,
    
    pub font_size: Option<f32>,
    pub font_family: Option<String>,
    pub font_weight: Option<FontWeight>,
    pub font_slant: Option<FontSlant>,
    pub font_width: Option<FontWidth>,
    pub line_height: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub word_spacing: Option<f32>,
    
    pub italic: Option<bool>,
    pub text_align: Option<TextAlign>,
    pub text_decoration: Option<TextDecoration>,
    pub decoration_color: Option<Color>,
    pub decoration_style: Option<String>,
    pub decoration_thickness: Option<f32>,
    
    pub text_transform: Option<TextTransform>,
    
    pub max_lines: Option<u32>,
    pub min_font_size: Option<f32>,
    pub max_font_size: Option<f32>,
    pub truncation_mode: Option<TextOverflow>,
    pub soft_wrap: Option<bool>,
    
    pub background_color: Option<Color>,
    pub shadow: Option<TextShadow>,
    pub opacity: Option<f32>,
    
    pub semantic_label: Option<String>,
    pub exclude_from_semantics: Option<bool>,
    
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
    pub fixed_size: Option<bool>,
    pub selectable: Option<bool>,
    
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,
    
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
    pub shadow_effect: Option<ShadowEffect>,
    
    pub locale: Option<String>,
    pub text_direction: Option<String>,
    pub text_scaling_factor: Option<f32>,
    pub underline: Option<bool>,
    pub strikethrough: Option<bool>,
    
    pub clip_to_bounds: Option<bool>,
    pub accessibility_label: Option<String>,
    pub accessibility_hint: Option<String>,
    pub is_accessibility_element: Option<bool>,
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
            font_slant: None,
            font_width: None,
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
            edge_insets: None,
            width: None,
            height: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,
            fixed_size: None,
            selectable: None,
            border_width: None,
            border_color: None,
            border_radius: None,
            border_style: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset: None,
            shadow_effect: None,
            locale: None,
            text_direction: None,
            text_scaling_factor: None,
            underline: None,
            strikethrough: None,
            clip_to_bounds: None,
            accessibility_label: None,
            accessibility_hint: None,
            is_accessibility_element: None,
        }
    }
}

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
    
    pub fn with_font_slant(mut self, slant: FontSlant) -> Self {
        self.font_slant = Some(slant);
        self
    }
    
    pub fn with_font_width(mut self, width: FontWidth) -> Self {
        self.font_width = Some(width);
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
    
    pub fn with_edge_insets(mut self, insets: EdgeInsets) -> Self {
        self.edge_insets = Some(insets);
        self
    }
    
    pub fn with_dimensions(mut self, width: f32, height: f32) -> Self {
        self.width = Some(width);
        self.height = Some(height);
        self
    }
    
    pub fn with_min_dimensions(mut self, width: f32, height: f32) -> Self {
        self.min_width = Some(width);
        self.min_height = Some(height);
        self
    }
    
    pub fn with_max_dimensions(mut self, width: f32, height: f32) -> Self {
        self.max_width = Some(width);
        self.max_height = Some(height);
        self
    }
    
    pub fn with_semantic_label(mut self, label: impl Into<String>) -> Self {
        self.semantic_label = Some(label.into());
        self
    }
    
    pub fn with_shadow(mut self, shadow: TextShadow) -> Self {
        self.shadow = Some(shadow);
        self
    }
    
    pub fn with_box_shadow(mut self, radius: f32, color: Color, offset: Option<(f32, f32)>) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset = offset;
        self
    }
    
    pub fn with_border(mut self, width: f32, color: Color, radius: Option<f32>, style: Option<BorderStyle>) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self.border_radius = radius;
        self.border_style = style;
        self
    }
    
    pub fn with_clip_to_bounds(mut self, clip: bool) -> Self {
        self.clip_to_bounds = Some(clip);
        self
    }
    
    pub fn with_accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.accessibility_label = label;
        self.accessibility_hint = hint;
        self.is_accessibility_element = is_element;
        self
    }
    
    pub fn with_text_decoration_options(
        mut self, 
        decoration: TextDecoration, 
        color: Option<Color>, 
        thickness: Option<f32>
    ) -> Self {
        self.text_decoration = Some(decoration);
        self.decoration_color = color;
        self.decoration_thickness = thickness;
        self
    }
    
    pub(crate) fn with_border_radius(&self, some: Option<f64>) -> TextProps {
        todo!()
    }
}