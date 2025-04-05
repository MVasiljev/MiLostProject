use crate::text::TextProps;
use crate::render::node::RenderNode;
use super::utils::generate_unique_id;

pub fn transform_text(props: &TextProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("text"), "Text");
    
    node.set_prop("content", props.content.clone());
    
    if let Some(style) = &props.font_style {
        node.set_prop("font_style", format!("{:?}", style));
    }
    
    if let Some(color) = &props.color {
        node.set_prop("color", format!("{:?}", color));
    }
    
    if let Some(font_size) = props.font_size {
        node.set_prop("font_size", font_size.to_string());
    }
    
    if let Some(font_weight) = &props.font_weight {
        node.set_prop("font_weight", format!("{:?}", font_weight));
    }
    
    if let Some(line_height) = props.line_height {
        node.set_prop("line_height", line_height.to_string());
    }
    
    if let Some(letter_spacing) = props.letter_spacing {
        node.set_prop("letter_spacing", letter_spacing.to_string());
    }
    
    if let Some(text_align) = &props.text_align {
        node.set_prop("text_align", format!("{:?}", text_align).to_lowercase());
    }
    
    if let Some(underline) = props.underline {
        node.set_prop("underline", underline.to_string());
    }
    
    if let Some(strikethrough) = props.strikethrough {
        node.set_prop("strikethrough", strikethrough.to_string());
    }
    
    if let Some(italic) = props.italic {
        node.set_prop("italic", italic.to_string());
    }
    
    if let Some(max_lines) = props.max_lines {
        node.set_prop("max_lines", max_lines.to_string());
    }
    
    if let Some(truncation_mode) = &props.truncation_mode {
        node.set_prop("truncation_mode", format!("{:?}", truncation_mode));
    }
    
    node
}