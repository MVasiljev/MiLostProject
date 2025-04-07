use crate::render::node::RenderNode;
use super::types::Size;
use super::layout_utils::parse_edge_insets;

pub fn measure_text(node: &RenderNode, available_size: Size) -> Size {
    let content = node.get_prop_as_string("content").unwrap_or_default();
    
    let font_style = node.get_prop_as_string("font_style").unwrap_or_else(|| "Body".to_string());
    
    let base_font_size = match font_style.as_str() {
        "Title" | "FontStyle::Title" => 24.0,
        "Headline" | "FontStyle::Headline" => 20.0,
        "Subheadline" | "FontStyle::Subheadline" => 18.0,
        "Body" | "FontStyle::Body" => 16.0,
        "Callout" | "FontStyle::Callout" => 14.0,
        "Caption" | "FontStyle::Caption" => 12.0,
        "Footnote" | "FontStyle::Footnote" => 10.0,
        _ => 16.0,
    };
    
    let font_size = node.get_prop_f32("font_size").unwrap_or(base_font_size);
    
    let min_font_size = node.get_prop_f32("min_font_size").unwrap_or(0.0);
    let max_font_size = node.get_prop_f32("max_font_size").unwrap_or(f32::MAX);
    let font_size = font_size.max(min_font_size).min(max_font_size);
    
    let line_height_multiplier = node.get_prop_f32("line_height").unwrap_or(1.2);
    let line_height = font_size * line_height_multiplier;
    
    let letter_spacing = node.get_prop_f32("letter_spacing").unwrap_or(0.0);
    let char_width_factor = if letter_spacing > 0.0 {
        1.0 + (letter_spacing / font_size) * 0.5
    } else {
        1.0
    };
    
    let char_width_base = font_size * 0.6;
    let char_width = char_width_base * char_width_factor;
    
    let italic_factor = node.get_prop_bool("italic").unwrap_or(false) as u8 as f32 * 0.1 + 1.0;
    
    let weight_factor = match node.get_prop_as_string("font_weight").as_deref() {
        Some("Bold") | Some("ExtraBold") | Some("Black") => 1.05,
        _ => 1.0,
    };
    
    let line_count = if content.contains('\n') {
        content.matches('\n').count() + 1
    } else {
        1
    };
    
    let max_lines = node.get_prop("max_lines")
        .and_then(|v| v.as_integer())
        .map(|v| v as usize)
        .unwrap_or(usize::MAX);
    
    let line_count = line_count.min(max_lines);
    
    let mut wrapped_line_count = line_count;
    let text_width = content.len() as f32 * char_width * italic_factor * weight_factor;
    
    let soft_wrap = node.get_prop_bool("soft_wrap").unwrap_or(true);
    
    if soft_wrap && text_width > available_size.width && available_size.width > 0.0 {
        let chars_per_line = (available_size.width / (char_width * italic_factor * weight_factor)).floor() as usize;
        if chars_per_line > 0 {
            let wrap_lines = (content.len() as f32 / chars_per_line as f32).ceil() as usize;
            wrapped_line_count = line_count + wrap_lines - 1;
            wrapped_line_count = wrapped_line_count.min(max_lines);
        }
    }
    
    let text_height = line_height * wrapped_line_count as f32;
    let constrained_width = text_width.min(available_size.width);
    
    let padding = node.get_prop_f32("padding").unwrap_or(0.0);
    let insets = parse_edge_insets(node);
    
    let padded_width = constrained_width + (padding * 2.0) + insets.horizontal_insets();
    let padded_height = text_height + (padding * 2.0) + insets.vertical_insets();
    
    let width = node.get_prop_f32("width").unwrap_or(padded_width);
    let height = node.get_prop_f32("height").unwrap_or(padded_height);
    
    let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
    let max_width = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
    let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
    let max_height = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
    
    let final_width = width.max(min_width).min(max_width);
    let final_height = height.max(min_height).min(max_height);
    
    Size::new(final_width, final_height)
}