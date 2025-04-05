use crate::spacer::{SpacerProps, SpacerStrategy};
use crate::render::node::RenderNode;
use super::utils::{generate_unique_id, add_children};

pub fn transform_spacer(props: &SpacerProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("spacer"), "Spacer");
    
    if let Some(strategy) = &props.strategy {
        match strategy {
            SpacerStrategy::Fixed(size) => {
                node.set_prop("strategy", "Fixed".to_string());
                node.set_prop("size", size.to_string());
            },
            SpacerStrategy::Flexible(grow) => {
                node.set_prop("strategy", "Flexible".to_string());
                node.set_prop("flex_grow", grow.to_string());
            },
            SpacerStrategy::Minimum(size) => {
                node.set_prop("strategy", "Minimum".to_string());
                node.set_prop("min_size", size.to_string());
            },
            SpacerStrategy::Maximum(size) => {
                node.set_prop("strategy", "Maximum".to_string());
                node.set_prop("max_size", size.to_string());
            }
        }
    }
    
    if let Some(label) = &props.accessibility_label {
        node.set_prop("accessibility_label", label.clone());
    }
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}