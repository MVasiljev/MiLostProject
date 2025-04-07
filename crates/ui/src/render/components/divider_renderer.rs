use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::render::property::keys;
use super::shared::{parse_color, draw_background};
use std::f32::consts::PI;

pub struct DividerRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for DividerRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let color = node.get_prop_as_string(keys::BORDER_COLOR)
            .unwrap_or_else(|| "Black".to_string());
        let color_str = parse_color(&color);
        
        let style = node.get_prop_as_string("divider_style")
            .unwrap_or_else(|| "Solid".to_string());
        
        let thickness = node.get_prop_f32(keys::THICKNESS).unwrap_or(1.0);
        
        context.set_stroke_color(&color_str)?;
        context.set_line_width(thickness)?;
        
        let y = frame.y + frame.height / 2.0;
        
        match style.as_str() {
            "Dashed" | "DividerStyle::Dashed" => {
                context.begin_path()?;
                
                let dash_length = node.get_prop_f32("dash_length").unwrap_or(5.0);
                let gap_length = node.get_prop_f32("gap_length").unwrap_or(3.0);
                
                let mut x = frame.x;
                while x < frame.x + frame.width {
                    context.move_to(x, y)?;
                    context.line_to(x + dash_length, y)?;
                    x += dash_length + gap_length;
                }
                
                context.stroke()?;
            },
            "Dotted" | "DividerStyle::Dotted" => {
                let dot_radius = thickness / 2.0;
                let spacing = node.get_prop_f32("dot_spacing").unwrap_or(dot_radius * 3.0);
                
                let mut x = frame.x + dot_radius;
                while x < frame.x + frame.width {
                    context.begin_path()?;
                    context.arc(x, y, dot_radius, 0.0, 2.0 * PI, false)?;
                    context.fill()?;
                    x += spacing;
                }
            },
            "Gradient" | "DividerStyle::Gradient" => {
                let gradient_color_count = node.get_prop_f32("gradient_color_count")
                    .map(|count| count as usize)
                    .unwrap_or(0);
                
                if gradient_color_count > 1 {
                    let mut gradient_stops = Vec::new();
                    
                    for i in 0..gradient_color_count {
                        if let Some(color_str) = node.get_prop_as_string(&format!("gradient_color_{}", i)) {
                            let position = (i as f32) / ((gradient_color_count - 1) as f32);
                            gradient_stops.push((position, parse_color(&color_str)));
                        }
                    }
                    
                    if !gradient_stops.is_empty() {
                        let gradient_direction = node.get_prop_as_string("gradient_direction")
                            .unwrap_or_else(|| "horizontal".to_string());
                        
                        let gradient_id = if gradient_direction == "vertical" {
                            context.create_linear_gradient(
                                frame.x, frame.y, 
                                frame.x, frame.y + frame.height, 
                                gradient_stops
                            )?
                        } else {
                            context.create_linear_gradient(
                                frame.x, frame.y, 
                                frame.x + frame.width, frame.y, 
                                gradient_stops
                            )?
                        };
                        
                        context.set_stroke_gradient(&gradient_id)?;
                        context.stroke()?;
                    }
                }
            },
            _ => {
                context.begin_path()?;
                context.move_to(frame.x, y)?;
                context.line_to(frame.x + frame.width, y)?;
                context.stroke()?;
            }
        }
        
        if let Some(label) = node.get_prop_as_string(keys::LABEL) {
            if !label.is_empty() {
                let label_color = node.get_prop_as_string("label_color")
                    .map(|c| parse_color(&c))
                    .unwrap_or_else(|| color_str.clone());
                
                let font_size = node.get_prop_f32(keys::FONT_SIZE).unwrap_or(12.0);
                let font = format!("{}px sans-serif", font_size);
                let padding = node.get_prop_f32("label_padding").unwrap_or(8.0);
                
                let char_width = font_size * 0.6;
                let text_width = label.len() as f32 * char_width;
                
                if let Some(bg_color) = node.get_prop_as_string(keys::BACKGROUND) {
                    context.set_fill_color(&parse_color(&bg_color))?;
                    
                    let label_x = frame.x + (frame.width - text_width) / 2.0;
                    context.fill_rect(
                        label_x - padding, 
                        y - font_size / 2.0 - padding / 2.0,
                        text_width + padding * 2.0, 
                        font_size + padding
                    )?;
                }
                
                context.set_font(&font)?;
                context.set_fill_color(&label_color)?;
                context.set_text_align("center")?;
                context.set_text_baseline("middle")?;
                
                let label_x = frame.x + (frame.width - text_width) / 2.0;
                context.fill_text(&label, label_x + text_width / 2.0, y)?;
                
                context.set_text_align("left")?;
                context.set_text_baseline("alphabetic")?;
            }
        }
        
        Ok(())
    }
}