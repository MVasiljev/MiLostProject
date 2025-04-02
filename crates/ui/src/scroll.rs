use serde::{Serialize, Deserialize};
use crate::UIComponent;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ScrollDirection {
    Vertical,
    Horizontal,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScrollProps {
    pub direction: ScrollDirection,
    pub children: Vec<UIComponent>,
}
