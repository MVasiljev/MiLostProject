use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{
    draw_background, 
    draw_border, 
    draw_rounded_rect, 
    create_gradient,
    apply_shadow,
    clear_shadow,
    parse_color
};
use crate::render::property::keys;

pub struct TextRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for TextRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        let shadow_applied = apply_shadow(
            context, 
            node.get_prop_as_string("shadow_color").as_deref(),
            node.get_prop_f32("shadow_offset_x"),
            node.get_prop_f32("shadow_offset_y"),
            node.get_prop_f32("shadow_radius")
        )?;
        
        let gradient_id = create_gradient(context, node, frame)?;
        
        let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
        
        context.begin_path()?;
        draw_rounded_rect(context, frame.x, frame.y, frame.width, frame.height, border_radius)?;
        
        if let Some(gradient_id) = gradient_id {
            context.set_fill_gradient(&gradient_id)?;
            context.fill()?;
        } else {
            draw_background(context, node, frame)?;
        }
        
        draw_border(context, node, frame)?;
        
        let content = node.get_prop_as_string("content").unwrap_or_default();
        
        let font_size = node.get_prop_f32("font_size").unwrap_or(16.0);
        let font_family = node.get_prop_as_string("font_family").unwrap_or_else(|| "sans-serif".to_string());
        let font_weight = node.get_prop_as_string("font_weight_value").unwrap_or_else(|| "400".to_string());
        let is_italic = node.get_prop_bool("italic").unwrap_or(false);
        
        let font_style_str = if is_italic {
            if font_weight == "700" || font_weight == "bold" {
                "italic bold"
            } else {
                "italic"
            }
        } else if font_weight == "700" || font_weight == "bold" {
            "bold"
        } else {
            ""
        };
        
        let font = format!("{} {}px {}", font_style_str, font_size, font_family);
        context.set_font(font.trim())?;
        
        let color = node.get_prop_as_string(keys::TEXT_COLOR).unwrap_or_else(|| "#000000".to_string());
        context.set_fill_color(&parse_color(&color))?;
        
        let align_str = node.get_prop_as_string(keys::TEXT_ALIGNMENT).unwrap_or_else(|| "left".to_string());
        let align_value = match align_str.to_lowercase().as_str() {
            "center" => "center",
            "right" => "right",
            _ => "left"
        };
        context.set_text_align(align_value)?;
        
        let padding = node.get_prop_f32(keys::PADDING).unwrap_or(0.0);
        let line_height = node.get_prop_f32(keys::LINE_HEIGHT).unwrap_or(1.2) * font_size;
        
        let text_x = match align_value {
            "center" => frame.x + frame.width / 2.0,
            "right" => frame.x + frame.width - padding,
            _ => frame.x + padding
        };
        
        let baseline_y = frame.y + padding + font_size;
        
        if content.contains('\n') {
            let lines: Vec<&str> = content.split('\n').collect();
            let max_lines = node.get_prop("max_lines")
                .and_then(|v| v.as_integer())
                .map(|v| v as usize);
                
            let lines_to_render = if let Some(max) = max_lines {
                lines.iter().take(max).collect::<Vec<_>>()
            } else {
                lines.iter().collect::<Vec<_>>()
            };
            
            let truncation_mode = node.get_prop_as_string("truncation_mode");
            
            for (i, line) in lines_to_render.iter().enumerate() {
                let y_pos = baseline_y + (i as f32 * line_height);
                
                let text_to_render = if i == lines_to_render.len() - 1 
                    && max_lines.map_or(false, |max| i + 1 == max) 
                    && i + 1 < lines.len() 
                    && truncation_mode.as_deref() == Some("Ellipsis") {
                    format!("{}...", line)
                } else {
                    line.to_string()
                };
                
                context.fill_text(&text_to_render, text_x, y_pos)?;
            }
        } else {
            context.fill_text(&content, text_x, baseline_y)?;
        }
        
        let text_decoration = node.get_prop_as_string("text_decoration");
        let underline = node.get_prop_bool("underline").unwrap_or(false);
        let strikethrough = node.get_prop_bool("strikethrough").unwrap_or(false);
        
        let text_length = content.len() as f32 * (font_size * 0.6);
        let decoration_start_x = match align_value {
            "center" => text_x - text_length / 2.0,
            "right" => text_x - text_length,
            _ => text_x
        };
        
        if let Some(decoration) = text_decoration.as_deref() {
            if decoration != "None" {
                let decoration_color = node.get_prop_as_string("decoration_color")
                    .unwrap_or_else(|| color.clone());
                
                let decoration_thickness = node.get_prop_f32("decoration_thickness").unwrap_or(1.0);
                
                context.set_stroke_color(&parse_color(&decoration_color))?;
                context.set_line_width(decoration_thickness)?;
                
                context.begin_path()?;
                
                match decoration {
                    "Underline" => {
                        context.move_to(decoration_start_x, baseline_y + font_size * 0.15)?;
                        context.line_to(decoration_start_x + text_length, baseline_y + font_size * 0.15)?;
                    },
                    "Overline" => {
                        context.move_to(decoration_start_x, baseline_y - font_size * 0.85)?;
                        context.line_to(decoration_start_x + text_length, baseline_y - font_size * 0.85)?;
                    },
                    "LineThrough" => {
                        context.move_to(decoration_start_x, baseline_y - font_size * 0.35)?;
                        context.line_to(decoration_start_x + text_length, baseline_y - font_size * 0.35)?;
                    },
                    _ => {}
                }
                
                context.stroke()?;
            }
        } else if underline {
            context.set_stroke_color(&parse_color(&color))?;
            context.set_line_width(1.0)?;
            
            context.begin_path()?;
            context.move_to(decoration_start_x, baseline_y + font_size * 0.15)?;
            context.line_to(decoration_start_x + text_length, baseline_y + font_size * 0.15)?;
            context.stroke()?;
        } else if strikethrough {
            context.set_stroke_color(&parse_color(&color))?;
            context.set_line_width(1.0)?;
            
            context.begin_path()?;
            context.move_to(decoration_start_x, baseline_y - font_size * 0.35)?;
            context.line_to(decoration_start_x + text_length, baseline_y - font_size * 0.35)?;
            context.stroke()?;
        }
        
        context.set_text_align("left")?;
        clear_shadow(context, shadow_applied)?;
        
        Ok(())
    }
}