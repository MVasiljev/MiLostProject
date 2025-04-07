use crate::text::TextProps;
use crate::shared::font::{FontWeight, FontFamily};
use crate::Color;

pub struct TextTheme {
    pub title_font_family: String,
    pub body_font_family: String,
    pub title_color: Color,
    pub body_color: Color,
    pub subtitle_color: Color,
    pub link_color: Color,
    pub error_color: Color,
}

impl Default for TextTheme {
    fn default() -> Self {
        Self {
            title_font_family: "Inter, sans-serif".to_string(),
            body_font_family: "Inter, sans-serif".to_string(),
            title_color: Color::Black,
            body_color: Color::rgb(50, 50, 50),
            subtitle_color: Color::Gray,
            link_color: Color::Blue,
            error_color: Color::Red,
        }
    }
}

pub struct ThemedTextStyles {
    pub title: fn(TextProps) -> TextProps,
    pub subtitle: fn(TextProps) -> TextProps,
    pub body: fn(TextProps) -> TextProps,
    pub caption: fn(TextProps) -> TextProps,
    pub link: fn(TextProps) -> TextProps,
}

pub fn create_themed_text_styles(theme: &TextTheme) -> ThemedTextStyles {
    let title = move |props: TextProps| {
        let mut updated = props;
        updated.font_family = Some(theme.title_font_family.clone());
        updated.font_size = Some(24.0);
        updated.font_weight = Some(FontWeight::Bold);
        updated.color = Some(theme.title_color.clone());
        updated.line_height = Some(1.2);
        updated
    };
    
    let subtitle = move |props: TextProps| {
        let mut updated = props;
        updated.font_family = Some(theme.body_font_family.clone());
        updated.font_size = Some(18.0);
        updated.font_weight = Some(FontWeight::SemiBold);
        updated.color = Some(theme.subtitle_color.clone());
        updated.line_height = Some(1.3);
        updated
    };
    
    let body = move |props: TextProps| {
        let mut updated = props;
        updated.font_family = Some(theme.body_font_family.clone());
        updated.font_size = Some(16.0);
        updated.font_weight = Some(FontWeight::Regular);
        updated.color = Some(theme.body_color.clone());
        updated.line_height = Some(1.5);
        updated
    };
    
    let caption = move |props: TextProps| {
        let mut updated = props;
        updated.font_family = Some(theme.body_font_family.clone());
        updated.font_size = Some(12.0);
        updated.font_weight = Some(FontWeight::Regular);
        updated.color = Some(theme.subtitle_color.clone());
        updated.line_height = Some(1.3);
        updated
    };
    
    let link = move |props: TextProps| {
        let mut updated = props;
        updated.font_family = Some(theme.body_font_family.clone());
        updated.font_size = Some(16.0);
        updated.color = Some(theme.link_color.clone());
        updated.text_decoration = Some(crate::text::TextDecoration::Underline);
        updated
    };
    
    ThemedTextStyles {
        title,
        subtitle,
        body,
        caption,
        link,
    }
}