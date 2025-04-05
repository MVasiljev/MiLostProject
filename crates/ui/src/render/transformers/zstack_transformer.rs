use crate::zstack::{ZStackProps, ZStackAlignment};
use crate::render::node::RenderNode;
use crate::UIComponent;
use super::utils::{generate_unique_id, add_children};

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
    
    add_children(&mut node, &props.children, crate::render::component::render);
    
    node
}