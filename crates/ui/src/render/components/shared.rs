use crate::render::renderer::DrawingContext;
use crate::render::node::RenderNode;
use crate::layout::{Rect, EdgeInsets};
use std::f32::consts::PI;

pub fn parse_color(color_str: &str) -> String {
    match color_str {
        "White" | "Color::White" => "#ffffff".to_string(),
        "Black" | "Color::Black" => "#000000".to_string(),
        "Red" | "Color::Red" => "#ff0000".to_string(),
        "Green" | "Color::Green" => "#00ff00".to_string(),
        "Blue" | "Color::Blue" => "#0000ff".to_string(),
        "Gray" | "Color::Gray" => "#808080".to_string(),
        "LightGray" | "Color::LightGray" => "#d3d3d3".to_string(),
        "DarkGray" | "Color::DarkGray" => "#a9a9a9".to_string(),
        "Yellow" | "Color::Yellow" => "#ffff00".to_string(),
        "Orange" | "Color::Orange" => "#ffa500".to_string(),
        "Purple" | "Color::Purple" => "#800080".to_string(),
        "Pink" | "Color::Pink" => "#ffc0cb".to_string(),
        "Transparent" | "Color::Transparent" => "transparent".to_string(),
        _ => {
            if color_str.starts_with('#') && (color_str.len() == 7 || color_str.len() == 9) {
                color_str.to_string()
            } else {
                "#000000".to_string()
            }
        }
    }
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
    
    context.begin_path()?;
    
    context.move_to(x + r, y)?;
    context.line_to(x + width - r, y)?;
    context.arc(x + width - r, y + r, r, -0.5 * PI, 0.0, false)?;
    
    context.line_to(x + width, y + height - r)?;
    context.arc(x + width - r, y + height - r, r, 0.0, 0.5 * PI, false)?;
    
    context.line_to(x + r, y + height)?;
    context.arc(x + r, y + height - r, r, 0.5 * PI, PI, false)?;
    
    context.line_to(x, y + r)?;
    context.arc(x + r, y + r, r, PI, 1.5 * PI, false)?;
    
    context.close_path()?;
    
    Ok(())
}

pub fn draw_background<T: DrawingContext>(
    context: &T,
    node: &RenderNode, 
    frame: Rect
) -> Result<(), String> {
    if let Some(bg_str) = node.get_prop("background") {
        let color = parse_color(bg_str);
        context.set_fill_color(&color)?;
        
        if let Some(corner_radius) = node.get_prop_f32("corner_radius") {
            if corner_radius > 0.0 {
                draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
                context.fill()?;
            } else {
                context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
            }
        } else {
            context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
        }
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
            let border_color = node.get_prop("border_color")
                .map(|c| parse_color(c))
                .unwrap_or_else(|| "#000000".to_string());
            
            context.set_stroke_color(&border_color)?;
            context.set_line_width(border_width)?;
            
            if let Some(corner_radius) = node.get_prop_f32("corner_radius") {
                if corner_radius > 0.0 {
                    draw_rounded_rect(
                        context,
                        frame.x + border_width / 2.0,
                        frame.y + border_width / 2.0,
                        frame.width - border_width,
                        frame.height - border_width,
                        corner_radius
                    )?;
                    context.stroke()?;
                } else {
                    context.stroke_rect(frame.x, frame.y, frame.width, frame.height)?;
                }
            } else {
                context.stroke_rect(frame.x, frame.y, frame.width, frame.height)?;
            }
        }
    }
    
    Ok(())
}

pub fn parse_edge_insets(node: &RenderNode) -> EdgeInsets {
    if let Some(insets_str) = node.get_prop("edge_insets") {
        if let Some(parts) = insets_str.split(',').collect::<Vec<&str>>().get(0..4) {
            if parts.len() == 4 {
                if let (Ok(top), Ok(right), Ok(bottom), Ok(left)) = (
                    parts[0].parse::<f32>(),
                    parts[1].parse::<f32>(),
                    parts[2].parse::<f32>(),
                    parts[3].parse::<f32>()
                ) {
                    return EdgeInsets::new(top, right, bottom, left);
                }
            }
        }
    }
    
    if let Some(padding) = node.get_prop_f32("padding") {
        EdgeInsets::all(padding)
    } else {
        EdgeInsets::zero()
    }
}

pub fn apply_clipping<T: DrawingContext>(
    context: &T,
    node: &RenderNode, 
    frame: Rect,
    clip_fn: impl FnOnce() -> Result<(), String>
) -> Result<(), String> {
    let should_clip = node.get_prop("clip_to_bounds")
        .map(|v| v == "true")
        .unwrap_or(false);
    
    if should_clip {
        context.save_drawing_state()?;
        context.begin_path()?;
        context.rect(frame.x, frame.y, frame.width, frame.height)?;
        context.clip()?;
        
        let result = clip_fn();
        
        context.restore_drawing_state()?;
        result
    } else {
        clip_fn()
    }
}

pub fn draw_shadow<T: DrawingContext>(
    context: &T,
    node: &RenderNode, 
    frame: Rect
) -> Result<(), String> {
    if let Some(shadow_radius) = node.get_prop_f32("shadow_radius") {
        if shadow_radius > 0.0 {
            let shadow_color = node.get_prop("shadow_color")
                .map(|c| parse_color(c))
                .unwrap_or_else(|| "#000000".to_string());
            
            let shadow_offset_x = node.get_prop_f32("shadow_offset_x").unwrap_or(0.0);
            let shadow_offset_y = node.get_prop_f32("shadow_offset_y").unwrap_or(2.0);
            
            context.save_drawing_state()?;
            context.restore_drawing_state()?;
        }
    }
    
    Ok(())
}