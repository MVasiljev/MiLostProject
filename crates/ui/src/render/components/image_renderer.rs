use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::render::property::keys;
use crate::image::{ImageSource, ResizeMode, ContentMode};
use super::shared::{
    draw_rounded_rect, 
    draw_background,
    draw_border, 
    apply_shadow,
    clear_shadow,
    parse_color
};
use std::f32::consts::PI;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct ImageRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for ImageRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let shadow_applied = apply_shadow(
            context,
            node.get_prop_as_string(keys::SHADOW_COLOR).as_deref(),
            node.get_prop_f32(keys::SHADOW_OFFSET_X),
            node.get_prop_f32(keys::SHADOW_OFFSET_Y),
            node.get_prop_f32(keys::SHADOW_RADIUS)
        )?;
        
        let corner_radius = node.get_prop_f32(keys::BORDER_RADIUS).unwrap_or(0.0);
        
        draw_background(context, node, frame)?;
        
        if corner_radius > 0.0 {
            context.save_drawing_state()?;
            context.begin_path()?;
            draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, corner_radius)?;
            context.clip()?;
        }
        
        let source_type = node.get_prop_as_string("source_type").unwrap_or_else(|| "remote".to_string());
        
        let is_loading = node.get_prop_bool("is_loading").unwrap_or(false);
        let has_error = node.get_prop_bool("has_error").unwrap_or(false);
        
        let tint_color = node.get_prop_as_string("tint_color");
        
        if is_loading {
            self.draw_loading_indicator(context, frame)?;
        } else if has_error {
            let alt = node.get_prop_as_string("alt").unwrap_or_default();
            self.draw_error_indicator(context, frame, &alt)?;
        } else {
            let src = node.get_prop_as_string("src").unwrap_or_default();
            let alt = node.get_prop_as_string("alt").unwrap_or_default();
            
            if !src.is_empty() {
                self.draw_image(context, node, frame, &source_type, &src, &alt)?;
            } else {
                self.draw_empty_placeholder(context, frame, &alt)?;
            }
        }
        
        if let Some(tint) = tint_color {
            self.apply_tint(context, frame, &tint)?;
        }
        
        self.apply_filters(context, node, frame)?;
        
        if corner_radius > 0.0 {
            context.restore_drawing_state()?;
        }
        
        draw_border(context, node, frame)?;
        
        clear_shadow(context, shadow_applied)?;
        
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
        let indicator_size = (frame.width.min(frame.height) * 0.2).min(32.0).max(16.0);
        
        context.save_drawing_state()?;
        
        context.begin_path()?;
        context.arc(center_x, center_y, indicator_size / 2.0, 0.0, 2.0 * PI, false)?;
        context.set_fill_color("rgba(0,0,0,0.1)")?;
        context.fill()?;
        
        context.set_stroke_color("#ffffff")?;
        context.set_line_width(indicator_size / 8.0)?;
        
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as f32;
        
        let start_angle = (now / 150.0) % (2.0 * PI as f32);
        let end_angle = start_angle + PI * 0.75;
        
        context.begin_path()?;
        context.arc(
            center_x,
            center_y,
            indicator_size / 2.0 - (indicator_size / 16.0),
            start_angle,
            end_angle,
            false
        )?;
        context.stroke()?;
        
        context.restore_drawing_state()?;
        
        Ok(())
    }
    
    fn draw_error_indicator<T: DrawingContext>(
        &self,
        context: &T,
        frame: Rect,
        alt: &str
    ) -> Result<(), String> {
        let center_x = frame.x + frame.width / 2.0;
        let center_y = frame.y + frame.height / 2.0;
        let icon_size = (frame.width.min(frame.height) * 0.2).min(48.0).max(24.0);
        
        context.save_drawing_state()?;
        
        context.set_fill_color("#ff0000")?;
        context.begin_path()?;
        context.arc(center_x, center_y, icon_size / 2.0, 0.0, 2.0 * PI, false)?;
        context.fill()?;
        
        context.set_stroke_color("#ffffff")?;
        context.set_line_width(icon_size / 10.0)?;
        
        context.begin_path()?;
        context.move_to(center_x - icon_size * 0.25, center_y - icon_size * 0.25)?;
        context.line_to(center_x + icon_size * 0.25, center_y + icon_size * 0.25)?;
        context.stroke()?;
        
        context.begin_path()?;
        context.move_to(center_x + icon_size * 0.25, center_y - icon_size * 0.25)?;
        context.line_to(center_x - icon_size * 0.25, center_y + icon_size * 0.25)?;
        context.stroke()?;
        
        if !alt.is_empty() {
            context.set_font("12px sans-serif")?;
            context.set_text_align("center")?;
            context.set_fill_color("#ffffff")?;
            context.fill_text(alt, center_x, center_y + icon_size * 0.75)?;
        }
        
        context.restore_drawing_state()?;
        
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
        
        context.save_drawing_state()?;
        
        context.set_fill_color("#e0e0e0")?;
        context.begin_path()?;
        context.rect(frame.x, frame.y, frame.width, frame.height)?;
        context.fill()?;
        
        let icon_size = (frame.width.min(frame.height) * 0.2).min(48.0).max(24.0);
        context.set_fill_color("#a0a0a0")?;
        
        context.begin_path()?;
        context.rect(
            center_x - icon_size * 0.3, 
            center_y - icon_size * 0.2, 
            icon_size * 0.6, 
            icon_size * 0.4
        )?;
        context.fill()?;
        
        context.set_fill_color("#808080")?;
        context.begin_path()?;
        context.arc(
            center_x, 
            center_y, 
            icon_size * 0.2, 
            0.0, 
            2.0 * PI, 
            false
        )?;
        context.fill()?;
        
        if !alt.is_empty() {
            context.set_font("12px sans-serif")?;
            context.set_text_align("center")?;
            context.set_fill_color("#000000")?;
            context.fill_text(alt, center_x, center_y + icon_size * 0.75)?;
        }
        
        context.restore_drawing_state()?;
        
        Ok(())
    }
    
    fn draw_image<T: DrawingContext>(
        &self,
        context: &T,
        node: &RenderNode,
        frame: Rect,
        source_type: &str,
        src: &str,
        alt: &str
    ) -> Result<(), String> {
        let resize_mode = node.get_prop_as_string("resize_mode")
            .unwrap_or_else(|| "Fit".to_string());
        
        let content_mode = node.get_prop_as_string("content_mode")
            .unwrap_or_else(|| "ScaleAspectFit".to_string());
        
        match source_type {
            "remote" => {
                context.draw_image(src, frame.x, frame.y, frame.width, frame.height)?;
            },
            "asset" => {
                context.draw_image(src, frame.x, frame.y, frame.width, frame.height)?;
            },
            "memory" => {
                return Err("Memory image drawing not implemented".to_string());
            },
            _ => {
                return Err(format!("Unsupported image source type: {}", source_type));
            }
        }
        
        Ok(())
    }
    
    fn apply_tint<T: DrawingContext>(
        &self,
        context: &T,
        frame: Rect,
        tint_color: &str
    ) -> Result<(), String> {
        context.save_drawing_state()?;
        context.set_global_composite_operation("multiply")?;
        context.set_fill_color(tint_color)?;
        context.begin_path()?;
        context.rect(frame.x, frame.y, frame.width, frame.height)?;
        context.fill()?;
        context.restore_drawing_state()?;
        
        Ok(())
    }
    
    fn apply_filters<T: DrawingContext>(
        &self,
        context: &T,
        node: &RenderNode,
        frame: Rect
    ) -> Result<(), String> {
        let filter_count = node.get_prop_f32("filter_count").unwrap_or(0.0) as usize;
        
        for i in 0..filter_count {
            let filter_type_key = format!("filter_{}_type", i);
            let filter_value_key = format!("filter_{}_value", i);
            
            if let (Some(filter_type), Some(filter_value)) = (
                node.get_prop_as_string(&filter_type_key), 
                node.get_prop_f32(&filter_value_key)
            ) {
                match filter_type.to_lowercase().as_str() {
                    "blur" => {
                        context.apply_filter(&format!("blur({}px)", filter_value))?;
                    },
                    "grayscale" => {
                        context.apply_filter(&format!("grayscale({}%)", filter_value * 100.0))?;
                    },
                    "sepia" => {
                        context.apply_filter(&format!("sepia({}%)", filter_value * 100.0))?;
                    },
                    "saturation" => {
                        context.apply_filter(&format!("saturate({}%)", filter_value * 100.0))?;
                    },
                    "brightness" => {
                        context.apply_filter(&format!("brightness({}%)", filter_value * 100.0))?;
                    },
                    "contrast" => {
                        context.apply_filter(&format!("contrast({}%)", filter_value * 100.0))?;
                    },
                    "hue" => {
                        context.apply_filter(&format!("hue-rotate({}deg)", filter_value * 360.0))?;
                    },
                    "invert" => {
                        context.apply_filter("invert(100%)")?;
                    },
                    _ => {
                        return Err(format!("Unsupported filter type: {}", filter_type));
                    }
                }
            }
        }
        
        Ok(())
    }
}