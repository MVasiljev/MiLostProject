use crate::components::image::{ImageProps, ResizeMode, ContentMode, ImageFilter};
use crate::shared::styles::BorderStyle;
use crate::shared::Color;

pub struct ImageStyleOptions {
    pub resize_mode: Option<ResizeMode>,
    pub content_mode: Option<ContentMode>,
    pub tint_color: Option<Color>,
    pub filters: Option<Vec<ImageFilter>>,
    pub opacity: Option<f32>,
}

pub fn use_image_style(options: ImageStyleOptions) -> impl Fn(ImageProps) -> ImageProps {
    move |mut props: ImageProps| {
        if let Some(resize_mode) = &options.resize_mode {
            props.resize_mode = Some(resize_mode.clone());
        }
        
        if let Some(content_mode) = &options.content_mode {
            props.content_mode = Some(content_mode.clone());
        }
        
        if let Some(tint_color) = &options.tint_color {
            props.tint_color = Some(tint_color.clone());
        }
        
        if let Some(filters) = &options.filters {
            props.filters = Some(filters.clone());
        }
        
        if let Some(opacity) = options.opacity {
            props.opacity = Some(opacity);
        }
        
        props
    }
}

pub struct ImageBorderOptions {
    pub width: Option<f32>,
    pub color: Option<Color>,
    pub radius: Option<f32>,
    pub style: Option<BorderStyle>,
}

pub fn use_image_border(options: ImageBorderOptions) -> impl Fn(ImageProps) -> ImageProps {
    move |mut props: ImageProps| {
        if let Some(width) = options.width {
            props.border_width = Some(width);
        }
        
        if let Some(color) = &options.color {
            props.border_color = Some(color.clone());
        }
        
        if let Some(radius) = options.radius {
            props.corner_radius = Some(radius);
        }
        
        if let Some(style) = &options.style {
            props.border_style = Some(style.clone());
        }
        
        props
    }
}

pub struct ImageLoadingOptions {
    pub placeholder: Option<String>,
    pub error_placeholder: Option<String>,
}

pub fn use_image_loading(options: ImageLoadingOptions) -> impl Fn(ImageProps) -> ImageProps {
    move |mut props: ImageProps| {
        if let Some(placeholder) = &options.placeholder {
            props.loading_placeholder = Some(placeholder.clone());
        }
        
        if let Some(error_placeholder) = &options.error_placeholder {
            props.error_placeholder = Some(error_placeholder.clone());
        }
        
        props
    }
}

pub struct ImageEffectsOptions {
    pub blur_radius: Option<f32>,
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
}

pub fn use_image_effects(options: ImageEffectsOptions) -> impl Fn(ImageProps) -> ImageProps {
    move |mut props: ImageProps| {
        if let Some(blur_radius) = options.blur_radius {
            props.blur_radius = Some(blur_radius);
        }
        
        if let Some(shadow_radius) = options.shadow_radius {
            props.shadow_radius = Some(shadow_radius);
        }
        
        if let Some(shadow_color) = &options.shadow_color {
            props.shadow_color = Some(shadow_color.clone());
        }
        
        if let Some(shadow_offset) = options.shadow_offset {
            props.shadow_offset = Some(shadow_offset);
        }
        
        props
    }
}

pub fn use_avatar_image() -> impl Fn(ImageProps) -> ImageProps {
    |mut props: ImageProps| {
        props.resize_mode = Some(ResizeMode::Fill);
        props.content_mode = Some(ContentMode::ScaleAspectFill);
        props.corner_radius = Some(100.0);
        props
    }
}

pub fn use_blurred_background() -> impl Fn(ImageProps) -> ImageProps {
    |mut props: ImageProps| {
        props.resize_mode = Some(ResizeMode::Fill);
        props.filters = Some(vec![ImageFilter::Blur(10.0)]);
        props.opacity = Some(0.8);
        props
    }
}

pub fn use_rounded_image() -> impl Fn(ImageProps) -> ImageProps {
    |mut props: ImageProps| {
        props.corner_radius = Some(16.0);
        props.border_width = Some(1.0);
        props.border_color = Some(Color::LightGray);
        props
    }
}