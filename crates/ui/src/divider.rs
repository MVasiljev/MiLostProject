// Enhanced Divider implementation in divider.rs
use serde::{Serialize, Deserialize};
use crate::Color;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum DividerStyle {
    Solid,
    Dashed,
    Dotted,
}

impl Default for DividerStyle {
    fn default() -> Self {
        DividerStyle::Solid
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DividerProps {
    pub thickness: Option<f32>,
    pub color: Option<Color>,
    pub style: Option<DividerStyle>,
    pub padding: Option<f32>,
}

// Enhanced drawing implementation for renderer.rs


// Update divider measurement in LayoutEngine
