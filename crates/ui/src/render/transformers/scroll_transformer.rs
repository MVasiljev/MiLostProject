use crate::scroll::ScrollProps;
use crate::render::node::RenderNode;
use super::utils::{generate_unique_id, add_children, set_optional_prop};

pub fn transform_scroll(props: &ScrollProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("scroll"), "Scroll");
    
    node.set_prop("direction", format!("{:?}", props.direction));
    
    set_optional_prop(&mut node, "shows_indicators", &props.shows_indicators);
    
    if let Some(color) = &props.scrollbar_color {
        node.set_prop("scrollbar_color", format!("{:?}", color));
    }
    
    set_optional_prop(&mut node, "scrollbar_width", &props.scrollbar_width);
    set_optional_prop(&mut node, "scrollbar_margin", &props.scrollbar_margin);
    
    set_optional_prop(&mut node, "always_bounces_horizontal", &props.always_bounces_horizontal);
    set_optional_prop(&mut node, "always_bounces_vertical", &props.always_bounces_vertical);
    
    set_optional_prop(&mut node, "scroll_enabled", &props.scroll_enabled);
    set_optional_prop(&mut node, "paging_enabled", &props.paging_enabled);
    
    if let Some(rate) = &props.deceleration_rate {
        node.set_prop("deceleration_rate", format!("{:?}", rate));
    }
    
    if let Some(inset) = &props.content_inset {
        let inset_str = format!(
            "{},{},{},{}",
            inset.top.unwrap_or(0.0),
            inset.left.unwrap_or(0.0),
            inset.bottom.unwrap_or(0.0),
            inset.right.unwrap_or(0.0)
        );
        node.set_prop("content_inset", inset_str);
    }
    
    if let Some(style) = &props.indicator_style {
        node.set_prop("indicator_style", format!("{:?}", style));
    }
    
    if let Some(label) = &props.accessibility_label {
        node.set_prop("accessibility_label", label.clone());
    }
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}