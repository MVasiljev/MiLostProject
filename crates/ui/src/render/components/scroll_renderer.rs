use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{
    draw_background, 
    draw_border, 
    parse_color,
    draw_scrollbar
};

pub struct ScrollRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ScrollRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        draw_background(context, node, frame)?;
        draw_border(context, node, frame)?;
        
        let show_scrollbars = node.get_prop_bool("shows_indicators").unwrap_or(false);
        
        if !show_scrollbars {
            return Ok(());
        }
        
        let direction = node.get_prop_as_string("direction")
            .unwrap_or_else(|| "Vertical".to_string());
        
        let content_size = node.get_prop_f32("content_size").unwrap_or(0.0);
        let scroll_position = node.get_prop_f32("scroll_position").unwrap_or(0.0);
        
        let scrollbar_color = node.get_prop_as_string("scrollbar_color")
            .map(|c| parse_color(&c))
            .unwrap_or_else(|| "#cccccc".to_string());
        
        let scrollbar_width = node.get_prop_f32("scrollbar_width").unwrap_or(6.0);
        let scrollbar_margin = node.get_prop_f32("scrollbar_margin").unwrap_or(2.0);
        
        if content_size > 0.0 {
            draw_scrollbar(
                context, 
                frame, 
                direction.as_str(), 
                content_size, 
                scroll_position, 
                scrollbar_color, 
                scrollbar_width, 
                scrollbar_margin
            )?;
        }
        
        Ok(())
    }
}