use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{
    draw_background, 
    draw_border, 
    draw_rounded_rect
};

pub struct SpacerRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for SpacerRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
        
        context.begin_path()?;
        draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, border_radius)?;
        
        draw_background(context, node, frame)?;
        draw_border(context, node, frame)?;
        
        Ok(())
    }
}