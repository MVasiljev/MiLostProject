use crate::components::base_props::BaseComponentProps;
use crate::components::base_props_utils::apply_base_props;
use crate::components::divider::{DividerProps, DividerStyle, LabelPosition};
use crate::render::node::RenderNode;
use crate::render::property::keys;
use super::utils::{generate_unique_id, set_optional_prop};

pub fn transform_divider(props: &DividerProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("divider"), "Divider");
    
    set_optional_prop(&mut node, keys::THICKNESS, &props.thickness);
    
    if let Some(color) = &props.color {
        node.set_prop(keys::BORDER_COLOR, color.clone());
    }
    
    if let Some(style) = &props.style {
        node.set_prop("divider_style", format!("{:?}", style));
    }
    
    set_optional_prop(&mut node, keys::PADDING, &props.padding);
    set_optional_prop(&mut node, "dash_length", &props.dash_length);
    set_optional_prop(&mut node, "gap_length", &props.gap_length);
    set_optional_prop(&mut node, "dot_radius", &props.dot_radius);
    set_optional_prop(&mut node, "dot_spacing", &props.dot_spacing);
    
    if let Some(label) = &props.label {
        node.set_prop(keys::LABEL, label.clone());
    }
    
    if let Some(label_color) = &props.label_color {
        node.set_prop("label_color", label_color.clone());
    }
    
    set_optional_prop(&mut node, "label_padding", &props.label_padding);
    
    if let Some(label_pos) = &props.label_position {
        node.set_prop("label_position", format!("{:?}", label_pos));
    }
    
    if let Some(gradient_colors) = &props.gradient_colors {
        node.set_prop("gradient_color_count", gradient_colors.len().to_string());
        for (i, color) in gradient_colors.iter().enumerate() {
            node.set_prop(&format!("gradient_color_{}", i), color.clone());
        }
    }
    
    if let Some(gradient_direction) = &props.gradient_direction {
        node.set_prop("gradient_direction", gradient_direction.clone());
    }
    
    let mut base_props = BaseComponentProps::new();
    
    base_props.opacity = props.opacity;
    base_props.border_radius = props.border_radius;
    
    if let Some(semantic_label) = &props.semantic_label {
        base_props.accessibility_label = Some(semantic_label.clone());
    }
    
    if let Some(accessibility_hint) = &props.accessibility_hint {
        base_props.accessibility_hint = Some(accessibility_hint.clone());
    }
    
    apply_base_props(&mut node, &base_props);
    
    node
}