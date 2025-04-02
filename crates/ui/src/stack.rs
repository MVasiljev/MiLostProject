use serde::{Serialize, Deserialize};
use crate::{Color, UIComponent};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VStackProps {
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub background: Option<Color>,
    pub children: Vec<UIComponent>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HStackProps {
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub background: Option<Color>,
    pub children: Vec<UIComponent>,
}
