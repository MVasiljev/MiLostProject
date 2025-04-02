use serde::{Serialize, Deserialize};
use crate::Color;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DividerProps {
    pub thickness: Option<f32>, // in pixels
    pub color: Option<Color>,
}
