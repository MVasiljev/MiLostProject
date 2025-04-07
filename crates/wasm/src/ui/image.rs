use wasm_bindgen::prelude::*;
use serde_wasm_bindgen::to_value;
use crate::shared::{
    color::Color,
    styles::BorderStyle,
    edge_insets::EdgeInsets,
};
use crate::components::image::{
    ImageProps, ImageSource, ResizeMode, ContentMode, ImageFilter
};
use crate::components::UIComponent;

#[wasm_bindgen]
pub struct ImageBuilder {
    props: ImageProps,
}

#[wasm_bindgen]
impl ImageBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(url: &str) -> Self {
        Self {
            props: ImageProps::new(ImageSource::Remote(url.to_string())),
        }
    }

    #[wasm_bindgen(method)]
    pub fn from_asset(mut self, path: &str) -> Self {
        self.props.source = ImageSource::Asset(path.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn alt(mut self, alt_text: &str) -> Self {
        self.props = self.props.with_alt(alt_text.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn dimensions(mut self, width: Option<f32>, height: Option<f32>) -> Self {
        if let Some(w) = width {
            self.props = self.props.with_width(w);
        }
        
        if let Some(h) = height {
            self.props = self.props.with_height(h);
        }
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn aspect_ratio(mut self, ratio: f32) -> Self {
        self.props = self.props.with_aspect_ratio(ratio);
        self
    }

    #[wasm_bindgen(method)]
    pub fn resize_mode(mut self, mode_str: &str) -> Self {
        let mode = match mode_str.to_lowercase().as_str() {
            "fill" => ResizeMode::Fill,
            "fit" => ResizeMode::Fit,
            "cover" => ResizeMode::Cover,
            "contain" => ResizeMode::Contain,
            "none" => ResizeMode::None,
            _ => ResizeMode::Fit,
        };
        
        self.props = self.props.with_resize_mode(mode);
        self
    }

    #[wasm_bindgen(method)]
    pub fn content_mode(mut self, mode_str: &str) -> Self {
        let mode = match mode_str.to_lowercase().as_str() {
            "scaletofill" => ContentMode::ScaleToFill,
            "scaleaspectfit" => ContentMode::ScaleAspectFit,
            "scaleaspectfill" => ContentMode::ScaleAspectFill,
            "center" => ContentMode::Center,
            "top" => ContentMode::Top,
            "bottom" => ContentMode::Bottom,
            "left" => ContentMode::Left,
            "right" => ContentMode::Right,
            "topleft" => ContentMode::TopLeft,
            "topright" => ContentMode::TopRight,
            "bottomleft" => ContentMode::BottomLeft,
            "bottomright" => ContentMode::BottomRight,
            _ => ContentMode::ScaleAspectFit,
        };
        
        self.props = self.props.with_content_mode(mode);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background_color(mut self, color_str: &str) -> Self {
        if let Some(color) = Color::from_hex(color_str).ok() {
            self.props.background_color = Some(color);
        }
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn opacity(mut self, value: f32) -> Self {
        self.props = self.props.with_opacity(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn tint_color(mut self, color_str: &str) -> Self {
        if let Some(color) = Color::from_hex(color_str).ok() {
            self.props = self.props.with_tint_color(color);
        }
        
        self
    }

    // Border and corner styling
    #[wasm_bindgen(method)]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.props = self.props.with_corner_radius(radius);
        self
    }

    #[wasm_bindgen(method)]
    pub fn border(mut self, width: f32, color_str: &str, style_str: Option<String>) -> Self {
        let color = Color::from_hex(color_str).unwrap_or(Color::Black);
        
        let style = if let Some(s) = style_str {
            match s.to_lowercase().as_str() {
                "solid" => Some(BorderStyle::Solid),
                "dashed" => Some(BorderStyle::Dashed),
                "dotted" => Some(BorderStyle::Dotted),
                "none" => Some(BorderStyle::None),
                _ => None,
            }
        } else {
            None
        };
        
        self.props = self.props.with_border(width, color, style);
        self
    }

    // Shadow effects
    #[wasm_bindgen(method)]
    pub fn shadow(mut self, radius: f32, color_str: &str, offset_x: f32, offset_y: f32) -> Self {
        let color = Color::from_hex(color_str).unwrap_or(Color::Black);
        self.props = self.props.with_shadow(radius, color, Some((offset_x, offset_y)));
        self
    }

    // Filters
    #[wasm_bindgen(method)]
    pub fn blur_filter(mut self, radius: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Blur(radius));
        self
    }

    #[wasm_bindgen(method)]
    pub fn grayscale_filter(mut self, intensity: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Grayscale(intensity));
        self
    }

    #[wasm_bindgen(method)]
    pub fn sepia_filter(mut self, intensity: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Sepia(intensity));
        self
    }

    #[wasm_bindgen(method)]
    pub fn saturation_filter(mut self, value: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Saturation(value));
        self
    }

    #[wasm_bindgen(method)]
    pub fn brightness_filter(mut self, value: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Brightness(value));
        self
    }

    #[wasm_bindgen(method)]
    pub fn contrast_filter(mut self, value: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Contrast(value));
        self
    }

    #[wasm_bindgen(method)]
    pub fn hue_filter(mut self, value: f32) -> Self {
        self.props = self.props.with_filter(ImageFilter::Hue(value));
        self
    }

    #[wasm_bindgen(method)]
    pub fn invert_filter(mut self, enabled: bool) -> Self {
        self.props = self.props.with_filter(ImageFilter::Invert(enabled));
        self
    }

    #[wasm_bindgen(method)]
    pub fn blur_radius(mut self, radius: f32) -> Self {
        self.props = self.props.with_blur(radius);
        self
    }

    // Loading and error states
    #[wasm_bindgen(method)]
    pub fn loading_placeholder(mut self, url: &str) -> Self {
        self.props.loading_placeholder = Some(url.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn error_placeholder(mut self, url: &str) -> Self {
        self.props.error_placeholder = Some(url.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn loading_state(mut self, is_loading: bool) -> Self {
        self.props = self.props.with_loading_state(is_loading);
        self
    }

    #[wasm_bindgen(method)]
    pub fn error_state(mut self, has_error: bool) -> Self {
        self.props = self.props.with_error_state(has_error);
        self
    }

    // Layout properties
    #[wasm_bindgen(method)]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props = self.props.with_clip_to_bounds(clip);
        self
    }

    #[wasm_bindgen(method)]
    pub fn preserve_aspect_ratio(mut self, preserve: bool) -> Self {
        self.props = self.props.with_preserve_aspect_ratio(preserve);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props = self.props.with_padding(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props = self.props.with_edge_insets(EdgeInsets::new(top, right, bottom, left));
        self
    }

    // Animation
    #[wasm_bindgen(method)]
    pub fn animation(mut self, duration: f32, is_animating: bool) -> Self {
        self.props = self.props.with_animation(duration, is_animating);
        self
    }

    // Accessibility
    #[wasm_bindgen(method)]
    pub fn accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.props = self.props.with_accessibility(label, hint, is_element);
        self
    }

    // Building
    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Image(self.props.clone());
        
        to_value(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

// Factory methods for common image patterns
#[wasm_bindgen]
pub fn create_avatar_image(url: &str, size: f32) -> Result<JsValue, JsValue> {
    ImageBuilder::new(url)
        .dimensions(Some(size), Some(size))
        .corner_radius(size / 2.0)
        .clip_to_bounds(true)
        .resize_mode("cover")
        .build()
}

#[wasm_bindgen]
pub fn create_thumbnail_image(url: &str, width: f32, height: f32) -> Result<JsValue, JsValue> {
    ImageBuilder::new(url)
        .dimensions(Some(width), Some(height))
        .corner_radius(4.0)
        .resize_mode("cover")
        .build()
}

#[wasm_bindgen]
pub fn create_banner_image(url: &str) -> Result<JsValue, JsValue> {
    ImageBuilder::new(url)
        .resize_mode("cover")
        .content_mode("scaleAspectFill")
        .aspect_ratio(3.0)
        .build()
}