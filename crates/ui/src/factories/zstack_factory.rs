use crate::{UIComponent, Color, EdgeInsets};
use crate::zstack::{ZStackProps, ZStackAlignment};
use crate::hooks::{use_zstack_center_alignment, use_zstack_styling};

pub fn create_overlay_card(content: UIComponent, overlay: UIComponent) -> UIComponent {
    let center_alignment = use_zstack_center_alignment();
    let card_styling = use_zstack_styling(crate::hooks::ZStackStylingOptions {
        background: Some(Color::White),
        border_width: Some(1.0),
        border_color: Some(Color::from_hex("#e0e0e0")),
        border_radius: Some(8.0),
        shadow_radius: Some(4.0),
        shadow_color: Some(Color::rgba(0, 0, 0, 0.1)),
        shadow_offset: Some((0.0, 2.0)),
    });
    
    let props = ZStackProps::new();
    let props = center_alignment(props);
    let props = card_styling(props);
    let props = props.with_children(vec![content, overlay]);
    
    UIComponent::ZStack(props)
}

pub fn create_badge_icon(icon: UIComponent, badge_count: u32) -> UIComponent {
    let badge_text = UIComponent::Text(
        crate::text::TextProps::new(badge_count.to_string())
            .with_color(Color::White)
            .with_font_size(10.0)
            .with_background_color(Color::Red)
            .with_padding(4.0)
            .with_border_radius(Some(10.0))
    );
    
    UIComponent::ZStack(
        ZStackProps::new()
            .with_children(vec![icon, badge_text])
            .with_alignment(ZStackAlignment::TopTrailing)
            .with_padding(8.0)
    )
}

pub fn create_card_with_banner(
    content: UIComponent,
    banner_text: &str,
    banner_color: Color
) -> UIComponent {
    let banner = UIComponent::Text(
        crate::text::TextProps::new(banner_text)
            .with_color(Color::White)
            .with_background_color(banner_color)
            .with_padding(4.0)
            .with_text_align(crate::shared::styles::TextAlign::Center)
            .with_width(Some(150.0))
            .with_font_size(12.0)
            .with_font_weight(crate::shared::font::FontWeight::Bold)
    );
    
    UIComponent::ZStack(
        ZStackProps::new()
            .with_children(vec![content, banner])
            .with_alignment(ZStackAlignment::TopLeading)
            .with_clip_to_bounds(true)
    )
}

pub fn create_image_with_caption(
    image: UIComponent,
    caption: &str
) -> UIComponent {
    let caption_text = UIComponent::Text(
        crate::text::TextProps::new(caption)
            .with_color(Color::White)
            .with_background_color(Color::rgba(0, 0, 0, 0.5))
            .with_padding(8.0)
            .with_text_align(crate::shared::styles::TextAlign::Center)
            .with_font_size(14.0)
    );
    
    UIComponent::ZStack(
        ZStackProps::new()
            .with_children(vec![image, caption_text])
            .with_alignment(ZStackAlignment::Bottom)
    )
}