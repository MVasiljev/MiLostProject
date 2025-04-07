use crate::render::node::RenderNode;
use crate::layout::types::{Size};
use crate::render::property::keys;

pub fn measure_button(node: &RenderNode, available_size: Size) -> Size {
    let label = node.get_prop(keys::LABEL)
        .map(|p| p.to_string_value())
        .unwrap_or_else(|| "".to_string());
    
    let size_preset = node.get_prop("size")
        .map(|p| p.to_string_value())
        .unwrap_or_else(|| "Medium".to_string());
    
    let (base_height, char_width, horizontal_padding) = match size_preset.as_str() {
        "Small" => (28.0, 7.0, 8.0),
        "Large" => (48.0, 10.0, 16.0),
        _ => (36.0, 8.0, 12.0),
    };
    
    let fixed_width = node.get_prop_f32("fixed_width");
    let fixed_height = node.get_prop_f32("fixed_height");
    
    let content_width = if fixed_width.is_some() {
        fixed_width.unwrap()
    } else {
        let icon_space = if node.get_prop("icon").is_some() {
            base_height * 0.6
        } else {
            0.0
        };
        
        let text_width = if label.is_empty() {
            0.0
        } else {
            let font_size_multiplier = node.get_prop_f32(keys::FONT_SIZE).map_or(1.0, |s| s / 16.0);
            
            label.len() as f32 * char_width * font_size_multiplier
        };
        
        let padding = node.get_prop_f32(keys::PADDING).unwrap_or(horizontal_padding);
        
        (text_width + icon_space + (padding * 2.0)).min(available_size.width)
    };
    
    let content_height = if fixed_height.is_some() {
        fixed_height.unwrap()
    } else {
        let vertical_padding = node.get_prop_f32(keys::PADDING).unwrap_or(8.0);
        
        let font_size_factor = node.get_prop_f32(keys::FONT_SIZE).map_or(1.0, |s| s / 16.0);
        
        base_height * font_size_factor
    };
    
    let min_width = node.get_prop_f32(keys::MIN_WIDTH).unwrap_or(0.0);
    let max_width = node.get_prop_f32(keys::MAX_WIDTH).unwrap_or(f32::MAX);
    let constrained_width = content_width.max(min_width).min(max_width).min(available_size.width);
    
    let is_loading = node.get_prop(keys::IS_LOADING)
        .and_then(|v| v.as_boolean())
        .unwrap_or(false);
    
    let final_width = if is_loading {
        let indicator_size = node.get_prop_f32("loading_indicator_size").unwrap_or(16.0);
        let hide_text = node.get_prop("hide_text_while_loading")
            .and_then(|v| v.as_boolean())
            .unwrap_or(false);
        
        if hide_text {
            (indicator_size + 16.0).max(constrained_width)
        } else {
            (constrained_width + indicator_size + 8.0).min(available_size.width)
        }
    } else {
        constrained_width
    };
    
    Size::new(final_width, content_height)
}