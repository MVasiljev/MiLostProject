use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum FontStyle {
    Title,
    Body,
    Caption,
    // Add Weight, Size, etc. later
}
