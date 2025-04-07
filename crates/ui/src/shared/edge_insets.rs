use serde::{Serialize, Deserialize};
use std::fmt;

/// EdgeInsets represents padding or margins with different values for each side.
/// This structure provides a canonical representation for edge insets throughout the framework.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct EdgeInsets {
    pub top: f32,
    pub right: f32,
    pub bottom: f32,
    pub left: f32,
}

impl EdgeInsets {
    /// Creates a new EdgeInsets with specific values for each side
    pub fn new(top: f32, right: f32, bottom: f32, left: f32) -> Self {
        Self { top, right, bottom, left }
    }
    
    /// Creates EdgeInsets with the same value for all sides
    pub fn all(value: f32) -> Self {
        Self::new(value, value, value, value)
    }
    
    /// Creates EdgeInsets with horizontal (left, right) values
    pub fn horizontal(value: f32) -> Self {
        Self::new(0.0, value, 0.0, value)
    }
    
    /// Creates EdgeInsets with vertical (top, bottom) values
    pub fn vertical(value: f32) -> Self {
        Self::new(value, 0.0, value, 0.0)
    }
    
    /// Creates EdgeInsets with different values for vertical and horizontal
    pub fn symmetric(vertical: f32, horizontal: f32) -> Self {
        Self::new(vertical, horizontal, vertical, horizontal)
    }
    
    /// Creates EdgeInsets with zero for all sides
    pub fn zero() -> Self {
        Self::all(0.0)
    }
    
    /// Converts EdgeInsets to a string representation
    pub fn to_string(&self) -> String {
        format!("{},{},{},{}", self.top, self.right, self.bottom, self.left)
    }
    
    /// Returns the sum of horizontal insets (left + right)
    pub fn horizontal_insets(&self) -> f32 {
        self.left + self.right
    }
    
    /// Returns the sum of vertical insets (top + bottom)
    pub fn vertical_insets(&self) -> f32 {
        self.top + self.bottom
    }
    
    /// Scales all insets by a factor
    pub fn scale(&self, factor: f32) -> Self {
        Self::new(
            self.top * factor,
            self.right * factor,
            self.bottom * factor,
            self.left * factor
        )
    }
    
    /// Adds another EdgeInsets to this one
    pub fn add(&self, other: &EdgeInsets) -> Self {
        Self::new(
            self.top + other.top,
            self.right + other.right,
            self.bottom + other.bottom,
            self.left + other.left
        )
    }
    
    /// Returns an EdgeInsets with the maximum values from this and another
    pub fn max(&self, other: &EdgeInsets) -> Self {
        Self::new(
            self.top.max(other.top),
            self.right.max(other.right),
            self.bottom.max(other.bottom),
            self.left.max(other.left)
        )
    }
    
    /// Returns an EdgeInsets with the minimum values from this and another
    pub fn min(&self, other: &EdgeInsets) -> Self {
        Self::new(
            self.top.min(other.top),
            self.right.min(other.right),
            self.bottom.min(other.bottom),
            self.left.min(other.left)
        )
    }
}

impl Default for EdgeInsets {
    fn default() -> Self {
        Self::zero()
    }
}

impl fmt::Display for EdgeInsets {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{},{},{},{}", self.top, self.right, self.bottom, self.left)
    }
}

/// Parse a string into EdgeInsets
/// 
/// Handles formats like:
/// - "10,20,30,40" (top, right, bottom, left)
/// - "10" (all sides)
/// - "10,20" (vertical, horizontal)
pub fn parse_edge_insets(insets_str: &str) -> Option<EdgeInsets> {
    let parts: Vec<&str> = insets_str.split(',').collect();
    
    match parts.len() {
        // Format: "value" - all sides equal
        1 => {
            let value = parts[0].trim().parse::<f32>().ok()?;
            Some(EdgeInsets::all(value))
        },
        
        // Format: "vertical,horizontal"
        2 => {
            let vertical = parts[0].trim().parse::<f32>().ok()?;
            let horizontal = parts[1].trim().parse::<f32>().ok()?;
            Some(EdgeInsets::symmetric(vertical, horizontal))
        },
        
        // Format: "top,right,bottom,left"
        4 => {
            let top = parts[0].trim().parse::<f32>().ok()?;
            let right = parts[1].trim().parse::<f32>().ok()?;
            let bottom = parts[2].trim().parse::<f32>().ok()?;
            let left = parts[3].trim().parse::<f32>().ok()?;
            Some(EdgeInsets::new(top, right, bottom, left))
        },
        
        // Invalid format
        _ => None,
    }
}

/// Formats EdgeInsets as a canonical string representation
pub fn format_edge_insets(insets: &EdgeInsets) -> String {
    format!("{},{},{},{}", insets.top, insets.right, insets.bottom, insets.left)
}

/// Normalizes EdgeInsets to ensure all values are non-negative
pub fn normalize_edge_insets(insets: &EdgeInsets) -> EdgeInsets {
    EdgeInsets::new(
        insets.top.max(0.0),
        insets.right.max(0.0),
        insets.bottom.max(0.0),
        insets.left.max(0.0)
    )
}

/// Utility functions for edge insets calculations
pub mod utils {
    use super::*;
    use crate::layout::types::Size;
    use crate::layout::types::Rect;
    
    /// Apply edge insets to a size by reducing it
    pub fn apply_insets_to_size(size: &Size, insets: &EdgeInsets) -> Size {
        Size::new(
            (size.width - insets.horizontal_insets()).max(0.0),
            (size.height - insets.vertical_insets()).max(0.0)
        )
    }
    
    /// Apply edge insets to a rect, creating an inner rect
    pub fn apply_insets_to_rect(rect: &Rect, insets: &EdgeInsets) -> Rect {
        Rect::new(
            rect.x + insets.left,
            rect.y + insets.top,
            (rect.width - insets.horizontal_insets()).max(0.0),
            (rect.height - insets.vertical_insets()).max(0.0)
        )
    }
    
    /// Creates a rect expanded by the edge insets
    pub fn expand_rect_by_insets(rect: &Rect, insets: &EdgeInsets) -> Rect {
        Rect::new(
            rect.x - insets.left,
            rect.y - insets.top,
            rect.width + insets.horizontal_insets(),
            rect.height + insets.vertical_insets()
        )
    }
}