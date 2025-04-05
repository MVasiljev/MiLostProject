use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::Color;
use super::shared::{draw_background, draw_border, parse_color};
use std::f32::consts::PI;

pub struct ScrollRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ScrollRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        draw_background(context, node, frame)?;
        draw_border(context, node, frame)?;
        
        let show_scrollbars = node.get_prop("shows_indicators")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
        
        if !show_scrollbars {
            return Ok(());
        }
        
        let direction = node.get_prop("direction")
            .map(|d| d.as_str())
            .unwrap_or("Vertical");
        
        let content_size = node.get_prop_f32("content_size").unwrap_or(0.0);
        let scroll_position = node.get_prop_f32("scroll_position").unwrap_or(0.0);
        
        let scrollbar_color = node.get_prop("scrollbar_color")
            .map(|c| parse_color(&c))
            .unwrap_or_else(|| "#cccccc".to_string());
        
        let scrollbar_width = node.get_prop_f32("scrollbar_width").unwrap_or(6.0);
        let scrollbar_margin = node.get_prop_f32("scrollbar_margin").unwrap_or(2.0);
        
        if content_size > 0.0 {
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
        }
        
        Ok(())
    }
}