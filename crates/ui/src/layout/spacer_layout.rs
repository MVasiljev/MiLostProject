use crate::render::node::RenderNode;
use crate::layout::types::Size;

/// Measure spacer component based on strategy and available space
pub fn measure_spacer(node: &RenderNode, available_size: Size) -> Size {
    // Determine parent type
    let parent_type = node.get_prop("_parent_type")
        .cloned()
        .unwrap_or_else(|| "Unknown".to_string());
    
    // Get strategy and related properties
    let strategy = node.get_prop("strategy")
        .map(|s| s.as_str());
    
    let size = node.get_prop_f32("size");
    let min_size = node.get_prop_f32("min_size").unwrap_or(0.0);
    let max_size = node.get_prop_f32("max_size").unwrap_or(f32::MAX);
    let flex_grow = node.get_prop_f32("flex_grow").unwrap_or(0.0);
    
    // Calculate size based on parent type and strategy
    match parent_type.as_str() {
        "VStack" => {
            let height = match (strategy, size, flex_grow) {
                (Some("Fixed"), Some(s), _) => s,
                (Some("Flexible"), _, fg) => available_size.height * fg,
                (Some("Minimum"), _, _) => min_size,
                (Some("Maximum"), _, _) => max_size.min(available_size.height),
                _ => 0.0
            }.max(min_size).min(max_size);
            
            Size::new(available_size.width, height)
        },
        "HStack" => {
            let width = match (strategy, size, flex_grow) {
                (Some("Fixed"), Some(s), _) => s,
                (Some("Flexible"), _, fg) => available_size.width * fg,
                (Some("Minimum"), _, _) => min_size,
                (Some("Maximum"), _, _) => max_size.min(available_size.width),
                _ => 0.0
            }.max(min_size).min(max_size);
            
            Size::new(width, available_size.height)
        },
        _ => {
            let dimension = match (strategy, size, flex_grow) {
                (Some("Fixed"), Some(s), _) => s,
                (Some("Flexible"), _, fg) => f32::max(available_size.width, available_size.height) * fg,
                (Some("Minimum"), _, _) => min_size,
                (Some("Maximum"), _, _) => max_size.min(f32::max(available_size.width, available_size.height)),
                _ => 0.0
            }.max(min_size).min(max_size);
            
            Size::new(dimension, dimension)
        }
    }
}