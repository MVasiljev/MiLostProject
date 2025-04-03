// Enhanced Spacer implementation in spacer.rs
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpacerProps {
    pub size: Option<f32>,         // Fixed size if specified
    pub min_size: Option<f32>,     // Minimum size constraint
    pub max_size: Option<f32>,     // Maximum size constraint
    pub flex_grow: Option<f32>,    // Flex grow factor (1.0 means equal distribution)
}

// Enhanced measurement in LayoutEngine


// We need to update the stack layout algorithms to properly use flex_grow
// Here's an enhancement for the VStack positioning:



// Similar enhancement would be needed for HStack positioning