use crate::render::node::RenderNode;
use crate::layout::Rect;
use std::collections::HashMap;

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

pub trait ComponentRenderer<T: DrawingContext> {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String>;
}

pub struct Renderer<T: DrawingContext> {
    context: T,
    renderers: HashMap<&'static str, Box<dyn ComponentRenderer<T>>>,
}

impl<T: DrawingContext> Renderer<T> {
    pub fn new(context: T) -> Self {
        let mut renderer = Self {
            context,
            renderers: HashMap::new(),
        };
        
        renderer.register_component_renderers();
        
        renderer
    }
    
    fn register_component_renderers(&mut self) {
        use crate::render::components::*;
        
        self.register_renderer("VStack", Box::new(VStackRenderer));
        self.register_renderer("HStack", Box::new(HStackRenderer));
        self.register_renderer("ZStack", Box::new(ZStackRenderer));
        self.register_renderer("Text", Box::new(TextRenderer));
        self.register_renderer("Button", Box::new(ButtonRenderer));
        self.register_renderer("Image", Box::new(ImageRenderer));
        self.register_renderer("Scroll", Box::new(ScrollRenderer));
        self.register_renderer("Spacer", Box::new(SpacerRenderer));
        self.register_renderer("Divider", Box::new(DividerRenderer));
    }
    
    pub fn register_renderer(
        &mut self, 
        component_type: &'static str, 
        renderer: Box<dyn ComponentRenderer<T>>
    ) {
        self.renderers.insert(component_type, renderer);
    }
    
    pub fn render(&self, node: &RenderNode) -> Result<(), String> {
        self.render_node(node, false)
    }
    
    pub fn render_with_clipping(&self, node: &RenderNode) -> Result<(), String> {
        self.render_node(node, true)
    }
    
    fn render_node(&self, node: &RenderNode, enable_clipping: bool) -> Result<(), String> {
        let x = node.get_prop_f32("x").unwrap_or(0.0);
        let y = node.get_prop_f32("y").unwrap_or(0.0);
        let width = node.get_prop_f32("width").unwrap_or(0.0);
        let height = node.get_prop_f32("height").unwrap_or(0.0);
        
        let frame = Rect::new(x, y, width, height);
        
        let should_clip = enable_clipping && node.get_prop("clip_to_bounds")
            .map(|v| v == "true")
            .unwrap_or(false);
        
        if should_clip {
            self.context.save_drawing_state()?;
            self.context.begin_path()?;
            self.context.rect(frame.x, frame.y, frame.width, frame.height)?;
            self.context.clip()?;
        }
        
        if let Some(renderer) = self.renderers.get(node.type_name.as_str()) {
            renderer.render(node, &self.context, frame)?;
        }
        
        for child in &node.children {
            self.render_node(child, enable_clipping)?;
        }
        
        if should_clip {
            self.context.restore_drawing_state()?;
        }
        
        Ok(())
    }
}