use crate::components::scroll::ScrollProps;
use crate::render::node::RenderNode;
use crate::components::base_props::{BaseComponentProps, utils::apply_base_props};
use super::utils::{generate_unique_id, add_children, set_optional_prop};

pub fn transform_scroll(props: &ScrollProps) -> RenderNode {
    let mut node = RenderNode::new(&generate_unique_id("scroll"), "Scroll");
    
    node.set_prop("direction", format!("{:?}", props.direction));
    
    set_optional_prop(&mut node, "shows_indicators", &props.shows_indicators);
    set_optional_prop(&mut node, "scrollbar_width", &props.scrollbar_width);
    set_optional_prop(&mut node, "scrollbar_margin", &props.scrollbar_margin);
    
    if let Some(color) = &props.scrollbar_color {
        node.set_prop("scrollbar_color", color.to_css_string());
    }
    
    set_optional_prop(&mut node, "scroll_enabled", &props.scroll_enabled);
    set_optional_prop(&mut node, "paging_enabled", &props.paging_enabled);
    set_optional_prop(&mut node, "always_bounces_horizontal", &props.always_bounces_horizontal);
    set_optional_prop(&mut node, "always_bounces_vertical", &props.always_bounces_vertical);
    
    if let Some(rate) = &props.deceleration_rate {
        node.set_prop("deceleration_rate", format!("{:?}", rate));
    }
    
    if let Some(insets) = &props.content_insets {
        let inset_str = format!(
            "{},{},{},{}",
            insets.top.unwrap_or(0.0),
            insets.left.unwrap_or(0.0),
            insets.bottom.unwrap_or(0.0),
            insets.right.unwrap_or(0.0)
        );
        node.set_prop("content_inset", inset_str);
    }
    
    if let Some(style) = &props.indicator_style {
        node.set_prop("indicator_style", format!("{:?}", style));
    }
    
    let mut base_props = BaseComponentProps::new();
    
    base_props.width = props.width;
    base_props.height = props.height;
    base_props.min_width = props.min_width;
    base_props.max_width = props.max_width;
    base_props.min_height = props.min_height;
    base_props.max_height = props.max_height;
    
    base_props.background = props.background_color.clone();
    base_props.border_width = props.border_width;
    base_props.border_color = props.border_color.clone();
    base_props.border_radius = props.border_radius;
    base_props.border_style = props.border_style.clone();
    
    base_props.padding = props.padding;
    base_props.edge_insets = props.edge_insets.clone();
    base_props.opacity = props.opacity;
    
    base_props.accessibility_label = props.accessibility_label.clone();
    
    apply_base_props(&mut node, &base_props);
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}