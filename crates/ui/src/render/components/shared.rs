use crate::render::renderer::DrawingContext;
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::{Color, Gradient, GradientType};
use std::f32::consts::PI;

pub fn parse_color(color: &str) -> String {
    Color::from_hex(color).to_css_string()
}

pub fn draw_rounded_rect<T: DrawingContext>(
    context: &T, 
    x: f32, 
    y: f32, 
    width: f32, 
    height: f32, 
    radius: f32
) -> Result<(), String> {
    if radius <= 0.0 {
        context.rect(x, y, width, height)?;
        return Ok(());
    }
    
    let radius = radius.min(width / 2.0).min(height / 2.0);
    
    context.begin_path()?;
    
    context.move_to(x + radius, y)?;
    
    context.line_to(x + width - radius, y)?;
    context.arc(x + width - radius, y + radius, radius, -0.5 * PI, 0.0, false)?;
    
    context.line_to(x + width, y + height - radius)?;
    context.arc(x + width - radius, y + height - radius, radius, 0.0, 0.5 * PI, false)?;
    
    context.line_to(x + radius, y + height)?;
    context.arc(x + radius, y + height - radius, radius, 0.5 * PI, PI, false)?;
    
    context.line_to(x, y + radius)?;
    context.arc(x + radius, y + radius, radius, PI, 1.5 * PI, false)?;
    
    context.close_path()?;
    
    Ok(())
}

pub fn draw_background<T: DrawingContext>(
    context: &T, 
    node: &RenderNode, 
    frame: Rect
) -> Result<(), String> {
    if let Some(bg_color) = node.get_prop_as_string("background") {
        context.set_fill_color(&parse_color(&bg_color))?;
        context.begin_path()?;
        draw_rounded_rect(
            context, 
            frame.x, 
            frame.y, 
            frame.width, 
            frame.height, 
            node.get_prop_f32("border_radius").unwrap_or(0.0)
        )?;
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
        if border_width > 0.0 {
            let border_color = node.get_prop_as_string("border_color")
                .map(|c| parse_color(&c))
                .unwrap_or_else(|| "#000000".to_string());
            
            let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
            
            context.begin_path()?;
            draw_rounded_rect(
                context, 
                frame.x, 
                frame.y, 
                frame.width, 
                frame.height, 
                border_radius
            )?;
            
            context.set_stroke_color(&border_color)?;
            context.set_line_width(border_width)?;
            context.stroke()?;
        }
    }
    
    Ok(())
}

pub fn apply_shadow<T: DrawingContext>(
    context: &T,
    shadow_color: Option<&str>,
    shadow_offset_x: Option<f32>,
    shadow_offset_y: Option<f32>,
    shadow_blur: Option<f32>
) -> Result<bool, String> {
    if let (Some(color), Some(blur)) = (shadow_color, shadow_blur) {
        if blur > 0.0 {
            let offset_x = shadow_offset_x.unwrap_or(0.0);
            let offset_y = shadow_offset_y.unwrap_or(0.0);
            context.set_shadow(offset_x, offset_y, blur, &parse_color(color))?;
            return Ok(true);
        }
    }
    
    Ok(false)
}

pub fn clear_shadow<T: DrawingContext>(
    context: &T,
    shadow_applied: bool
) -> Result<(), String> {
    if shadow_applied {
        context.clear_shadow()?;
    }
    
    Ok(())
}

pub fn create_gradient<T: DrawingContext>(
    context: &T,
    node: &RenderNode,
    frame: Rect
) -> Result<Option<String>, String> {
    let gradient_type = node.get_prop_as_string("gradient_type");
    let gradient_color_count = node.get_prop_f32("gradient_color_count")
        .unwrap_or(0.0) as usize;
    
    if gradient_color_count == 0 {
        return Ok(None);
    }
    
    let mut color_stops = Vec::new();
    for i in 0..gradient_color_count {
        let color = node.get_prop_as_string(&format!("gradient_color_{}", i))
            .map(|c| parse_color(&c))
            .unwrap_or_else(|| "#000000".to_string());
        
        let position = node.get_prop_f32(&format!("gradient_position_{}", i))
            .unwrap_or((i as f32) / ((gradient_color_count - 1) as f32));
        
        color_stops.push((position, color));
    }
    
    let start_x = node.get_prop_f32("gradient_start_x").unwrap_or(0.0);
    let start_y = node.get_prop_f32("gradient_start_y").unwrap_or(0.0);
    let end_x = node.get_prop_f32("gradient_end_x").unwrap_or(1.0);
    let end_y = node.get_prop_f32("gradient_end_y").unwrap_or(1.0);
    
    let gradient_id = if gradient_type.as_deref() == Some("radial") {
        let center_x = frame.x + frame.width * start_x;
        let center_y = frame.y + frame.height * start_y;
        let radius = ((frame.width * frame.width + frame.height * frame.height) as f32).sqrt() / 2.0;
        
        context.create_radial_gradient(
            center_x, 
            center_y, 
            0.0,
            center_x, 
            center_y, 
            radius,
            color_stops
        )?
    } else {
        context.create_linear_gradient(
            frame.x + frame.width * start_x,
            frame.y + frame.height * start_y,
            frame.x + frame.width * end_x,
            frame.y + frame.height * end_y,
            color_stops
        )?
    };
    
    Ok(Some(gradient_id))
}

pub fn draw_scrollbar<T: DrawingContext>(
    context: &T, 
    frame: Rect, 
    direction: &str,
    content_size: f32, 
    scroll_position: f32, 
    scrollbar_color: String, 
    scrollbar_width: f32, 
    scrollbar_margin: f32
) -> Result<(), String> {
    match direction {
        "Horizontal" => {
            let visible_ratio = if content_size > frame.width {
                frame.width / content_size
            } else {
                1.0
            };
            
            let scrollbar_length = (frame.width * visible_ratio).max(30.0);
            let max_scroll = content_size - frame.width;
            let scroll_ratio = if max_scroll > 0.0 {
                scroll_position / max_scroll
            } else {
                0.0
            };
            
            let scrollbar_pos = frame.x + (frame.width - scrollbar_length) * scroll_ratio;
            
            context.set_fill_color("#eeeeee")?;
            context.fill_rect(
                frame.x, 
                frame.y + frame.height - scrollbar_width - scrollbar_margin,
                frame.width,
                scrollbar_width
            )?;
            
            context.set_fill_color(&scrollbar_color)?;
            context.fill_rect(
                scrollbar_pos, 
                frame.y + frame.height - scrollbar_width - scrollbar_margin,
                scrollbar_length,
                scrollbar_width
            )?;
        },
        _ => {
            let visible_ratio = if content_size > frame.height {
                frame.height / content_size
            } else {
                1.0
            };
            
            let scrollbar_length = (frame.height * visible_ratio).max(30.0);
            let max_scroll = content_size - frame.height;
            let scroll_ratio = if max_scroll > 0.0 {
                scroll_position / max_scroll
            } else {
                0.0
            };
            
            let scrollbar_pos = frame.y + (frame.height - scrollbar_length) * scroll_ratio;
            
            context.set_fill_color("#eeeeee")?;
            context.fill_rect(
                frame.x + frame.width - scrollbar_width - scrollbar_margin, 
                frame.y,
                scrollbar_width,
                frame.height
            )?;
            
            context.set_fill_color(&scrollbar_color)?;
            context.fill_rect(
                frame.x + frame.width - scrollbar_width - scrollbar_margin, 
                scrollbar_pos,
                scrollbar_width,
                scrollbar_length
            )?;
        }
    }
    
    Ok(())
}