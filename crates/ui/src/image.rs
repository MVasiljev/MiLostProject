use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageProps {
    pub src: String,
    pub alt: Option<String>,
}
