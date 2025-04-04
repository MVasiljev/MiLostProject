use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{parse_color, draw_rounded_rect};
use std::f32::consts::PI;

pub struct ImageRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ImageRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let src = node.get_prop("src").cloned().unwrap_or_default();
        let alt = node.get_prop("alt").cloned().unwrap_or_default();
        
        // Determine source type and path
        let source_type = node.get_prop("source_type").map_or("remote", |v| v.as_str());
        let display_src = if source_type == "asset" {
            if let Some(path) = node.get_prop("source_path") {
                format!("asset://{}", path)
            } else {
                src.clone()
            }
        } else if source_type == "memory" {
            "memory://image".to_string()
        } else {
            src.clone()
        };
        
        // Handle image styling properties
        let corner_radius = node.get_prop_f32("corner_radius").unwrap_or(0.0);
        let border_width = node.get_prop_f32("border_width").unwrap_or(0.0);
        let border_color = node.get_prop("border_color")
            .map(|c| parse_color(c))
            .unwrap_or_else(|| "#cccccc".to_string());
            
        let opacity = node.get_prop_f32("opacity").unwrap_or(1.0);
        let scale_mode = node.get_prop("scale_mode").map_or("fit",  |v| v.as_str());
        
        // Handle loading and error states
        let is_loading = node.get_prop("is_loading")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
        let has_error = node.get_prop("has_error")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
        
        // Apply clipping for rounded corners if needed
        if corner_radius > 0.0 {
            context.save_drawing_state()?;
            context.begin_path()?;
            draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
            context.clip()?;
        }
        
        // Fill background color (could be placeholder or for transparent images)
        let background_color = node.get_prop("background_color")
            .map(|c| parse_color(c))
            .unwrap_or_else(|| "#f5f5f5".to_string());
            
        context.set_fill_color(&background_color)?;
        context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
        
        // In a real implementation, we would load and draw the actual image here
        // Since we don't have actual image loading capabilities in this example,
        // we'll draw a placeholder representation
        
        if is_loading {
            // Draw loading indicator
            self.draw_loading_indicator(context, frame)?;
        } else if has_error {
            // Draw error indicator
            self.draw_error_indicator(context, frame)?;
        } else if src.is_empty() {
            // Draw empty placeholder
            self.draw_empty_placeholder(context, frame, &alt)?;
        } else {
            // Draw image placeholder 
            self.draw_image_placeholder(context, frame, &display_src, &alt)?;
        }
        
        // Restore drawing state if we applied clipping
        if corner_radius > 0.0 {
            context.restore_drawing_state()?;
        }
        
        // Draw border if specified
        if border_width > 0.0 {
            context.begin_path()?;
            
            if corner_radius > 0.0 {
                draw_rounded_rect(
                    context,
                    frame.x + border_width / 2.0,
                    frame.y + border_width / 2.0,
                    frame.width - border_width,
                    frame.height - border_width,
                    corner_radius
                )?;
            } else {
                context.rect(
                    frame.x + border_width / 2.0,
                    frame.y + border_width / 2.0,
                    frame.width - border_width,
                    frame.height - border_width
                )?;
            }
            
            context.set_stroke_color(&border_color)?;
            context.set_line_width(border_width)?;
            context.stroke()?;
        }
        
        Ok(())
    }
}

impl ImageRenderer {
    fn draw_loading_indicator<T: DrawingContext>(
        &self,
        context: &T,
        frame: Rect
    ) -> Result<(), String> {
        let center_x = frame.x + frame.width / 2.0;
        let center_y = frame.y + frame.height / 2.0;
        let indicator_size = (frame.width.min(frame.height) * 0.2).min(32.0);
        
        // Draw spinning circle (simplified representation)
        context.set_stroke_color("#888888")?;
        context.set_line_width(2.0)?;
        
        context.begin_path()?;
        context.arc(center_x, center_y, indicator_size / 2.0, 0.0, 1.5 * PI, false)?;
        context.stroke()?;
        
        // Add "Loading..." text
        context.set_font("12px sans-serif")?;
        context.set_fill_color("#888888")?;
        context.set_text_align("center")?;
        context.set_text_baseline("top")?;
        
        let text_y = center_y + indicator_size / 2.0 + 10.0;
        context.fill_text("Loading...", center_x, text_y)?;
        
        Ok(())
    }
    
    fn draw_error_indicator<T: DrawingContext>(
        &self,
        context: &T,
        frame: Rect
    ) -> Result<(), String> {
        let center_x = frame.x + frame.width / 2.0;
        let center_y = frame.y + frame.height / 2.0;
        let icon_size = (frame.width.min(frame.height) * 0.2).min(32.0);
        
        // Draw error X
        context.set_stroke_color("#ff3b30")?;
        context.set_line_width(2.0)?;
        
        let offset = icon_size / 2.0;
        
        context.begin_path()?;
        context.move_to(center_x - offset, center_y - offset)?;
        context.line_to(center_x + offset, center_y + offset)?;
        
        context.move_to(center_x + offset, center_y - offset)?;
        context.line_to(center_x - offset, center_y + offset)?;
        
        context.stroke()?;
        
        // Add "Failed to load image" text
        context.set_font("12px sans-serif")?;
        context.set_fill_color("#888888")?;
        context.set_text_align("center")?;
        context.set_text_baseline("top")?;
        
        let text_y = center_y + icon_size / 2.0 + 10.0;
        context.fill_text("Failed to load image", center_x, text_y)?;
        
        Ok(())
    }
    
    fn draw_empty_placeholder<T: DrawingContext>(
        &self,
        context: &T,
        frame: Rect,
        alt: &str
    ) -> Result<(), String> {
        let center_x = frame.x + frame.width / 2.0;
        let center_y = frame.y + frame.height / 2.0;
        let icon_size = (frame.width.min(frame.height) * 0.2).min(24.0).max(12.0);
        
        // Draw image icon placeholder
        context.set_fill_color("#bbbbbb")?;
        
        let camera_width = icon_size * 1.2;
        let camera_height = icon_size * 0.8;
        let camera_x = center_x - camera_width / 2.0;
        let camera_y = center_y - camera_height / 2.0;
        
        // Draw camera body
        context.begin_path()?;
        context.rect(camera_x, camera_y, camera_width, camera_height)?;
        context.fill()?;
        
        // Draw camera lens
        context.begin_path()?;
        context.arc(center_x, center_y, icon_size * 0.25, 0.0, 2.0 * PI, false)?;
        context.fill()?;
        
        // Draw alt text or placeholder text
        let display_text = if alt.is_empty() {
            "No Image".to_string()
        } else {
            alt.to_string()
        };
        
        let max_display_length = 20;
        let truncated_text = if display_text.len() > max_display_length {
            format!("{}...", &display_text[0..max_display_length-3])
        } else {
            display_text
        };
        
        context.set_font("10px sans-serif")?;
        context.set_fill_color("#888888")?;
        context.set_text_align("center")?;
        context.set_text_baseline("top")?;
        
        let text_y = center_y + icon_size / 2.0 + 8.0;
        context.fill_text(&truncated_text, center_x, text_y)?;
        
        Ok(())
    }
    
    fn draw_image_placeholder<T: DrawingContext>(
        &self,
        context: &T,
        frame: Rect,
        src: &str,
        alt: &str
    ) -> Result<(), String> {
        // In a real implementation, we would draw the actual image here
        // Since we don't have actual image loading capabilities in this example,
        // we'll draw crossed lines to indicate the image area
        
        // Draw crossed lines
        context.set_stroke_color("#e0e0e0")?;
        context.set_line_width(1.0)?;
        
        context.begin_path()?;
        context.move_to(frame.x, frame.y)?;
        context.line_to(frame.x + frame.width, frame.y + frame.height)?;
        
        context.move_to(frame.x + frame.width, frame.y)?;
        context.line_to(frame.x, frame.y + frame.height)?;
        
        context.stroke()?;
        
        // Display the image source as text
        let center_x = frame.x + frame.width / 2.0;
        let center_y = frame.y + frame.height / 2.0;
        
        let display_text = if !alt.is_empty() {
            alt.to_string()
        } else {
            src.split('/')
                .last()
                .map(|s| s.to_string())
                .unwrap_or_else(|| "Image".to_string())
        };
        
        let max_display_length = 30;
        let truncated_text = if display_text.len() > max_display_length {
            format!("{}...", &display_text[0..max_display_length-3])
        } else {
            display_text
        };
        
        context.set_font("12px sans-serif")?;
        context.set_fill_color("#888888")?;
        context.set_text_align("center")?;
        context.set_text_baseline("middle")?;
        
        context.fill_text(&truncated_text, center_x, center_y)?;
        
        Ok(())
    }
}