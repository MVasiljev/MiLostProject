use serde::{Serialize, Deserialize};
use crate::shared::styles::BorderStyle;
use crate::shared::edge_insets::EdgeInsets;

use super::{Color, UIComponent};

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
pub struct ScrollInsets {
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

    pub content_insets: Option<ScrollInsets>,

    pub indicator_style: Option<ScrollIndicatorStyle>,

    pub accessibility_label: Option<String>,

    pub width: Option<f32>,
    pub height: Option<f32>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,

    pub background_color: Option<Color>,
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,

    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub opacity: Option<f32>,
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
            content_insets: None,
            indicator_style: Some(ScrollIndicatorStyle::Default),
            accessibility_label: None,

            width: None,
            height: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,

            background_color: None,
            border_width: None,
            border_color: None,
            border_radius: None,
            border_style: None,

            padding: None,
            edge_insets: None,
            opacity: None,
        }
    }
}

impl ScrollProps {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn vertical() -> Self {
        Self {
            direction: ScrollDirection::Vertical,
            ..Default::default()
        }
    }

    pub fn horizontal() -> Self {
        Self {
            direction: ScrollDirection::Horizontal,
            ..Default::default()
        }
    }

    pub fn add_child(mut self, child: UIComponent) -> Self {
        self.children.push(child);
        self
    }
}