use crate::render::node::RenderNode;
use super::types::{Size};

/// Measure Text component
pub fn measure_text(node: &RenderNode, available_size: Size) -> Size {
    let content = node.get_prop("content")
        .cloned()
        .unwrap_or_else(|| "".to_string());
    
    let font_style = node.get_prop("font_style")
        .cloned()
        .unwrap_or_else(|| "Body".to_string());
    
    let text_height = match font_style.as_str() {
        "Title" | "FontStyle::Title" => 32.0,
        "Body" | "FontStyle::Body" => 18.0,
        "Caption" | "FontStyle::Caption" => 14.0,
        _ => 18.0,
    };
    
    let char_width = match font_style.as_str() {
        "Title" | "FontStyle::Title" => 18.0,
        "Body" | "FontStyle::Body" => 10.0,
        "Caption" | "FontStyle::Caption" => 8.0,
        _ => 10.0,
    };
    
    let text_width = (content.len() as f32 * char_width).min(available_size.width);
    
    Size::new(text_width, text_height)
}