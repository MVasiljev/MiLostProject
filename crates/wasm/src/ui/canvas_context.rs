
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};
use milost_ui::platform::canvas::DrawingContext;

pub struct WebCanvasContext {
    context: CanvasRenderingContext2d,
}

impl WebCanvasContext {
    pub fn new(canvas_id: &str) -> Result<Self, JsValue> {
        let window = web_sys::window().expect("No global window exists");
        let document = window.document().expect("No document exists");
        
        let canvas = document
            .get_element_by_id(canvas_id)
            .ok_or_else(|| JsValue::from_str("Canvas element not found"))?;
            
        let canvas = canvas
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| JsValue::from_str("Element is not a canvas"))?;
            
        let context = canvas
            .get_context("2d")?
            .ok_or_else(|| JsValue::from_str("Could not get 2d context"))?
            .dyn_into::<CanvasRenderingContext2d>()
            .map_err(|_| JsValue::from_str("Error converting to 2d context"))?;
            
        context.clear_rect(0.0, 0.0, canvas.width() as f64, canvas.height() as f64);
        
        Ok(Self { context })
    }
    
    pub fn width(&self) -> Result<u32, JsValue> {
        let canvas = self.context.canvas()
            .ok_or_else(|| JsValue::from_str("Could not get canvas"))?
            .dyn_into::<HtmlCanvasElement>()?;
        Ok(canvas.width())
    }
    
    pub fn height(&self) -> Result<u32, JsValue> {
        let canvas = self.context.canvas()
            .ok_or_else(|| JsValue::from_str("Could not get canvas"))?
            .dyn_into::<HtmlCanvasElement>()?;
        Ok(canvas.height())
    }
}

impl DrawingContext for WebCanvasContext {
    fn set_fill_color(&self, color: &str) -> Result<(), String> {
        self.context.set_fill_style(&JsValue::from_str(color));
        Ok(())
    }
    
    fn fill_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.context.fill_rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
    
    fn set_font(&self, font: &str) -> Result<(), String> {
        self.context.set_font(font);
        Ok(())
    }
    
    fn set_text_align(&self, align: &str) -> Result<(), String> {
        self.context.set_text_align(align);
        Ok(())
    }
    
    fn set_text_baseline(&self, baseline: &str) -> Result<(), String> {
        self.context.set_text_baseline(baseline);
        Ok(())
    }
    
    fn fill_text(&self, text: &str, x: f32, y: f32) -> Result<(), String> {
        self.context.fill_text(text, x as f64, y as f64)
            .map_err(|e| format!("Error filling text: {:?}", e))
    }
    
    fn set_stroke_color(&self, color: &str) -> Result<(), String> {
        self.context.set_stroke_style(&JsValue::from_str(color));
        Ok(())
    }
    
    fn set_line_width(&self, width: f32) -> Result<(), String> {
        self.context.set_line_width(width as f64);
        Ok(())
    }
    
    fn stroke_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.context.stroke_rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
    
    fn begin_path(&self) -> Result<(), String> {
        self.context.begin_path();
        Ok(())
    }
    
    fn move_to(&self, x: f32, y: f32) -> Result<(), String> {
        self.context.move_to(x as f64, y as f64);
        Ok(())
    }
    
    fn line_to(&self, x: f32, y: f32) -> Result<(), String> {
        self.context.line_to(x as f64, y as f64);
        Ok(())
    }
    
    fn arc(&self, x: f32, y: f32, radius: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String> {
        self.context.arc_with_anticlockwise(
            x as f64, 
            y as f64, 
            radius as f64, 
            start_angle as f64, 
            end_angle as f64,
            counterclockwise
        )
        .map_err(|e| format!("Error drawing arc: {:?}", e))
    }
    
    fn close_path(&self) -> Result<(), String> {
        self.context.close_path();
        Ok(())
    }
    
    fn fill(&self) -> Result<(), String> {
        self.context.fill();
        Ok(())
    }
    
    fn stroke(&self) -> Result<(), String> {
        self.context.stroke();
        Ok(())
    }
    
    fn clear(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.context.clear_rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
}