use milost_ui::components::registry::transform_component;
use milost_ui::components::UIComponent;
use milost_ui::layout::{LayoutEngine, Size, Rect};
use milost_ui::render::renderer::Renderer;
use milost_ui::render::node::RenderNode;
use milost_ui::events::{
    Event, EventType, HandlerResult, SwipeDirection, EventSource
};
use milost_ui::DrawingContext;
use wasm_bindgen::prelude::*;
use std::cell::RefCell;
use std::rc::Rc;

use crate::ui::canvas_context::CanvasContext;

#[wasm_bindgen]
pub struct WebRenderer {
    canvas_context: Rc<RefCell<CanvasContext>>,
    layout_engine: Rc<RefCell<LayoutEngine>>,
    current_node: Rc<RefCell<Option<RenderNode>>>,
    container_size: Size,
}

#[wasm_bindgen]
impl WebRenderer {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str, width: f32, height: f32) -> Result<WebRenderer, JsValue> {
        let canvas_context = CanvasContext::new(canvas_id)
            .map_err(|e| JsValue::from_str(&e))?;
        
        let ctx = Rc::new(RefCell::new(canvas_context));
        
        // Get canvas dimensions for layout
        let container_size = Size::new(width, height);
        
        Ok(Self {
            canvas_context: ctx,
            layout_engine: Rc::new(RefCell::new(LayoutEngine::new())),
            current_node: Rc::new(RefCell::new(None)),
            container_size,
        })
    }
    
    #[wasm_bindgen]
    pub fn set_size(&mut self, width: f32, height: f32) {
        self.container_size = Size::new(width, height);
    }
    
    #[wasm_bindgen]
    pub fn render_component(&mut self, json: &str) -> Result<(), JsValue> {
        // Parse the component from JSON
        let component: UIComponent = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
        
        // Transform the component to a render node
        let mut render_node = transform_component(&component);
        
        // Compute layout
        let mut layout_engine = self.layout_engine.borrow_mut();
        layout_engine.compute_enhanced_layout(&mut render_node, self.container_size);
        
        // Store the current node for potential redraws
        *self.current_node.borrow_mut() = Some(render_node.clone());
        
        // Clear the canvas
        self.canvas_context.borrow().clear(0.0, 0.0, self.container_size.width, self.container_size.height)
            .map_err(|e| JsValue::from_str(&format!("Canvas clear error: {}", e)))?;
        
        // Create a renderer and render the node
        let renderer = Renderer::new(self.canvas_context.borrow().clone());
        renderer.render_with_clipping(&render_node)
            .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)))?;
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn redraw(&self) -> Result<(), JsValue> {
        if let Some(render_node) = &*self.current_node.borrow() {
            // Clear the canvas
            self.canvas_context.borrow().clear(0.0, 0.0, self.container_size.width, self.container_size.height)
                .map_err(|e| JsValue::from_str(&format!("Canvas clear error: {}", e)))?;
            
            // Create a renderer and render the node
            let renderer = Renderer::new(self.canvas_context.borrow().clone());
            renderer.render_with_clipping(render_node)
                .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)))?;
        }
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn mark_dirty_region(&mut self, x: f32, y: f32, width: f32, height: f32) -> Result<(), JsValue> {
        if let Some(render_node) = &*self.current_node.borrow() {
            let dirty_rect = Rect::new(x, y, width, height);
            let container_rect = Rect::new(0.0, 0.0, self.container_size.width, self.container_size.height);
            
            // Create a renderer
            let mut renderer = Renderer::new(self.canvas_context.borrow().clone());
            
            // Mark the region as dirty
            renderer.mark_dirty(dirty_rect);
            
            // Render only the dirty regions
            renderer.render_dirty_regions(render_node, container_rect)
                .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)))?;
            
            // Clear dirty regions
            renderer.clear_dirty_regions();
        }
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn handle_event(&self, event_type: &str, x: f32, y: f32, target_id: Option<String>) -> Result<bool, JsValue> {
        if let Some(render_node) = &*self.current_node.borrow() {
            // Create a renderer
            let mut renderer = Renderer::new(self.canvas_context.borrow().clone());
            
            // Register event handlers from the current render tree
            renderer.register_handlers_from_tree(render_node);
            
            // Create an event source for web client
            let event_source = EventSource::Custom {
                category: "web-client".to_string(),
                subcategory: None,
            };
            
            // Parse the event type
            let event_type_enum = match event_type {
                "tap" => EventType::Tap,
                "double_tap" => EventType::DoubleTap,
                "long_press" => EventType::LongPress,
                "pointer_down" => EventType::PointerDown,
                "pointer_up" => EventType::PointerUp,
                "pointer_move" => EventType::PointerMove,
                "touch_start" => EventType::TouchStart,
                "touch_end" => EventType::TouchEnd, 
                "touch_move" => EventType::TouchMove,
                "focus" => EventType::Focus,
                "blur" => EventType::Blur,
                "hover_enter" => EventType::HoverEnter,
                "hover_exit" => EventType::HoverExit,
                "swipe_left" => EventType::Swipe(SwipeDirection::Left),
                "swipe_right" => EventType::Swipe(SwipeDirection::Right),
                "swipe_up" => EventType::Swipe(SwipeDirection::Up),
                "swipe_down" => EventType::Swipe(SwipeDirection::Down),
                _ => return Err(JsValue::from_str(&format!("Unknown event type: {}", event_type))),
            };
            
            // Create the event
            let mut event = Event::new(event_type_enum, event_source);
            event.position = Some((x, y));
            if let Some(id) = target_id {
                event.target_id = Some(id);
            }
            
            // Process the event
            let result = renderer.process_event(event);
            
            Ok(matches!(result, HandlerResult::Handled))
        } else {
            Ok(false)
        }
    }
    
    #[wasm_bindgen]
    pub fn find_node_at_position(&self, x: f32, y: f32) -> Option<String> {
        if let Some(_) = &*self.current_node.borrow() {
            let renderer = Renderer::new(self.canvas_context.borrow().clone());
            renderer.find_node_at_position(x, y)
        } else {
            None
        }
    }
}

// Static function to render a component to a canvas
#[wasm_bindgen]
pub fn render_to_canvas_element(canvas_id: &str, json: &str, width: f32, height: f32) -> Result<(), JsValue> {
    // Create a renderer instance with the provided width and height
    let mut renderer = WebRenderer::new(canvas_id, width, height)?;
    
    // Use the renderer to render the component
    renderer.render_component(json)
}

// Static function to get the render node from a component
#[wasm_bindgen]
pub fn get_render_node(json: &str) -> Result<JsValue, JsValue> {
    // Parse the component from JSON
    let component: UIComponent = serde_json::from_str(json)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
    
    // Transform the component to a render node
    let render_node = transform_component(&component);
    
    // Convert the render node to JSON
    serde_json::to_string(&render_node)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
        .map(|s| JsValue::from_str(&s))
}