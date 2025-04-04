use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::parse_color;

pub struct SpacerRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for SpacerRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let debug_mode = node.get_prop("debug_mode")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
            
        if debug_mode {
            let debug_color = node.get_prop("debug_color")
                .map(|c| parse_color(c))
                .unwrap_or_else(|| "#ffdddd".to_string());
                
            context.set_fill_color(&debug_color)?;
            context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
            
            context.set_stroke_color("#ff9999")?;
            context.set_line_width(1.0)?;
            context.begin_path()?;
            context.move_to(frame.x, frame.y)?;
            context.line_to(frame.x + frame.width, frame.y + frame.height)?;
            context.move_to(frame.x + frame.width, frame.y)?;
            context.line_to(frame.x, frame.y + frame.height)?;
            context.stroke()?;
        }
        
        Ok(())
    }
}