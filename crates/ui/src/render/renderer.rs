use crate::{events::SwipeDirection, render::node::RenderNode};
use crate::layout::Rect;
use std::collections::HashMap;
use crate::events::{
    Event, EventType, EventDispatcher, HandlerResult, 
    EventMiddlewarePipeline, MiddlewareResult,
    middlewares::LoggingMiddleware, middlewares::LogLevel,
    TypedEventHandler
};
use std::time::Duration;

pub trait DrawingContext {
    fn set_fill_color(&self, color: &str) -> Result<(), String>;
    fn fill_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    fn set_stroke_color(&self, color: &str) -> Result<(), String>;
    fn set_line_width(&self, width: f32) -> Result<(), String>;
    fn stroke_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    
    fn begin_path(&self) -> Result<(), String>;
    fn move_to(&self, x: f32, y: f32) -> Result<(), String>;
    fn line_to(&self, x: f32, y: f32) -> Result<(), String>;
    fn arc(&self, x: f32, y: f32, radius: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String>;
    fn bezier_curve_to(&self, cp1x: f32, cp1y: f32, cp2x: f32, cp2y: f32, x: f32, y: f32) -> Result<(), String>;
    fn quadratic_curve_to(&self, cpx: f32, cpy: f32, x: f32, y: f32) -> Result<(), String>;
    fn ellipse(&self, x: f32, y: f32, radius_x: f32, radius_y: f32, rotation: f32, start_angle: f32, end_angle: f32, counterclockwise: bool) -> Result<(), String>;
    fn close_path(&self) -> Result<(), String>;
    fn fill(&self) -> Result<(), String>;
    fn stroke(&self) -> Result<(), String>;
    fn clip(&self) -> Result<(), String>;
    fn rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    
    fn set_font(&self, font: &str) -> Result<(), String>;
    fn set_text_align(&self, align: &str) -> Result<(), String>;
    fn set_text_baseline(&self, baseline: &str) -> Result<(), String>;
    fn fill_text(&self, text: &str, x: f32, y: f32) -> Result<(), String>;
    fn stroke_text(&self, text: &str, x: f32, y: f32) -> Result<(), String>;
    fn measure_text(&self, text: &str) -> Result<f32, String>;
    
    fn draw_image(&self, image_id: &str, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    fn draw_image_with_clip(&self, image_id: &str, sx: f32, sy: f32, s_width: f32, s_height: f32, dx: f32, dy: f32, d_width: f32, d_height: f32) -> Result<(), String>;
    
    fn translate(&self, x: f32, y: f32) -> Result<(), String>;
    fn rotate(&self, angle: f32) -> Result<(), String>;
    fn scale(&self, x: f32, y: f32) -> Result<(), String>;
    fn transform(&self, a: f32, b: f32, c: f32, d: f32, e: f32, f: f32) -> Result<(), String>;
    fn reset_transform(&self) -> Result<(), String>;
    
    fn create_linear_gradient(&self, x0: f32, y0: f32, x1: f32, y1: f32, stops: Vec<(f32, String)>) -> Result<String, String>;
    fn create_radial_gradient(&self, x0: f32, y0: f32, r0: f32, x1: f32, y1: f32, r1: f32, stops: Vec<(f32, String)>) -> Result<String, String>;
    fn set_fill_gradient(&self, gradient_id: &str) -> Result<(), String>;
    fn set_stroke_gradient(&self, gradient_id: &str) -> Result<(), String>;
    
    fn set_shadow(&self, offset_x: f32, offset_y: f32, blur: f32, color: &str) -> Result<(), String>;
    fn clear_shadow(&self) -> Result<(), String>;
    
    fn set_global_alpha(&self, alpha: f32) -> Result<(), String>;
    fn set_global_composite_operation(&self, operation: &str) -> Result<(), String>;
    
    fn save_drawing_state(&self) -> Result<(), String>;
    fn restore_drawing_state(&self) -> Result<(), String>;
    fn clear(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    
    fn clear_clip(&self) -> Result<(), String>;
    fn clip_rect(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), String>;
    fn clip_rounded_rect(&self, x: f32, y: f32, width: f32, height: f32, radius: f32) -> Result<(), String>;
    
    fn set_blend_mode(&self, mode: &str) -> Result<(), String>;
    fn apply_filter(&self, filter: &str) -> Result<(), String>;
    fn clear_filter(&self) -> Result<(), String>;
}

pub trait ComponentRenderer<T: DrawingContext> {
    fn render(&self, node: &RenderNode, context: &T, frame: Rect) -> Result<(), String>;
}

pub struct Renderer<T: DrawingContext> {
    context: T,
    renderers: HashMap<&'static str, Box<dyn ComponentRenderer<T>>>,
    dirty_regions: Vec<Rect>,
    needs_full_render: bool,
    
    event_dispatcher: EventDispatcher,
    event_middleware: EventMiddlewarePipeline,
    
    node_layout_map: HashMap<String, Rect>,
    focused_node_id: Option<String>,
    hovered_node_id: Option<String>,
}

impl<T: DrawingContext> Renderer<T> {
    pub fn new(context: T) -> Self {
        let mut event_middleware = EventMiddlewarePipeline::new(Duration::from_secs(3))
            .with_max_retries(3);
            
        let _ = event_middleware.add_middleware(
            LoggingMiddleware::new(LogLevel::Debug)
        );
        
        let mut renderer = Self {
            context,
            renderers: HashMap::new(),
            dirty_regions: Vec::new(),
            needs_full_render: true,
            
            event_dispatcher: EventDispatcher::new(),
            event_middleware,
            
            node_layout_map: HashMap::new(),
            focused_node_id: None,
            hovered_node_id: None,
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
    
    pub fn mark_dirty(&mut self, region: Rect) {
        self.dirty_regions.push(region);
    }
    
    pub fn mark_all_dirty(&mut self) {
        self.needs_full_render = true;
    }
    
    pub fn render_dirty_regions(&self, node: &RenderNode, container_rect: Rect) -> Result<(), String> {
        if self.needs_full_render {
            return self.render_node(node, true);
        }
        
        for region in &self.dirty_regions {
            if !regions_intersect(*region, container_rect) {
                continue;
            }
            
            self.context.save_drawing_state()?;
            
            self.context.begin_path()?;
            self.context.rect(region.x, region.y, region.width, region.height)?;
            self.context.clip()?;
            
            self.context.clear(region.x, region.y, region.width, region.height)?;
            
            self.render_node_in_region(node, true, *region)?;
            
            self.context.restore_drawing_state()?;
        }
        
        Ok(())
    }
    
    fn render_node_in_region(&self, node: &RenderNode, enable_clipping: bool, region: Rect) -> Result<(), String> {
        let x = node.get_prop_f32("x").unwrap_or(0.0);
        let y = node.get_prop_f32("y").unwrap_or(0.0);
        let width = node.get_prop_f32("width").unwrap_or(0.0);
        let height = node.get_prop_f32("height").unwrap_or(0.0);
        
        let frame = Rect::new(x, y, width, height);
        
        if !regions_intersect(frame, region) {
            return Ok(());
        }
        
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
            self.render_node_in_region(child, enable_clipping, region)?;
        }
        
        if should_clip {
            self.context.restore_drawing_state()?;
        }
        
        Ok(())
    }
    
    fn render_node(&self, node: &RenderNode, enable_clipping: bool) -> Result<(), String> {
        let x = node.get_prop_f32("x").unwrap_or(0.0);
        let y = node.get_prop_f32("y").unwrap_or(0.0);
        let width = node.get_prop_f32("width").unwrap_or(0.0);
        let height = node.get_prop_f32("height").unwrap_or(0.0);
        
        let frame = Rect::new(x, y, width, height);
        
        unsafe {
            let this = self as *const Self as *mut Self;
            (*this).node_layout_map.insert(node.id.clone(), frame);
        }
        
        let opacity = node.get_prop_f32("opacity");
        let has_opacity = opacity.is_some() && opacity.unwrap() < 1.0;
        
        if has_opacity {
            self.context.save_drawing_state()?;
            self.context.set_global_alpha(opacity.unwrap())?;
        }
        
        let has_shadow = node.get_prop("shadow_radius").is_some() &&
                         node.get_prop("shadow_color").is_some();
        
        if has_shadow {
            let shadow_radius = node.get_prop_f32("shadow_radius").unwrap_or(0.0);
            let default_shadow_color = "rgba(0,0,0,0.5)".to_string();
            let shadow_color = node.get_prop("shadow_color").unwrap_or(&default_shadow_color);
            let shadow_offset_x = node.get_prop_f32("shadow_offset_x").unwrap_or(0.0);
            let shadow_offset_y = node.get_prop_f32("shadow_offset_y").unwrap_or(0.0);
            
            self.context.set_shadow(shadow_offset_x, shadow_offset_y, shadow_radius, shadow_color)?;
        }
        
        let should_clip = enable_clipping && node.get_prop("clip_to_bounds")
            .map(|v| v == "true")
            .unwrap_or(false);
        
        if should_clip {
            self.context.save_drawing_state()?;
            self.context.begin_path()?;
            
            let corner_radius = node.get_prop_f32("corner_radius");
            if let Some(radius) = corner_radius {
                if radius > 0.0 {
                    self.context.clip_rounded_rect(frame.x, frame.y, frame.width, frame.height, radius)?;
                } else {
                    self.context.rect(frame.x, frame.y, frame.width, frame.height)?;
                    self.context.clip()?;
                }
            } else {
                self.context.rect(frame.x, frame.y, frame.width, frame.height)?;
                self.context.clip()?;
            }
        }
        
        let blend_mode = node.get_prop("blend_mode");
        if let Some(mode) = blend_mode {
            self.context.set_blend_mode(mode)?;
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
        
        if has_shadow {
            self.context.clear_shadow()?;
        }
        
        if has_opacity {
            self.context.restore_drawing_state()?;
        }
        
        Ok(())
    }
    
    pub fn clear_dirty_regions(&mut self) {
        self.dirty_regions.clear();
        self.needs_full_render = false;
    }
    
    
    pub fn register_event_handler(&self, event_type: EventType, handler: TypedEventHandler) {
        self.event_dispatcher.register_handler(event_type, handler);
    }
    
    pub fn register_global_handler(&self, handler: TypedEventHandler) {
        self.event_dispatcher.register_global_handler(handler);
    }
    
    pub fn process_event(&mut self, mut event: Event) -> HandlerResult {
        match self.event_middleware.process(&mut event) {
            Ok(MiddlewareResult::Continue) | Ok(MiddlewareResult::Modified) => {
                if event.target_id.is_none() && event.position.is_some() {
                    let position = event.position.unwrap();
                    if let Some(target_id) = self.find_node_at_position(position.0, position.1) {
                        event.target_id = Some(target_id);
                    }
                }
                
                if matches!(event.event_type, EventType::PointerMove) {
                    self.handle_hover_events(&mut event);
                }
                
                if matches!(event.event_type, EventType::Tap) || 
                   matches!(event.event_type, EventType::PointerDown) {
                    self.handle_focus_events(&mut event);
                }
                
                self.event_dispatcher.dispatch(&mut event)
            },
            Ok(MiddlewareResult::Stop) => {
                HandlerResult::Handled
            },
            Err(err) => {
                eprintln!("Error processing event: {:?}", err);
                HandlerResult::Unhandled
            },
            _ => HandlerResult::Unhandled,
        }
    }
    
    pub fn find_node_at_position(&self, x: f32, y: f32) -> Option<String> {
        let mut nodes: Vec<(&String, &Rect)> = self.node_layout_map.iter().collect();
        
        nodes.reverse();
        
        for (node_id, rect) in nodes {
            if rect.contains_point(x, y) {
                return Some(node_id.clone());
            }
        }
        
        None
    }
    
    fn handle_hover_events(&mut self, event: &mut Event) {
        if let Some(position) = event.position {
            let current_hover = self.find_node_at_position(position.0, position.1);
            
            if current_hover != self.hovered_node_id {
                if let Some(prev_id) = &self.hovered_node_id {
                    let mut hover_exit = Event::new(
                        EventType::HoverExit,
                        event.metadata.source.clone()
                    );
                    hover_exit.target_id = Some(prev_id.clone());
                    hover_exit.position = event.position;
                    
                    let _ = self.event_dispatcher.dispatch(&mut hover_exit);
                }
                
                if let Some(new_id) = &current_hover {
                    let mut hover_enter = Event::new(
                        EventType::HoverEnter,
                        event.metadata.source.clone()
                    );
                    hover_enter.target_id = Some(new_id.clone());
                    hover_enter.position = event.position;
                    
                    let _ = self.event_dispatcher.dispatch(&mut hover_enter);
                }
                
                self.hovered_node_id = current_hover;
            }
        }
    }
    
    fn handle_focus_events(&mut self, event: &mut Event) {
        if let Some(target_id) = &event.target_id {
            if self.focused_node_id.as_ref() == Some(target_id) {
                return;
            }
            
            if let Some(prev_id) = &self.focused_node_id {
                let mut blur_event = Event::new(
                    EventType::Blur,
                    event.metadata.source.clone()
                );
                blur_event.target_id = Some(prev_id.clone());
                
                let _ = self.event_dispatcher.dispatch(&mut blur_event);
            }
            
            let mut focus_event = Event::new(
                EventType::Focus,
                event.metadata.source.clone()
            );
            focus_event.target_id = Some(target_id.clone());
            
            let _ = self.event_dispatcher.dispatch(&mut focus_event);
            
            self.focused_node_id = Some(target_id.clone());
        }
    }
    
    pub fn register_handlers_from_tree(&self, root: &RenderNode) {
        self.register_node_handlers(root);
    }
    
    fn register_node_handlers(&self, node: &RenderNode) {
        for handler in &node.event_handlers {
            let handler_id = handler.handler_id.clone();
            let event_type = handler.event_type.clone();
            
            let typed_handler = TypedEventHandler::new(
                &handler_id,
                {
                    let handler_id = handler_id.clone();
                    let event_type_clone = event_type.clone();
                    move |_event: &mut Event| {
                        println!("Handler '{}' called for event type {:?}", handler_id, event_type_clone);
                        HandlerResult::Handled
                    }
                }
            );
            
            self.event_dispatcher.register_handler(event_type, typed_handler);
        }
        
        if let Some(node_events) = node.get_node_events() {
            let create_handler = |handler_id: String, event_desc: String| {
                TypedEventHandler::new(&handler_id, move |event: &mut Event| {
                    println!("{} handler called for node {:?}", event_desc, event.target_id);
                    HandlerResult::Handled
                })
            };
            
            macro_rules! register_event_handler {
                ($event_type:expr, $handler_option:expr, $event_desc:expr) => {
                    if let Some(ref handler_id) = $handler_option {
                        self.event_dispatcher.register_handler(
                            $event_type,
                            create_handler(
                                handler_id.clone(), 
                                $event_desc.to_string()
                            )
                        );
                    }
                };
            }
            
            register_event_handler!(EventType::Tap, node_events.on_tap, "Tap");
            register_event_handler!(EventType::DoubleTap, node_events.on_double_tap, "Double tap");
            register_event_handler!(EventType::LongPress, node_events.on_long_press, "Long press");
            register_event_handler!(EventType::HoverEnter, node_events.on_hover_enter, "Hover enter");
            register_event_handler!(EventType::HoverExit, node_events.on_hover_exit, "Hover exit");
            register_event_handler!(EventType::Focus, node_events.on_focus, "Focus");
            register_event_handler!(EventType::Blur, node_events.on_blur, "Blur");
            
            for (direction, handler_id) in &node_events.on_swipe {
                let direction_str = direction.clone();
                let swipe_direction = match direction_str.as_str() {
                    "left" => SwipeDirection::Left,
                    "right" => SwipeDirection::Right,
                    "up" => SwipeDirection::Up,
                    "down" => SwipeDirection::Down,
                    _ => continue,
                };
                
                self.event_dispatcher.register_handler(
                    EventType::Swipe(swipe_direction),
                    TypedEventHandler::new(handler_id, move |event: &mut Event| {
                        println!("Swipe {} handler called for node {:?}", direction_str, event.target_id);
                        HandlerResult::Handled
                    })
                );
            }
        }
        
        for child in &node.children {
            self.register_node_handlers(child);
        }
    }
}

fn regions_intersect(a: Rect, b: Rect) -> bool {
    !(a.x > b.x + b.width || 
      a.x + a.width < b.x || 
      a.y > b.y + b.height || 
      a.y + a.height < b.y)
}

impl Rect {
    pub fn contains_point(&self, x: f32, y: f32) -> bool {
        x >= self.x && x <= self.x + self.width && 
        y >= self.y && y <= self.y + self.height
    }
}