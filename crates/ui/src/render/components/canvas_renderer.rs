use crate::render::renderer::DrawingContext;
use std::collections::HashMap;
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Clone, Debug)]
pub enum Color {
    Rgba(u8, u8, u8, f32),
    Hsla(f32, f32, f32, f32),
    Named(String),
    Hex(String),
}

impl Color {
    pub fn to_string(&self) -> String {
        match self {
            Color::Rgba(r, g, b, a) => format!("rgba({},{},{},{})", r, g, b, a),
            Color::Hsla(h, s, l, a) => format!("hsla({},{},{}%,{})", h, s, l, a),
            Color::Named(name) => name.clone(),
            Color::Hex(hex) => hex.clone(),
        }
    }
}

pub struct CanvasContext {
    id: String,
    
    width: f32,
    height: f32,
    
    dpi_scale: f32,
    
    active_gradients: Rc<RefCell<HashMap<String, Gradient>>>,
    
    images: Rc<RefCell<HashMap<String, Image>>>,
    
    gradient_counter: Rc<RefCell<u32>>,
    
    current_fill_color: Option<Color>,
    current_stroke_color: Option<Color>,
    current_line_width: f32,
    current_font: String,
    current_text_align: String,
    current_text_baseline: String,
    
    transformation_stack: Vec<(f32, f32, f32)>,
}

#[derive(Clone)]
pub struct Image {
    id: String,
    
    width: Option<f32>,
    height: Option<f32>,
    
    loaded: bool,
}

#[derive(Clone)]
pub struct Gradient {
    is_radial: bool,
    
    start_x: f32,
    start_y: f32,
    end_x: f32,
    end_y: f32,
    start_radius: f32,
    end_radius: f32,
    
    stops: Vec<(f32, Color)>,
}

impl CanvasContext {
    pub fn new(id: &str, width: f32, height: f32) -> Self {
        Self {
            id: id.to_string(),
            width,
            height,
            dpi_scale: 1.0,
            active_gradients: Rc::new(RefCell::new(HashMap::new())),
            images: Rc::new(RefCell::new(HashMap::new())),
            gradient_counter: Rc::new(RefCell::new(0)),
            
            current_fill_color: None,
            current_stroke_color: None,
            current_line_width: 1.0,
            current_font: "16px sans-serif".to_string(),
            current_text_align: "left".to_string(),
            current_text_baseline: "alphabetic".to_string(),
            
            transformation_stack: Vec::new(),
        }
    }
    
    fn generate_gradient_id(&self) -> String {
        let mut counter = self.gradient_counter.borrow_mut();
        *counter += 1;
        format!("gradient_{}", *counter)
    }
}

impl DrawingContext for CanvasContext {
    fn set_fill_color(&self, color: &str) -> Result<(), String> {
        let color_obj = match color {
            _ if color.starts_with('#') => Color::Hex(color.to_string()),
            _ if color.starts_with("rgb") => Color::Named(color.to_string()),
            _ if color.starts_with("hsl") => Color::Named(color.to_string()),
            _ => Color::Named(color.to_string()),
        };
        
        unsafe {
            (self as *const Self as *mut Self).as_mut()
                .map(|ctx| ctx.current_fill_color = Some(color_obj));
        }
        
        Ok(())
    }
    
    fn fill_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        println!("Fill Rectangle: x={}, y={}, width={}, height={}", x, y, width, height);
        Ok(())
    }
    
    fn set_stroke_color(&self, color: &str) -> Result<(), String> {
        let color_obj = match color {
            _ if color.starts_with('#') => Color::Hex(color.to_string()),
            _ if color.starts_with("rgb") => Color::Named(color.to_string()),
            _ if color.starts_with("hsl") => Color::Named(color.to_string()),
            _ => Color::Named(color.to_string()),
        };
        
        unsafe {
            (self as *const Self as *mut Self).as_mut()
                .map(|ctx| ctx.current_stroke_color = Some(color_obj));
        }
        
        Ok(())
    }
    
    fn set_line_width(&self, width: f32) -> Result<(), String> {
        unsafe {
            (self as *const Self as *mut Self).as_mut()
                .map(|ctx| ctx.current_line_width = width);
        }
        Ok(())
    }
    
    fn stroke_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        println!("Stroke Rectangle: x={}, y={}, width={}, height={}", x, y, width, height);
        Ok(())
    }
    
    fn begin_path(&self) -> Result<(), String> {
        println!("Beginning path");
        Ok(())
    }
    
    fn move_to(&self, x: f32, y: f32) -> Result<(), String> {
        println!("Move to: x={}, y={}", x, y);
        Ok(())
    }
    
    fn line_to(&self, x: f32, y: f32) -> Result<(), String> {
        println!("Line to: x={}, y={}", x, y);
        Ok(())
    }
    
    fn arc(&self, x: f32, y: f32, radius: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String> {
        println!(
            "Draw arc: x={}, y={}, radius={}, start_angle={}, end_angle={}, counterclockwise={}",
            x, y, radius, start_angle, end_angle, counterclockwise
        );
        Ok(())
    }
    
    fn bezier_curve_to(&self, cp1x: f32, cp1y: f32, cp2x: f32, cp2y: f32, x: f32, y: f32) -> Result<(), String> {
        println!(
            "Bezier curve: cp1x={}, cp1y={}, cp2x={}, cp2y={}, x={}, y={}",
            cp1x, cp1y, cp2x, cp2y, x, y
        );
        Ok(())
    }
    
    fn quadratic_curve_to(&self, cpx: f32, cpy: f32, x: f32, y: f32) -> Result<(), String> {
        println!(
            "Quadratic curve: cpx={}, cpy={}, x={}, y={}",
            cpx, cpy, x, y
        );
        Ok(())
    }
    
    fn ellipse(&self, x: f32, y: f32, radius_x: f32, radius_y: f32, rotation: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String> {
        println!(
            "Draw ellipse: x={}, y={}, radius_x={}, radius_y={}, rotation={}, start_angle={}, end_angle={}, counterclockwise={}",
            x, y, radius_x, radius_y, rotation, start_angle, end_angle, counterclockwise
        );
        Ok(())
    }
    
    fn close_path(&self) -> Result<(), String> {
        println!("Closing path");
        Ok(())
    }
    
    fn fill(&self) -> Result<(), String> {
        println!("Filling path");
        Ok(())
    }
    
    fn stroke(&self) -> Result<(), String> {
        println!("Stroking path");
        Ok(())
    }
    
    fn clip(&self) -> Result<(), String> {
        println!("Clipping path");
        Ok(())
    }
    
    fn rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        println!("Rectangle path: x={}, y={}, width={}, height={}", x, y, width, height);
        Ok(())
    }
    
    fn set_font(&self, font: &str) -> Result<(), String> {
        unsafe {
            (self as *const Self as *mut Self).as_mut()
                .map(|ctx| ctx.current_font = font.to_string());
        }
        Ok(())
    }
    
    fn set_text_align(&self, align: &str) -> Result<(), String> {
        unsafe {
            (self as *const Self as *mut Self).as_mut()
                .map(|ctx| ctx.current_text_align = align.to_string());
        }
        Ok(())
    }
    
    fn set_text_baseline(&self, baseline: &str) -> Result<(), String> {
        unsafe {
            (self as *const Self as *mut Self).as_mut()
                .map(|ctx| ctx.current_text_baseline = baseline.to_string());
        }
        Ok(())
    }
    
    fn fill_text(&self, text: &str, x: f32, y: f32) -> Result<(), String> {
        println!(
            "Fill text: '{}' at x={}, y={} with font={} align={} baseline={}",
            text, x, y, self.current_font, self.current_text_align, self.current_text_baseline
        );
        Ok(())
    }
    
    fn stroke_text(&self, text: &str, x: f32, y: f32) -> Result<(), String> {
        println!(
            "Stroke text: '{}' at x={}, y={} with font={} align={} baseline={}",
            text, x, y, self.current_font, self.current_text_align, self.current_text_baseline
        );
        Ok(())
    }
    
    fn measure_text(&self, text: &str) -> Result<f32, String> {
        Ok(text.len() as f32 * 10.0)
    }
    
    fn draw_image(&self, image_id: &str, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        println!(
            "Draw image: id={} at x={}, y={}, width={}, height={}",
            image_id, x, y, width, height
        );
        Ok(())
    }
    
    fn draw_image_with_clip(&self, image_id: &str, sx: f32, sy: f32, s_width: f32, s_height: f32, dx: f32, dy: f32, d_width: f32, d_height: f32) -> Result<(), String> {
        println!(
            "Draw image with clip: id={} source(x={}, y={}, width={}, height={}) dest(x={}, y={}, width={}, height={})",
            image_id, sx, sy, s_width, s_height, dx, dy, d_width, d_height
        );
        Ok(())
    }
    
    fn translate(&self, x: f32, y: f32) -> Result<(), String> {
        println!("Translate: x={}, y={}", x, y);
        Ok(())
    }
    
    fn rotate(&self, angle: f32) -> Result<(), String> {
        println!("Rotate: angle={}", angle);
        Ok(())
    }
    
    fn scale(&self, x: f32, y: f32) -> Result<(), String> {
        println!("Scale: x={}, y={}", x, y);
        Ok(())
    }
    
    fn transform(&self, a: f32, b: f32, c: f32, d: f32, e: f32, f: f32) -> Result<(), String> {
        println!("Transform: a={}, b={}, c={}, d={}, e={}, f={}", a, b, c, d, e, f);
        Ok(())
    }
    
    fn reset_transform(&self) -> Result<(), String> {
        println!("Reset transform");
        Ok(())
    }
    
    fn create_linear_gradient(&self, x0: f32, y0: f32, x1: f32, y1: f32, stops: Vec<(f32, String)>) -> Result<String, String> {
        let color_stops: Vec<(f32, Color)> = stops.into_iter().map(|(pos, color)| {
            let color_obj = match color {
                _ if color.starts_with('#') => Color::Hex(color),
                _ if color.starts_with("rgb") => Color::Named(color),
                _ if color.starts_with("hsl") => Color::Named(color),
                _ => Color::Named(color),
            };
            (pos, color_obj)
        }).collect();

        let gradient_id = self.generate_gradient_id();

        let gradient = Gradient {
            is_radial: false,
            start_x: x0,
            start_y: y0,
            end_x: x1,
            end_y: y1,
            start_radius: 0.0,
            end_radius: 0.0,
            stops: color_stops,
        };

        self.active_gradients.borrow_mut().insert(gradient_id.clone(), gradient);

        Ok(gradient_id)
    }
    
    fn create_radial_gradient(&self, x0: f32, y0: f32, r0: f32, x1: f32, y1: f32, r1: f32, stops: Vec<(f32, String)>) -> Result<String, String> {
        let color_stops: Vec<(f32, Color)> = stops.into_iter().map(|(pos, color)| {
            let color_obj = match color {
                _ if color.starts_with('#') => Color::Hex(color),
                _ if color.starts_with("rgb") => Color::Named(color),
                _ if color.starts_with("hsl") => Color::Named(color),
                _ => Color::Named(color),
            };
            (pos, color_obj)
        }).collect();

        let gradient_id = self.generate_gradient_id();

        let gradient = Gradient {
            is_radial: true,
            start_x: x0,
            start_y: y0,
            end_x: x1,
            end_y: y1,
            start_radius: r0,
            end_radius: r1,
            stops: color_stops,
        };

        self.active_gradients.borrow_mut().insert(gradient_id.clone(), gradient);

        Ok(gradient_id)
    }
    
    fn set_fill_gradient(&self, gradient_id: &str) -> Result<(), String> {
        let gradients = self.active_gradients.borrow();
        let gradient = gradients.get(gradient_id)
            .ok_or_else(|| format!("Gradient with id '{}' not found", gradient_id))?;
        
        println!(
            "Setting fill gradient: id={}, radial={}, start({},{}) end({},{})",
            gradient_id, 
            gradient.is_radial, 
            gradient.start_x, 
            gradient.start_y, 
            gradient.end_x, 
            gradient.end_y
        );
        
        Ok(())
    }
    
    fn set_stroke_gradient(&self, gradient_id: &str) -> Result<(), String> {
        let gradients = self.active_gradients.borrow();
        let gradient = gradients.get(gradient_id)
            .ok_or_else(|| format!("Gradient with id '{}' not found", gradient_id))?;
        
        println!(
            "Setting stroke gradient: id={}, radial={}, start({},{}) end({},{})",
            gradient_id, 
            gradient.is_radial, 
            gradient.start_x, 
            gradient.start_y, 
            gradient.end_x, 
            gradient.end_y
        );
        
        Ok(())
    }
    
    fn set_shadow(&self, offset_x: f32, offset_y: f32, blur: f32, color: &str) -> Result<(), String> {
        println!(
            "Set shadow: offset_x={}, offset_y={}, blur={}, color={}",
            offset_x, offset_y, blur, color
        );
        Ok(())
    }
    
    fn clear_shadow(&self) -> Result<(), String> {
        println!("Clear shadow");
        Ok(())
    }
    
    fn set_global_alpha(&self, alpha: f32) -> Result<(), String> {
        println!("Set global alpha: {}", alpha);
        Ok(())
    }
    
    fn set_global_composite_operation(&self, operation: &str) -> Result<(), String> {
        println!("Set global composite operation: {}", operation);
        Ok(())
    }
    
    fn save_drawing_state(&self) -> Result<(), String> {
        println!("Save drawing state");
        Ok(())
    }
    
    fn restore_drawing_state(&self) -> Result<(), String> {
        println!("Restore drawing state");
        Ok(())
    }
    
    fn clear(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        println!("Clear canvas region: x={}, y={}, width={}, height={}", x, y, width, height);
        Ok(())
    }
    
    fn clear_clip(&self) -> Result<(), String> {
        println!("Clear clipping region");
        Ok(())
    }
    
    fn clip_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String> {
        println!("Clip to rectangle: x={}, y={}, width={}, height={}", x, y, width, height);
        Ok(())
    }
    
    fn clip_rounded_rect(&self, x: f32, y: f32, width: f32, height: f32, radius: f32) -> Result<(), String> {
        println!(
            "Clip to rounded rectangle: x={}, y={}, width={}, height={}, radius={}",
            x, y, width, height, radius
        );
        Ok(())
    }
    
    fn set_blend_mode(&self, mode: &str) -> Result<(), String> {
        println!("Set blend mode: {}", mode);
        Ok(())
    }
    
    fn apply_filter(&self, filter: &str) -> Result<(), String> {
        println!("Apply filter: {}", filter);
        Ok(())
    }
    
    fn clear_filter(&self) -> Result<(), String> {
        println!("Clear filters");
        Ok(())
    }
}

pub struct CanvasRenderer {
    context: CanvasContext,
}

impl CanvasRenderer {
    pub fn new(id: &str, width: f32, height: f32) -> Self {
        Self {
            context: CanvasContext::new(id, width, height),
        }
    }
    
    pub fn get_context(&self) -> &CanvasContext {
        &self.context
    }
    
    pub fn clear_canvas(&self) -> Result<(), String> {
        self.context.clear(0.0, 0.0, self.context.width, self.context.height)
    }
    
    pub fn load_image(&mut self, image_id: &str, width: Option<f32>, height: Option<f32>) -> Result<(), String> {
        let mut images = self.context.images.borrow_mut();
        
        let image = Image {
            id: image_id.to_string(),
            width,
            height,
            loaded: true,
        };
        
        images.insert(image_id.to_string(), image);
        
        Ok(())
    }
    
    pub fn is_image_loaded(&self, image_id: &str) -> bool {
        self.context.images.borrow().contains_key(image_id)
    }
}