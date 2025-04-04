use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{draw_background, draw_border, draw_rounded_rect};

pub struct ZStackRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ZStackRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        draw_background(context, node, frame)?;
        
        draw_border(context, node, frame)?;  
        
        Ok(())
    }
}