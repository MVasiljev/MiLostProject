use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{draw_rounded_rect, parse_color};
use std::f32::consts::PI;

pub struct ButtonRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ButtonRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let label = node.get_prop("label").cloned().unwrap_or_default();
        let style = node.get_prop("button_style").cloned().unwrap_or_else(|| "Primary".to_string());
        let disabled = node.get_prop("disabled")
            .and_then(|val| val.parse::<bool>().ok())
            .unwrap_or(false);
        let corner_radius = node.get_prop_f32("corner_radius").unwrap_or(4.0);
        
        let (mut bg_color, mut text_color, mut border_color, mut border_width): (String, String, String, f32) = if disabled {
            ("#cccccc".to_string(), "#666666".to_string(), "#bbbbbb".to_string(), 0.0)
        } else {
            match style.as_str() {
                "Secondary" | "ButtonStyle::Secondary" => 
                    ("#e0e0e0".to_string(), "#333333".to_string(), "#c0c0c0".to_string(), 0.0),
                "Danger" | "ButtonStyle::Danger" => 
                    ("#ff3b30".to_string(), "#ffffff".to_string(), "#cc2e26".to_string(), 0.0),
                "Success" | "ButtonStyle::Success" => 
                    ("#34c759".to_string(), "#ffffff".to_string(), "#28a745".to_string(), 0.0),
                "Outline" | "ButtonStyle::Outline" => 
                    ("#ffffff".to_string(), "#0066cc".to_string(), "#0066cc".to_string(), 1.0),
                "Text" | "ButtonStyle::Text" => 
                    ("transparent".to_string(), "#0066cc".to_string(), "transparent".to_string(), 0.0),
                _ => ("#0066cc".to_string(), "#ffffff".to_string(), "#0066cc".to_string(), 0.0),
            }
        };
        
        if let Some(custom_bg) = node.get_prop("background_color") {
            bg_color = parse_color(custom_bg);
        }
        
        if let Some(custom_text) = node.get_prop("text_color") {
            text_color = parse_color(custom_text);
        }
        
        if let Some(custom_border) = node.get_prop("border_color") {
            border_color = parse_color(custom_border);
        }
        
        if let Some(custom_border_width) = node.get_prop_f32("border_width") {
            border_width = custom_border_width;
        }
        
        context.set_fill_color(&bg_color)?;
        
        if border_width > 0.0 {
            context.set_stroke_color(&border_color)?;
            context.set_line_width(border_width)?;
        }
        
        draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
        context.fill()?;
        
        if border_width > 0.0 {
            context.stroke()?;
        }
        
        let font_size = node.get_prop_f32("font_size").unwrap_or(16.0);
        let font = format!("{}px sans-serif", font_size);
        
        context.set_font(&font)?;
        context.set_fill_color(&text_color)?;
        context.set_text_align("center")?;
        context.set_text_baseline("middle")?;
        
        let text_x = frame.x + frame.width / 2.0;
        let text_y = frame.y + frame.height / 2.0;
        
        let is_loading = node.get_prop("is_loading")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
        
        if is_loading {
            let hide_text = node.get_prop("hide_text_while_loading")
                .and_then(|v| v.parse::<bool>().ok())
                .unwrap_or(false);
                
            let indicator_size = node.get_prop_f32("loading_indicator_size").unwrap_or(16.0);
            let indicator_x = if hide_text {
                text_x
            } else {
                text_x - (label.len() as f32 * font_size * 0.3) - indicator_size
            };
            
            context.begin_path()?;
            context.arc(
                indicator_x, 
                text_y, 
                indicator_size / 2.0, 
                0.0, 
                2.0 * PI, 
                false
            )?;
            context.stroke()?;
            
            if !hide_text {
                context.fill_text(&label, text_x + indicator_size / 2.0, text_y)?;
            }
        } else {
            if let Some(icon) = node.get_prop("icon") {
                let icon_size = node.get_prop_f32("icon_size").unwrap_or(16.0);
                let icon_spacing = node.get_prop_f32("icon_spacing").unwrap_or(8.0);
                
                let icon_x = text_x - (label.len() as f32 * font_size * 0.3) - icon_size / 2.0 - icon_spacing / 2.0;
                
                context.begin_path()?;
                context.arc(icon_x, text_y, icon_size / 2.0, 0.0, 2.0 * PI, false)?;
                context.fill()?;
                
                context.fill_text(&label, text_x + icon_size / 2.0, text_y)?;
            } else {
                context.fill_text(&label, text_x, text_y)?;
            }
        }
        
        context.set_text_align("left")?;
        context.set_text_baseline("alphabetic")?;
        
        Ok(())
    }
}