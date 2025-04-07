use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::render::property::keys;
use super::shared::{
    draw_rounded_rect, 
    parse_color, 
    apply_shadow, 
    clear_shadow
};
use std::f32::consts::PI;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct ButtonRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ButtonRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let label = node.get_prop_as_string(keys::LABEL).unwrap_or_default();
        
        let style = node.get_prop_as_string(keys::BUTTON_STYLE)
            .unwrap_or_else(|| "Primary".to_string());
        
        let disabled = node.get_prop_bool(keys::ENABLED)
            .map(|v| !v)
            .unwrap_or(false);
        
        let corner_radius = node.get_prop_f32(keys::BORDER_RADIUS).unwrap_or(4.0);
        
        // Determine colors based on style and disabled state
        let (mut bg_color, mut text_color, mut border_color, mut border_width): (String, String, String, f32) = if disabled {
            ("#cccccc".to_string(), "#666666".to_string(), "#bbbbbb".to_string(), 0.0)
        } else {
            match style.as_str() {
                "Secondary" => ("#e0e0e0".to_string(), "#333333".to_string(), "#c0c0c0".to_string(), 0.0),
                "Danger" => ("#ff3b30".to_string(), "#ffffff".to_string(), "#cc2e26".to_string(), 0.0),
                "Success" => ("#34c759".to_string(), "#ffffff".to_string(), "#28a745".to_string(), 0.0),
                "Outline" => ("#ffffff".to_string(), "#0066cc".to_string(), "#0066cc".to_string(), 1.0),
                "Text" => ("transparent".to_string(), "#0066cc".to_string(), "transparent".to_string(), 0.0),
                _ => ("#0066cc".to_string(), "#ffffff".to_string(), "#0066cc".to_string(), 0.0),
            }
        };
        
        // Override colors if explicitly set
        if let Some(custom_bg) = node.get_prop_as_string(keys::BACKGROUND) {
            bg_color = parse_color(&custom_bg);
        }
        
        if let Some(custom_text) = node.get_prop_as_string(keys::TEXT_COLOR) {
            text_color = parse_color(&custom_text);
        }
        
        if let Some(custom_border) = node.get_prop_as_string(keys::BORDER_COLOR) {
            border_color = parse_color(&custom_border);
        }
        
        if let Some(custom_border_width) = node.get_prop_f32(keys::BORDER_WIDTH) {
            border_width = custom_border_width;
        }
        
        // Apply shadow
        let shadow_applied = apply_shadow(
            context,
            node.get_prop_as_string(keys::SHADOW_COLOR).as_deref(),
            node.get_prop_f32(keys::SHADOW_OFFSET_X),
            node.get_prop_f32(keys::SHADOW_OFFSET_Y),
            node.get_prop_f32(keys::SHADOW_RADIUS)
        )?;
        
        // Draw background path
        context.begin_path()?;
        draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
        
        // Fill background
        context.set_fill_color(&bg_color)?;
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
        let font_size = node.get_prop_f32(keys::FONT_SIZE).unwrap_or(16.0);
        let font_weight = node.get_prop_as_string(keys::FONT_WEIGHT).unwrap_or_else(|| "normal".to_string());
        let font = format!("{} {}px sans-serif", font_weight, font_size);
        
        context.set_font(&font)?;
        context.set_fill_color(&text_color)?;
        context.set_text_align("center")?;
        context.set_text_baseline("middle")?;
        
        let text_x = frame.x + frame.width / 2.0;
        let text_y = frame.y + frame.height / 2.0;
        
        let is_loading = node.get_prop_bool("is_loading").unwrap_or(false);
        
        if is_loading {
            let hide_text = node.get_prop_bool("hide_text_while_loading").unwrap_or(false);
            let indicator_size = node.get_prop_f32("loading_indicator_size").unwrap_or(16.0);
            let indicator_color = node.get_prop_as_string("loading_indicator_color").unwrap_or_else(|| text_color.clone());
            
            let indicator_x = if hide_text {
                text_x
            } else {
                text_x - (label.len() as f32 * font_size * 0.3) - indicator_size
            };
            
            // Draw loading spinner
            context.save_drawing_state()?;
            context.set_stroke_color(&indicator_color)?;
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
            if let Some(icon) = node.get_prop_as_string("icon") {
                let icon_size = node.get_prop_f32("icon_size").unwrap_or(16.0);
                let icon_spacing = node.get_prop_f32("icon_spacing").unwrap_or(8.0);
                let icon_position = node.get_prop_as_string("icon_position").unwrap_or_else(|| "left".to_string());
                
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