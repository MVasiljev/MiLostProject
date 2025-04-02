
use crate::UIComponent;
use super::node::RenderNode;

pub fn render(component: &UIComponent) -> RenderNode {
    match component {
        UIComponent::Text(props) => {
            let mut node = RenderNode::new("text", "Text");
            node.set_prop("content", props.content.clone());
            if let Some(style) = &props.font_style {
                node.set_prop("font_style", format!("{:?}", style));
            }
            if let Some(color) = &props.color {
                node.set_prop("color", format!("{:?}", color));
            }
            node
        },

        UIComponent::Button(props) => {
            let mut node = RenderNode::new("button", "Button");
            node.set_prop("label", props.label.clone());
            if let Some(on_tap) = &props.on_tap {
                node.set_prop("on_tap", on_tap.clone());
            }
            node
        },

        UIComponent::VStack(props) => {
            let mut node = RenderNode::new("vstack", "VStack");
            if let Some(spacing) = props.spacing {
                node.set_prop("spacing", spacing.to_string());
            }
            if let Some(padding) = props.padding {
                node.set_prop("padding", padding.to_string());
            }
            if let Some(bg) = &props.background {
                node.set_prop("background", format!("{:?}", bg));
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::HStack(props) => {
            let mut node = RenderNode::new("hstack", "HStack");
            if let Some(spacing) = props.spacing {
                node.set_prop("spacing", spacing.to_string());
            }
            if let Some(padding) = props.padding {
                node.set_prop("padding", padding.to_string());
            }
            if let Some(bg) = &props.background {
                node.set_prop("background", format!("{:?}", bg));
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::ZStack(props) => {
            let mut node = RenderNode::new("zstack", "ZStack");
            if let Some(alignment) = &props.alignment {
                node.set_prop("alignment", alignment.clone());
            }
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::Image(props) => {
            let mut node = RenderNode::new("image", "Image");
            node.set_prop("src", props.src.clone());
            if let Some(alt) = &props.alt {
                node.set_prop("alt", alt.clone());
            }
            node
        },

        UIComponent::Scroll(props) => {
            let mut node = RenderNode::new("scroll", "Scroll");
            node.set_prop("direction", format!("{:?}", props.direction));
            
            for child in &props.children {
                let child_node = render(child);
                node.add_child(child_node);
            }
            
            node
        },

        UIComponent::Spacer(props) => {
            let mut node = RenderNode::new("spacer", "Spacer");
            if let Some(size) = props.size {
                node.set_prop("size", size.to_string());
            }
            node
        },

        UIComponent::Divider(props) => {
            let mut node = RenderNode::new("divider", "Divider");
            if let Some(thickness) = props.thickness {
                node.set_prop("thickness", thickness.to_string());
            }
            if let Some(color) = &props.color {
                node.set_prop("color", format!("{:?}", color));
            }
            node
        },
    }
}