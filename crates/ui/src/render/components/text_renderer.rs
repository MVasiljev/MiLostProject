use crate::render::renderer::{DrawingContext, ComponentRenderer};
use crate::render::node::RenderNode;
use crate::layout::Rect;
use super::shared::{draw_background, parse_color};

pub struct TextRenderer;

impl<T: DrawingContext> ComponentRenderer<T> for TextRenderer {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String> {
        draw_background(context, node, frame)?;
        
        let content = node.get_prop("content")
            .cloned()
            .unwrap_or_default();
        
        let font_style = node.get_prop("font_style")
            .cloned()
            .unwrap_or_else(|| "Body".to_string());
        
        let color = node.get_prop("color")
            .cloned()
            .unwrap_or_else(|| "Black".to_string());
        
        let font = match font_style.as_str() {
            "Title" | "FontStyle::Title" => "bold 24px sans-serif",
            "Headline" | "FontStyle::Headline" => "bold 20px sans-serif",
            "Subheadline" | "FontStyle::Subheadline" => "bold 18px sans-serif",
            "Body" | "FontStyle::Body" => "16px sans-serif",
            "Callout" | "FontStyle::Callout" => "14px sans-serif",
            "Caption" | "FontStyle::Caption" => "12px sans-serif",
            "Footnote" | "FontStyle::Footnote" => "10px sans-serif",
            _ => "16px sans-serif",
        };
        
        let font = if let Some(font_size) = node.get_prop_f32("font_size") {
            if font_style.contains("bold") || font_style.starts_with("Title") || 
               font_style.starts_with("Headline") || font_style.starts_with("Subheadline") {
                format!("bold {}px sans-serif", font_size)
            } else {
                format!("{}px sans-serif", font_size)
            }
        } else {
            font.to_string()
        };
        
        context.set_font(&font)?;
        context.set_fill_color(&parse_color(&color))?;
        
        let align = node.get_prop("text_align").map_or("left", |v| v.as_str());
        context.set_text_align(align)?;
        
        let baseline_y = match font_style.as_str() {
            "Title" | "FontStyle::Title" => frame.y + 24.0,
            "Headline" | "FontStyle::Headline" => frame.y + 20.0,
            "Subheadline" | "FontStyle::Subheadline" => frame.y + 18.0,
            "Body" | "FontStyle::Body" => frame.y + 16.0,
            "Callout" | "FontStyle::Callout" => frame.y + 14.0,
            "Caption" | "FontStyle::Caption" => frame.y + 12.0,
            "Footnote" | "FontStyle::Footnote" => frame.y + 10.0,
            _ => frame.y + 16.0,
        };
        
        let text_x = match align {
            "center" => frame.x + frame.width / 2.0,
            "right" => frame.x + frame.width,
            _ => frame.x
        };
        
        let line_height = node.get_prop_f32("line_height").unwrap_or(1.2);
        let font_size = node.get_prop_f32("font_size").unwrap_or_else(|| {
            match font_style.as_str() {
                "Title" | "FontStyle::Title" => 24.0,
                "Headline" | "FontStyle::Headline" => 20.0,
                "Subheadline" | "FontStyle::Subheadline" => 18.0,
                "Body" | "FontStyle::Body" => 16.0,
                "Callout" | "FontStyle::Callout" => 14.0,
                "Caption" | "FontStyle::Caption" => 12.0,
                "Footnote" | "FontStyle::Footnote" => 10.0,
                _ => 16.0,
            }
        });
        
        if content.contains('\n') {
            let lines: Vec<&str> = content.split('\n').collect();
            for (i, line) in lines.iter().enumerate() {
                let y_pos = baseline_y + (i as f32 * font_size * line_height);
                context.fill_text(line, text_x, y_pos)?;
            }
        } else {
            context.fill_text(&content, text_x, baseline_y)?;
        }
        
        context.set_text_align("left")?;
        
        Ok(())
    }
}