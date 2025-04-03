
use crate::render::node::RenderNode;
use super::{types::{Alignment, Rect, Size}, EdgeInsets};
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct LayoutInfo {
    pub frame: Rect,
    pub padding: Option<f32>,
    pub alignment: Option<Alignment>,
    pub content_size: Size,
    pub flex_grow: Option<f32>,
    pub flex_shrink: Option<f32>,
    pub flex_basis: Option<f32>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
    pub parent_type: Option<String>,
    pub resolved_props: HashMap<String, String>,
}

impl LayoutInfo {
    pub fn new() -> Self {
        Self {
            frame: Rect::zero(),
            padding: None,
            alignment: None,
            content_size: Size::zero(),
            flex_grow: None,
            flex_shrink: None,
            flex_basis: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,
            parent_type: None,
            resolved_props: HashMap::new(),
        }
    }
    
    pub fn with_frame(mut self, frame: Rect) -> Self {
        self.frame = frame;
        self
    }
    
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    pub fn with_alignment(mut self, alignment: Alignment) -> Self {
        self.alignment = Some(alignment);
        self
    }
    
    pub fn with_content_size(mut self, size: Size) -> Self {
        self.content_size = size;
        self
    }
    
    pub fn with_flex_grow(mut self, flex_grow: f32) -> Self {
        self.flex_grow = Some(flex_grow);
        self
    }
    
    pub fn with_flex_shrink(mut self, flex_shrink: f32) -> Self {
        self.flex_shrink = Some(flex_shrink);
        self
    }
    
    pub fn with_flex_basis(mut self, flex_basis: f32) -> Self {
        self.flex_basis = Some(flex_basis);
        self
    }
    
    pub fn with_min_width(mut self, min_width: f32) -> Self {
        self.min_width = Some(min_width);
        self
    }
    
    pub fn with_max_width(mut self, max_width: f32) -> Self {
        self.max_width = Some(max_width);
        self
    }
    
    pub fn with_min_height(mut self, min_height: f32) -> Self {
        self.min_height = Some(min_height);
        self
    }
    
    pub fn with_max_height(mut self, max_height: f32) -> Self {
        self.max_height = Some(max_height);
        self
    }
    
    pub fn with_parent_type(mut self, parent_type: &str) -> Self {
        self.parent_type = Some(parent_type.to_string());
        self
    }
    
    pub fn inner_rect(&self) -> Rect {
        if let Some(padding) = self.padding {
            self.frame.inset(padding)
        } else {
            self.frame
        }
    }
    
    pub fn constrain_size(&self, size: Size) -> Size {
        let width = if let Some(max_width) = self.max_width {
            size.width.min(max_width)
        } else {
            size.width
        };
        
        let width = if let Some(min_width) = self.min_width {
            width.max(min_width)
        } else {
            width
        };
        
        let height = if let Some(max_height) = self.max_height {
            size.height.min(max_height)
        } else {
            size.height
        };
        
        let height = if let Some(min_height) = self.min_height {
            height.max(min_height)
        } else {
            height
        };
        
        Size::new(width, height)
    }
}


pub struct LayoutEngine {
    layout_cache: HashMap<String, LayoutInfo>,
}

impl LayoutEngine {

    pub fn new() -> Self {
        Self {
            layout_cache: HashMap::new(),
        }
    }
    
    pub fn compute_layout<'a>(&mut self, node: &'a mut RenderNode, container_size: Size) -> &'a mut RenderNode {
        self.layout_cache.clear();
        
        self.measure_node(node, container_size);
        
        self.position_node(node, Rect::from_size(container_size.width, container_size.height));
        
        self.apply_layout(node);
        
        node
    }

    fn position_vstack_children_flex(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut total_fixed_height = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(mut child_layout) = self.layout_cache.get_mut(&child.id) {
                child_layout.parent_type = Some("VStack".to_string());
            }
            
            let flex_grow = child.resolved_props.get("flex_grow")
                .and_then(|val| val.parse::<f32>().ok())
                .unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_height += child_layout.content_size.height;
            }
        }
        
        let spacing_height = if node.children.len() > 1 {
            spacing * (node.children.len() - 1) as f32
        } else {
            0.0
        };
        
        total_fixed_height += spacing_height;
        
        let available_flex_height = (frame.height - total_fixed_height).max(0.0);
        
        let mut y_offset = frame.y;
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_height = child_layout.content_size.height;
                
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_height = (available_flex_height * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                if let Some(max_height) = child_layout.max_height {
                    child_height = child_height.min(max_height);
                }
                
                if let Some(min_height) = child_layout.min_height {
                    child_height = child_height.max(min_height);
                }
                
                let child_frame = Rect::new(
                    frame.x,
                    y_offset,
                    frame.width,
                    child_height
                );
                
                self.position_node(child, child_frame);
                
                y_offset += child_height + spacing;
            }
        }
    }
    
    fn position_hstack_children_flex(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut total_fixed_width = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(mut child_layout) = self.layout_cache.get_mut(&child.id) {
                child_layout.parent_type = Some("HStack".to_string());
            }
            
            let flex_grow = child.resolved_props.get("flex_grow")
                .and_then(|val| val.parse::<f32>().ok())
                .unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_width += child_layout.content_size.width;
            }
        }
        
        let spacing_width = if node.children.len() > 1 {
            spacing * (node.children.len() - 1) as f32
        } else {
            0.0
        };
        
        total_fixed_width += spacing_width;
        
        let available_flex_width = (frame.width - total_fixed_width).max(0.0);
        
        let mut x_offset = frame.x;
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_width = child_layout.content_size.width;
                
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_width = (available_flex_width * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                if let Some(max_width) = child_layout.max_width {
                    child_width = child_width.min(max_width);
                }
                
                if let Some(min_width) = child_layout.min_width {
                    child_width = child_width.max(min_width);
                }
                
                let child_frame = Rect::new(
                    x_offset,
                    frame.y,
                    child_width,
                    frame.height
                );
                
                self.position_node(child, child_frame);
                
                x_offset += child_width + spacing;
            }
        }
    }

    fn get_edge_insets(&self, node: &RenderNode) -> EdgeInsets {
        if let Some(edge_insets_str) = node.get_prop("edge_insets") {
            let parts: Vec<&str> = edge_insets_str.split(',').collect();
            if parts.len() == 4 {
                let top = parts[0].parse::<f32>().unwrap_or(0.0);
                let right = parts[1].parse::<f32>().unwrap_or(0.0);
                let bottom = parts[2].parse::<f32>().unwrap_or(0.0);
                let left = parts[3].parse::<f32>().unwrap_or(0.0);
                return EdgeInsets::new(top, right, bottom, left);
            }
        }
        
        if let Some(padding) = node.get_prop_f32("padding") {
            return EdgeInsets::all(padding);
        }
        
        EdgeInsets::zero()
    }
    
    fn enhanced_measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let node_type = &node.type_name;
        
        let content_size = match node_type.as_str() {
            "VStack" => self.measure_vstack(node, available_size),
            "HStack" => self.measure_hstack(node, available_size),
            "ZStack" => self.measure_zstack(node, available_size),
            "Text" => self.measure_text(node, available_size),
            "Button" => self.measure_button(node, available_size),
            "Image" => self.measure_image(node, available_size),
            "Scroll" => self.measure_scroll(node, available_size),
            "Spacer" => self.measure_spacer(node, available_size),
            "Divider" => self.measure_divider(node, available_size),
            _ => Size::zero(),
        };
        
        let mut layout_info = LayoutInfo::new().with_content_size(content_size);
        
        if let Some(padding) = node.resolved_props.get("padding") {
            if let Ok(padding_value) = padding.parse::<f32>() {
                layout_info = layout_info.with_padding(padding_value);
            }
        }
        
        if let Some(alignment_str) = node.resolved_props.get("alignment") {
            let alignment = match alignment_str.as_str() {
                "topLeading" => Some(Alignment::TopLeading),
                "top" => Some(Alignment::Top),
                "topTrailing" => Some(Alignment::TopTrailing),
                "leading" => Some(Alignment::Leading),
                "center" => Some(Alignment::Center),
                "trailing" => Some(Alignment::Trailing),
                "bottomLeading" => Some(Alignment::BottomLeading),
                "bottom" => Some(Alignment::Bottom),
                "bottomTrailing" => Some(Alignment::BottomTrailing),
                _ => None,
            };
            
            if let Some(a) = alignment {
                layout_info = layout_info.with_alignment(a);
            }
        }
        
        if let Some(flex_grow) = node.resolved_props.get("flex_grow") {
            if let Ok(value) = flex_grow.parse::<f32>() {
                layout_info = layout_info.with_flex_grow(value);
            }
        }
        
        if let Some(flex_shrink) = node.resolved_props.get("flex_shrink") {
            if let Ok(value) = flex_shrink.parse::<f32>() {
                layout_info = layout_info.with_flex_shrink(value);
            }
        }
        
        if let Some(flex_basis) = node.resolved_props.get("flex_basis") {
            if let Ok(value) = flex_basis.parse::<f32>() {
                layout_info = layout_info.with_flex_basis(value);
            }
        }
        
        if let Some(min_width) = node.resolved_props.get("min_width") {
            if let Ok(value) = min_width.parse::<f32>() {
                layout_info = layout_info.with_min_width(value);
            }
        }
        
        if let Some(max_width) = node.resolved_props.get("max_width") {
            if let Ok(value) = max_width.parse::<f32>() {
                layout_info = layout_info.with_max_width(value);
            }
        }
        
        if let Some(min_height) = node.resolved_props.get("min_height") {
            if let Ok(value) = min_height.parse::<f32>() {
                layout_info = layout_info.with_min_height(value);
            }
        }
        
        if let Some(max_height) = node.resolved_props.get("max_height") {
            if let Ok(value) = max_height.parse::<f32>() {
                layout_info = layout_info.with_max_height(value);
            }
        }
        
        self.layout_cache.insert(node.id.clone(), layout_info);
        
        content_size
    }
    
    fn measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let node_type = &node.type_name;
        
        let content_size = match node_type.as_str() {
            "VStack" => self.measure_vstack(node, available_size),
            "HStack" => self.measure_hstack(node, available_size),
            "ZStack" => self.measure_zstack(node, available_size),
            "Text" => self.measure_text(node, available_size),
            "Button" => self.measure_button(node, available_size),
            "Image" => self.measure_image(node, available_size),
            "Scroll" => self.measure_scroll(node, available_size),
            "Spacer" => self.measure_spacer(node, available_size),
            "Divider" => self.measure_divider(node, available_size),
            _ => Size::zero(),
        };
        
        let mut layout_info = LayoutInfo::new().with_content_size(content_size);
        
        if let Some(padding) = node.resolved_props.get("padding") {
            if let Ok(padding_value) = padding.parse::<f32>() {
                layout_info = layout_info.with_padding(padding_value);
            }
        }
        
        if let Some(alignment_str) = node.resolved_props.get("alignment") {
            let alignment = match alignment_str.as_str() {
                "topLeading" => Some(Alignment::TopLeading),
                "top" => Some(Alignment::Top),
                "topTrailing" => Some(Alignment::TopTrailing),
                "leading" => Some(Alignment::Leading),
                "center" => Some(Alignment::Center),
                "trailing" => Some(Alignment::Trailing),
                "bottomLeading" => Some(Alignment::BottomLeading),
                "bottom" => Some(Alignment::Bottom),
                "bottomTrailing" => Some(Alignment::BottomTrailing),
                _ => None,
            };
            
            if let Some(a) = alignment {
                layout_info = layout_info.with_alignment(a);
            }
        }
        
        self.layout_cache.insert(node.id.clone(), layout_info);
        
        content_size
    }
    
    fn position_node(&mut self, node: &RenderNode, frame: Rect) -> () {
        if let Some(mut layout_info) = self.layout_cache.get_mut(&node.id) {
            layout_info.frame = frame;
            
            let inner_frame = if let Some(padding) = layout_info.padding {
                frame.inset(padding)
            } else {
                frame
            };
            
            match node.type_name.as_str() {
                "VStack" => self.position_vstack_children(node, inner_frame),
                "HStack" => self.position_hstack_children(node, inner_frame),
                "ZStack" => self.position_zstack_children(node, inner_frame),
                "Scroll" => self.position_scroll_children(node, inner_frame),
                _ => (),
            }
        }
    }
    
    fn apply_layout(&self, node: &mut RenderNode) {
        if let Some(layout) = self.layout_cache.get(&node.id) {
            node.resolved_props.insert("x".to_string(), layout.frame.x.to_string());
            node.resolved_props.insert("y".to_string(), layout.frame.y.to_string());
            node.resolved_props.insert("width".to_string(), layout.frame.width.to_string());
            node.resolved_props.insert("height".to_string(), layout.frame.height.to_string());
            
            for child in &mut node.children {
                self.apply_layout(child);
            }
        }
    }
    
    
    fn measure_vstack(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
        let equal_spacing = node.get_prop("equal_spacing")
            .and_then(|val| val.parse::<bool>().ok())
            .unwrap_or(false);
            
        let insets = self.get_edge_insets(node);
        
        let content_width : f32= available_size.width - insets.left - insets.right;
        let content_height: f32 = available_size.height - insets.top - insets.bottom;
        let content_size:Size = Size::new(content_width, content_height);
        
        let mut total_height: f32 = 0.0;
        let mut max_width: f32 = 0.0;
        let mut flex_items: Vec<(usize, f32)> = Vec::new();
        let mut non_flex_count = 0;
        
        for (i, child) in node.children.iter().enumerate() {
            let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                flex_items.push((i, flex_grow));
            } else {
                let child_size = self.measure_node(child, content_size);
                total_height += child_size.height;
                max_width = max_width.max(child_size.width);
                non_flex_count += 1;
            }
        }
        
        let spacing_count = if equal_spacing {
            node.children.len().saturating_sub(1) as f32
        } else {
            (non_flex_count + flex_items.len()).saturating_sub(1) as f32
        };
        
        let total_spacing = spacing * spacing_count;
        total_height += total_spacing;
        
        let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
        let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
        max_width = max_width.max(min_width).min(max_width_constraint);
        
        let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
        let max_height = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
        total_height = total_height.max(min_height).min(max_height);
        
        Size::new(
            max_width + insets.left + insets.right,
            total_height + insets.top + insets.bottom
        )
    }
    
    fn measure_hstack(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
        let equal_spacing = node.get_prop("equal_spacing")
            .and_then(|val| val.parse::<bool>().ok())
            .unwrap_or(false);
            
        let insets = self.get_edge_insets(node);
        
        let content_width: f32 = available_size.width - insets.left - insets.right;
        let content_height: f32 = available_size.height - insets.top - insets.bottom;
        let content_size = Size::new(content_width, content_height);
        
        let mut total_width: f32 = 0.0;
        let mut max_height: f32 = 0.0;
        let mut flex_items: Vec<(usize, f32)> = Vec::new();
        let mut non_flex_count = 0;
        
        for (i, child) in node.children.iter().enumerate() {
            let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                flex_items.push((i, flex_grow));
            } else {
                let child_size = self.measure_node(child, content_size);
                total_width += child_size.width;
                max_height = max_height.max(child_size.height);
                non_flex_count += 1;
            }
        }
        
        let spacing_count = if equal_spacing {
            node.children.len().saturating_sub(1) as f32
        } else {
            (non_flex_count + flex_items.len()).saturating_sub(1) as f32
        };
        
        let total_spacing = spacing * spacing_count;
        total_width += total_spacing;
        
        let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
        let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
        total_width = total_width.max(min_width).min(max_width_constraint);
        
        let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
        let max_height_constraint = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
        max_height = max_height.max(min_height).min(max_height_constraint);
        
        Size::new(
            total_width + insets.left + insets.right,
            max_height + insets.top + insets.bottom
        )
    }
    
    fn measure_zstack(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let insets = self.get_edge_insets(node);
        
        let content_width = available_size.width - insets.left - insets.right;
        let content_height = available_size.height - insets.top - insets.bottom;
        let content_size = Size::new(content_width, content_height);
        
        let mut max_width: f32 = 0.0;
        let mut max_height: f32 = 0.0;
        
        for child in &node.children {
            let child_size = self.measure_node(child, content_size);
            max_width = max_width.max(child_size.width);
            max_height = max_height.max(child_size.height);
        }
        
        let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
        let max_width_constraint = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
        max_width = max_width.max(min_width).min(max_width_constraint);
        
        let min_height = node.get_prop_f32("min_height").unwrap_or(0.0);
        let max_height_constraint = node.get_prop_f32("max_height").unwrap_or(f32::MAX);
        max_height = max_height.max(min_height).min(max_height_constraint);
        
        Size::new(
            max_width + insets.left + insets.right,
            max_height + insets.top + insets.bottom
        )
    }
    
    fn measure_text(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let content = node.resolved_props.get("content")
            .cloned()
            .unwrap_or_else(|| "".to_string());
        
        let font_style = node.resolved_props.get("font_style")
            .cloned()
            .unwrap_or_else(|| "Body".to_string());
        
        let text_height = match font_style.as_str() {
            "Title" | "FontStyle::Title" => 32.0,
            "Body" | "FontStyle::Body" => 18.0,
            "Caption" | "FontStyle::Caption" => 14.0,
            _ => 18.0,
        };
        
        let char_width = match font_style.as_str() {
            "Title" | "FontStyle::Title" => 18.0,
            "Body" | "FontStyle::Body" => 10.0,
            "Caption" | "FontStyle::Caption" => 8.0,
            _ => 10.0,
        };
        
        let text_width = (content.len() as f32 * char_width).min(available_size.width);
        
        Size::new(text_width, text_height)
    }
    
    fn measure_button(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let label = node.resolved_props.get("label")
            .cloned()
            .unwrap_or_else(|| "".to_string());
        
        let size_preset = node.resolved_props.get("size")
            .cloned()
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
            let icon_space = if node.resolved_props.contains_key("icon") {
                base_height * 0.6
            } else {
                0.0
            };
            
            let text_width = if label.is_empty() {
                0.0
            } else {
                let font_size_multiplier = node.get_prop_f32("font_size").map_or(1.0, |s| s / 16.0);
                
                label.len() as f32 * char_width * font_size_multiplier
            };
            
            let padding = node.get_prop_f32("padding").unwrap_or(horizontal_padding);
            
            (text_width + icon_space + (padding * 2.0)).min(available_size.width)
        };
        
        let content_height = if fixed_height.is_some() {
            fixed_height.unwrap()
        } else {
            let vertical_padding = node.get_prop_f32("padding").unwrap_or(8.0);
            
            let font_size_factor = node.get_prop_f32("font_size").map_or(1.0, |s| s / 16.0);
            
            base_height * font_size_factor
        };
        
        let min_width = node.get_prop_f32("min_width").unwrap_or(0.0);
        let max_width = node.get_prop_f32("max_width").unwrap_or(f32::MAX);
        let constrained_width = content_width.max(min_width).min(max_width).min(available_size.width);
        
        let is_loading = node.get_prop("is_loading")
            .and_then(|v| v.parse::<bool>().ok())
            .unwrap_or(false);
        
        let final_width = if is_loading {
            let indicator_size = node.get_prop_f32("loading_indicator_size").unwrap_or(16.0);
            let hide_text = node.get_prop("hide_text_while_loading")
                .and_then(|v| v.parse::<bool>().ok())
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
    
    fn measure_image(&mut self, node: &RenderNode, available_size: Size) -> Size {
        Size::new(available_size.width, 200.0)
    }
    
    fn measure_scroll(&mut self, node: &RenderNode, available_size: Size) -> Size {
        if node.children.is_empty() {
            return Size::new(available_size.width, available_size.height);
        }
        
        let content_size = self.measure_node(&node.children[0], available_size);
        
        Size::new(available_size.width, available_size.height)
    }
    
    fn measure_spacer(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let size = node.resolved_props.get("size")
            .and_then(|val| val.parse::<f32>().ok());
        
        let min_size = node.resolved_props.get("min_size")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let max_size = node.resolved_props.get("max_size")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(f32::MAX);
        
        let parent_type = node.resolved_props.get("_parent_type")
            .cloned()
            .unwrap_or_else(|| "Unknown".to_string());
        
        match parent_type.as_str() {
            "VStack" => {
                let height = if let Some(s) = size {
                    s.max(min_size).min(max_size)
                } else {
                    min_size
                };
                Size::new(available_size.width, height)
            },
            "HStack" => {
                let width = if let Some(s) = size {
                    s.max(min_size).min(max_size)
                } else {
                    min_size
                };
                Size::new(width, available_size.height)
            },
            _ => {
                let dimension = size.unwrap_or(0.0).max(min_size).min(max_size);
                Size::new(dimension, dimension)
            }
        }
    }
    
    fn measure_divider(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let thickness = node.resolved_props.get("thickness")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(1.0);
        
        let padding = node.resolved_props.get("padding")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let total_height = thickness + (padding * 2.0);
        
        Size::new(available_size.width, total_height)
    }
    
    
    fn position_vstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
        let equal_spacing = node.get_prop("equal_spacing")
            .and_then(|val| val.parse::<bool>().ok())
            .unwrap_or(false);
        let insets = self.get_edge_insets(node);
        
        let content_frame = Rect::new(
            frame.x + insets.left,
            frame.y + insets.top,
            frame.width - insets.left - insets.right,
            frame.height - insets.top - insets.bottom
        );
        
        let alignment_str = node.get_prop("alignment").map_or("Leading", |v| v.as_str());

        
        let mut total_fixed_height = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        let mut fixed_heights = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_height += child_layout.content_size.height;
                fixed_heights.push((i, child_layout.content_size.height));
            }
        }
        
        let mut total_spacing = 0.0;
        
        if equal_spacing && node.children.len() > 1 {
            let items_count = node.children.len() - 1;
            let available_space = content_frame.height - total_fixed_height;
            
            let flex_space = if total_flex_grow > 0.0 {
                available_space * 0.5
            } else {
                0.0
            };
            
            total_spacing = (available_space - flex_space).max(0.0);
        } else if node.children.len() > 1 {
            total_spacing = spacing * (node.children.len() - 1) as f32;
        }
        
        let available_flex_height = (content_frame.height - total_fixed_height - total_spacing).max(0.0);
        
        let mut y_offset = content_frame.y;
        let equal_space = if equal_spacing && node.children.len() > 1 {
            total_spacing / (node.children.len() - 1) as f32
        } else {
            spacing
        };
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_height = child_layout.content_size.height;
                let child_width = child_layout.content_size.width;
                
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_height = (available_flex_height * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                let x_pos = match alignment_str {
                    s if s.eq_ignore_ascii_case("leading") => content_frame.x,
                    s if s.eq_ignore_ascii_case("trailing") => content_frame.x + content_frame.width - child_width,
                    s if s.eq_ignore_ascii_case("center") => content_frame.x + (content_frame.width - child_width) / 2.0,
                    _ => content_frame.x
                };
                
                let child_frame = Rect::new(
                    x_pos,
                    y_offset,
                    child_width,
                    child_height
                );
                
                self.position_node(child, child_frame);
                
                y_offset += child_height + equal_space;
            }
        }
    }
    
    fn position_hstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.get_prop_f32("spacing").unwrap_or(0.0);
        let equal_spacing = node.get_prop("equal_spacing")
            .and_then(|val| val.parse::<bool>().ok())
            .unwrap_or(false);
        let insets = self.get_edge_insets(node);
        
        let content_frame = Rect::new(
            frame.x + insets.left,
            frame.y + insets.top,
            frame.width - insets.left - insets.right,
            frame.height - insets.top - insets.bottom
        );
        
        let alignment_str = node.get_prop("alignment").map_or("Center", |v| v.as_str());
        
        let mut total_fixed_width = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        let mut fixed_widths = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            let flex_grow = child.get_prop_f32("flex_grow").unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_width += child_layout.content_size.width;
                fixed_widths.push((i, child_layout.content_size.width));
            }
        }
        
        let mut total_spacing = 0.0;
        
        if equal_spacing && node.children.len() > 1 {
            let items_count = node.children.len() - 1;
            let available_space = content_frame.width - total_fixed_width;
            
            let flex_space = if total_flex_grow > 0.0 {
                available_space * 0.5
            } else {
                0.0
            };
            
            total_spacing = (available_space - flex_space).max(0.0);
        } else if node.children.len() > 1 {
            total_spacing = spacing * (node.children.len() - 1) as f32;
        }
        
        let available_flex_width = (content_frame.width - total_fixed_width - total_spacing).max(0.0);
        
        let mut x_offset = content_frame.x;
        let equal_space = if equal_spacing && node.children.len() > 1 {
            total_spacing / (node.children.len() - 1) as f32
        } else {
            spacing
        };
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_width = child_layout.content_size.width;
                let child_height = child_layout.content_size.height;
                
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_width = (available_flex_width * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                let y_pos = match alignment_str {
                    "Top" => content_frame.y,
                    "Bottom" => content_frame.y + content_frame.height - child_height,
                    "Center" => content_frame.y + (content_frame.height - child_height) / 2.0,
                    _ => content_frame.y + (content_frame.height - child_height) / 2.0
                };
                
                let child_frame = Rect::new(
                    x_offset,
                    y_pos,
                    child_width,
                    child_height
                );
                
                self.position_node(child, child_frame);
                
                x_offset += child_width + equal_space;
            }
        }
    }

    fn apply_layout_with_clipping(&self, node: &mut RenderNode) {
        if let Some(layout) = self.layout_cache.get(&node.id) {
            node.resolved_props.insert("x".to_string(), layout.frame.x.to_string());
            node.resolved_props.insert("y".to_string(), layout.frame.y.to_string());
            node.resolved_props.insert("width".to_string(), layout.frame.width.to_string());
            node.resolved_props.insert("height".to_string(), layout.frame.height.to_string());
            
            if let Some(clip_to_bounds) = node.get_prop("clip_to_bounds") {
                if clip_to_bounds == "true" {
                    node.resolved_props.insert("clip_to_bounds".to_string(), "true".to_string());
                }
            }
            
            for child in &mut node.children {
                self.apply_layout_with_clipping(child);
            }
        }
    }

    fn parse_edge_insets(insets_str: &str) -> Option<EdgeInsets> {
        let parts: Vec<&str> = insets_str.split(',').collect();
        if parts.len() == 4 {
            let top = parts[0].parse::<f32>().ok()?;
            let right = parts[1].parse::<f32>().ok()?;
            let bottom = parts[2].parse::<f32>().ok()?;
            let left = parts[3].parse::<f32>().ok()?;
            Some(EdgeInsets::new(top, right, bottom, left))
        } else {
            None
        }
    }

    pub fn compute_enhanced_layout<'a>(&mut self, node: &'a mut RenderNode, container_size: Size) -> &'a mut RenderNode {
        self.layout_cache.clear();
        
        self.measure_node(node, container_size);
        
        self.position_node(node, Rect::from_size(container_size.width, container_size.height));
        
        self.apply_layout_with_clipping(node);
        
        node
    }
    
    fn position_zstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        let insets = self.get_edge_insets(node);
        
        let content_frame = Rect::new(
            frame.x + insets.left,
            frame.y + insets.top,
            frame.width - insets.left - insets.right,
            frame.height - insets.top - insets.bottom
        );
        
        let alignment_str = node.get_prop("alignment").map_or("Center", |v| v.as_str());

        
        let alignment = match alignment_str {
            "TopLeading" => Alignment::TopLeading,
            "Top" => Alignment::Top,
            "TopTrailing" => Alignment::TopTrailing,
            "Leading" => Alignment::Leading,
            "Trailing" => Alignment::Trailing,
            "BottomLeading" => Alignment::BottomLeading,
            "Bottom" => Alignment::Bottom,
            "BottomTrailing" => Alignment::BottomTrailing,
            _ => Alignment::Center,
        };
        
        for child in &node.children {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let (x, y) = match alignment {
                    Alignment::TopLeading => (content_frame.x, content_frame.y),
                    Alignment::Top => (content_frame.x + (content_frame.width - child_size.width) / 2.0, content_frame.y),
                    Alignment::TopTrailing => (content_frame.x + content_frame.width - child_size.width, content_frame.y),
                    Alignment::Leading => (content_frame.x, content_frame.y + (content_frame.height - child_size.height) / 2.0),
                    Alignment::Center => (
                        content_frame.x + (content_frame.width - child_size.width) / 2.0,
                        content_frame.y + (content_frame.height - child_size.height) / 2.0
                    ),
                    Alignment::Trailing => (content_frame.x + content_frame.width - child_size.width, content_frame.y + (content_frame.height - child_size.height) / 2.0),
                    Alignment::BottomLeading => (content_frame.x, content_frame.y + content_frame.height - child_size.height),
                    Alignment::Bottom => (content_frame.x + (content_frame.width - child_size.width) / 2.0, content_frame.y + content_frame.height - child_size.height),
                    Alignment::BottomTrailing => (content_frame.x + content_frame.width - child_size.width, content_frame.y + content_frame.height - child_size.height),
                };
                
                let child_frame = Rect::new(x, y, child_size.width, child_size.height);
                self.position_node(child, child_frame);
            }
        }
    }
    
    fn position_scroll_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        if !node.children.is_empty() {
            let child = &node.children[0];
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let direction = node.resolved_props.get("direction")
                    .cloned()
                    .unwrap_or_else(|| "Vertical".to_string());
                
                let child_frame = if direction.contains("Horizontal") {
                    Rect::new(frame.x, frame.y, child_size.width, frame.height)
                } else {
                    Rect::new(frame.x, frame.y, frame.width, child_size.height)
                };
                
                self.position_node(child, child_frame);
            }
        }
    }
}