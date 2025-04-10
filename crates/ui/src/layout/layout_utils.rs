use crate::render::node::RenderNode;
use crate::shared::edge_insets::{EdgeInsets, parse_edge_insets as parse_insets_from_string};

pub fn parse_edge_insets(node: &RenderNode) -> EdgeInsets {
    if let Some(property) = node.get_prop("edge_insets") {
        if let Some(insets) = property.as_edge_insets() {
            return *insets;
        }
        
        if let Some(insets_str) = property.as_string() {
            if let Some(insets) = parse_insets_from_string(insets_str) {
                return insets;
            }
        }
    }
    
    if let Some(insets_str) = node.get_prop_string("edge_insets") {
        if let Some(insets) = parse_insets_from_string(insets_str) {
            return insets;
        }
    }
    
    if let Some(padding) = node.get_prop_f32("padding") {
        EdgeInsets::all(padding)
    } else {
        EdgeInsets::zero()
    }
}
