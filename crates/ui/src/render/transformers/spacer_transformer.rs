use crate::spacer::{SpacerProps, SpacerStrategy};
use crate::render::node::RenderNode;
use crate::components::base_props::{BaseComponentProps, utils::apply_base_props};
use super::utils::{generate_unique_id, add_children};

pub fn transform_spacer(props: &SpacerProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("spacer"), "Spacer");
    
    if let Some(strategy) = &props.strategy {
        match strategy {
            SpacerStrategy::Fixed(size) => {
                node.set_prop("strategy", "Fixed");
                node.set_prop("size", *size);
            },
            SpacerStrategy::Flexible(grow) => {
                node.set_prop("strategy", "Flexible");
                node.set_prop("flex_grow", *grow);
            },
            SpacerStrategy::Minimum(size) => {
                node.set_prop("strategy", "Minimum");
                node.set_prop("min_size", *size);
            },
            SpacerStrategy::Maximum(size) => {
                node.set_prop("strategy", "Maximum");
                node.set_prop("max_size", *size);
            }
        }
    }
    
    let mut base_props = BaseComponentProps::new();
    
    base_props.background = props.background.clone();
    base_props.opacity = props.opacity;
    base_props.border_width = props.border_width;
    base_props.border_color = props.border_color.clone();
    base_props.border_radius = props.border_radius;
    base_props.border_style = props.border_style.clone();
    base_props.edge_insets = props.edge_insets.clone();
    base_props.accessibility_label = props.accessibility_label.clone();
    base_props.accessibility_hint = props.accessibility_hint.clone();
    base_props.is_accessibility_element = props.is_accessibility_element;
    
    apply_base_props(&mut node, &base_props);
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}