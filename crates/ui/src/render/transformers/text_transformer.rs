use crate::text::TextProps;
use crate::render::node::RenderNode;
use crate::render::property::{Property, keys};
use crate::components::base_props::{BaseComponentProps, utils::apply_base_props};
use super::utils::generate_unique_id;

pub fn transform_text(props: &TextProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("text"), "Text");
    
    node.set_prop(keys::TEXT, props.content.clone());
    
    if let Some(color) = &props.color {
        node.set_prop(keys::TEXT_COLOR, color.clone());
    }
    
    if let Some(style) = &props.font_style {
        node.set_prop("font_style", format!("{:?}", style));
    }
    
    if let Some(font_size) = props.font_size {
        node.set_prop(keys::FONT_SIZE, font_size);
    }
    
    if let Some(font_weight) = &props.font_weight {
        node.set_prop(keys::FONT_WEIGHT, font_weight.clone());
    }
    
    if let Some(line_height) = props.line_height {
        node.set_prop(keys::LINE_HEIGHT, line_height);
    }
    
    if let Some(letter_spacing) = props.letter_spacing {
        node.set_prop(keys::LETTER_SPACING, letter_spacing);
    }
    
    if let Some(text_align) = &props.text_align {
        node.set_prop(keys::TEXT_ALIGNMENT, text_align.clone());
    }
    
    if let Some(text_decoration) = &props.text_decoration {
        node.set_prop("text_decoration", format!("{:?}", text_decoration));
    }
    
    if let Some(decoration_color) = &props.decoration_color {
        node.set_prop("decoration_color", decoration_color.clone());
    }
    
    if let Some(decoration_thickness) = props.decoration_thickness {
        node.set_prop("decoration_thickness", decoration_thickness);
    }
    
    if let Some(text_transform) = &props.text_transform {
        node.set_prop(keys::TEXT_TRANSFORM, text_transform.clone());
    }
    
    if let Some(max_lines) = props.max_lines {
        node.set_prop("max_lines", max_lines as i32);
    }
    
    if let Some(truncation_mode) = &props.truncation_mode {
        node.set_prop("truncation_mode", format!("{:?}", truncation_mode));
    }
    
    if let Some(soft_wrap) = props.soft_wrap {
        node.set_prop("soft_wrap", soft_wrap);
    }
    
    if let Some(background_color) = &props.background_color {
        node.set_prop(keys::BACKGROUND, background_color.clone());
    }
    
    if let Some(shadow) = &props.shadow {
        node.set_prop("shadow_color", shadow.color.clone());
        node.set_prop("shadow_offset_x", shadow.offset_x);
        node.set_prop("shadow_offset_y", shadow.offset_y);
        node.set_prop("shadow_blur_radius", shadow.blur_radius);
    }
    
    if let Some(opacity) = props.opacity {
        node.set_prop(keys::OPACITY, opacity);
    }
    
    if let Some(semantic_label) = &props.semantic_label {
        node.set_prop(keys::ACCESSIBILITY_LABEL, semantic_label.clone());
    }
    
    if let Some(exclude) = props.exclude_from_semantics {
        node.set_prop("exclude_from_semantics", exclude);
    }
    
    if let Some(underline) = props.underline {
        node.set_prop("underline", underline);
    }
    
    if let Some(strikethrough) = props.strikethrough {
        node.set_prop("strikethrough", strikethrough);
    }
    
    let mut base_props = BaseComponentProps::new();
    
    if let Some(w) = props.width {
        base_props.width = Some(w);
    }
    
    if let Some(h) = props.height {
        base_props.height = Some(h);
    }
    
    if let Some(p) = props.padding {
        base_props.padding = Some(p);
    }
    
    if let Some(bg) = &props.background_color {
        base_props.background = Some(bg.clone());
    }
    
    if let Some(o) = props.opacity {
        base_props.opacity = Some(o);
    }
    
    apply_base_props(&mut node, &base_props);
    
    node
}