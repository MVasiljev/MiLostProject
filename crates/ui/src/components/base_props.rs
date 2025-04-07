use crate::shared::color::Color;
use crate::styles::{BorderStyle, ShadowEffect, Gradient};
use crate::EdgeInsets;
use std::fmt;
use serde::{Serialize, Deserialize};

/// BaseComponentProps provides a set of common properties shared by all UI components.
/// This structure centralizes the definition of properties that apply to most or all
/// component types, promoting consistency and reducing code duplication.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BaseComponentProps {
    // Identification
    pub id: Option<String>,
    
    // Visual properties
    pub background: Option<Color>,
    pub opacity: Option<f32>,
    
    // Layout properties
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
    
    // Border properties
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,
    
    // Shadow properties
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset_x: Option<f32>,
    pub shadow_offset_y: Option<f32>,
    
    // Advanced visual properties
    pub gradient: Option<Gradient>,
    pub clip_to_bounds: Option<bool>,
    pub shadow_effect: Option<ShadowEffect>,
    
    // Interaction properties
    pub enabled: Option<bool>,
    pub focusable: Option<bool>,
    
    // Accessibility properties
    pub accessibility_label: Option<String>,
    pub accessibility_hint: Option<String>,
    pub is_accessibility_element: Option<bool>,
    
    // Animation properties
    pub animation_duration: Option<f32>,
    pub transition_properties: Option<Vec<String>>,
}

impl Default for BaseComponentProps {
    fn default() -> Self {
        Self {
            id: None,
            background: None,
            opacity: None,
            padding: None,
            edge_insets: None,
            width: None,
            height: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,
            border_width: None,
            border_color: None,
            border_radius: None,
            border_style: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset_x: None,
            shadow_offset_y: None,
            gradient: None,
            clip_to_bounds: None,
            shadow_effect: None,
            enabled: None,
            focusable: None,
            accessibility_label: None,
            accessibility_hint: None,
            is_accessibility_element: None,
            animation_duration: None,
            transition_properties: None,
        }
    }
}

impl BaseComponentProps {
    /// Create a new instance with default values
    pub fn new() -> Self {
        Self::default()
    }
    
    /// Create a new instance with a specific ID
    pub fn with_id(id: &str) -> Self {
        let mut props = Self::default();
        props.id = Some(id.to_string());
        props
    }
    
    // Builder methods for visual properties
    
    /// Set the background color
    pub fn with_background(mut self, color: Color) -> Self {
        self.background = Some(color);
        self
    }
    
    /// Set the opacity (0.0 - 1.0)
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }
    
    // Builder methods for layout properties
    
    /// Set uniform padding on all sides
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    /// Set detailed edge insets (top, right, bottom, left)
    pub fn with_edge_insets(mut self, insets: EdgeInsets) -> Self {
        self.edge_insets = Some(insets);
        self
    }
    
    /// Set the fixed width
    pub fn with_width(mut self, width: f32) -> Self {
        self.width = Some(width);
        self
    }
    
    /// Set the fixed height
    pub fn with_height(mut self, height: f32) -> Self {
        self.height = Some(height);
        self
    }
    
    /// Set both width and height
    pub fn with_size(mut self, width: f32, height: f32) -> Self {
        self.width = Some(width);
        self.height = Some(height);
        self
    }
    
    /// Set the minimum width
    pub fn with_min_width(mut self, min_width: f32) -> Self {
        self.min_width = Some(min_width);
        self
    }
    
    /// Set the maximum width
    pub fn with_max_width(mut self, max_width: f32) -> Self {
        self.max_width = Some(max_width);
        self
    }
    
    /// Set the minimum height
    pub fn with_min_height(mut self, min_height: f32) -> Self {
        self.min_height = Some(min_height);
        self
    }
    
    /// Set the maximum height
    pub fn with_max_height(mut self, max_height: f32) -> Self {
        self.max_height = Some(max_height);
        self
    }
    
    // Builder methods for border properties
    
    /// Set the border width
    pub fn with_border_width(mut self, width: f32) -> Self {
        self.border_width = Some(width);
        self
    }
    
    /// Set the border color
    pub fn with_border_color(mut self, color: Color) -> Self {
        self.border_color = Some(color);
        self
    }
    
    /// Set the border radius (for rounded corners)
    pub fn with_border_radius(mut self, radius: f32) -> Self {
        self.border_radius = Some(radius);
        self
    }
    
    /// Set the border style
    pub fn with_border_style(mut self, style: BorderStyle) -> Self {
        self.border_style = Some(style);
        self
    }
    
    /// Set all border properties at once
    pub fn with_border(mut self, width: f32, color: Color, radius: f32, style: BorderStyle) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self.border_radius = Some(radius);
        self.border_style = Some(style);
        self
    }
    
    // Builder methods for shadow properties
    
    /// Set the shadow radius (blur)
    pub fn with_shadow_radius(mut self, radius: f32) -> Self {
        self.shadow_radius = Some(radius);
        self
    }
    
    /// Set the shadow color
    pub fn with_shadow_color(mut self, color: Color) -> Self {
        self.shadow_color = Some(color);
        self
    }
    
    /// Set the shadow offset (x and y)
    pub fn with_shadow_offset(mut self, offset_x: f32, offset_y: f32) -> Self {
        self.shadow_offset_x = Some(offset_x);
        self.shadow_offset_y = Some(offset_y);
        self
    }
    
    /// Set all shadow properties at once
    pub fn with_shadow(mut self, radius: f32, color: Color, offset_x: f32, offset_y: f32) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset_x = Some(offset_x);
        self.shadow_offset_y = Some(offset_y);
        self
    }
    
    /// Set a complex shadow effect
    pub fn with_shadow_effect(mut self, effect: ShadowEffect) -> Self {
        self.shadow_effect = Some(effect);
        self
    }
    
    // Builder methods for advanced visual properties
    
    /// Set a gradient
    pub fn with_gradient(mut self, gradient: Gradient) -> Self {
        self.gradient = Some(gradient);
        self
    }
    
    /// Set whether content should be clipped to bounds
    pub fn with_clip_to_bounds(mut self, clip: bool) -> Self {
        self.clip_to_bounds = Some(clip);
        self
    }
    
    // Builder methods for interaction properties
    
    /// Set whether the component is enabled
    pub fn with_enabled(mut self, enabled: bool) -> Self {
        self.enabled = Some(enabled);
        self
    }
    
    /// Set whether the component can receive focus
    pub fn with_focusable(mut self, focusable: bool) -> Self {
        self.focusable = Some(focusable);
        self
    }
    
    // Builder methods for accessibility properties
    
    /// Set the accessibility label
    pub fn with_accessibility_label(mut self, label: &str) -> Self {
        self.accessibility_label = Some(label.to_string());
        self
    }
    
    /// Set the accessibility hint
    pub fn with_accessibility_hint(mut self, hint: &str) -> Self {
        self.accessibility_hint = Some(hint.to_string());
        self
    }
    
    /// Set whether this is an accessibility element
    pub fn with_is_accessibility_element(mut self, is_element: bool) -> Self {
        self.is_accessibility_element = Some(is_element);
        self
    }
    
    /// Set all accessibility properties at once
    pub fn with_accessibility(mut self, label: &str, hint: &str, is_element: bool) -> Self {
        self.accessibility_label = Some(label.to_string());
        self.accessibility_hint = Some(hint.to_string());
        self.is_accessibility_element = Some(is_element);
        self
    }
    
    // Builder methods for animation properties
    
    /// Set the animation duration
    pub fn with_animation_duration(mut self, duration: f32) -> Self {
        self.animation_duration = Some(duration);
        self
    }
    
    /// Set the properties that should animate during transitions
    pub fn with_transition_properties(mut self, properties: Vec<String>) -> Self {
        self.transition_properties = Some(properties);
        self
    }
    
    /// Add a property to animate during transitions
    pub fn add_transition_property(mut self, property: &str) -> Self {
        let mut props = self.transition_properties.unwrap_or_default();
        props.push(property.to_string());
        self.transition_properties = Some(props);
        self
    }
    
    /// Merge with another BaseComponentProps, with other properties taking precedence
    pub fn merge(self, other: &BaseComponentProps) -> Self {
        let mut result = self;
        
        // For each property in other, update result if Some
        if let Some(id) = &other.id { result.id = Some(id.clone()); }
        if let Some(background) = &other.background { result.background = Some(background.clone()); }
        if let Some(opacity) = &other.opacity { result.opacity = Some(*opacity); }
        if let Some(padding) = &other.padding { result.padding = Some(*padding); }
        if let Some(edge_insets) = &other.edge_insets { result.edge_insets = Some(edge_insets.clone()); }
        if let Some(width) = &other.width { result.width = Some(*width); }
        if let Some(height) = &other.height { result.height = Some(*height); }
        if let Some(min_width) = &other.min_width { result.min_width = Some(*min_width); }
        if let Some(max_width) = &other.max_width { result.max_width = Some(*max_width); }
        if let Some(min_height) = &other.min_height { result.min_height = Some(*min_height); }
        if let Some(max_height) = &other.max_height { result.max_height = Some(*max_height); }
        if let Some(border_width) = &other.border_width { result.border_width = Some(*border_width); }
        if let Some(border_color) = &other.border_color { result.border_color = Some(border_color.clone()); }
        if let Some(border_radius) = &other.border_radius { result.border_radius = Some(*border_radius); }
        if let Some(border_style) = &other.border_style { result.border_style = Some(border_style.clone()); }
        if let Some(shadow_radius) = &other.shadow_radius { result.shadow_radius = Some(*shadow_radius); }
        if let Some(shadow_color) = &other.shadow_color { result.shadow_color = Some(shadow_color.clone()); }
        if let Some(shadow_offset_x) = &other.shadow_offset_x { result.shadow_offset_x = Some(*shadow_offset_x); }
        if let Some(shadow_offset_y) = &other.shadow_offset_y { result.shadow_offset_y = Some(*shadow_offset_y); }
        if let Some(gradient) = &other.gradient { result.gradient = Some(gradient.clone()); }
        if let Some(clip_to_bounds) = &other.clip_to_bounds { result.clip_to_bounds = Some(*clip_to_bounds); }
        if let Some(shadow_effect) = &other.shadow_effect { result.shadow_effect = Some(shadow_effect.clone()); }
        if let Some(enabled) = &other.enabled { result.enabled = Some(*enabled); }
        if let Some(focusable) = &other.focusable { result.focusable = Some(*focusable); }
        if let Some(accessibility_label) = &other.accessibility_label { result.accessibility_label = Some(accessibility_label.clone()); }
        if let Some(accessibility_hint) = &other.accessibility_hint { result.accessibility_hint = Some(accessibility_hint.clone()); }
        if let Some(is_accessibility_element) = &other.is_accessibility_element { result.is_accessibility_element = Some(*is_accessibility_element); }
        if let Some(animation_duration) = &other.animation_duration { result.animation_duration = Some(*animation_duration); }
        if let Some(transition_properties) = &other.transition_properties { result.transition_properties = Some(transition_properties.clone()); }
        
        result
    }
}

impl fmt::Display for BaseComponentProps {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "BaseComponentProps {{ ")?;
        
        if let Some(id) = &self.id {
            write!(f, "id: {}, ", id)?;
        }
        
        // Only include a few important properties in the display representation
        if let Some(background) = &self.background {
            write!(f, "background: {:?}, ", background)?;
        }
        
        if let Some(width) = &self.width {
            write!(f, "width: {}, ", width)?;
        }
        
        if let Some(height) = &self.height {
            write!(f, "height: {}, ", height)?;
        }
        
        write!(f, "... }}")
    }
}

/// Helper functions for working with BaseComponentProps
pub mod utils {
    use super::*;
    use crate::render::node::RenderNode;
    use crate::render::property;
    use crate::shared::properties::{Property, PropertyBag};
    use crate::styles::SpreadMethod;
    use crate::GradientType;
    
    /// Apply base properties to a render node
    pub fn apply_base_props(node: &mut RenderNode, base_props: &BaseComponentProps) {
        // Helper function to set a property if it's Some
        fn set_if_some_property<T>(node: &mut RenderNode, key: &str, value: &Option<T>) 
            where
                T: Clone + Into<Property>, property::Property: From<T>
            {
                if let Some(val) = value {
                    node.set_prop(key, val.clone());
                }
            }

        // Apply visual properties
        set_if_some_property(node, "background", &base_props.background);
        set_if_some_property(node, "opacity", &base_props.opacity);
        
        // Apply layout properties
        set_if_some_property(node, "padding", &base_props.padding);
        set_if_some_property(node, "edge_insets", &base_props.edge_insets);
        set_if_some_property(node, "width", &base_props.width);
        set_if_some_property(node, "height", &base_props.height);
        set_if_some_property(node, "min_width", &base_props.min_width);
        set_if_some_property(node, "max_width", &base_props.max_width);
        set_if_some_property(node, "min_height", &base_props.min_height);
        set_if_some_property(node, "max_height", &base_props.max_height);
        
        // Apply border properties
        set_if_some_property(node, "border_width", &base_props.border_width);
        set_if_some_property(node, "border_color", &base_props.border_color);
        set_if_some_property(node, "border_radius", &base_props.border_radius);
        if let Some(style) = &base_props.border_style {
            node.set_prop("border_style", format!("{:?}", style));
        }
        
        // Apply shadow properties
        set_if_some_property(node, "shadow_radius", &base_props.shadow_radius);
        set_if_some_property(node, "shadow_color", &base_props.shadow_color);
        set_if_some_property(node, "shadow_offset_x", &base_props.shadow_offset_x);
        set_if_some_property(node, "shadow_offset_y", &base_props.shadow_offset_y);
        
        // Apply advanced visual properties
        set_if_some_property(node, "clip_to_bounds", &base_props.clip_to_bounds);
        
        // Apply interaction properties
        set_if_some_property(node, "enabled", &base_props.enabled);
        set_if_some_property(node, "focusable", &base_props.focusable);
        
        // Apply accessibility properties
        set_if_some_property(node, "accessibility_label", &base_props.accessibility_label);
        set_if_some_property(node, "accessibility_hint", &base_props.accessibility_hint);
        set_if_some_property(node, "is_accessibility_element", &base_props.is_accessibility_element);
        
        // Apply animation properties
        set_if_some_property(node, "animation_duration", &base_props.animation_duration);
        
        // Handle complex properties

        // Gradient
        if let Some(gradient) = &base_props.gradient {
            // Set gradient type based on the GradientType enum
            let gradient_type_str = match gradient.gradient_type {
                GradientType::Linear => "linear",
                GradientType::Radial => "radial",
                GradientType::Conic => "conic",
                GradientType::Repeating => "repeating",
            };
            node.set_prop("gradient_type", gradient_type_str);
            
            // Set gradient stops
            node.set_prop("gradient_stop_count", gradient.stops.len().to_string());
            for (i, stop) in gradient.stops.iter().enumerate() {
                node.set_prop(&format!("gradient_stop_{}_color", i), stop.color.clone());
                node.set_prop(&format!("gradient_stop_{}_position", i), stop.position.to_string());
                if let Some(name) = &stop.name {
                    node.set_prop(&format!("gradient_stop_{}_name", i), name.clone());
                }
            }
            
            // Set gradient endpoints
            node.set_prop("gradient_start_x", gradient.start_point.0.to_string());
            node.set_prop("gradient_start_y", gradient.start_point.1.to_string());
            node.set_prop("gradient_end_x", gradient.end_point.0.to_string());
            node.set_prop("gradient_end_y", gradient.end_point.1.to_string());
            
            // Set optional properties
            if let Some(angle) = gradient.angle {
                node.set_prop("gradient_angle", angle.to_string());
            }
            
            if let Some(spread) = &gradient.spread_method {
                let spread_str = match spread {
                    SpreadMethod::Pad => "pad",
                    SpreadMethod::Reflect => "reflect",
                    SpreadMethod::Repeat => "repeat",
                };
                node.set_prop("gradient_spread_method", spread_str);
            }
            
            if let Some(name) = &gradient.name {
                node.set_prop("gradient_name", name.to_string());
            }
            
            if let Some(custom_props) = &gradient.custom_props {
                for (key, value) in custom_props {
                    node.set_prop(&format!("gradient_custom_{}", key), value.to_string());
                }
            }
        }
        
        // Shadow effect
        if let Some(effect) = &base_props.shadow_effect {
            node.set_prop("shadow_effect_color", effect.color.clone());
            node.set_prop("shadow_effect_offset_x", effect.offset.0.to_string());
            node.set_prop("shadow_effect_offset_y", effect.offset.1.to_string());
            node.set_prop("shadow_effect_blur_radius", effect.blur_radius.to_string());
            
            if let Some(spread) = effect.spread_radius {
                node.set_prop("shadow_effect_spread_radius", spread.to_string());
            }
            
            if let Some(inset) = effect.inset {
                node.set_prop("shadow_effect_inset", inset.to_string());
            }
            
            if let Some(opacity) = effect.opacity {
                node.set_prop("shadow_effect_opacity", opacity.to_string());
            }
            
            if let Some(name) = &effect.name {
                node.set_prop("shadow_effect_name", name.to_string());
            }
            
            if let Some(z_index) = effect.z_index {
                node.set_prop("shadow_effect_z_index", z_index.to_string());
            }
        }
        
        // Transition properties
        if let Some(transition_props) = &base_props.transition_properties {
            node.set_prop("transition_property_count", transition_props.len().to_string());
            
            for (i, prop) in transition_props.iter().enumerate() {
                node.set_prop(&format!("transition_property_{}", i), prop.clone());
            }
        }
    }
    
    /// Extract base properties from a PropertyBag
    pub fn extract_base_props(properties: &PropertyBag) -> BaseComponentProps {
        let mut base_props = BaseComponentProps::new();
        
        // Helper function to extract and convert properties
        let extract = |properties: &PropertyBag, key: &str| -> Option<Property> {
            properties.get(key).cloned()
        };
        
        // Extract visual properties
        if let Some(Property::String(id)) = extract(properties, "id") {
            base_props.id = Some(id);
        }
        
        if let Some(Property::Color(color)) = extract(properties, "background") {
            base_props.background = Some(color);
        }
        
        if let Some(Property::Number(opacity)) = extract(properties, "opacity") {
            base_props.opacity = Some(opacity);
        }
        
        // Extract layout properties
        if let Some(Property::Number(padding)) = extract(properties, "padding") {
            base_props.padding = Some(padding);
        }
        
        if let Some(Property::EdgeInsets(insets)) = extract(properties, "edge_insets") {
            base_props.edge_insets = Some(insets);
        }
        
        if let Some(Property::Number(width)) = extract(properties, "width") {
            base_props.width = Some(width);
        }
        
        if let Some(Property::Number(height)) = extract(properties, "height") {
            base_props.height = Some(height);
        }
        
        if let Some(Property::Number(min_width)) = extract(properties, "min_width") {
            base_props.min_width = Some(min_width);
        }
        
        if let Some(Property::Number(max_width)) = extract(properties, "max_width") {
            base_props.max_width = Some(max_width);
        }
        
        if let Some(Property::Number(min_height)) = extract(properties, "min_height") {
            base_props.min_height = Some(min_height);
        }
        
        if let Some(Property::Number(max_height)) = extract(properties, "max_height") {
            base_props.max_height = Some(max_height);
        }

        if let Some(Property::Number(border_width)) = extract(properties, "border_width") {
            base_props.border_width = Some(border_width);
        }
        
        if let Some(Property::Color(border_color)) = extract(properties, "border_color") {
            base_props.border_color = Some(border_color);
        }
        
        if let Some(Property::Number(border_radius)) = extract(properties, "border_radius") {
            base_props.border_radius = Some(border_radius);
        }
        
        base_props
    }
}