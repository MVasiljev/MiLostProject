use crate::zstack::{ZStackProps, ZStackAlignment};
use crate::render::node::RenderNode;
use crate::UIComponent;
use crate::components::base_props::utils::apply_base_props;
use crate::components::base_props::BaseComponentProps;
use super::utils::{generate_unique_id, set_optional_prop, set_edge_insets, add_children};

pub fn transform_zstack(props: &ZStackProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("zstack"), "ZStack");
    
    if let Some(alignment) = &props.alignment {
        let alignment_str = match alignment {
            ZStackAlignment::Center => "center",
            ZStackAlignment::TopLeading => "topleading",
            ZStackAlignment::Top => "top",
            ZStackAlignment::TopTrailing => "toptrailing",
            ZStackAlignment::Leading => "leading",
            ZStackAlignment::Trailing => "trailing",
            ZStackAlignment::BottomLeading => "bottomleading",
            ZStackAlignment::Bottom => "bottom",
            ZStackAlignment::BottomTrailing => "bottomtrailing",
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
        node.set_prop("layout_priority", priority.to_string());
    }
    
    if let Some(bg) = &props.background {
        node.set_prop("background", format!("{:?}", bg));
    }
    
    let mut base_props = BaseComponentProps::new();
    
    if let Some(bg) = &props.background {
        base_props.background = Some(bg.clone());
    }
    
    if let Some(ei) = &props.edge_insets {
        base_props.edge_insets = Some(ei.clone());
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
    
    if let Some(clip) = props.clip_to_bounds {
        base_props.clip_to_bounds = Some(clip);
    }
    
    apply_base_props(&mut node, &base_props);
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}