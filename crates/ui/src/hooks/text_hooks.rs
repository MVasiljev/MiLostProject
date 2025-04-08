use crate::{components::{text::{self, TextDecoration, TextOverflow}, TextProps}, shared::{BorderStyle, Color, EdgeInsets, FontSlant, FontWeight, TextAlign, TextTransform}};

pub struct TextStyleOptions {
    pub font_size: Option<f32>,
    pub font_family: Option<String>,
    pub font_weight: Option<FontWeight>,
    pub color: Option<Color>,
    pub italic: Option<bool>,
    pub line_height: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub text_align: Option<TextAlign>,
    pub text_transform: Option<TextTransform>,
}

pub fn use_text_style(options: TextStyleOptions) -> impl Fn(TextProps) -> TextProps {
    move |props: TextProps| {
        let mut updated = props;
        
        if let Some(font_size) = options.font_size {
            updated = updated.with_font_size(font_size);
        }
        
        if let Some(font_family) = &options.font_family {
            updated = updated.with_font_family(font_family.clone());
        }
        
        if let Some(font_weight) = &options.font_weight {
            updated = updated.with_font_weight(font_weight.clone());
        }
        
        if let Some(color) = &options.color {
            updated = updated.with_color(color.clone());
        }
        
        if let Some(italic) = options.italic {
            updated = updated.with_font_slant(
                if italic { FontSlant::Italic } else { FontSlant::Normal }
            );
        }
        
        if let Some(line_height) = options.line_height {
            updated = updated.with_line_height(line_height);
        }
        
        if let Some(letter_spacing) = options.letter_spacing {
            updated = updated.with_letter_spacing(letter_spacing);
        }
        
        if let Some(text_align) = &options.text_align {
            updated = updated.with_text_align(text_align.clone());
        }
        
        if let Some(text_transform) = &options.text_transform {
            updated = updated.with_text_transform(text_transform.clone());
        }
        
        updated
    }
}

pub struct TextDecorationOptions {
    pub decoration_type: TextDecoration,
    pub color: Option<Color>,
    pub thickness: Option<f32>,
}

pub fn use_text_decoration(options: TextDecorationOptions) -> impl Fn(TextProps) -> TextProps {
    move |props: TextProps| {
        props.with_text_decoration_options(
            options.decoration_type.clone(),
            options.color.clone(),
            options.thickness,
        )
    }
}

pub struct TextContainerOptions {
    pub background_color: Option<Color>,
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
}

pub fn use_text_container(options: TextContainerOptions) -> impl Fn(TextProps) -> TextProps {
    move |props: TextProps| {
        let mut updated = props;
        
        if let Some(background_color) = &options.background_color {
            updated = updated.with_background_color(background_color.clone());
        }
        
        if let Some(padding) = options.padding {
            updated = updated.with_padding(padding);
        }
        
        if let Some(edge_insets) = &options.edge_insets {
            updated = updated.with_edge_insets(edge_insets.clone());
        }
        
        if let (Some(border_width), Some(border_color)) = (options.border_width, &options.border_color) {
            updated = updated.with_border(
                border_width,
                border_color.clone(),
                options.border_radius,
                options.border_style.clone(),
            );
        }
        
        if let (Some(shadow_radius), Some(shadow_color)) = (options.shadow_radius, &options.shadow_color) {
            updated = updated.with_box_shadow(
                shadow_radius,
                shadow_color.clone(),
                options.shadow_offset,
            );
        }
        
        updated
    }
}

pub struct TextLimitOptions {
    pub max_lines: Option<u32>,
    pub max_width: Option<f32>,
    pub truncation_mode: Option<TextOverflow>,
    pub min_font_size: Option<f32>,
    pub max_font_size: Option<f32>,
    pub soft_wrap: Option<bool>,
}

pub fn use_text_limits(options: TextLimitOptions) -> impl Fn(TextProps) -> TextProps {
    move |props: TextProps| {
        let mut updated = props;
        
        if let Some(max_lines) = options.max_lines {
            updated = updated.with_max_lines(max_lines);
        }
        
        if let Some(max_width) = options.max_width {
            updated = updated.with_max_dimensions(max_width, f32::MAX);
        }
        
        if let Some(truncation_mode) = &options.truncation_mode {
            updated = updated.with_truncation_mode(truncation_mode.clone());
        }
        
        if let Some(min_font_size) = options.min_font_size {
            updated.min_font_size = Some(min_font_size);
        }
        
        if let Some(max_font_size) = options.max_font_size {
            updated.max_font_size = Some(max_font_size);
        }
        
        if let Some(soft_wrap) = options.soft_wrap {
            updated.soft_wrap = Some(soft_wrap);
        }
        
        updated
    }
}

pub fn use_heading_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_weight(FontWeight::Bold)
            .with_font_size(24.0)
            .with_line_height(1.2)
            .with_letter_spacing(0.5)
            .with_color(Color::Black)
    }
}

pub fn use_subheading_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_weight(FontWeight::SemiBold)
            .with_font_size(18.0)
            .with_line_height(1.3)
            .with_color(Color::DarkGray)
    }
}

pub fn use_body_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_weight(FontWeight::Regular)
            .with_font_size(16.0)
            .with_line_height(1.5)
            .with_color(Color::Black)
    }
}

pub fn use_caption_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_weight(FontWeight::Regular)
            .with_font_size(12.0)
            .with_line_height(1.2)
            .with_color(Color::Gray)
    }
}

pub fn use_emphasized_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_slant(FontSlant::Italic)
            .with_color(Color::DarkGray)
    }
}

pub fn use_link_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_color(Color::Blue)
            .with_text_decoration(TextDecoration::Underline)
    }
}

pub fn use_truncated_style(lines: u32) -> impl Fn(TextProps) -> TextProps {
    move |props| {
        props
            .with_max_lines(lines)
            .with_truncation_mode(TextOverflow::Ellipsis)
    }
}

pub fn use_centered_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props.with_text_align(TextAlign::Center)
    }
}

pub fn use_shadowed_style(color: Color, blur: f32) -> impl FnOnce(TextProps) -> TextProps {
    move |props| {
        props.with_shadow(text::TextShadow {
            color,
            offset_x: 2.0,
            offset_y: 2.0,
            blur_radius: blur,
        })
    }
}


pub fn use_title_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_size(24.0)
            .with_font_weight(FontWeight::Bold)
            .with_color(Color::Black)
            .with_line_height(1.2)
    }
}

pub fn use_subtitle_style() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_font_size(18.0)
            .with_font_weight(FontWeight::SemiBold)
            .with_color(Color::DarkGray)
            .with_line_height(1.3)
    }
}

pub fn use_centered_text() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props.with_text_align(TextAlign::Center)
    }
}

pub fn use_error_text() -> impl Fn(TextProps) -> TextProps {
    |props| {
        props
            .with_color(Color::Red)
            .with_font_weight(FontWeight::Medium)
    }
}

pub fn use_highlighted_text(background: Color) -> impl FnOnce(TextProps) -> TextProps {
    move |props| {
        props
            .with_background_color(background)
            .with_padding(4.0)
    }
}