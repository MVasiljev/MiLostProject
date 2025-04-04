use serde::{Serialize, Deserialize};
use std::path::PathBuf;

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
    pub resize_mode: Option<ResizeMode>,
    pub content_mode: Option<ContentMode>,
    pub corner_radius: Option<f32>,
    pub border_width: Option<f32>,
    pub border_color: Option<String>,
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<String>,
    pub shadow_offset: Option<(f32, f32)>,
    pub tint_color: Option<String>,
    pub filters: Option<Vec<ImageFilter>>,
    pub opacity: Option<f32>,
    pub blur_radius: Option<f32>,
    pub loading_placeholder: Option<String>,
    pub error_placeholder: Option<String>,
    pub clip_to_bounds: Option<bool>,
    pub preserve_aspect_ratio: Option<bool>,
    pub animation_duration: Option<f32>,
    pub is_animating: Option<bool>,
    pub cache_policy: Option<String>,
}

impl ImageProps {
    pub fn new(source: ImageSource) -> Self {
        Self {
            source,
            alt: None,
            width: None,
            height: None,
            aspect_ratio: None,
            resize_mode: None,
            content_mode: None,
            corner_radius: None,
            border_width: None,
            border_color: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset: None,
            tint_color: None,
            filters: None,
            opacity: None,
            blur_radius: None,
            loading_placeholder: None,
            error_placeholder: None,
            clip_to_bounds: None,
            preserve_aspect_ratio: None,
            animation_duration: None,
            is_animating: None,
            cache_policy: None,
        }
    }

    pub fn with_alt(mut self, alt: String) -> Self {
        self.alt = Some(alt);
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

    pub fn with_resize_mode(mut self, mode: ResizeMode) -> Self {
        self.resize_mode = Some(mode);
        self
    }
    
    pub fn with_content_mode(mut self, mode: ContentMode) -> Self {
        self.content_mode = Some(mode);
        self
    }

    pub fn with_corner_radius(mut self, radius: f32) -> Self {
        self.corner_radius = Some(radius);
        self
    }

    pub fn with_border(mut self, width: f32, color: String) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self
    }

    pub fn with_shadow(mut self, radius: f32, color: String, offset: (f32, f32)) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset = Some(offset);
        self
    }

    pub fn with_tint_color(mut self, color: String) -> Self {
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

    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity);
        self
    }

    pub fn with_blur(mut self, radius: f32) -> Self {
        self.blur_radius = Some(radius);
        self
    }

    pub fn with_placeholders(mut self, loading: String, error: String) -> Self {
        self.loading_placeholder = Some(loading);
        self.error_placeholder = Some(error);
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

    pub fn with_animation(mut self, duration: f32, is_animating: bool) -> Self {
        self.animation_duration = Some(duration);
        self.is_animating = Some(is_animating);
        self
    }

    pub fn with_cache_policy(mut self, policy: String) -> Self {
        self.cache_policy = Some(policy);
        self
    }

    pub fn get_resize_mode(&self) -> ResizeMode {
        self.resize_mode.clone().unwrap_or_default()
    }
    
    pub fn get_content_mode(&self) -> ContentMode {
        self.content_mode.clone().unwrap_or_default()
    }
}