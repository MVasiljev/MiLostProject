use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::render::components::base_renderer::BaseRenderer;

pub struct HStackRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for HStackRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        BaseRenderer::draw_background_and_borders(context, node, frame)?;
               
        Ok(())
    }
}