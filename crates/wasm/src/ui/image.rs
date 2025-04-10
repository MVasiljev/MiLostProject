use wasm_bindgen::prelude::*;
use milost_ui::{
    components::image::{ContentMode, ImageFilter, ImageProps, ImageSource, ResizeMode}, shared::{color::Color, edge_insets::EdgeInsets}, BorderStyle, UIComponent
};

#[wasm_bindgen]
pub struct Image {
    props: ImageProps,
}

#[wasm_bindgen]
impl Image {
    #[wasm_bindgen(constructor)]
    pub fn new(url: &str) -> Self {
        Self {
            props: ImageProps::new(ImageSource::Remote(url.to_string())),
        }
    }

    #[wasm_bindgen]
    pub fn from_asset(mut self, path: &str) -> Self {
        self.props.source = ImageSource::Asset(path.to_string());
        self
    }
    
    #[wasm_bindgen]
    pub fn alt(mut self, alt_text: &str) -> Self {
        self.props.alt = Some(alt_text.to_string());
        self
    }
    
    // Dimensions and aspect
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
    pub fn aspect_ratio(mut self, ratio: f32) -> Self {
        self.props.aspect_ratio = Some(ratio);
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
    
    // Display mode
    #[wasm_bindgen]
    pub fn resize_mode(mut self, mode: &str) -> Self {
        self.props.resize_mode = Some(match mode.to_lowercase().as_str() {
            "fill" => ResizeMode::Fill,
            "fit" => ResizeMode::Fit,
            "cover" => ResizeMode::Cover,
            "contain" => ResizeMode::Contain,
            "none" => ResizeMode::None,
            _ => ResizeMode::Fit,
        });
        self
    }
    
    #[wasm_bindgen]
    pub fn content_mode(mut self, mode: &str) -> Self {
        self.props.content_mode = Some(match mode.to_lowercase().as_str() {
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
        });
        self
    }
    
    // Appearance
    #[wasm_bindgen]
    pub fn background_color(mut self, color: &str) -> Self {
        self.props.background_color = parse_color(color);
        self
    }
    
    #[wasm_bindgen]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }
    
    #[wasm_bindgen]
    pub fn tint_color(mut self, color: &str) -> Self {
        self.props.tint_color = parse_color(color);
        self
    }
    
    // Border and corner styling
    #[wasm_bindgen]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.props.corner_radius = Some(radius);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_width(mut self, width: f32) -> Self {
        self.props.border_width = Some(width);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_color(mut self, color: &str) -> Self {
        self.props.border_color = parse_color(color);
        self
    }
    
    #[wasm_bindgen]
    pub fn border_style(mut self, style: &str) -> Self {
        self.props.border_style = match style.to_lowercase().as_str() {
            "solid" => Some(BorderStyle::Solid),
            "dashed" => Some(BorderStyle::Dashed),
            "dotted" => Some(BorderStyle::Dotted),
            "none" => Some(BorderStyle::None),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen]
    pub fn border(mut self, width: f32, color: &str, style: Option<String>) -> Self {
        self.props.border_width = Some(width);
        self.props.border_color = parse_color(color);
        
        if let Some(style_str) = style {
            self.props.border_style = match style_str.to_lowercase().as_str() {
                "solid" => Some(BorderStyle::Solid),
                "dashed" => Some(BorderStyle::Dashed),
                "dotted" => Some(BorderStyle::Dotted),
                "none" => Some(BorderStyle::None),
                _ => None,
            };
        }
        
        self
    }
    
    // Shadow effects
    #[wasm_bindgen]
    pub fn shadow_radius(mut self, radius: f32) -> Self {
        self.props.shadow_radius = Some(radius);
        self
    }
    
    #[wasm_bindgen]
    pub fn shadow_color(mut self, color: &str) -> Self {
        self.props.shadow_color = parse_color(color);
        self
    }
    
    #[wasm_bindgen]
    pub fn shadow_offset(mut self, offset_x: f32, offset_y: f32) -> Self {
        self.props.shadow_offset = Some((offset_x, offset_y));
        self
    }
    
    #[wasm_bindgen]
    pub fn shadow(mut self, radius: f32, color: &str, offset_x: f32, offset_y: f32) -> Self {
        self.props.shadow_radius = Some(radius);
        self.props.shadow_color = parse_color(color);
        self.props.shadow_offset = Some((offset_x, offset_y));
        self
    }
    
    // Image filters
    #[wasm_bindgen]
    pub fn blur_filter(mut self, radius: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Blur(radius));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn grayscale_filter(mut self, intensity: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Grayscale(intensity));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn sepia_filter(mut self, intensity: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Sepia(intensity));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn saturation_filter(mut self, value: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Saturation(value));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn brightness_filter(mut self, value: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Brightness(value));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn contrast_filter(mut self, value: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Contrast(value));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn hue_filter(mut self, value: f32) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Hue(value));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn invert_filter(mut self, enabled: bool) -> Self {
        if self.props.filters.is_none() {
            self.props.filters = Some(Vec::new());
        }
        
        if let Some(filters) = &mut self.props.filters {
            filters.push(ImageFilter::Invert(enabled));
        }
        
        self
    }
    
    #[wasm_bindgen]
    pub fn blur_radius(mut self, radius: f32) -> Self {
        self.props.blur_radius = Some(radius);
        self
    }
    
    // Loading and error states
    #[wasm_bindgen]
    pub fn loading_placeholder(mut self, url: &str) -> Self {
        self.props.loading_placeholder = Some(url.to_string());
        self
    }
    
    #[wasm_bindgen]
    pub fn error_placeholder(mut self, url: &str) -> Self {
        self.props.error_placeholder = Some(url.to_string());
        self
    }
    
    #[wasm_bindgen]
    pub fn is_loading(mut self, loading: bool) -> Self {
        self.props.is_loading = Some(loading);
        self
    }
    
    #[wasm_bindgen]
    pub fn has_error(mut self, error: bool) -> Self {
        self.props.has_error = Some(error);
        self
    }
    
    // Layout properties
    #[wasm_bindgen]
    pub fn clip_to_bounds(mut self, clip: bool) -> Self {
        self.props.clip_to_bounds = Some(clip);
        self
    }
    
    #[wasm_bindgen]
    pub fn preserve_aspect_ratio(mut self, preserve: bool) -> Self {
        self.props.preserve_aspect_ratio = Some(preserve);
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
    
    // Animation
    #[wasm_bindgen]
    pub fn animation_duration(mut self, duration: f32) -> Self {
        self.props.animation_duration = Some(duration);
        self
    }
    
    #[wasm_bindgen]
    pub fn is_animating(mut self, animating: bool) -> Self {
        self.props.is_animating = Some(animating);
        self
    }
    
    #[wasm_bindgen]
    pub fn animation(mut self, duration: f32, animating: bool) -> Self {
        self.props.animation_duration = Some(duration);
        self.props.is_animating = Some(animating);
        self
    }
    
    // Accessibility
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
    pub fn cache_policy(mut self, policy: &str) -> Self {
        self.props.cache_policy = Some(policy.to_string());
        self
    }
    
    #[wasm_bindgen]
    pub fn to_json(&self) -> String {
        serde_json::to_string(&UIComponent::Image(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}

// Factory methods for common image patterns
#[wasm_bindgen]
pub fn create_avatar_image(url: &str, size: f32) -> Image {
    Image::new(url)
        .width(size)
        .height(size)
        .corner_radius(size / 2.0)
        .clip_to_bounds(true)
        .resize_mode("cover")
}

#[wasm_bindgen]
pub fn create_thumbnail_image(url: &str, width: f32, height: f32) -> Image {
    Image::new(url)
        .width(width)
        .height(height)
        .corner_radius(4.0)
        .resize_mode("cover")
}

#[wasm_bindgen]
pub fn create_banner_image(url: &str) -> Image {
    Image::new(url)
        .resize_mode("cover")
        .content_mode("scaleAspectFill")
        .aspect_ratio(3.0)
}

// Helper function to parse color strings
fn parse_color(color: &str) -> Option<Color> {
    match color.to_lowercase().as_str() {
        "white" => Some(Color::White),
        "black" => Some(Color::Black),
        "gray" => Some(Color::Gray),
        "lightgray" => Some(Color::LightGray),
        "darkgray" => Some(Color::DarkGray),
        "red" => Some(Color::Red),
        "green" => Some(Color::Green),
        "blue" => Some(Color::Blue),
        "yellow" => Some(Color::Yellow),
        "orange" => Some(Color::Orange),
        "purple" => Some(Color::Purple),
        "pink" => Some(Color::Pink),
        "teal" => Some(Color::Teal),
        "indigo" => Some(Color::Indigo),
        "cyan" => Some(Color::Cyan),
        "primary" => Some(Color::Primary),
        "secondary" => Some(Color::Secondary),
        "transparent" => Some(Color::Transparent),
        _ => Some(Color::from_hex(color)),
    }
}