use crate::render::node::RenderNode;
use crate::render::renderer::{DrawingContext, Renderer};
use crate::layout::Rect;

/// Canvas Renderer implementation
pub struct CanvasRenderer<T: DrawingContext> {
    renderer: Renderer<T>,
}

impl<T: DrawingContext> CanvasRenderer<T> {
    pub fn new(context: T) -> Self {
        let renderer = Renderer::new(context);
        
        Self { renderer }
    }
    
    pub fn render(&self, node: &RenderNode) -> Result<(), String> {
        self.renderer.render(node)
    }
    
    pub fn render_with_clipping(&self, node: &RenderNode) -> Result<(), String> {
        self.renderer.render_with_clipping(node)
    }
}

// For backward compatibility, we'll include a simple CanvasContext 
// implementation, but in real usage, this would be replaced by a
// platform-specific implementation
pub struct CanvasContext;

impl CanvasContext {
    pub fn new() -> Self {
        Self { }
    }
}

impl DrawingContext for CanvasContext {
    fn set_fill_color(&self, _color: &str) -> Result<(), String> {
        Ok(())
    }
    
    fn fill_rect(&self, _x: f32, _y: f32, _width: f32, _height: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn set_font(&self, _font: &str) -> Result<(), String> {
        Ok(())
    }
    
    fn set_text_align(&self, _align: &str) -> Result<(), String> {
        Ok(())
    }
    
    fn set_text_baseline(&self, _baseline: &str) -> Result<(), String> {
        Ok(())
    }
    
    fn fill_text(&self, _text: &str, _x: f32, _y: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn set_stroke_color(&self, _color: &str) -> Result<(), String> {
        Ok(())
    }
    
    fn set_line_width(&self, _width: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn stroke_rect(&self, _x: f32, _y: f32, _width: f32, _height: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn begin_path(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn move_to(&self, _x: f32, _y: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn line_to(&self, _x: f32, _y: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn arc(&self, _x: f32, _y: f32, _radius: f32, _start_angle: f32, _end_angle: f32, _counterclockwise: bool) -> Result<(), String> {
        Ok(())
    }
    
    fn close_path(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn fill(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn stroke(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn clear(&self, _x: f32, _y: f32, _width: f32, _height: f32) -> Result<(), String> {
        Ok(())
    }
    
    fn save_drawing_state(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn restore_drawing_state(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn clip(&self) -> Result<(), String> {
        Ok(())
    }
    
    fn rect(&self, _x: f32, _y: f32, _width: f32, _height: f32) -> Result<(), String> {
        Ok(())
    }
}