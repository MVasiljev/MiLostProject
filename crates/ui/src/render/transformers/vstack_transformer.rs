use crate::stack::{VStackProps, LayoutPriority, Gradient};
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
            LayoutPriority::Custom(val) => {
                node.set_prop("custom_layout_priority", val.to_string());
                "custom"
            }
        };
        node.set_prop("layout_priority", priority_str.to_string());
    }
    
    set_optional_prop(&mut node, "equal_spacing", &props.equal_spacing);
    
    if let Some(radius) = props.shadow_radius {
        node.set_prop("shadow_radius", radius.to_string());
        
        if let Some(color) = &props.shadow_color {
            node.set_prop("shadow_color", format!("{:?}", color));
        }
        
        if let Some(offset) = props.shadow_offset {
            node.set_prop("shadow_offset_x", offset.0.to_string());
            node.set_prop("shadow_offset_y", offset.1.to_string());
        }
    }
    
    if let Some(gradient) = &props.gradient {
        node.set_prop("gradient_type", if gradient.is_radial { "radial" } else { "linear" }.to_string());
        
        node.set_prop("gradient_color_count", gradient.colors.len().to_string());
        for (i, color) in gradient.colors.iter().enumerate() {
            node.set_prop(&format!("gradient_color_{}", i), format!("{:?}", color));
            if i < gradient.positions.len() {
                node.set_prop(&format!("gradient_position_{}", i), gradient.positions[i].to_string());
            }
        }
        
        node.set_prop("gradient_start_x", gradient.start_point.0.to_string());
        node.set_prop("gradient_start_y", gradient.start_point.1.to_string());
        node.set_prop("gradient_end_x", gradient.end_point.0.to_string());
        node.set_prop("gradient_end_y", gradient.end_point.1.to_string());
    }
    
    if let Some(width) = props.border_width {
        node.set_prop("border_width", width.to_string());
        
        if let Some(color) = &props.border_color {
            node.set_prop("border_color", format!("{:?}", color));
        }
        
        if let Some(radius) = props.border_radius {
            node.set_prop("border_radius", radius.to_string());
        }
    }
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}