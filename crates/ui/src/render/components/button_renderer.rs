use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{
    draw_rounded_rect, 
    parse_color, 
    apply_background, 
    apply_shadow, 
    clear_shadow
};
use std::f32::consts::PI;
use std::time::{SystemTime, UNIX_EPOCH};

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
        
        // Apply shadow if defined
        let shadow_applied = apply_shadow(
            context,
            node.get_prop("shadow_color").map(|s| s.as_str()),
            node.get_prop_f32("shadow_offset_x"),
            node.get_prop_f32("shadow_offset_y"),
            node.get_prop_f32("shadow_radius")
        )?;
        
        // Draw background
        context.begin_path()?;
        draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
        
        // Handle gradient if present
        if let Some(gradient_type) = node.get_prop("gradient_type") {
            let is_radial = gradient_type == "radial";
            let mut gradient_stops = Vec::new();
            
            // Try to parse gradient stops
            if let Some(stop_count_str) = node.get_prop("gradient_stop_count") {
                if let Ok(stop_count) = stop_count_str.parse::<usize>() {
                    for i in 0..stop_count {
                        if let (Some(pos_str), Some(color)) = (
                            node.get_prop(&format!("gradient_stop_{}_position", i)),
                            node.get_prop(&format!("gradient_stop_{}_color", i))
                        ) {
                            if let Ok(position) = pos_str.parse::<f32>() {
                                gradient_stops.push((position, parse_color(color)));
                            }
                        }
                    }
                }
            }
            
            if !gradient_stops.is_empty() {
                let gradient_id = if is_radial {
                    let center_x = frame.x + frame.width / 2.0;
                    let center_y = frame.y + frame.height / 2.0;
                    let radius = (frame.width.powi(2) + frame.height.powi(2)).sqrt() / 2.0;
                    
                    context.create_radial_gradient(
                        center_x, center_y, 0.0,
                        center_x, center_y, radius,
                        gradient_stops
                    )?
                } else {
                    // Get start and end points or use defaults
                    let start_x = node.get_prop_f32("gradient_start_x").unwrap_or(0.0);
                    let start_y = node.get_prop_f32("gradient_start_y").unwrap_or(0.0);
                    let end_x = node.get_prop_f32("gradient_end_x").unwrap_or(1.0);
                    let end_y = node.get_prop_f32("gradient_end_y").unwrap_or(1.0);
                    
                    context.create_linear_gradient(
                        frame.x + start_x * frame.width,
                        frame.y + start_y * frame.height,
                        frame.x + end_x * frame.width,
                        frame.y + end_y * frame.height,
                        gradient_stops
                    )?
                };
                
                context.set_fill_gradient(&gradient_id)?;
            } else {
                context.set_fill_color(&bg_color)?;
            }
        } else {
            context.set_fill_color(&bg_color)?;
        }
        
        context.fill()?;
        
        // Draw border if needed
        if border_width > 0.0 {
            context.begin_path()?;
            draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
            context.set_stroke_color(&border_color)?;
            context.set_line_width(border_width)?;
            context.stroke()?;
        }
        
        // Clear shadow for text rendering
        clear_shadow(context, shadow_applied)?;
        
        // Text rendering
        let font_size = node.get_prop_f32("font_size").unwrap_or(16.0);
        let default_font_weight = "normal".to_string();
        let font_weight = node.get_prop("font_weight").unwrap_or(&default_font_weight);
        let font = format!("{} {}px sans-serif", font_weight, font_size);
        
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
            let indicator_color = node.get_prop("loading_indicator_color").unwrap_or(&text_color);
            let indicator_x = if hide_text {
                text_x
            } else {
                text_x - (label.len() as f32 * font_size * 0.3) - indicator_size
            };
            
            // Draw loading spinner
            context.save_drawing_state()?;
            context.set_stroke_color(indicator_color)?;
            context.set_line_width(indicator_size / 8.0)?;
            
            // Draw spinner circle
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
            
            // Draw spinner animation indicator using system time
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_secs_f64())
                .unwrap_or(0.0);
            
            let angle = (now / 1.0) % (2.0 * PI as f64);
            
            context.begin_path()?;
            context.arc(
                indicator_x,
                text_y,
                indicator_size / 2.0,
                angle as f32,
                angle as f32 + 0.5 * PI,
                false
            )?;
            context.stroke()?;
            
            context.restore_drawing_state()?;
            
            if !hide_text {
                context.fill_text(&label, text_x + indicator_size / 2.0, text_y)?;
            }
        } else {
            if let Some(icon) = node.get_prop("icon") {
                let icon_size = node.get_prop_f32("icon_size").unwrap_or(16.0);
                let icon_spacing = node.get_prop_f32("icon_spacing").unwrap_or(8.0);
                let default_icon_position = "left".to_string();
                let icon_position = node.get_prop("icon_position").unwrap_or(&default_icon_position);
                
                let (icon_x, text_offset) = if icon_position == "right" {
                    let ix = text_x + (label.len() as f32 * font_size * 0.3) + icon_spacing / 2.0;
                    let to = -icon_size / 2.0 - icon_spacing / 2.0;
                    (ix, to)
                } else {
                    let ix = text_x - (label.len() as f32 * font_size * 0.3) - icon_size / 2.0 - icon_spacing / 2.0;
                    let to = icon_size / 2.0 + icon_spacing / 2.0;
                    (ix, to)
                };
                
                // Simple circle icon rendering
                // In a real implementation, this would use an icon system or images
                context.begin_path()?;
                context.arc(icon_x, text_y, icon_size / 2.0, 0.0, 2.0 * PI, false)?;
                context.fill()?;
                
                context.fill_text(&label, text_x + text_offset, text_y)?;
            } else {
                context.fill_text(&label, text_x, text_y)?;
            }
        }
        
        // Reset text settings to defaults
        context.set_text_align("left")?;
        context.set_text_baseline("alphabetic")?;
        
        Ok(())
    }
}