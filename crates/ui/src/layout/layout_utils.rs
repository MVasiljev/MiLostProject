use crate::render::node::RenderNode;
use super::types::{EdgeInsets};

/// Parse edge insets from a node's properties
pub fn parse_edge_insets(node: &RenderNode) -> EdgeInsets {
    if let Some(insets_str) = node.get_prop("edge_insets") {
        if let Some(parts) = insets_str.split(',').collect::<Vec<&str>>().get(0..4) {
            if parts.len() == 4 {
                if let (Ok(top), Ok(right), Ok(bottom), Ok(left)) = (
                    parts[0].parse::<f32>(),
                    parts[1].parse::<f32>(),
                    parts[2].parse::<f32>(),
                    parts[3].parse::<f32>()
                ) {
                    return EdgeInsets::new(top, right, bottom, left);
                }
            }
        }
    }
    
    if let Some(padding) = node.get_prop_f32("padding") {
        EdgeInsets::all(padding)
    } else {
        EdgeInsets::zero()
    }
}

/// Parse edge insets from a string
pub fn parse_edge_insets_from_string(insets_str: &str) -> Option<EdgeInsets> {
    let parts: Vec<&str> = insets_str.split(',').collect();
    if parts.len() == 4 {
        let top = parts[0].parse::<f32>().ok()?;
        let right = parts[1].parse::<f32>().ok()?;
        let bottom = parts[2].parse::<f32>().ok()?;
        let left = parts[3].parse::<f32>().ok()?;
        Some(EdgeInsets::new(top, right, bottom, left))
    } else {
        None
    }
}