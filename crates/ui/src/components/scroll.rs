use serde::{Serialize, Deserialize};
use crate::{Color, UIComponent};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ScrollDirection {
    Vertical,
    Horizontal,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ScrollIndicatorStyle {
    Default,
    Light,
    Dark,
    Custom(Color),
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum DecelerationRate {
    Normal,
    Fast,
    Custom(f32),
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ContentInset {
    pub top: Option<f32>,
    pub left: Option<f32>,
    pub bottom: Option<f32>,
    pub right: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScrollProps {
    pub direction: ScrollDirection,
    pub children: Vec<UIComponent>,

    pub shows_indicators: Option<bool>,
    pub scrollbar_color: Option<Color>,
    pub scrollbar_width: Option<f32>,
    pub scrollbar_margin: Option<f32>,

    pub always_bounces_horizontal: Option<bool>,
    pub always_bounces_vertical: Option<bool>,

    pub scroll_enabled: Option<bool>,
    pub paging_enabled: Option<bool>,

    pub deceleration_rate: Option<DecelerationRate>,

    pub content_inset: Option<ContentInset>,

    pub indicator_style: Option<ScrollIndicatorStyle>,

    pub accessibility_label: Option<String>,
}

impl Default for ScrollProps {
    fn default() -> Self {
        Self {
            direction: ScrollDirection::Vertical,
            children: Vec::new(),
            shows_indicators: Some(false),
            scrollbar_color: Some(Color::Gray),
            scrollbar_width: Some(6.0),
            scrollbar_margin: Some(2.0),
            always_bounces_horizontal: Some(false),
            always_bounces_vertical: Some(false),
            scroll_enabled: Some(true),
            paging_enabled: Some(false),
            deceleration_rate: Some(DecelerationRate::Normal),
            content_inset: None,
            indicator_style: Some(ScrollIndicatorStyle::Default),
            accessibility_label: None,
        }
    }
}

impl ScrollProps {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn horizontal() -> Self {
        Self {
            direction: ScrollDirection::Horizontal,
            ..Default::default()
        }
    }

    pub fn vertical() -> Self {
        Self {
            direction: ScrollDirection::Vertical,
            ..Default::default()
        }
    }

    pub fn add_child(mut self, child: UIComponent) -> Self {
        self.children.push(child);
        self
    }

    pub fn shows_indicators(mut self, shows: bool) -> Self {
        self.shows_indicators = Some(shows);
        self
    }

    pub fn scrollbar_color(mut self, color: Color) -> Self {
        self.scrollbar_color = Some(color);
        self
    }

    pub fn scrollbar_width(mut self, width: f32) -> Self {
        self.scrollbar_width = Some(width);
        self
    }

    pub fn scrollbar_margin(mut self, margin: f32) -> Self {
        self.scrollbar_margin = Some(margin);
        self
    }

    pub fn always_bounces_horizontal(mut self, bounces: bool) -> Self {
        self.always_bounces_horizontal = Some(bounces);
        self
    }

    pub fn always_bounces_vertical(mut self, bounces: bool) -> Self {
        self.always_bounces_vertical = Some(bounces);
        self
    }

    pub fn scroll_enabled(mut self, enabled: bool) -> Self {
        self.scroll_enabled = Some(enabled);
        self
    }

    pub fn paging_enabled(mut self, enabled: bool) -> Self {
        self.paging_enabled = Some(enabled);
        self
    }

    pub fn deceleration_rate(mut self, rate: DecelerationRate) -> Self {
        self.deceleration_rate = Some(rate);
        self
    }

    pub fn content_inset(mut self, inset: ContentInset) -> Self {
        self.content_inset = Some(inset);
        self
    }

    pub fn indicator_style(mut self, style: ScrollIndicatorStyle) -> Self {
        self.indicator_style = Some(style);
        self
    }

    pub fn accessibility_label(mut self, label: impl Into<String>) -> Self {
        self.accessibility_label = Some(label.into());
        self
    }
}