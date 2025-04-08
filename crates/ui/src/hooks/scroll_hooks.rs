
use crate::components::scroll::{DecelerationRate, ScrollIndicatorStyle};
use crate::components::{ScrollDirection, ScrollProps, UIComponent};
use crate::shared::styles::BorderStyle;
use crate::shared::edge_insets::EdgeInsets;
use crate::shared::Color;

pub struct ScrollIndicatorOptions {
    pub shows_indicators: Option<bool>,
    pub scrollbar_color: Option<Color>,
    pub scrollbar_width: Option<f32>,
    pub scrollbar_margin: Option<f32>,
    pub indicator_style: Option<ScrollIndicatorStyle>,
}

pub fn use_scroll_indicators(options: ScrollIndicatorOptions) -> impl Fn(ScrollProps) -> ScrollProps {
    move |mut props: ScrollProps| {
        if let Some(shows_indicators) = options.shows_indicators {
            props.shows_indicators = Some(shows_indicators);
        }
        
        if let Some(scrollbar_color) = &options.scrollbar_color {
            props.scrollbar_color = Some(scrollbar_color.clone());
        }
        
        if let Some(scrollbar_width) = options.scrollbar_width {
            props.scrollbar_width = Some(scrollbar_width);
        }
        
        if let Some(scrollbar_margin) = options.scrollbar_margin {
            props.scrollbar_margin = Some(scrollbar_margin);
        }
        
        if let Some(indicator_style) = &options.indicator_style {
            props.indicator_style = Some(indicator_style.clone());
        }
        
        props
    }
}

pub struct ScrollBehaviorOptions {
    pub direction: Option<ScrollDirection>,
    pub scroll_enabled: Option<bool>,
    pub paging_enabled: Option<bool>,
    pub always_bounces_horizontal: Option<bool>,
    pub always_bounces_vertical: Option<bool>,
    pub deceleration_rate: Option<DecelerationRate>,
}

pub fn use_scroll_behavior(options: ScrollBehaviorOptions) -> impl Fn(ScrollProps) -> ScrollProps {
    move |mut props: ScrollProps| {
        if let Some(direction) = &options.direction {
            props.direction = direction.clone();
        }
        
        if let Some(scroll_enabled) = options.scroll_enabled {
            props.scroll_enabled = Some(scroll_enabled);
        }
        
        if let Some(paging_enabled) = options.paging_enabled {
            props.paging_enabled = Some(paging_enabled);
        }
        
        if let Some(always_bounces_horizontal) = options.always_bounces_horizontal {
            props.always_bounces_horizontal = Some(always_bounces_horizontal);
        }
        
        if let Some(always_bounces_vertical) = options.always_bounces_vertical {
            props.always_bounces_vertical = Some(always_bounces_vertical);
        }
        
        if let Some(deceleration_rate) = &options.deceleration_rate {
            props.deceleration_rate = Some(deceleration_rate.clone());
        }
        
        props
    }
}

pub struct ScrollInsetOptions {
    pub top: Option<f32>,
    pub left: Option<f32>,
    pub bottom: Option<f32>,
    pub right: Option<f32>,
}

pub fn use_scroll_insets(options: ScrollInsetOptions) -> impl Fn(ScrollProps) -> ScrollProps {
    move |mut props: ScrollProps| {
        let mut content_insets = props.content_insets.take().unwrap_or_default();
        
        if let Some(top) = options.top {
            content_insets.top = Some(top);
        }
        
        if let Some(left) = options.left {
            content_insets.left = Some(left);
        }
        
        if let Some(bottom) = options.bottom {
            content_insets.bottom = Some(bottom);
        }
        
        if let Some(right) = options.right {
            content_insets.right = Some(right);
        }
        
        props.content_insets = Some(content_insets);
        props
    }
}

pub struct ScrollAppearanceOptions {
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub background_color: Option<Color>,
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub opacity: Option<f32>,
}

pub fn use_scroll_appearance(options: ScrollAppearanceOptions) -> impl Fn(ScrollProps) -> ScrollProps {
    move |mut props: ScrollProps| {
        if let Some(width) = options.width {
            props.width = Some(width);
        }
        
        if let Some(height) = options.height {
            props.height = Some(height);
        }
        
        if let Some(background_color) = &options.background_color {
            props.background_color = Some(background_color.clone());
        }
        
        if let Some(border_width) = options.border_width {
            props.border_width = Some(border_width);
        }
        
        if let Some(border_color) = &options.border_color {
            props.border_color = Some(border_color.clone());
        }
        
        if let Some(border_radius) = options.border_radius {
            props.border_radius = Some(border_radius);
        }
        
        if let Some(border_style) = &options.border_style {
            props.border_style = Some(border_style.clone());
        }
        
        if let Some(padding) = options.padding {
            props.padding = Some(padding);
        }
        
        if let Some(edge_insets) = &options.edge_insets {
            props.edge_insets = Some(edge_insets.clone());
        }
        
        if let Some(opacity) = options.opacity {
            props.opacity = Some(opacity);
        }
        
        props
    }
}

pub fn use_paged_scroll() -> impl Fn(ScrollProps) -> ScrollProps {
    |mut props: ScrollProps| {
        props.paging_enabled = Some(true);
        props.always_bounces_horizontal = Some(false);
        props.deceleration_rate = Some(DecelerationRate::Fast);
        props.shows_indicators = Some(false);
        props
    }
}

pub fn use_smooth_scroll() -> impl Fn(ScrollProps) -> ScrollProps {
    |mut props: ScrollProps| {
        props.deceleration_rate = Some(DecelerationRate::Normal);
        props.always_bounces_vertical = Some(true);
        props.shows_indicators = Some(true);
        props
    }
}

pub fn use_content_scrollable(items: Vec<UIComponent>) -> impl Fn(ScrollProps) -> ScrollProps {
    move |mut props: ScrollProps| {
        props.children = items.clone();
        props
    }
}