use serde::{Serialize, Deserialize};
use crate::{Color, EventHandler};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonStyle {
    Primary,
    Secondary,
    Danger,
    Success,
    Outline,
    Text,
    Custom,
}

impl Default for ButtonStyle {
    fn default() -> Self {
        ButtonStyle::Primary
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonProps {
    pub label: String,
    pub on_tap: Option<EventHandler>,
    pub disabled: Option<bool>,
    pub style: Option<ButtonStyle>,
    pub background_color: Option<String>,
    pub text_color: Option<String>,
    pub border_color: Option<String>,
    pub corner_radius: Option<f32>,
    pub padding: Option<f32>,
    pub icon: Option<String>,
    pub icon_position: Option<String>,
}



