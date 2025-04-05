use crate::stack::{VStackProps, LayoutPriority};
use crate::VStackAlignment;
use crate::render::node::RenderNode;
use crate::UIComponent;
use super::utils::{generate_unique_id, set_optional_prop, set_edge_insets, add_children};

pub fn transform_vstack(props: &VStackProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("vstack"), "VStack");
    
    set_optional_prop(&mut node, "spacing", &props.spacing);
    set_optional_prop(&mut node, "padding", &props.padding);
    
    if let Some(bg) = &props.background {
        node.set_prop("background", format!("{:?}", bg));
    }
    
    if let Some(alignment) = &props.alignment {
        let alignment_str = match alignment {
            VStackAlignment::Leading => "leading",
            VStackAlignment::Center => "center",
            VStackAlignment::Trailing => "trailing",
        };
        
        node.set_prop("alignment", alignment_str.to_string());
    }
    
    set_edge_insets(&mut node, &props.edge_insets);
    
    set_optional_prop(&mut node, "min_width", &props.min_width);
    set_optional_prop(&mut node, "ideal_width", &props.ideal_width);
    set_optional_prop(&mut node, "max_width", &props.max_width);
    set_optional_prop(&mut node, "min_height", &props.min_height);
    set_optional_prop(&mut node, "ideal_height", &props.ideal_height);
    set_optional_prop(&mut node, "max_height", &props.max_height);
    
    set_optional_prop(&mut node, "clip_to_bounds", &props.clip_to_bounds);
    
    if let Some(priority) = &props.layout_priority {
        let priority_str = match priority {
            LayoutPriority::Low => "low",
            LayoutPriority::Medium => "medium",
            LayoutPriority::High => "high",
            LayoutPriority::Custom(_) => "custom",
        };
        node.set_prop("layout_priority", priority_str.to_string());
    }
    
    set_optional_prop(&mut node, "equal_spacing", &props.equal_spacing);
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}