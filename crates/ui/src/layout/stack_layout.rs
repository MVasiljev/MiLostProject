use crate::render::node::RenderNode;
use super::layout_engine::{LayoutMeasurement, LayoutPositioning};
use super::flex_layout::{measure_flex, position_flex_children, FlexDirection};
use super::types::{Rect, Size};

pub fn measure_vstack(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    measure_flex(node, available_size, engine, FlexDirection::Vertical)
}

pub fn measure_hstack(node: &RenderNode, available_size: Size, engine: &mut impl LayoutMeasurement) -> Size {
    measure_flex(node, available_size, engine, FlexDirection::Horizontal)
}

pub fn position_vstack_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning
) {
    position_flex_children(node, frame, engine, FlexDirection::Vertical)
}

pub fn position_hstack_children(
    node: &RenderNode, 
    frame: Rect, 
    engine: &mut impl LayoutPositioning
) {
    position_flex_children(node, frame, engine, FlexDirection::Horizontal)
}