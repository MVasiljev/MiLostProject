
use crate::render::node::RenderNode;
use crate::color::Color;
use crate::layout::Rect;

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
        
        self.context.set_fill_color("#3498db")?;
        self.context.begin_path()?;
        let corner_radius = 4.0;
        
        self.context.move_to(frame.x + corner_radius, frame.y)?;
        self.context.line_to(frame.x + frame.width - corner_radius, frame.y)?;
        self.context.arc(
            frame.x + frame.width - corner_radius,
            frame.y + corner_radius,
            corner_radius,
            -0.5 * std::f32::consts::PI,
            0.0,
            false
        )?;
        self.context.line_to(frame.x + frame.width, frame.y + frame.height - corner_radius)?;
        self.context.arc(
            frame.x + frame.width - corner_radius,
            frame.y + frame.height - corner_radius,
            corner_radius,
            0.0,
            0.5 * std::f32::consts::PI,
            false
        )?;
        self.context.line_to(frame.x + corner_radius, frame.y + frame.height)?;
        self.context.arc(
            frame.x + corner_radius,
            frame.y + frame.height - corner_radius,
            corner_radius,
            0.5 * std::f32::consts::PI,
            std::f32::consts::PI,
            false
        )?;
        self.context.line_to(frame.x, frame.y + corner_radius)?;
        self.context.arc(
            frame.x + corner_radius,
            frame.y + corner_radius,
            corner_radius,
            std::f32::consts::PI,
            1.5 * std::f32::consts::PI,
            false
        )?;
        self.context.close_path()?;
        self.context.fill()?;
        
        self.context.set_font("14px sans-serif")?;
        self.context.set_fill_color("#ffffff")?;
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
        self.context.set_stroke_color("#cccccc")?;
        self.context.set_line_width(1.0)?;
        self.context.stroke_rect(
            frame.x,
            frame.y,
            frame.width,
            frame.height
        )?;
        
        self.context.set_font("12px sans-serif")?;
        self.context.set_fill_color("#999999")?;
        self.context.set_text_align("center")?;
        self.context.set_text_baseline("middle")?;
        
        let text_x = frame.x + frame.width / 2.0;
        let text_y = frame.y + frame.height / 2.0;
        self.context.fill_text("Image", text_x, text_y)?;
        
        self.context.set_text_align("left")?;
        self.context.set_text_baseline("alphabetic")?;
        
        Ok(())
    }
    
    fn draw_divider(&self, node: &RenderNode, frame: Rect) -> Result<(), String> {
        let color = node.get_prop("color").cloned().unwrap_or_else(|| "Black".to_string());
        
        self.context.set_stroke_color(&self.parse_color(&color))?;
        self.context.set_line_width(frame.height)?;
        
        self.context.begin_path()?;
        let y = frame.y + frame.height / 2.0;
        self.context.move_to(frame.x, y)?;
        self.context.line_to(frame.x + frame.width, y)?;
        self.context.stroke()?;
        
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