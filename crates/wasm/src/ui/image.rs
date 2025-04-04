use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{ImageProps, UIComponent, ImageSource, ResizeMode, ContentMode, ImageFilter};

#[wasm_bindgen]
pub struct ImageBuilder {
    source: ImageSource,
    alt: Option<String>,
    width: Option<f32>,
    height: Option<f32>,
    aspect_ratio: Option<f32>,
    resize_mode: Option<ResizeMode>,
    content_mode: Option<ContentMode>,
    corner_radius: Option<f32>,
    border_width: Option<f32>,
    border_color: Option<String>,
    shadow_radius: Option<f32>,
    shadow_color: Option<String>,
    shadow_offset: Option<(f32, f32)>,
    tint_color: Option<String>,
    filters: Option<Vec<ImageFilter>>,
    opacity: Option<f32>,
    blur_radius: Option<f32>,
    loading_placeholder: Option<String>,
    error_placeholder: Option<String>,
    clip_to_bounds: Option<bool>,
    preserve_aspect_ratio: Option<bool>,
    animation_duration: Option<f32>,
    is_animating: Option<bool>,
    cache_policy: Option<String>,
}

#[wasm_bindgen]
impl ImageBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(src: &str) -> Self {
        Self {
            source: ImageSource::Remote(src.to_string()),
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

    #[wasm_bindgen(method)]
    pub fn from_asset(mut self, path: &str) -> Self {
        self.source = ImageSource::Asset(path.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn alt(mut self, alt_text: &str) -> Self {
        self.alt = Some(alt_text.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn width(mut self, width: f32) -> Self {
        self.width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn height(mut self, height: f32) -> Self {
        self.height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn aspect_ratio(mut self, ratio: f32) -> Self {
        self.aspect_ratio = Some(ratio);
        self
    }

    #[wasm_bindgen(method)]
    pub fn resize_mode(mut self, mode: &str) -> Self {
        self.resize_mode = match mode {
            "fill" => Some(ResizeMode::Fill),
            "fit" => Some(ResizeMode::Fit),
            "cover" => Some(ResizeMode::Cover),
            "contain" => Some(ResizeMode::Contain),
            "none" => Some(ResizeMode::None),
            _ => Some(ResizeMode::Fit),
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn content_mode(mut self, mode: &str) -> Self {
        self.content_mode = match mode {
            "scaleToFill" => Some(ContentMode::ScaleToFill),
            "scaleAspectFit" => Some(ContentMode::ScaleAspectFit),
            "scaleAspectFill" => Some(ContentMode::ScaleAspectFill),
            "center" => Some(ContentMode::Center),
            "top" => Some(ContentMode::Top),
            "bottom" => Some(ContentMode::Bottom),
            "left" => Some(ContentMode::Left),
            "right" => Some(ContentMode::Right),
            "topLeft" => Some(ContentMode::TopLeft),
            "topRight" => Some(ContentMode::TopRight),
            "bottomLeft" => Some(ContentMode::BottomLeft),
            "bottomRight" => Some(ContentMode::BottomRight),
            _ => Some(ContentMode::ScaleAspectFit),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.corner_radius = Some(radius);
        self
    }

    #[wasm_bindgen(method)]
    pub fn border_width(mut self, width: f32) -> Self {
        self.border_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn border_color(mut self, color: &str) -> Self {
        self.border_color = Some(color.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color: &str, offset_x: f32, offset_y: f32) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color.to_string());
        self.shadow_offset = Some((offset_x, offset_y));
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn tint_color(mut self, color: &str) -> Self {
        self.tint_color = Some(color.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_blur_filter(mut self, radius: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Blur(radius));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_grayscale_filter(mut self, intensity: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Grayscale(intensity));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_sepia_filter(mut self, intensity: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Sepia(intensity));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_saturation_filter(mut self, value: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Saturation(value));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_brightness_filter(mut self, value: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Brightness(value));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_contrast_filter(mut self, value: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Contrast(value));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_hue_filter(mut self, value: f32) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Hue(value));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn add_invert_filter(mut self, enabled: bool) -> Self {
        if self.filters.is_none() {
            self.filters = Some(Vec::new());
        }
        
        if let Some(ref mut filters) = self.filters {
            filters.push(ImageFilter::Invert(enabled));
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn opacity(mut self, value: f32) -> Self {
        self.opacity = Some(value);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn blur_radius(mut self, radius: f32) -> Self {
        self.blur_radius = Some(radius);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn loading_placeholder(mut self, src: &str) -> Self {
        self.loading_placeholder = Some(src.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn error_placeholder(mut self, src: &str) -> Self {
        self.error_placeholder = Some(src.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.clip_to_bounds = Some(clip);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn preserve_aspect_ratio(mut self, preserve: bool) -> Self {
        self.preserve_aspect_ratio = Some(preserve);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn animation(mut self, duration: f32, is_animating: bool) -> Self {
        self.animation_duration = Some(duration);
        self.is_animating = Some(is_animating);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn cache_policy(mut self, policy: &str) -> Self {
        self.cache_policy = Some(policy.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let mut props = ImageProps::new(self.source.clone());
        
        if let Some(alt) = &self.alt {
            props = props.with_alt(alt.clone());
        }
        
        if let Some(width) = self.width {
            props = props.with_width(width);
        }
        
        if let Some(height) = self.height {
            props = props.with_height(height);
        }
        
        if let Some(ratio) = self.aspect_ratio {
            props = props.with_aspect_ratio(ratio);
        }
        
        if let Some(mode) = &self.resize_mode {
            props = props.with_resize_mode(mode.clone());
        }
        
        if let Some(mode) = &self.content_mode {
            props = props.with_content_mode(mode.clone());
        }
        
        if let Some(radius) = self.corner_radius {
            props = props.with_corner_radius(radius);
        }
        
        if let Some(width) = self.border_width {
            if let Some(color) = &self.border_color {
                props = props.with_border(width, color.clone());
            }
        }
        
        if let Some(radius) = self.shadow_radius {
            if let Some(color) = &self.shadow_color {
                if let Some(offset) = self.shadow_offset {
                    props = props.with_shadow(radius, color.clone(), offset);
                }
            }
        }
        
        if let Some(color) = &self.tint_color {
            props = props.with_tint_color(color.clone());
        }
        
        if let Some(filters) = &self.filters {
            for filter in filters {
                props = props.with_filter(filter.clone());
            }
        }
        
        if let Some(opacity) = self.opacity {
            props = props.with_opacity(opacity);
        }
        
        if let Some(radius) = self.blur_radius {
            props = props.with_blur(radius);
        }
        
        if let Some(loading) = &self.loading_placeholder {
            if let Some(error) = &self.error_placeholder {
                props = props.with_placeholders(loading.clone(), error.clone());
            }
        }
        if let Some(clip) = self.clip_to_bounds {
            props = props.with_clip_to_bounds(clip);
        }
        
        if let Some(preserve) = self.preserve_aspect_ratio {
            props = props.with_preserve_aspect_ratio(preserve);
        }
        
        if let Some(duration) = self.animation_duration {
            if let Some(is_animating) = self.is_animating {
                props = props.with_animation(duration, is_animating);
            }
        }
        
        if let Some(policy) = &self.cache_policy {
            props = props.with_cache_policy(policy.clone());
        }

        let component = UIComponent::Image(props);

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}