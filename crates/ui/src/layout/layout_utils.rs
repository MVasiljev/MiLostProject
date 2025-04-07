use crate::render::node::RenderNode;
use crate::shared::edge_insets::{EdgeInsets, parse_edge_insets as parse_insets_from_string};

/// Extract edge insets from a render node
pub fn parse_edge_insets(node: &RenderNode) -> EdgeInsets {
    // First try to get directly from strongly typed property
    if let Some(property) = node.get_prop("edge_insets") {
        if let Some(insets) = property.as_edge_insets() {
            return *insets;
        }
        
        // Try to parse from string representation
        if let Some(insets_str) = property.as_string() {
            if let Some(insets) = parse_insets_from_string(insets_str) {
                return insets;
            }
        }
    }
    
    // Check for direct string property (backward compatibility)
    if let Some(insets_str) = node.get_prop_string("edge_insets") {
        if let Some(insets) = parse_insets_from_string(insets_str) {
            return insets;
        }
    }
    
    // Try padding as a fallback
    if let Some(padding) = node.get_prop_f32("padding") {
        EdgeInsets::all(padding)
    } else {
        EdgeInsets::zero()
    }
}
