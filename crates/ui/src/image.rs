use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ResizeMode {
    Fill,
    Fit,
    Cover,
    Contain,
}

impl Default for ResizeMode {
    fn default() -> Self {
        ResizeMode::Fit
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageProps {
    pub src: String,
    pub alt: Option<String>,
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub aspect_ratio: Option<f32>,
    pub resize_mode: Option<String>,
    pub corner_radius: Option<f32>,
    pub border_width: Option<f32>,
    pub border_color: Option<String>,
}

impl ImageProps {
    pub fn get_resize_mode(&self) -> ResizeMode {
        match &self.resize_mode {
            Some(mode) => match mode.as_str() {
                "fill" => ResizeMode::Fill,
                "cover" => ResizeMode::Cover,
                "contain" => ResizeMode::Contain,
                _ => ResizeMode::Fit,
            },
            None => ResizeMode::default(),
        }
    }
}