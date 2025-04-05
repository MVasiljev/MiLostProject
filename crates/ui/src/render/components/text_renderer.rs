use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::Color;
use super::shared::draw_background;

pub struct TextRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for TextRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        // First, draw the background (if specified)
        draw_background(context, node, frame)?;
        
        // Get text content
        let content = node.get_prop("content")
            .cloned()
            .unwrap_or_default();
        
        // Determine font style and size
        let font_style = node.get_prop("font_style")
            .cloned()
            .unwrap_or_else(|| "Body".to_string());
        
        // Base font settings based on style
        let base_font_size = match font_style.as_str() {
            "Title" | "FontStyle::Title" => 24.0,
            "Headline" | "FontStyle::Headline" => 20.0,
            "Subheadline" | "FontStyle::Subheadline" => 18.0,
            "Body" | "FontStyle::Body" => 16.0,
            "Callout" | "FontStyle::Callout" => 14.0,
            "Caption" | "FontStyle::Caption" => 12.0,
            "Footnote" | "FontStyle::Footnote" => 10.0,
            _ => 16.0,
        };
        
        // Get font family
        let font_family = node.get_prop("font_family")
            .cloned()
            .unwrap_or_else(|| "sans-serif".to_string());
        
        // Get font size and apply constraints
        let font_size = node.get_prop_f32("font_size").unwrap_or(base_font_size);
        let min_font_size = node.get_prop_f32("min_font_size").unwrap_or(0.0);
        let max_font_size = node.get_prop_f32("max_font_size").unwrap_or(f32::MAX);
        let font_size = font_size.max(min_font_size).min(max_font_size);
        
        // Determine font weight
        let font_weight = node.get_prop("font_weight_value")
            .map_or("400", |v| v.as_str());
            
        let is_bold = font_weight.parse::<u16>().map(|w| w >= 600).unwrap_or(false)
            || font_style.contains("bold")
            || font_style.starts_with("Title")
            || font_style.starts_with("Headline")
            || font_style.starts_with("Subheadline");
        
        // Determine if font is italic
        let is_italic = node.get_prop("italic")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
        
        // Construct font string
        let font_style_str = if is_italic && is_bold {
            "italic bold"
        } else if is_italic {
            "italic"
        } else if is_bold {
            "bold"
        } else {
            ""
        };
        
        let font = format!("{} {}px {}", font_style_str, font_size, font_family);
        context.set_font(font.trim())?;
        
        // Set text color using expanded color system
        let color_str = node.get_prop("color")
            .cloned()
            .unwrap_or_else(|| "Black".to_string());
        
        // Parse color - first try to interpret as a Color enum variant
        let color = match color_str.as_str() {
            "White" => Color::White,
            "Black" => Color::Black,
            "Red" => Color::Red,
            "Green" => Color::Green,
            "Blue" => Color::Blue,
            "Yellow" => Color::Yellow,
            "Orange" => Color::Orange,
            "Purple" => Color::Purple,
            "Pink" => Color::Pink,
            "Teal" => Color::Teal,
            "Gray" => Color::Gray,
            "LightGray" => Color::LightGray,
            "DarkGray" => Color::DarkGray,
            "Primary" => Color::Primary,
            "Secondary" => Color::Secondary,
            "Accent" => Color::Accent,
            "Error" => Color::Error,
            "Success" => Color::Success,
            "Warning" => Color::Warning,
            "Info" => Color::Info,
            "Link" => Color::Link,
            hex if hex.starts_with('#') => Color::Hex(hex.to_string()),
            _ => Color::Black, // Fallback to black for unknown colors
        };
        
        // Apply the color using CSS string format
        context.set_fill_color(&color.to_css_string())?;
        
        // Text alignment
        let align = node.get_prop("text_align").map_or("left", |v| v.as_str());
        context.set_text_align(align)?;
        
        // Calculate baseline position
        let baseline_y = match font_style.as_str() {
            "Title" | "FontStyle::Title" => frame.y + 24.0,
            "Headline" | "FontStyle::Headline" => frame.y + 20.0,
            "Subheadline" | "FontStyle::Subheadline" => frame.y + 18.0,
            "Body" | "FontStyle::Body" => frame.y + 16.0,
            "Callout" | "FontStyle::Callout" => frame.y + 14.0,
            "Caption" | "FontStyle::Caption" => frame.y + 12.0,
            "Footnote" | "FontStyle::Footnote" => frame.y + 10.0,
            _ => frame.y + font_size,
        };
        
        // Adjust for padding
        let padding = node.get_prop_f32("padding").unwrap_or(0.0);
        let baseline_y = baseline_y + padding;
        
        // Determine text position based on alignment
        let text_x = match align {
            "center" => frame.x + frame.width / 2.0,
            "right" => frame.x + frame.width - padding,
            _ => frame.x + padding
        };
        
        // Get line height and calculate multi-line positioning
        let line_height = node.get_prop_f32("line_height").unwrap_or(1.2);
        
        // Apply text shadow if specified
        if let (Some(shadow_color_str), Some(offset_x), Some(offset_y), Some(blur_radius)) = (
            node.get_prop("shadow_color"),
            node.get_prop_f32("shadow_offset_x"),
            node.get_prop_f32("shadow_offset_y"),
            node.get_prop_f32("shadow_blur_radius")
        ) {
            // Parse shadow color
            let shadow_color = match shadow_color_str.as_str() {
                "Black" => Color::Black,
                "Gray" => Color::Gray,
                "DarkGray" => Color::DarkGray,
                hex if hex.starts_with('#') => Color::Hex(hex.to_string()),
                _ => Color::Black, // Default shadow color
            };
            
            // Draw shadow text
            context.set_fill_color(&shadow_color.to_css_string())?;
            
            if content.contains('\n') {
                let lines: Vec<&str> = content.split('\n').collect();
                for (i, line) in lines.iter().enumerate() {
                    let y_pos = baseline_y + (i as f32 * font_size * line_height);
                    context.fill_text(line, text_x + offset_x, y_pos + offset_y)?;
                }
            } else {
                context.fill_text(&content, text_x + offset_x, baseline_y + offset_y)?;
            }
            
            // Reset to text color for main text
            context.set_fill_color(&color.to_css_string())?;
        }
        
        // Determine max lines for text truncation
        let max_lines = node.get_prop("max_lines")
            .and_then(|v| v.parse::<usize>().ok());
        
        // Handle text overflow/truncation
        let truncation_mode = node.get_prop("truncation_mode").map_or("Clip", |v| v.as_str());
        
        // Render text - handle multiline
        if content.contains('\n') {
            let lines: Vec<&str> = content.split('\n').collect();
            let lines_to_render = if let Some(max) = max_lines {
                lines.iter().take(max).collect::<Vec<_>>()
            } else {
                lines.iter().collect::<Vec<_>>()
            };
            
            for (i, line) in lines_to_render.iter().enumerate() {
                let y_pos = baseline_y + (i as f32 * font_size * line_height);
                
                // Apply truncation if this is the last line and we're at max_lines
                let text_to_render = if i == lines_to_render.len() - 1 
                    && max_lines.map_or(false, |max| i + 1 == max) 
                    && i + 1 < lines.len() 
                    && truncation_mode == "Ellipsis" {
                    format!("{}...", line)
                } else {
                    line.to_string()
                };
                
                context.fill_text(&text_to_render, text_x, y_pos)?;
            }
        } else {
            context.fill_text(&content, text_x, baseline_y)?;
        }
        
        // Apply text decoration if specified
        let text_decoration = node.get_prop("text_decoration").map_or("none", |v| v.as_str());
        
        if text_decoration != "none" {
            let decoration_color_str = node.get_prop("decoration_color")
                .map_or(color_str.as_str(), |v| v.as_str());
                
            // Parse decoration color
            let decoration_color = match decoration_color_str {
                "White" => Color::White,
                "Black" => Color::Black,
                "Red" => Color::Red,
                "Blue" => Color::Blue,
                hex if hex.starts_with('#') => Color::Hex(hex.to_string()),
                _ => color.clone(), // Default to text color
            };
            
            let decoration_thickness = node.get_prop_f32("decoration_thickness").unwrap_or(1.0);
            
            // Handle text decorations (underline, strikethrough, etc.)
            let y_offset = match text_decoration {
                "underline" => font_size * 0.15,  // Position underline
                "overline" => -font_size * 0.85,  // Position overline
                "linethrough" => -font_size * 0.35, // Position strikethrough
                _ => 0.0,
            };
            
            if y_offset != 0.0 {
                context.set_stroke_color(&decoration_color.to_css_string())?;
                context.set_line_width(decoration_thickness)?;
                
                // Draw text decoration line
                let text_length = content.len() as f32 * (font_size * 0.6);
                let start_x = match align {
                    "center" => text_x - text_length / 2.0,
                    "right" => text_x - text_length,
                    _ => text_x
                };
                
                context.begin_path()?;
                context.move_to(start_x, baseline_y + y_offset)?;
                context.line_to(start_x + text_length, baseline_y + y_offset)?;
                context.stroke()?;
            }
        }
        
        // Legacy underline support
        let underline = node.get_prop("underline")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
            
        if underline && text_decoration == "none" {
            context.set_stroke_color(&color.to_css_string())?;
            context.set_line_width(1.0)?;
            
            // Calculate underline position and width
            let text_length = content.len() as f32 * (font_size * 0.6);
            let start_x = match align {
                "center" => text_x - text_length / 2.0,
                "right" => text_x - text_length,
                _ => text_x
            };
            
            context.begin_path()?;
            context.move_to(start_x, baseline_y + font_size * 0.15)?;
            context.line_to(start_x + text_length, baseline_y + font_size * 0.15)?;
            context.stroke()?;
        }
        
        // Legacy strikethrough support
        let strikethrough = node.get_prop("strikethrough")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
            
        if strikethrough && text_decoration == "none" {
            context.set_stroke_color(&color.to_css_string())?;
            context.set_line_width(1.0)?;
            
            // Calculate strikethrough position and width
            let text_length = content.len() as f32 * (font_size * 0.6);
            let start_x = match align {
                "center" => text_x - text_length / 2.0,
                "right" => text_x - text_length,
                _ => text_x
            };
            
            context.begin_path()?;
            context.move_to(start_x, baseline_y - font_size * 0.35)?;
            context.line_to(start_x + text_length, baseline_y - font_size * 0.35)?;
            context.stroke()?;
        }
        
        // Apply opacity if specified
        // Note: This would be better applied at the drawing context level
        // but we're keeping it here for completeness
        if let Some(opacity_str) = node.get_prop("opacity") {
            if let Ok(opacity) = opacity_str.parse::<f32>() {
                // In a real implementation, this would modify global opacity
                // For now, we'll just log it or handle it at a higher level
            }
        }
        
        // Reset text alignment to default
        context.set_text_align("left")?;
        
        Ok(())
    }
}