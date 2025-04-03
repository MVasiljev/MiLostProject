
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::UIComponent;

pub trait DrawingContext {
    fn set_fill_color(&self, color: &str) -> Result<(), String>;
    
    fn fill_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    
    fn set_font(&self, font: &str) -> Result<(), String>;
    
    fn set_text_align(&self, align: &str) -> Result<(), String>;
    
    fn set_text_baseline(&self, baseline: &str) -> Result<(), String>;
    
    fn fill_text(&self, text: &str, x: f32, y: f32) -> Result<(), String>;
    
    fn set_stroke_color(&self, color: &str) -> Result<(), String>;
    
    fn set_line_width(&self, width: f32) -> Result<(), String>;
    
    fn stroke_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    
    fn begin_path(&self) -> Result<(), String>;
    
    fn move_to(&self, x: f32, y: f32) -> Result<(), String>;
    
    fn line_to(&self, x: f32, y: f32) -> Result<(), String>;
    
    fn arc(&self, x: f32, y: f32, radius: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String>;
    
    fn close_path(&self) -> Result<(), String>;
    
    fn fill(&self) -> Result<(), String>;
    
    fn stroke(&self) -> Result<(), String>;
    
    fn clear(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;

    fn save_drawing_state(&self) -> Result<(), String>;
    
    fn restore_drawing_state(&self) -> Result<(), String>;
    
    fn clip(&self) -> Result<(), String>;
    
    fn rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
}

pub struct CanvasRenderer<T: DrawingContext> {
    context: T,
}       

impl<T: DrawingContext> CanvasRenderer<T> {
    pub fn new(context: T) -> Self {
        Self { context }
    }
    
     pub fn render(&self, node: &RenderNode) -> Result<(), String> {
        self.draw_node(node)
    }
    
    fn draw_node(&self, node: &RenderNode) -> Result<(), String> {
        let x = node.get_prop_f32("x").unwrap_or(0.0);
        let y = node.get_prop_f32("y").unwrap_or(0.0);
        let width = node.get_prop_f32("width").unwrap_or(0.0);
        let height = node.get_prop_f32("height").unwrap_or(0.0);
        
        let frame = Rect::new(x, y, width, height);
        
        match node.type_name.as_str() {
            "VStack" => self.draw_vstack(node, frame)?,
            "HStack" => self.draw_hstack(node, frame)?,
            "ZStack" => self.draw_zstack(node, frame)?,
            "Text" => self.draw_text(node, frame)?,
            "Button" => self.draw_button(node, frame)?,
            "Image" => self.draw_image(node, frame)?,
            "Divider" => self.draw_divider(node, frame)?,
            "Spacer" => {},
            _ => {},
        }
        
        for child in &node.children {
            self.draw_node(child)?;
        }
        
        Ok(())
    }
    
    
    fn draw_vstack(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        if let Some(bg_str) = node.get_prop("background") {
            let color = self.parse_color(bg_str);
            self.context.set_fill_color(&color)?;
            self.context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
        }
        
        Ok(())
    }
    
    fn draw_hstack(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        if let Some(bg_str) = node.get_prop("background") {
            let color = self.parse_color(bg_str);
            self.context.set_fill_color(&color)?;
            self.context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
        }
        
        Ok(())
    }
    
    fn draw_zstack(&self, _node: &RenderNode, _frame: Rect) -> Result<(), String> {
        Ok(())
    }
    
    fn draw_text(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        let content = node.get_prop("content").cloned().unwrap_or_default();
        
        let font_style = node.get_prop("font_style").cloned().unwrap_or_else(|| "Body".to_string());
        
        let color = node.get_prop("color").cloned().unwrap_or_else(|| "Black".to_string());
        
        let font = match font_style.as_str() {
            "Title" | "FontStyle::Title" => "bold 24px sans-serif",
            "Body" | "FontStyle::Body" => "16px sans-serif",
            "Caption" | "FontStyle::Caption" => "12px sans-serif",
            _ => "16px sans-serif",
        };
        
        self.context.set_font(font)?;
        self.context.set_fill_color(&self.parse_color(&color))?;
        
        let baseline_y = match font_style.as_str() {
            "Title" | "FontStyle::Title" => frame.y + 24.0,
            "Body" | "FontStyle::Body" => frame.y + 16.0,
            "Caption" | "FontStyle::Caption" => frame.y + 12.0,
            _ => frame.y + 16.0,
        };
        
        self.context.fill_text(&content, frame.x, baseline_y)?;
        
        Ok(())
    }
    
    fn draw_button(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        let label = node.get_prop("label").cloned().unwrap_or_default();
        let style = node.get_prop("button_style").cloned().unwrap_or_else(|| "Primary".to_string());
        let disabled = node.get_prop("disabled")
            .and_then(|val| val.parse::<bool>().ok())
            .unwrap_or(false);
    
        let corner_radius = node.get_prop_f32("corner_radius").unwrap_or(4.0);
        let padding = node.get_prop_f32("padding").unwrap_or(10.0);
    
        let (bg_color, text_color, border_color, border_width): (String, String, String, f32) = if disabled {
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
                "Custom" | "ButtonStyle::Custom" => {
                    let bg = node.get_prop("background_color").cloned().unwrap_or_else(|| "#3498db".to_string());
                    let txt = node.get_prop("text_color").cloned().unwrap_or_else(|| "#ffffff".to_string());
                    let bdr = node.get_prop("border_color").cloned().unwrap_or_else(|| bg.clone());
                    let bw = node.get_prop_f32("border_width").unwrap_or(0.0);
                    (bg, txt, bdr, bw)
                },
                _ => 
                    ("#0066cc".to_string(), "#ffffff".to_string(), "#0066cc".to_string(), 0.0),
            }
        };
    
        self.context.set_fill_color(&bg_color)?;
    
        if border_width > 0.0 {
            self.context.set_stroke_color(&border_color)?;
            self.context.set_line_width(border_width)?;
        }
    
        self.context.begin_path()?;
    
        let r = corner_radius;
        let x = frame.x;
        let y = frame.y;
        let w = frame.width;
        let h = frame.height;
    
        self.context.move_to(x + r, y)?;
        self.context.line_to(x + w - r, y)?;
        self.context.arc(x + w - r, y + r, r, -0.5 * std::f32::consts::PI, 0.0, false)?;
        self.context.line_to(x + w, y + h - r)?;
        self.context.arc(x + w - r, y + h - r, r, 0.0, 0.5 * std::f32::consts::PI, false)?;
        self.context.line_to(x + r, y + h)?;
        self.context.arc(x + r, y + h - r, r, 0.5 * std::f32::consts::PI, std::f32::consts::PI, false)?;
        self.context.line_to(x, y + r)?;
        self.context.arc(x + r, y + r, r, std::f32::consts::PI, 1.5 * std::f32::consts::PI, false)?;
    
        self.context.close_path()?;
        self.context.fill()?;
    
        if border_width > 0.0 {
            self.context.stroke()?;
        }
    
        self.context.set_font("16px sans-serif")?;
        self.context.set_fill_color(&text_color)?;
        self.context.set_text_align("center")?;
        self.context.set_text_baseline("middle")?;
    
        let text_x = frame.x + frame.width / 2.0;
        let text_y = frame.y + frame.height / 2.0;
        self.context.fill_text(&label, text_x, text_y)?;
    
        self.context.set_text_align("left")?;
        self.context.set_text_baseline("alphabetic")?;
    
        Ok(())
    }
    
    fn draw_image(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        let src = node.get_prop("src").cloned().unwrap_or_default();
        let alt = node.get_prop("alt").cloned().unwrap_or_default();
        
        let corner_radius = node.get_prop_f32("corner_radius").unwrap_or(0.0);
        let border_width = node.get_prop_f32("border_width").unwrap_or(0.0);
        let border_color = node.get_prop("border_color")
            .cloned()
            .unwrap_or_else(|| "#cccccc".to_string());
        
        self.context.save_drawing_state()?;
        
        if corner_radius > 0.0 {
            self.context.begin_path()?;
            
            let r = corner_radius;
            let x = frame.x;
            let y = frame.y;
            let w = frame.width;
            let h = frame.height;
            
            self.context.move_to(x + r, y)?;
            self.context.line_to(x + w - r, y)?;
            self.context.arc(x + w - r, y + r, r, -0.5 * std::f32::consts::PI, 0.0, false)?;
            self.context.line_to(x + w, y + h - r)?;
            self.context.arc(x + w - r, y + h - r, r, 0.0, 0.5 * std::f32::consts::PI, false)?;
            self.context.line_to(x + r, y + h)?;
            self.context.arc(x + r, y + h - r, r, 0.5 * std::f32::consts::PI, std::f32::consts::PI, false)?;
            self.context.line_to(x, y + r)?;
            self.context.arc(x + r, y + r, r, std::f32::consts::PI, 1.5 * std::f32::consts::PI, false)?;
            
            self.context.close_path()?;
            self.context.clip()?;
        }
        
        self.context.set_fill_color("#f5f5f5")?;
        self.context.fill_rect(frame.x, frame.y, frame.width, frame.height)?;
        
        self.context.begin_path()?;
        self.context.move_to(frame.x, frame.y)?;
        self.context.line_to(frame.x + frame.width, frame.y + frame.height)?;
        self.context.move_to(frame.x + frame.width, frame.y)?;
        self.context.line_to(frame.x, frame.y + frame.height)?;
        self.context.set_stroke_color("#e0e0e0")?;
        self.context.set_line_width(1.0)?;
        self.context.stroke()?;
        
        let icon_size = (frame.width.min(frame.height) * 0.2).min(24.0).max(12.0);
        let center_x = frame.x + frame.width / 2.0;
        let center_y = frame.y + frame.height / 2.0;
        
        self.context.begin_path()?;
        self.context.set_fill_color("#bbbbbb")?;
        
        let camera_width = icon_size * 1.2;
        let camera_height = icon_size * 0.8;
        let camera_x = center_x - camera_width / 2.0;
        let camera_y = center_y - camera_height / 2.0;
        
        self.context.rect(camera_x, camera_y, camera_width, camera_height)?;
        
        let lens_radius = icon_size * 0.25;
        self.context.arc(center_x, center_y, lens_radius, 0.0, 2.0 * std::f32::consts::PI, false)?;
        
        self.context.fill()?;
        
        let display_text = if alt.is_empty() {
            if src.is_empty() { 
                "Image".to_string() 
            } else {
                src.split('/')
                   .last()
                   .map(|s| s.to_string())
                   .unwrap_or_else(|| "Image".to_string())
            }
        } else {
            alt.clone()
        };
        
        let max_display_length = 20;
        let truncated_text = if display_text.len() > max_display_length {
            format!("{}...", &display_text[0..max_display_length-3])
        } else {
            display_text.to_string()
        };
        
        self.context.set_font("10px sans-serif")?;
        self.context.set_fill_color("#888888")?;
        self.context.set_text_align("center")?;
        self.context.set_text_baseline("top")?;
        
        let text_y = center_y + icon_size / 2.0 + 8.0;
        self.context.fill_text(&truncated_text, center_x, text_y)?;
        
        self.context.restore_drawing_state()?;
        
        if border_width > 0.0 {
            self.context.begin_path()?;
            
            if corner_radius > 0.0 {
                let r = corner_radius;
                let x = frame.x;
                let y = frame.y;
                let w = frame.width;
                let h = frame.height;
                
                self.context.move_to(x + r, y)?;
                self.context.line_to(x + w - r, y)?;
                self.context.arc(x + w - r, y + r, r, -0.5 * std::f32::consts::PI, 0.0, false)?;
                self.context.line_to(x + w, y + h - r)?;
                self.context.arc(x + w - r, y + h - r, r, 0.0, 0.5 * std::f32::consts::PI, false)?;
                self.context.line_to(x + r, y + h)?;
                self.context.arc(x + r, y + h - r, r, 0.5 * std::f32::consts::PI, std::f32::consts::PI, false)?;
                self.context.line_to(x, y + r)?;
                self.context.arc(x + r, y + r, r, std::f32::consts::PI, 1.5 * std::f32::consts::PI, false)?;
                self.context.close_path()?;
            } else {
                self.context.rect(frame.x, frame.y, frame.width, frame.height)?;
            }
            
            self.context.set_stroke_color(&border_color)?;
            self.context.set_line_width(border_width)?;
            self.context.stroke()?;
        }
        
        self.context.set_text_align("left")?;
        self.context.set_text_baseline("alphabetic")?;
        
        Ok(())
    }
    
    fn draw_divider(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        let color = node.get_prop("color").cloned().unwrap_or_else(|| "Black".to_string());
        let color_str = self.parse_color(&color);
        
        let style = node.get_prop("style").cloned().unwrap_or_else(|| "Solid".to_string());
        
        self.context.set_stroke_color(&color_str)?;
        self.context.set_line_width(frame.height)?;
        
        match style.as_str() {
            "Dashed" | "DividerStyle::Dashed" => {
                self.context.begin_path()?;
                
                let dash_length = 5.0;
                let gap_length = 3.0;
                let y = frame.y + frame.height / 2.0;
                
                let mut x = frame.x;
                while x < frame.x + frame.width {
                    self.context.move_to(x, y)?;
                    self.context.line_to(x + dash_length, y)?;
                    x += dash_length + gap_length;
                }
                
                self.context.stroke()?;
            },
            "Dotted" | "DividerStyle::Dotted" => {
                let dot_radius = frame.height / 2.0;
                let spacing = dot_radius * 3.0;
                let y = frame.y + frame.height / 2.0;
                
                let mut x = frame.x + dot_radius;
                while x < frame.x + frame.width {
                    self.context.begin_path()?;
                    self.context.arc(x, y, dot_radius, 0.0, 2.0 * std::f32::consts::PI, false)?;
                    self.context.fill()?;
                    x += spacing;
                }
            },
            _ => {
                self.context.begin_path()?;
                let y = frame.y + frame.height / 2.0;
                self.context.move_to(frame.x, y)?;
                self.context.line_to(frame.x + frame.width, y)?;
                self.context.stroke()?;
            }
        }
        
        Ok(())
    }
    
    fn parse_color(&self, color_str: &str) -> String {
        match color_str {
            "White" | "Color::White" => "#ffffff".to_string(),
            "Blue" | "Color::Blue" => "#3498db".to_string(),
            "Black" | "Color::Black" => "#000000".to_string(),
            _ => "#000000".to_string(),
        }
    }
}