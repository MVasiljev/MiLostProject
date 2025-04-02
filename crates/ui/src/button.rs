use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonProps {
    pub label: String,
    pub on_tap: Option<String>,
}
