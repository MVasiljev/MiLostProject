use serde::{Serialize, Deserialize};
use crate::{Color, FontStyle};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TextProps {
    pub content: String,
    pub font_style: Option<FontStyle>,
    pub color: Option<Color>,
}
