use crate::{Color, UIComponent};
use crate::text::{TextProps, TextDecoration};
use crate::shared::edge_insets::EdgeInsets;
use crate::shared::styles::{TextAlign, BorderStyle};
use crate::shared::font::{FontWeight, FontSlant};

use crate::{Color, UIComponent};
use crate::text::{TextProps, TextDecoration};
use crate::hooks::{
    use_title_style, use_subtitle_style, use_body_style,
    use_caption_style, use_link_style, use_error_text
};

pub fn create_title(content: &str) -> UIComponent {
    let title_style = use_title_style();
    let props = title_style(TextProps::new(content));
    UIComponent::Text(props)
}

pub fn create_subtitle(content: &str) -> UIComponent {
    let subtitle_style = use_subtitle_style();
    let props = subtitle_style(TextProps::new(content));
    UIComponent::Text(props)
}

pub fn create_body_text(content: &str) -> UIComponent {
    let body_style = use_body_style();
    let props = body_style(TextProps::new(content));
    UIComponent::Text(props)
}

pub fn create_caption(content: &str) -> UIComponent {
    let caption_style = use_caption_style();
    let props = caption_style(TextProps::new(content));
    UIComponent::Text(props)
}

pub fn create_link(content: &str) -> UIComponent {
    let link_style = use_link_style();
    let props = link_style(TextProps::new(content));
    UIComponent::Text(props)
}

pub fn create_label(content: &str, color: Color) -> UIComponent {
    UIComponent::Text(
        TextProps::new(content)
            .with_font_size(14.0)
            .with_color(color)
            .with_background_color(color.with_opacity(0.15))
            .with_padding(6.0)
            .with_border_radius(Some(4.0))
    )
}

pub fn create_error_text(content: &str) -> UIComponent {
    let error_style = use_error_text();
    let props = error_style(TextProps::new(content));
    UIComponent::Text(props)
}

pub fn create_link(text: &str) -> UIComponent {
    UIComponent::Text(
        TextProps::new(text)
            .with_color(Color::Blue)
            .with_text_decoration(TextDecoration::Underline)
    )
}

pub fn create_quoted_text(text: &str) -> UIComponent {
    UIComponent::Text(
        TextProps::new(text)
            .with_font_slant(FontSlant::Italic)
            .with_color(Color::DarkGray)
            .with_padding(16.0)
            .with_edge_insets(EdgeInsets::new(0.0, 16.0, 0.0, 16.0))
            .with_border(4.0, Color::LightGray, None, Some(BorderStyle::Solid))
    )
}

pub fn create_highlighted_text(text: &str, background: Color, text_color: Color) -> UIComponent {
    UIComponent::Text(
        TextProps::new(text)
            .with_color(text_color)
            .with_background_color(background)
            .with_padding(8.0)
            .with_border_radius(Some(4.0))
    )
}

pub fn create_centered_text(text: &str) -> UIComponent {
    UIComponent::Text(
        TextProps::new(text)
            .with_text_align(TextAlign::Center)
            .with_width(Some(100.0))
    )
}

pub fn create_error_text(text: &str) -> UIComponent {
    UIComponent::Text(
        TextProps::new(text)
            .with_color(Color::Red)
            .with_font_size(14.0)
            .with_font_weight(FontWeight::Medium)
    )
}