
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{render, UIComponent, layout::{LayoutEngine, Size}};
use milost_ui::platform::canvas::CanvasRenderer;

use super::canvas_context::WebCanvasContext;

#[wasm_bindgen]
pub fn render_component(json: &str) -> Result<JsValue, JsValue> {
    let component: UIComponent = serde_json::from_str(json)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;

    let mut render_node = render(&component);
    
    let mut layout_engine = LayoutEngine::new();
    let container_size = Size::new(800.0, 600.0);
    layout_engine.compute_layout(&mut render_node, container_size);

    serde_json::to_string(&render_node)
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn render_to_canvas_element(canvas_id: &str, json: &str) -> Result<(), JsValue> {
    let component: UIComponent = serde_json::from_str(json)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;

    let mut render_node = render(&component);
    
    let web_canvas = WebCanvasContext::new(canvas_id)?;
    
    let width = web_canvas.width()?;
    let height = web_canvas.height()?;
    let container_size = Size::new(width as f32, height as f32);
    
    let mut layout_engine = LayoutEngine::new();
    layout_engine.compute_layout(&mut render_node, container_size);
    
    let renderer = CanvasRenderer::new(web_canvas);
    
    renderer.render(&render_node)
        .map_err(|e| JsValue::from_str(&format!("Rendering error: {}", e)))
}