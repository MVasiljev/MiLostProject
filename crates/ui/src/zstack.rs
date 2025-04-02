use serde::{Serialize, Deserialize};
use crate::UIComponent;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ZStackProps {
    pub alignment: Option<String>, // e.g., "topLeading", "center", "bottomTrailing"
    pub children: Vec<UIComponent>,
}
