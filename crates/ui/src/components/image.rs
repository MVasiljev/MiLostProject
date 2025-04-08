use serde::{Serialize, Deserialize};
use crate::shared::styles::{BorderStyle, ShadowEffect};
use crate::shared::edge_insets::EdgeInsets;

use super::Color;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ImageSource {
    Remote(String),
    Asset(String),
    Memory(Vec<u8>),
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ResizeMode {
    Fill,
    Fit,
    Cover,
    Contain,
    None,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ContentMode {
    ScaleToFill,
    ScaleAspectFit,
    ScaleAspectFill,
    Center,
    Top,
    Bottom,
    Left,
    Right,
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
}

impl Default for ResizeMode {
    fn default() -> Self {
        ResizeMode::Fit
    }
}

impl Default for ContentMode {
    fn default() -> Self {
        ContentMode::ScaleAspectFit
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ImageFilter {
    Blur(f32),
    Grayscale(f32),
    Sepia(f32),
    Saturation(f32),
    Brightness(f32),
    Contrast(f32),
    Hue(f32),
    Invert(bool),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageProps {
    pub source: ImageSource,
    pub alt: Option<String>,
    
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub aspect_ratio: Option<f32>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
    
    pub resize_mode: Option<ResizeMode>,
    pub content_mode: Option<ContentMode>,
    pub background_color: Option<Color>,
    pub opacity: Option<f32>,
    pub tint_color: Option<Color>,
    pub filters: Option<Vec<ImageFilter>>,
    pub blur_radius: Option<f32>,
    
    pub corner_radius: Option<f32>,
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_style: Option<BorderStyle>,
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
    pub shadow_effect: Option<ShadowEffect>,
    
    pub loading_placeholder: Option<String>,
    pub error_placeholder: Option<String>,
    pub is_loading: Option<bool>,
    pub has_error: Option<bool>,
    
    pub clip_to_bounds: Option<bool>,
    pub preserve_aspect_ratio: Option<bool>,
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    
    pub animation_duration: Option<f32>,
    pub is_animating: Option<bool>,
    
    pub accessibility_label: Option<String>,
    pub accessibility_hint: Option<String>,
    pub is_accessibility_element: Option<bool>,
    
    pub cache_policy: Option<String>,
}

impl Default for ImageProps {
    fn default() -> Self {
        Self {
            source: ImageSource::Remote(String::new()),
            alt: None,
            width: None,
            height: None,
            aspect_ratio: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,
            resize_mode: Some(ResizeMode::default()),
            content_mode: Some(ContentMode::default()),
            background_color: None,
            opacity: None,
            tint_color: None,
            filters: None,
            blur_radius: None,
            corner_radius: None,
            border_width: None,
            border_color: None,
            border_style: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset: None,
            shadow_effect: None,
            loading_placeholder: None,
            error_placeholder: None,
            is_loading: None,
            has_error: None,
            clip_to_bounds: None,
            preserve_aspect_ratio: None,
            padding: None,
            edge_insets: None,
            animation_duration: None,
            is_animating: None,
            accessibility_label: None,
            accessibility_hint: None,
            is_accessibility_element: None,
            cache_policy: None,
        }
    }
}

impl ImageProps {
    pub fn new(source: ImageSource) -> Self {
        Self {
            source,
            ..Default::default()
        }
    }

    pub fn with_alt(mut self, alt: impl Into<String>) -> Self {
        self.alt = Some(alt.into());
        self
    }
    
    pub fn with_dimensions(mut self, width: f32, height: f32) -> Self {
        self.width = Some(width);
        self.height = Some(height);
        self
    }
    
    pub fn with_width(mut self, width: f32) -> Self {
        self.width = Some(width);
        self
    }
    
    pub fn with_height(mut self, height: f32) -> Self {
        self.height = Some(height);
        self
    }
    
    pub fn with_aspect_ratio(mut self, ratio: f32) -> Self {
        self.aspect_ratio = Some(ratio);
        self
    }
    
    pub fn with_min_dimensions(mut self, min_width: f32, min_height: f32) -> Self {
        self.min_width = Some(min_width);
        self.min_height = Some(min_height);
        self
    }
    
    pub fn with_max_dimensions(mut self, max_width: f32, max_height: f32) -> Self {
        self.max_width = Some(max_width);
        self.max_height = Some(max_height);
        self
    }
    
    pub fn with_resize_mode(mut self, mode: ResizeMode) -> Self {
        self.resize_mode = Some(mode);
        self
    }
    
    pub fn with_content_mode(mut self, mode: ContentMode) -> Self {
        self.content_mode = Some(mode);
        self
    }
    
    pub fn with_background_color(mut self, color: Color) -> Self {
        self.background_color = Some(color);
        self
    }
    
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }
    
    pub fn with_corner_radius(mut self, radius: f32) -> Self {
        self.corner_radius = Some(radius);
        self
    }
    
    pub fn with_border(mut self, width: f32, color: Color, style: Option<BorderStyle>) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self.border_style = style;
        self
    }
    
    pub fn with_shadow(mut self, radius: f32, color: Color, offset: Option<(f32, f32)>) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset = offset;
        self
    }
    
    pub fn with_tint_color(mut self, color: Color) -> Self {
        self.tint_color = Some(color);
        self
    }
    
    pub fn with_filter(mut self, filter: ImageFilter) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(filter);
        }
        
        self
    }
    
    pub fn with_filters(mut self, filters: Vec<ImageFilter>) -> Self {
        self.filters = Some(filters);
        self
    }
    
    pub fn with_blur(mut self, radius: f32) -> Self {
        self.blur_radius = Some(radius);
        self
    }
    
    pub fn with_loading_state(mut self, is_loading: bool) -> Self {
        self.is_loading = Some(is_loading);
        self
    }
    
    pub fn with_error_state(mut self, has_error: bool) -> Self {
        self.has_error = Some(has_error);
        self
    }
    
    pub fn with_placeholders(mut self, loading: Option<String>, error: Option<String>) -> Self {
        self.loading_placeholder = loading;
        self.error_placeholder = error;
        self
    }
    
    pub fn with_clip_to_bounds(mut self, clip: bool) -> Self {
        self.clip_to_bounds = Some(clip);
        self
    }
    
    pub fn with_preserve_aspect_ratio(mut self, preserve: bool) -> Self {
        self.preserve_aspect_ratio = Some(preserve);
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
    
    pub fn with_animation(mut self, duration: f32, is_animating: bool) -> Self {
        self.animation_duration = Some(duration);
        self.is_animating = Some(is_animating);
        self
    }
    
    pub fn with_accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.accessibility_label = label;
        self.accessibility_hint = hint;
        self.is_accessibility_element = is_element;
        self
    }
    
    pub fn with_cache_policy(mut self, policy: impl Into<String>) -> Self {
        self.cache_policy = Some(policy.into());
        self
    }
}