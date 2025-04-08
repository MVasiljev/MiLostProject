use crate::components::text::{TextProps, TextShadow};
use crate::render::node::RenderNode;
use crate::render::property::{Property, keys};
use crate::components::base_props::{BaseComponentProps, utils::apply_base_props};
use super::utils::{generate_unique_id, set_optional_prop, set_edge_insets};

pub fn transform_text(props: &TextProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("text"), "Text");
    
    node.set_prop("content", props.content.clone());
    
    if let Some(color) = &props.color {
        node.set_prop(keys::TEXT_COLOR, color.clone());
    }
    
    if let Some(style) = &props.font_style {
        node.set_prop("font_style", format!("{:?}", style));
    }
    
    if let Some(font_size) = props.font_size {
        node.set_prop(keys::FONT_SIZE, font_size);
    }
    
    if let Some(font_family) = &props.font_family {
        node.set_prop("font_family", font_family.clone());
    }
    
    if let Some(font_weight) = &props.font_weight {
        node.set_prop(keys::FONT_WEIGHT, font_weight.clone());
        node.set_prop("font_weight_value", font_weight.to_css_weight());
    }
    
    if let Some(font_slant) = &props.font_slant {
        node.set_prop(keys::FONT_SLANT, font_slant.clone());
    }
    
    if let Some(font_width) = &props.font_width {
        node.set_prop(keys::FONT_WIDTH, font_width.clone());
    }
    
    if let Some(line_height) = props.line_height {
        node.set_prop(keys::LINE_HEIGHT, line_height);
    }
    
    if let Some(letter_spacing) = props.letter_spacing {
        node.set_prop(keys::LETTER_SPACING, letter_spacing);
    }
    
    if let Some(word_spacing) = props.word_spacing {
        node.set_prop("word_spacing", word_spacing);
    }
    
    if let Some(italic) = props.italic {
        node.set_prop("italic", italic);
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
    
    if let Some(decoration_style) = &props.decoration_style {
        node.set_prop("decoration_style", decoration_style.clone());
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
    
    if let Some(min_font_size) = props.min_font_size {
        node.set_prop("min_font_size", min_font_size);
    }
    
    if let Some(max_font_size) = props.max_font_size {
        node.set_prop("max_font_size", max_font_size);
    }
    
    if let Some(truncation_mode) = &props.truncation_mode {
        node.set_prop("truncation_mode", format!("{:?}", truncation_mode));
    }
    
    if let Some(soft_wrap) = props.soft_wrap {
        node.set_prop("soft_wrap", soft_wrap);
    }
    
    if let Some(shadow) = &props.shadow {
        node.set_prop("shadow_color", shadow.color.clone());
        node.set_prop("shadow_offset_x", shadow.offset_x);
        node.set_prop("shadow_offset_y", shadow.offset_y);
        node.set_prop("shadow_blur_radius", shadow.blur_radius);
    }
    
    if let Some(underline) = props.underline {
        node.set_prop("underline", underline);
    }
    
    if let Some(strikethrough) = props.strikethrough {
        node.set_prop("strikethrough", strikethrough);
    }
    
    if let Some(selectable) = props.selectable {
        node.set_prop("selectable", selectable);
    }
    
    if let Some(exclude) = props.exclude_from_semantics {
        node.set_prop("exclude_from_semantics", exclude);
    }
    
    if let Some(locale) = &props.locale {
        node.set_prop("locale", locale.clone());
    }
    
    if let Some(text_direction) = &props.text_direction {
        node.set_prop("text_direction", text_direction.clone());
    }
    
    if let Some(text_scaling_factor) = props.text_scaling_factor {
        node.set_prop("text_scaling_factor", text_scaling_factor);
    }
    
    let mut base_props = BaseComponentProps::new();
    
    if let Some(w) = props.width {
        base_props.width = Some(w);
    }
    
    if let Some(h) = props.height {
        base_props.height = Some(h);
    }
    
    if let Some(min_w) = props.min_width {
        base_props.min_width = Some(min_w);
    }
    
    if let Some(max_w) = props.max_width {
        base_props.max_width = Some(max_w);
    }
    
    if let Some(min_h) = props.min_height {
        base_props.min_height = Some(min_h);
    }
    
    if let Some(max_h) = props.max_height {
        base_props.max_height = Some(max_h);
    }
    
    if let Some(p) = props.padding {
        base_props.padding = Some(p);
    }
    
    if let Some(ei) = &props.edge_insets {
        base_props.edge_insets = Some(ei.clone());
    }
    
    if let Some(bg) = &props.background_color {
        base_props.background = Some(bg.clone());
    }
    
    if let Some(o) = props.opacity {
        base_props.opacity = Some(o);
    }
    
    if let Some(bw) = props.border_width {
        base_props.border_width = Some(bw);
    }
    
    if let Some(bc) = &props.border_color {
        base_props.border_color = Some(bc.clone());
    }
    
    if let Some(br) = props.border_radius {
        base_props.border_radius = Some(br);
    }
    
    if let Some(bs) = &props.border_style {
        base_props.border_style = Some(bs.clone());
    }
    
    if let Some(sr) = props.shadow_radius {
        base_props.shadow_radius = Some(sr);
    }
    
    if let Some(sc) = &props.shadow_color {
        base_props.shadow_color = Some(sc.clone());
    }
    
    if let Some(so) = &props.shadow_offset {
        base_props.shadow_offset_x = Some(so.0);
        base_props.shadow_offset_y = Some(so.1);
    }
    
    if let Some(se) = &props.shadow_effect {
        base_props.shadow_effect = Some(se.clone());
    }
    
    if let Some(clip) = props.clip_to_bounds {
        base_props.clip_to_bounds = Some(clip);
    }
    
    if let Some(a_label) = &props.accessibility_label {
        base_props.accessibility_label = Some(a_label.clone());
    }
    
    if let Some(a_hint) = &props.accessibility_hint {
        base_props.accessibility_hint = Some(a_hint.clone());
    }
    
    if let Some(a_element) = props.is_accessibility_element {
        base_props.is_accessibility_element = Some(a_element);
    }
    
    apply_base_props(&mut node, &base_props);
    
    node
}