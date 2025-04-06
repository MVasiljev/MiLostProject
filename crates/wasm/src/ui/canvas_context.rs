use crate::render::renderer::DrawingContext;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, HtmlImageElement};
use std::rc::Rc;
use std::cell::RefCell;

pub struct CanvasContext {
    ctx: CanvasRenderingContext2d,
    canvas: HtmlCanvasElement,
    dpi_scale: f32,
    active_gradients: Rc<RefCell<HashMap<String, JsValue>>>,
    images: Rc<RefCell<HashMap<String, HtmlImageElement>>>,
    gradient_counter: Rc<RefCell<u32>>,
}

pub struct CanvasRenderer {
    context: CanvasContext,
}

impl CanvasContext {
    pub fn new(canvas_id: &str) -> Result<Self, String> {
        let document = web_sys::window()
            .ok_or_else(|| "Failed to get window".to_string())?
            .document()
            .ok_or_else(|| "Failed to get document".to_string())?;
        
        let canvas = document.get_element_by_id(canvas_id)
            .ok_or_else(|| format!("Failed to get canvas with id: {}", canvas_id))?
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| "Element is not a canvas".to_string())?;
        
        let ctx = canvas
            .get_context("2d")
            .map_err(|_| "Failed to get 2d context".to_string())?
            .ok_or_else(|| "Failed to get 2d context".to_string())?
            .dyn_into::<CanvasRenderingContext2d>()
            .map_err(|_| "Failed to cast to CanvasRenderingContext2d".to_string())?;
        
        let dpi_scale = get_device_pixel_ratio();
        setup_high_dpi_canvas(&canvas, &ctx, dpi_scale)?;
        
        Ok(Self {
            ctx,
            canvas,
            dpi_scale,
            active_gradients: Rc::new(RefCell::new(HashMap::new())),
            images: Rc::new(RefCell::new(HashMap::new())),
            gradient_counter: Rc::new(RefCell::new(0)),
        })
    }
    
    pub fn get_dimensions(&self) -> (f32, f32) {
        (
            self.canvas.width() as f32 / self.dpi_scale,
            self.canvas.height() as f32 / self.dpi_scale
        )
    }
    
    pub fn load_image(&self, image_id: &str, url: &str) -> Result<(), String> {
        let img = HtmlImageElement::new().map_err(|_| "Failed to create image element".to_string())?;
        
        let images = self.images.clone();
        let image_id = image_id.to_string();
        let img_clone = img.clone();
        
        let success_callback = Closure::wrap(Box::new(move |_event: web_sys::Event| {
            let mut images_ref = images.borrow_mut();
            images_ref.insert(image_id.clone(), img_clone.clone());
        }) as Box<dyn FnMut(_)>);
        
        let error_callback = Closure::wrap(Box::new(|_event: web_sys::Event| {
            web_sys::console::error_1(&"Failed to load image".into());
        }) as Box<dyn FnMut(_)>);
        
        img.set_onload(Some(success_callback.as_ref().unchecked_ref()));
        img.set_onerror(Some(error_callback.as_ref().unchecked_ref()));
        
        img.set_src(url);
        
        success_callback.forget();
        error_callback.forget();
        
        Ok(())
    }
    
    pub fn is_image_loaded(&self, image_id: &str) -> bool {
        self.images.borrow().contains_key(image_id)
    }
    
    fn generate_gradient_id(&self) -> String {
        let mut counter = self.gradient_counter.borrow_mut();
        *counter += 1;
        format!("gradient_{}", *counter)
    }
}

impl DrawingContext for CanvasContext {
    fn set_fill_color(&self, color: &str) -> Result<(), String> {
        self.ctx.set_fill_style(&JsValue::from_str(color));
        Ok(())
    }
    
    fn fill_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.ctx.fill_rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
    
    fn set_stroke_color(&self, color: &str) -> Result<(), String> {
        self.ctx.set_stroke_style(&JsValue::from_str(color));
        Ok(())
    }
    
    fn set_line_width(&self, width: f32) -> Result<(), String> {
        self.ctx.set_line_width(width as f64);
        Ok(())
    }
    
    fn stroke_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.ctx.stroke_rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
    
    fn begin_path(&self) -> Result<(), String> {
        self.ctx.begin_path();
        Ok(())
    }
    
    fn move_to(&self, x: f32, y: f32) -> Result<(), String> {
        self.ctx.move_to(x as f64, y as f64);
        Ok(())
    }
    
    fn line_to(&self, x: f32, y: f32) -> Result<(), String> {
        self.ctx.line_to(x as f64, y as f64);
        Ok(())
    }
    
    fn arc(&self, x: f32, y: f32, radius: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String> {
        if counterclockwise {
            self.ctx.arc_with_anticlockwise(
                x as f64, 
                y as f64, 
                radius as f64, 
                start_angle as f64, 
                end_angle as f64,
                true
            ).map_err(|e| format!("Failed to draw arc: {:?}", e))?;
        } else {
            self.ctx.arc(
                x as f64, 
                y as f64, 
                radius as f64, 
                start_angle as f64, 
                end_angle as f64
            ).map_err(|e| format!("Failed to draw arc: {:?}", e))?;
        }
        Ok(())
    }
    
    fn bezier_curve_to(&self, cp1x: f32, cp1y: f32, cp2x: f32, cp2y: f32, x: f32, y: f32) -> Result<(), String> {
        self.ctx.bezier_curve_to(
            cp1x as f64, 
            cp1y as f64, 
            cp2x as f64, 
            cp2y as f64, 
            x as f64, 
            y as f64
        );
        Ok(())
    }
    
    fn quadratic_curve_to(&self, cpx: f32, cpy: f32, x: f32, y: f32) -> Result<(), String> {
        self.ctx.quadratic_curve_to(
            cpx as f64, 
            cpy as f64, 
            x as f64, 
            y as f64
        );
        Ok(())
    }
    
    fn ellipse(&self, x: f32, y: f32, radius_x: f32, radius_y: f32, rotation: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String> {
        if counterclockwise {
            self.ctx.ellipse_with_anticlockwise(
                x as f64,
                y as f64,
                radius_x as f64,
                radius_y as f64,
                rotation as f64,
                start_angle as f64,
                end_angle as f64,
                true
            ).map_err(|e| format!("Failed to draw ellipse: {:?}", e))?;
        } else {
            self.ctx.ellipse(
                x as f64,
                y as f64,
                radius_x as f64,
                radius_y as f64,
                rotation as f64,
                start_angle as f64,
                end_angle as f64
            ).map_err(|e| format!("Failed to draw ellipse: {:?}", e))?;
        }
        Ok(())
    }
    
    fn close_path(&self) -> Result<(), String> {
        self.ctx.close_path();
        Ok(())
    }
    
    fn fill(&self) -> Result<(), String> {
        self.ctx.fill();
        Ok(())
    }
    
    fn stroke(&self) -> Result<(), String> {
        self.ctx.stroke();
        Ok(())
    }
    
    fn clip(&self) -> Result<(), String> {
        self.ctx.clip();
        Ok(())
    }
    
    fn rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.ctx.rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
    
    fn set_font(&self, font: &str) -> Result<(), String> {
        self.ctx.set_font(font);
        Ok(())
    }
    
    fn set_text_align(&self, align: &str) -> Result<(), String> {
        self.ctx.set_text_align(align);
        Ok(())
    }
    
    fn set_text_baseline(&self, baseline: &str) -> Result<(), String> {
        self.ctx.set_text_baseline(baseline);
        Ok(())
    }
    
    fn fill_text(&self, text: &str, x: f32, y: f32) -> Result<(), String> {
        self.ctx.fill_text(text, x as f64, y as f64)
            .map_err(|e| format!("Failed to fill text: {:?}", e))?;
        Ok(())
    }
    
    fn stroke_text(&self, text: &str, x: f32, y: f32) -> Result<(), String> {
        self.ctx.stroke_text(text, x as f64, y as f64)
            .map_err(|e| format!("Failed to stroke text: {:?}", e))?;
        Ok(())
    }
    
    fn measure_text(&self, text: &str) -> Result<f32, String> {
        let text_metrics = self.ctx.measure_text(text)
            .map_err(|e| format!("Failed to measure text: {:?}", e))?;
            
        Ok(text_metrics.width() as f32)
    }
    
    fn draw_image(&self, image_id: &str, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        let images = self.images.borrow();
        let img = images.get(image_id)
            .ok_or_else(|| format!("Image with id '{}' not found", image_id))?;
            
        self.ctx.draw_image_with_html_image_element_and_dw_and_dh(
            img,
            x as f64,
            y as f64,
            width as f64,
            height as f64
        ).map_err(|e| format!("Failed to draw image: {:?}", e))?;
        
        Ok(())
    }
    
    fn draw_image_with_clip(&self, image_id: &str, sx: f32, sy: f32, s_width: f32, s_height: f32, dx: f32, dy: f32, d_width: f32, d_height: f32) -> Result<(), String> {
        let images = self.images.borrow();
        let img = images.get(image_id)
            .ok_or_else(|| format!("Image with id '{}' not found", image_id))?;
            
        self.ctx.draw_image_with_html_image_element_and_sw_and_sh_and_dx_and_dy_and_dw_and_dh(
            img,
            sx as f64,
            sy as f64,
            s_width as f64,
            s_height as f64,
            dx as f64,
            dy as f64,
            d_width as f64,
            d_height as f64
        ).map_err(|e| format!("Failed to draw image with clip: {:?}", e))?;
        
        Ok(())
    }
    
    fn translate(&self, x: f32, y: f32) -> Result<(), String> {
        self.ctx.translate(x as f64, y as f64)
            .map_err(|e| format!("Failed to translate: {:?}", e))?;
        Ok(())
    }
    
    fn rotate(&self, angle: f32) -> Result<(), String> {
        self.ctx.rotate(angle as f64)
            .map_err(|e| format!("Failed to rotate: {:?}", e))?;
        Ok(())
    }
    
    fn scale(&self, x: f32, y: f32) -> Result<(), String> {
        self.ctx.scale(x as f64, y as f64)
            .map_err(|e| format!("Failed to scale: {:?}", e))?;
        Ok(())
    }
    
    fn transform(&self, a: f32, b: f32, c: f32, d: f32, e: f32, f: f32) -> Result<(), String> {
        self.ctx.transform(
            a as f64, 
            b as f64, 
            c as f64, 
            d as f64, 
            e as f64, 
            f as f64
        ).map_err(|e| format!("Failed to transform: {:?}", e))?;
        Ok(())
    }
    
    fn reset_transform(&self) -> Result<(), String> {
        self.ctx.reset_transform()
            .map_err(|e| format!("Failed to reset transform: {:?}", e))?;
        Ok(())
    }
    
    fn create_linear_gradient(&self, x0: f32, y0: f32, x1: f32, y1: f32, stops: Vec<(f32, String)>) -> Result<String, String> {
        let gradient = self.ctx.create_linear_gradient(
            x0 as f64, 
            y0 as f64, 
            x1 as f64, 
            y1 as f64
        );
        
        for (position, color) in stops {
            gradient.add_color_stop(
                position,
                &color
            ).map_err(|e| format!("Failed to add color stop: {:?}", e))?;
        }
        
        let gradient_id = self.generate_gradient_id();
        self.active_gradients.borrow_mut().insert(gradient_id.clone(), gradient.into());
        
        Ok(gradient_id)
    }
    
    fn create_radial_gradient(&self, x0: f32, y0: f32, r0: f32, x1: f32, y1: f32, r1: f32, stops: Vec<(f32, String)>) -> Result<String, String> {
        let gradient = self.ctx.create_radial_gradient(
            x0 as f64, 
            y0 as f64, 
            r0 as f64,
            x1 as f64, 
            y1 as f64,
            r1 as f64
        ).map_err(|e| format!("Failed to create radial gradient: {:?}", e))?;
        
        for (position, color) in stops {
            gradient.add_color_stop(
                position,
                &color
            ).map_err(|e| format!("Failed to add color stop: {:?}", e))?;
        }
        
        let gradient_id = self.generate_gradient_id();
        self.active_gradients.borrow_mut().insert(gradient_id.clone(), gradient.into());
        
        Ok(gradient_id)
    }
    
    fn set_fill_gradient(&self, gradient_id: &str) -> Result<(), String> {
        let gradients = self.active_gradients.borrow();
        let gradient = gradients.get(gradient_id)
            .ok_or_else(|| format!("Gradient with id '{}' not found", gradient_id))?;
            
        self.ctx.set_fill_style(gradient);
        Ok(())
    }
    
    fn set_stroke_gradient(&self, gradient_id: &str) -> Result<(), String> {
        let gradients = self.active_gradients.borrow();
        let gradient = gradients.get(gradient_id)
            .ok_or_else(|| format!("Gradient with id '{}' not found", gradient_id))?;
            
        self.ctx.set_stroke_style(gradient);
        Ok(())
    }
    
    fn set_shadow(&self, offset_x: f32, offset_y: f32, blur: f32, color: &str) -> Result<(), String> {
        self.ctx.set_shadow_offset_x(offset_x as f64);
        self.ctx.set_shadow_offset_y(offset_y as f64);
        self.ctx.set_shadow_blur(blur as f64);
        self.ctx.set_shadow_color(color);
        Ok(())
    }
    
    fn clear_shadow(&self) -> Result<(), String> {
        self.ctx.set_shadow_offset_x(0.0);
        self.ctx.set_shadow_offset_y(0.0);
        self.ctx.set_shadow_blur(0.0);
        self.ctx.set_shadow_color("rgba(0,0,0,0)");
        Ok(())
    }
    
    fn set_global_alpha(&self, alpha: f32) -> Result<(), String> {
        self.ctx.set_global_alpha(alpha as f64);
        Ok(())
    }
    
    fn set_global_composite_operation(&self, operation: &str) -> Result<(), String> {
        self.ctx.set_global_composite_operation(operation)
            .map_err(|e| format!("Failed to set global composite operation: {:?}", e))?;
        Ok(())
    }
    
    fn save_drawing_state(&self) -> Result<(), String> {
        self.ctx.save();
        Ok(())
    }
    
    fn restore_drawing_state(&self) -> Result<(), String> {
        self.ctx.restore();
        Ok(())
    }
    
    fn clear(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.ctx.clear_rect(x as f64, y as f64, width as f64, height as f64);
        Ok(())
    }
    
    fn clear_clip(&self) -> Result<(), String> {
        self.restore_drawing_state()?;
        self.save_drawing_state()?;
        Ok(())
    }
    
    fn clip_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        self.begin_path()?;
        self.rect(x, y, width, height)?;
        self.clip()?;
        Ok(())
    }
    
    fn clip_rounded_rect(&self, x: f32, y: f32, width: f32, height: f32, radius: f32) -> Result<(), String> {
        self.begin_path()?;
        
        self.move_to(x + radius, y)?;
        
        self.line_to(x + width - radius, y)?;
        self.arc(x + width - radius, y + radius, radius, -0.5 * std::f32::consts::PI, 0.0, false)?;
        
        self.line_to(x + width, y + height - radius)?;
        self.arc(x + width - radius, y + height - radius, radius, 0.0, 0.5 * std::f32::consts::PI, false)?;
        
        self.line_to(x + radius, y + height)?;
        self.arc(x + radius, y + height - radius, radius, 0.5 * std::f32::consts::PI, std::f32::consts::PI, false)?;
        
        self.line_to(x, y + radius)?;
        self.arc(x + radius, y + radius, radius, std::f32::consts::PI, 1.5 * std::f32::consts::PI, false)?;
        
        self.close_path()?;
        self.clip()?;
        
        Ok(())
    }
    
    fn set_blend_mode(&self, mode: &str) -> Result<(), String> {
        self.set_global_composite_operation(mode)
    }
    
    fn apply_filter(&self, filter: &str) -> Result<(), String> {
        Err("Canvas API doesn't support CSS filters directly".to_string())
    }
    
    fn clear_filter(&self) -> Result<(), String> {
        Ok(())
    }
}

impl CanvasRenderer {
    pub fn new(canvas_id: &str) -> Result<Self, String> {
        let context = CanvasContext::new(canvas_id)?;
        Ok(Self { context })
    }
    
    pub fn get_context(&self) -> &CanvasContext {
        &self.context
    }
    
    pub fn clear_canvas(&self) -> Result<(), String> {
        let (width, height) = self.context.get_dimensions();
        self.context.clear(0.0, 0.0, width, height)
    }
    
    pub fn load_image(&self, image_id: &str, url: &str) -> Result<(), String> {
        self.context.load_image(image_id, url)
    }
    
    pub fn is_image_loaded(&self, image_id: &str) -> bool {
        self.context.is_image_loaded(image_id)
    }
}

fn get_device_pixel_ratio() -> f32 {
    web_sys::window()
        .map(|window| window.device_pixel_ratio() as f32)
        .unwrap_or(1.0)
}

fn setup_high_dpi_canvas(
    canvas: &HtmlCanvasElement, 
    context: &CanvasRenderingContext2d,
    dpi_scale: f32
) -> Result<(), String> {
    let display_width = canvas.client_width() as u32;
    let display_height = canvas.client_height() as u32;
    
    canvas.set_width(display_width);
    canvas.set_height(display_height);
    
    if dpi_scale > 1.0 {
        canvas.set_width((display_width as f32 * dpi_scale) as u32);
        canvas.set_height((display_height as f32 * dpi_scale) as u32);
        
        context.scale(dpi_scale as f64, dpi_scale as f64)
            .map_err(|_| "Failed to scale canvas context".to_string())?;
    }
    
    Ok(())
}