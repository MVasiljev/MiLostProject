use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum FontStyle {
    Title,
    Body,
    Caption,
    // Add Weight, Size, etc. later
}
