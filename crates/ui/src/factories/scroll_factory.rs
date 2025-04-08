
use crate::{components::{HStackProps, ScrollDirection, ScrollProps, UIComponent, VStackProps}, hooks::{
    use_content_scrollable, use_paged_scroll, use_scroll_appearance, use_scroll_indicators, use_smooth_scroll, ScrollAppearanceOptions, ScrollIndicatorOptions
}, shared::Color};

pub fn create_vertical_scroll(items: Vec<UIComponent>) -> UIComponent {
    UIComponent::Scroll(
        ScrollProps::vertical()
            .add_child(
                UIComponent::VStack(
                    VStackProps::new()
                        .spacing(16.0)
                )
            )
    )
}

pub fn create_horizontal_scroll(items: Vec<UIComponent>) -> UIComponent {
    UIComponent::Scroll(
        ScrollProps::horizontal()
            .add_child(
                UIComponent::HStack(
                    HStackProps::new()
                        .spacing(16.0)
                )
            )
    )
}

pub fn create_paged_scroll(items: Vec<UIComponent>) -> UIComponent {
    let paged_scroll = use_paged_scroll();
    let content_scroll = use_content_scrollable(items);
    
    UIComponent::Scroll(
        content_scroll(
            paged_scroll(
                ScrollProps::vertical()
            )
        )
    )
}

pub fn create_smooth_scroll(items: Vec<UIComponent>) -> UIComponent {
    let smooth_scroll = use_smooth_scroll();
    let content_scroll = use_content_scrollable(items);
    
    UIComponent::Scroll(
        content_scroll(
            smooth_scroll(
                ScrollProps::vertical()
            )
        )
    )
}

pub fn create_custom_scroll(
    direction: ScrollDirection, 
    items: Vec<UIComponent>, 
    config: fn(ScrollProps) -> ScrollProps
) -> UIComponent {
    let base_props = match direction {
        ScrollDirection::Vertical => ScrollProps::vertical(),
        ScrollDirection::Horizontal => ScrollProps::horizontal(),
    };
    
    UIComponent::Scroll(
        config(base_props)
            .add_child(
                match direction {
                    ScrollDirection::Vertical => 
                        UIComponent::VStack(
                            VStackProps::new()
                                .spacing(16.0)
                                .add_children(items)
                        ),
                    ScrollDirection::Horizontal => 
                        UIComponent::HStack(
                            HStackProps::new()
                                .spacing(16.0)
                                .add_children(items)
                        ),
                }
            )
    )
}

pub fn create_styled_scroll(
    items: Vec<UIComponent>, 
    config: fn(ScrollProps) -> ScrollProps
) -> UIComponent {
    UIComponent::Scroll(
        config(
            ScrollProps::vertical()
                .add_child(
                    UIComponent::VStack(
                        VStackProps::new()
                            .spacing(16.0)
                            .add_children(items)
                    )
                )
        )
    )
}

pub fn create_scroll_with_indicators(
    items: Vec<UIComponent>, 
    indicator_color: Color, 
    indicator_width: f32
) -> UIComponent {
    let indicators = use_scroll_indicators(
        ScrollIndicatorOptions {
            shows_indicators: Some(true),
            scrollbar_color: Some(indicator_color),
            scrollbar_width: Some(indicator_width),
            scrollbar_margin: Some(2.0),
            indicator_style: None,
        }
    );
    
    let content_scroll = use_content_scrollable(items);
    
    UIComponent::Scroll(
        content_scroll(
            indicators(
                ScrollProps::vertical()
            )
        )
    )
}

pub fn create_minimal_scroll(items: Vec<UIComponent>) -> UIComponent {
    let appearance = use_scroll_appearance(
        ScrollAppearanceOptions {
            width: None,
            height: None,
            background_color: None,
            border_width: None,
            border_color: None,
            border_radius: None,
            border_style: None,
            padding: None,
            edge_insets: None,
            opacity: Some(1.0),
        }
    );
    
    let content_scroll = use_content_scrollable(items);
    
    UIComponent::Scroll(
        content_scroll(
            appearance(
                ScrollProps::vertical()
            )
        )
    )
}