use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::shared::color::Color;
use crate::shared::edge_insets::EdgeInsets;

pub struct BaseRenderer;

impl BaseRenderer {
    pub fn draw_background_and_borders<T: DrawingContext>(
        context: &T,
        node: &RenderNode,
        frame: Rect
    ) -> Result<(), String> {
        let shadow_applied = Self::apply_shadow(context, node, frame)?;
        
        Self::draw_background(context, node, frame)?;
        
        Self::draw_border(context, node, frame)?;
        
        if shadow_applied {
            context.clear_shadow()?;
        }
        
        Ok(())
    }
    
    pub fn apply_shadow<T: DrawingContext>(
        context: &T,
        node: &RenderNode,
        frame: Rect
    ) -> Result<bool, String> {
        if let (Some(shadow_radius), Some(shadow_color)) = (
            node.get_prop_f32("shadow_radius"),
            node.get_prop_string("shadow_color")
        ) {
            let shadow_offset_x = node.get_prop_f32("shadow_offset_x").unwrap_or(0.0);
            let shadow_offset_y = node.get_prop_f32("shadow_offset_y").unwrap_or(0.0);
            
            context.set_shadow(shadow_offset_x, shadow_offset_y, shadow_radius, shadow_color)?;
            Ok(true)
        } else {
            Ok(false)
        }
    }
    
    pub fn draw_background<T: DrawingContext>(
        context: &T,
        node: &RenderNode,
        frame: Rect
    ) -> Result<(), String> {
        if let Some(background) = node.get_prop_string("background") {
            let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
            
            context.begin_path()?;
            
            if border_radius > 0.0 {
                Self::draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, border_radius)?;
            } else {
                context.rect(frame.x, frame.y, frame.width, frame.height)?;
            }
            
            if let Some(gradient_type) = node.get_prop_string("gradient_type") {
                Self::apply_gradient(context, node, frame, &gradient_type)?;
            } else {
                context.set_fill_color(&background)?;
            }
            
            context.fill()?;
        }
        
        Ok(())
    }
    
    pub fn draw_border<T: DrawingContext>(
        context: &T,
        node: &RenderNode,
        frame: Rect
    ) -> Result<(), String> {
        if let Some(border_width) = node.get_prop_f32("border_width") {
            if border_width <= 0.0 {
                return Ok(());
            }
            
            if let Some(border_color) = node.get_prop_string("border_color") {
                let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
                
                context.begin_path()?;
                
                if border_radius > 0.0 {
                    Self::draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, border_radius)?;
                } else {
                    context.rect(frame.x, frame.y, frame.width, frame.height)?;
                }
                
                context.set_stroke_color(&border_color)?;
                context.set_line_width(border_width)?;
                
                if let Some(border_style) = node.get_prop_string("border_style") {
                    match border_style.to_lowercase().as_str() {
                        "dashed" => {
                        },
                        "dotted" => {
                        },
                        _ => {}
                    }
                }
                
                context.stroke()?;
            }
        }
        
        Ok(())
    }
    
    pub fn draw_rounded_rect<T: DrawingContext>(
        context: &T,
        x: f32,
        y: f32,
        width: f32,
        height: f32,
        radius: f32
    ) -> Result<(), String> {
        let r = radius.min(width / 2.0).min(height / 2.0);
        
        context.move_to(x + r, y)?;
        context.line_to(x + width - r, y)?;
        context.arc(x + width - r, y + r, r, -std::f32::consts::FRAC_PI_2, 0.0, false)?;
        context.line_to(x + width, y + height - r)?;
        context.arc(x + width - r, y + height - r, r, 0.0, std::f32::consts::FRAC_PI_2, false)?;
        context.line_to(x + r, y + height)?;
        context.arc(x + r, y + height - r, r, std::f32::consts::FRAC_PI_2, std::f32::consts::PI, false)?;
        context.line_to(x, y + r)?;
        context.arc(x + r, y + r, r, std::f32::consts::PI, -std::f32::consts::FRAC_PI_2, false)?;
        
        Ok(())
    }
    
    pub fn apply_gradient<T: DrawingContext>(
        context: &T,
        node: &RenderNode,
        frame: Rect,
        gradient_type: &str
    ) -> Result<(), String> {
        let stop_count = node.get_prop_string("gradient_stop_count")
            .and_then(|s| s.parse::<usize>().ok())
            .unwrap_or(0);
            
        if stop_count == 0 {
            return Ok(());
        }
        
        let mut stops = Vec::with_capacity(stop_count);
        
        for i in 0..stop_count {
            if let (Some(color), Some(position_str)) = (
                node.get_prop_string(&format!("gradient_stop_{}_color", i)),
                node.get_prop_string(&format!("gradient_stop_{}_position", i))
            ) {
                if let Ok(position) = position_str.parse::<f32>() {
                    stops.push((position, color.clone()));
                }
            }
        }
        
        if stops.is_empty() {
            return Ok(());
        }
        
        let gradient_id = match gradient_type.to_lowercase().as_str() {
            "linear" => {
                let start_x = node.get_prop_f32("gradient_start_x").unwrap_or(frame.x);
                let start_y = node.get_prop_f32("gradient_start_y").unwrap_or(frame.y);
                let end_x = node.get_prop_f32("gradient_end_x").unwrap_or(frame.x + frame.width);
                let end_y = node.get_prop_f32("gradient_end_y").unwrap_or(frame.y + frame.height);
                
                context.create_linear_gradient(start_x, start_y, end_x, end_y, stops)?
            },
            "radial" => {
                let center_x = node.get_prop_f32("gradient_start_x").unwrap_or(frame.x + frame.width / 2.0);
                let center_y = node.get_prop_f32("gradient_start_y").unwrap_or(frame.y + frame.height / 2.0);
                let radius = node.get_prop_f32("gradient_radius")
                    .unwrap_or((frame.width.powi(2) + frame.height.powi(2)).sqrt() / 2.0);
                
                context.create_radial_gradient(center_x, center_y, 0.0, center_x, center_y, radius, stops)?
            },
            _ => {
                let start_x = frame.x;
                let start_y = frame.y;
                let end_x = frame.x + frame.width;
                let end_y = frame.y + frame.height;
                
                context.create_linear_gradient(start_x, start_y, end_x, end_y, stops)?
            }
        };
        
        context.set_fill_gradient(&gradient_id)?;
        
        Ok(())
    }
    
    pub fn parse_edge_insets(node: &RenderNode) -> EdgeInsets {
        if let Some(insets_str) = node.get_prop_string("edge_insets") {
            if let Some(insets) = crate::shared::edge_insets::parse_edge_insets(&insets_str) {
                return insets;
            }
        }
        
        if let Some(padding) = node.get_prop_f32("padding") {
            EdgeInsets::all(padding)
        } else {
            EdgeInsets::zero()
        }
    }
    
    pub fn parse_color(value: &str) -> String {
        value.to_string()
    }
}

pub struct BaseContainerRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for BaseContainerRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        BaseRenderer::draw_background_and_borders(context, node, frame)?;
        
        
        Ok(())
    }
}