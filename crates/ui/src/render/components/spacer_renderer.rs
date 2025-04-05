use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;

pub struct SpacerRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for SpacerRenderer {
    fn render(&self, _node: &RenderNode, _context: &T, _frame: Rect) -> Result<(), String> {
        // Spacer is typically transparent, so no rendering is needed
        Ok(())
    }
}