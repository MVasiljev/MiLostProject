use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{
    draw_background, 
    draw_border, 
    draw_rounded_rect, 
    create_gradient,
    apply_shadow,
    clear_shadow
};

pub struct VStackRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for VStackRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let shadow_applied = apply_shadow(
            context, 
            node.get_prop_as_string("shadow_color").as_deref(),
            node.get_prop_f32("shadow_offset_x"),
            node.get_prop_f32("shadow_offset_y"),
            node.get_prop_f32("shadow_radius")
        )?;
        
        let gradient_id = create_gradient(context, node, frame)?;
        
        let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
        
        context.begin_path()?;
        draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, border_radius)?;
        
        if let Some(gradient_id) = gradient_id {
            context.set_fill_gradient(&gradient_id)?;
        } else {
            draw_background(context, node, frame)?;
        }
        
        context.fill()?;
        
        draw_border(context, node, frame)?;
        
        clear_shadow(context, shadow_applied)?;
        
        Ok(())
    }
}