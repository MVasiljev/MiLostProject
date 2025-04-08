use crate::components::text::{TextDecoration, TextProps};
use crate::shared::font::{FontWeight, FontFamily};
use crate::shared::Color;

pub struct TextTheme {
    pub title_font_family: String,
    pub body_font_family: String,
    pub title_color: Color,
    pub body_color: Color,
    pub subtitle_color: Color,
    pub link_color: Color,
    pub error_color: Color,
}

pub fn apply_theme_to_text(props: TextProps, theme: &TextTheme) -> TextProps {
    let mut updated = props;
    
    if updated.font_family.is_none() {
        updated.font_family = Some(theme.body_font_family.clone());
    }
    
    updated
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
    pub title: Box<dyn Fn(TextProps) -> TextProps>,
    pub subtitle: Box<dyn Fn(TextProps) -> TextProps>,
    pub body: Box<dyn Fn(TextProps) -> TextProps>,
    pub caption: Box<dyn Fn(TextProps) -> TextProps>,
    pub link: Box<dyn Fn(TextProps) -> TextProps>,
}



pub fn create_themed_text_styles(theme: &TextTheme) -> ThemedTextStyles {
    let title = {
        let theme = theme.clone();
        Box::new(move |props: TextProps| {
            let mut updated = props;
            updated.font_family = Some(theme.title_font_family.clone());
            updated.font_size = Some(24.0);
            updated.font_weight = Some(FontWeight::Bold);
            updated.color = Some(theme.title_color.clone());
            updated.line_height = Some(1.2);
            updated
        }) as Box<dyn Fn(TextProps) -> TextProps>
    };

    let subtitle = {
        let theme = theme.clone();
        Box::new(move |props: TextProps| {
            let mut updated = props;
            updated.font_family = Some(theme.body_font_family.clone());
            updated.font_size = Some(18.0);
            updated.font_weight = Some(FontWeight::SemiBold);
            updated.color = Some(theme.subtitle_color.clone());
            updated.line_height = Some(1.3);
            updated
        })
    };

    let body = {
        let theme = theme.clone();
        Box::new(move |props: TextProps| {
            let mut updated = props;
            updated.font_family = Some(theme.body_font_family.clone());
            updated.font_size = Some(16.0);
            updated.font_weight = Some(FontWeight::Regular);
            updated.color = Some(theme.body_color.clone());
            updated.line_height = Some(1.5);
            updated
        })
    };

    let caption = {
        let theme = theme.clone();
        Box::new(move |props: TextProps| {
            let mut updated = props;
            updated.font_family = Some(theme.body_font_family.clone());
            updated.font_size = Some(12.0);
            updated.font_weight = Some(FontWeight::Regular);
            updated.color = Some(theme.subtitle_color.clone());
            updated.line_height = Some(1.3);
            updated
        })
    };

    let link = {
        let theme = theme.clone();
        Box::new(move |props: TextProps| {
            let mut updated = props;
            updated.font_family = Some(theme.body_font_family.clone());
            updated.font_size = Some(16.0);
            updated.color = Some(theme.link_color.clone());
            updated.text_decoration = Some(TextDecoration::Underline);
            updated
        })
    };

    ThemedTextStyles {
        title,
        subtitle,
        body,
        caption,
        link,
    }
}
