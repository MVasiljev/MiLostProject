use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpacerProps {
    pub size: Option<f32>, // Optional — acts as a flexible gap if None
}
