use crate::UIComponent;
use super::node::RenderNode;
use super::transformers::*;

pub fn render(component: &UIComponent) -> RenderNode {
    match component {
        UIComponent::Text(props) => transform_text(props),
        UIComponent::Button(props) => transform_button(props),
        UIComponent::VStack(props) => transform_vstack(props),
        UIComponent::HStack(props) => transform_hstack(props),
        UIComponent::ZStack(props) => transform_zstack(props),
        UIComponent::Image(props) => transform_image(props),
        UIComponent::Scroll(props) => transform_scroll(props),
        UIComponent::Spacer(props) => transform_spacer(props),
        UIComponent::Divider(props) => transform_divider(props),
    }
}