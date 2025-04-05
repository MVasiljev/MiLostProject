use crate::divider::DividerProps;
use crate::render::node::RenderNode;
use super::utils::{generate_unique_id, set_optional_prop};

pub fn transform_divider(props: &DividerProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("divider"), "Divider");
    
    set_optional_prop(&mut node, "thickness", &props.thickness);
    
    if let Some(color) = &props.color {
        node.set_prop("color", format!("{:?}", color));
    }
    
    if let Some(style) = &props.style {
        node.set_prop("style", format!("{:?}", style));
    }
    
    set_optional_prop(&mut node, "padding", &props.padding);
    
    if let Some(label) = &props.label {
        node.set_prop("label", label.clone());
    }
    
    if let Some(label_color) = &props.label_color {
        node.set_prop("label_color", format!("{:?}", label_color));
    }
    
    set_optional_prop(&mut node, "label_padding", &props.label_padding);
    set_optional_prop(&mut node, "dash_length", &props.dash_length);
    set_optional_prop(&mut node, "gap_length", &props.gap_length);
    set_optional_prop(&mut node, "dot_radius", &props.dot_radius);
    set_optional_prop(&mut node, "dot_spacing", &props.dot_spacing);
    
    node
}