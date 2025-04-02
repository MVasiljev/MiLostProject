use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Color {
    White,
    Blue,
    Black,
    // Extend with RGBA, gradients, etc.
}
