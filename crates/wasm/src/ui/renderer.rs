use milost_ui::components::registry::transform_component;
use milost_ui::components::UIComponent;
use milost_ui::layout::{LayoutEngine, Size};
use milost_ui::render::canvas_renderer::CanvasRenderer;
use milost_ui::render::RenderNode;
use wasm_bindgen::prelude::*;
use std::cell::RefCell;
use std::rc::Rc;

#[wasm_bindgen]
pub struct WebRenderer {
    canvas_renderer: CanvasRenderer,
    layout_engine: Rc<RefCell<LayoutEngine>>,
    current_node: Rc<RefCell<Option<RenderNode>>>,
    container_size: Size,
}

#[wasm_bindgen]
impl WebRenderer {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str, width: f32, height: f32) -> Result<WebRenderer, JsValue> {
        let canvas_renderer = CanvasRenderer::new(canvas_id, width, height);
        
        // Get canvas dimensions for layout
        let (width, height) = canvas_renderer.get_dimensions();
        let container_size = Size::new(width, height);
        
        Ok(Self {
            canvas_renderer,
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
        
        // Create a temporary internal renderer that doesn't get exposed to JS
        let render_result: Result<(), JsValue> = {
            #[cfg(target_arch = "wasm32")]
            {
                // For WebAssembly, use internal methods
                
                // We're using a wasm-specific approach to access internal methods
                let context = unsafe { &*(&self.canvas_renderer as *const CanvasRenderer) }.get_context();
                let mut renderer = Renderer::new(context);
                
                // Clear the canvas
                self.canvas_renderer.clear_canvas()?;
                
                // Render the node
                renderer.render_with_clipping(&render_node)
                    .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)))
            }
            
            #[cfg(not(target_arch = "wasm32"))]
            {
                // For non-WebAssembly builds, we'd use a different approach
                Ok(())
            }
        };
        
        render_result
    }
    
    #[wasm_bindgen]
    pub fn redraw(&self) -> Result<(), JsValue> {
        if let Some(render_node) = &*self.current_node.borrow() {
            // Create a temporary internal renderer that doesn't get exposed to JS
            let render_result: Result<(), JsValue> = {
                #[cfg(target_arch = "wasm32")]
                {
                    // For WebAssembly, use internal methods
                    use crate::render::renderer::Renderer;
                    
                    // We're using a wasm-specific approach to access internal methods
                    let context = unsafe { &*(&self.canvas_renderer as *const CanvasRenderer) }.get_context();
                    let mut renderer = Renderer::new(context);
                    
                    // Clear the canvas
                    self.canvas_renderer.clear_canvas()?;
                    
                    // Render the node
                    renderer.render_with_clipping(render_node)
                        .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)))
                }
                
                #[cfg(not(target_arch = "wasm32"))]
                {
                    // For non-WebAssembly builds, we'd use a different approach
                    Ok(())
                }
            };
            
            render_result?;
        }
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn mark_dirty_region(&self, x: f32, y: f32, width: f32, height: f32) -> Result<(), JsValue> {
        if let Some(render_node) = &*self.current_node.borrow() {
            // Create a temporary internal renderer that doesn't get exposed to JS
            let render_result: Result<(), JsValue> = {
                #[cfg(target_arch = "wasm32")]
                {
                    // For WebAssembly, use internal methods
                    use crate::render::renderer::Renderer;
                    
                    // We're using a wasm-specific approach to access internal methods
                    let context = unsafe { &*(&self.canvas_renderer as *const CanvasRenderer) }.get_context();
                    let mut renderer = Renderer::new(context);
                    
                    // Mark the region as dirty
                    renderer.mark_dirty(Rect::new(x, y, width, height));
                    
                    // Render only the dirty regions
                    let container_rect = Rect::from_size(self.container_size.width, self.container_size.height);
                    let result = renderer.render_dirty_regions(render_node, container_rect)
                        .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)));
                    
                    // Clear dirty regions
                    renderer.clear_dirty_regions();
                    
                    result
                }
                
                #[cfg(not(target_arch = "wasm32"))]
                {
                    // For non-WebAssembly builds, we'd use a different approach
                    Ok(())
                }
            };
            
            render_result?;
        }
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn handle_event(&self, event_type: &str, x: f32, y: f32, target_id: Option<String>) -> Result<bool, JsValue> {
        if let Some(render_node) = &*self.current_node.borrow() {
            // Create a temporary internal renderer that doesn't get exposed to JS
            let event_result = {
                #[cfg(target_arch = "wasm32")]
                {
                    // For WebAssembly, use internal methods
                    use crate::render::renderer::Renderer;
                    use crate::events::{Event, EventType, HandlerResult};
                    
                    // We're using a wasm-specific approach to access internal methods
                    let context = unsafe { &*(&self.canvas_renderer as *const CanvasRenderer) }.get_context();
                    let mut renderer = Renderer::new(context);
                    
                    // Register event handlers from the current render tree
                    renderer.register_handlers_from_tree(render_node);
                    
                    // Create an event
                    let event_type = match event_type {
                        "tap" => EventType::Tap,
                        "double_tap" => EventType::DoubleTap,
                        "long_press" => EventType::LongPress,
                        "pointer_down" => EventType::PointerDown,
                        "pointer_up" => EventType::PointerUp,
                        "pointer_move" => EventType::PointerMove,
                        "focus" => EventType::Focus,
                        "blur" => EventType::Blur,
                        "hover_enter" => EventType::HoverEnter,
                        "hover_exit" => EventType::HoverExit,
                        "swipe_left" => EventType::Swipe(crate::events::SwipeDirection::Left),
                        "swipe_right" => EventType::Swipe(crate::events::SwipeDirection::Right),
                        "swipe_up" => EventType::Swipe(SwipeDirection::Up),
                        "swipe_down" => EventType::Swipe(SwipeDirection::Down),
                        _ => return Err(JsValue::from_str(&format!("Unknown event type: {}", event_type))),
                    };
                    
                    let mut event = Event::new(event_type, "web-client".to_string());
                    event.position = Some((x, y));
                    if let Some(id) = target_id {
                        event.target_id = Some(id);
                    }
                    
                    // Process the event
                    let result = renderer.process_event(event);
                    
                    match result {
                        HandlerResult::Handled => true,
                        HandlerResult::Unhandled => false,
                    }
                }
                
                #[cfg(not(target_arch = "wasm32"))]
                {
                    // For non-WebAssembly builds, we'd return not handled
                    false
                }
            };
            
            Ok(event_result)
        } else {
            Ok(false)
        }
    }
    
    #[wasm_bindgen]
    pub fn find_node_at_position(&self, x: f32, y: f32) -> Option<String> {
        if let Some(render_node) = &*self.current_node.borrow() {
            // Create a temporary internal renderer that doesn't get exposed to JS
            #[cfg(target_arch = "wasm32")]
            {
                // For WebAssembly, use internal methods
                use crate::render::renderer::Renderer;
                
                // We're using a wasm-specific approach to access internal methods
                let context = unsafe { &*(&self.canvas_renderer as *const CanvasRenderer) }.get_context();
                let renderer = Renderer::new(context);
                
                renderer.find_node_at_position(x, y)
            }
            
            #[cfg(not(target_arch = "wasm32"))]
            {
                // For non-WebAssembly builds, return None
                None
            }
        } else {
            None
        }
    }
}

// Static function to render a component to a canvas
#[wasm_bindgen]
pub fn render_to_canvas_element(canvas_id: &str, json: &str, width: f32, height: f32) -> Result<(), JsValue> {
    // Create a renderer instance with the additional width and height parameters
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