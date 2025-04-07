// src/components/registry.rs - updated

// Split into two separate registries
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use crate::render::node::RenderNode;
use crate::UIComponent;
use crate::render::renderer::{ComponentRenderer, DrawingContext};

/// Factory function that transforms a component to a render node
pub type ComponentTransformerFn = Arc<dyn Fn(&UIComponent) -> RenderNode + Send + Sync>;

/// Registry for component transformers
pub struct ComponentTransformerRegistry {
    transformers: HashMap<String, ComponentTransformerFn>,
}

impl ComponentTransformerRegistry {
    /// Create a new, empty registry
    pub fn new() -> Self {
        Self {
            transformers: HashMap::new(),
        }
    }
    
    /// Register a component transformer for a specific component type
    pub fn register_transformer<F>(&mut self, component_type: &str, transformer: F) 
    where
        F: Fn(&UIComponent) -> RenderNode + Send + Sync + 'static
    {
        self.transformers.insert(component_type.to_string(), Arc::new(transformer));
    }
    
    /// Get a transformer for a specific component type
    pub fn get_transformer(&self, component_type: &str) -> Option<&ComponentTransformerFn> {
        self.transformers.get(component_type)
    }
    
    /// Check if a transformer is registered for a component type
    pub fn has_transformer(&self, component_type: &str) -> bool {
        self.transformers.contains_key(component_type)
    }
    
    /// Get all registered component types
    pub fn component_types(&self) -> Vec<String> {
        self.transformers.keys().cloned().collect()
    }
    
    /// Transform a component using the registered transformer
    pub fn transform(&self, component: &UIComponent) -> Option<RenderNode> {
        let component_type = match component {
            UIComponent::VStack(_) => "VStack",
            UIComponent::HStack(_) => "HStack",
            UIComponent::ZStack(_) => "ZStack",
            UIComponent::Text(_) => "Text",
            UIComponent::Button(_) => "Button",
            UIComponent::Image(_) => "Image",
            UIComponent::Scroll(_) => "Scroll",
            UIComponent::Spacer(_) => "Spacer",
            UIComponent::Divider(_) => "Divider",
        };
        
        self.get_transformer(component_type)
            .map(|transformer| transformer(component))
    }
    
    /// Register standard transformers
    pub fn register_standard_transformers(&mut self) {
        use crate::render::transformers::*;
        
        // Register transformers for standard components
        self.register_transformer("VStack", |component| {
            if let UIComponent::VStack(props) = component {
                transform_vstack(props)
            } else {
                panic!("Expected VStack component")
            }
        });
        
        self.register_transformer("HStack", |component| {
            if let UIComponent::HStack(props) = component {
                transform_hstack(props)
            } else {
                panic!("Expected HStack component")
            }
        });
        
        self.register_transformer("ZStack", |component| {
            if let UIComponent::ZStack(props) = component {
                transform_zstack(props)
            } else {
                panic!("Expected ZStack component")
            }
        });
        
        self.register_transformer("Text", |component| {
            if let UIComponent::Text(props) = component {
                transform_text(props)
            } else {
                panic!("Expected Text component")
            }
        });
        
        self.register_transformer("Button", |component| {
            if let UIComponent::Button(props) = component {
                transform_button(props)
            } else {
                panic!("Expected Button component")
            }
        });
        
        self.register_transformer("Image", |component| {
            if let UIComponent::Image(props) = component {
                transform_image(props)
            } else {
                panic!("Expected Image component")
            }
        });
        
        self.register_transformer("Scroll", |component| {
            if let UIComponent::Scroll(props) = component {
                transform_scroll(props)
            } else {
                panic!("Expected Scroll component")
            }
        });
        
        self.register_transformer("Spacer", |component| {
            if let UIComponent::Spacer(props) = component {
                transform_spacer(props)
            } else {
                panic!("Expected Spacer component")
            }
        });
        
        self.register_transformer("Divider", |component| {
            if let UIComponent::Divider(props) = component {
                transform_divider(props)
            } else {
                panic!("Expected Divider component")
            }
        });
    }
}

/// Type-erasure wrapper for component renderers
pub struct AnyComponentRenderer<T: DrawingContext> {
    renderer: Arc<dyn ComponentRenderer<T> + Send + Sync>,
}

impl<T: DrawingContext> AnyComponentRenderer<T> {
    pub fn new<R: ComponentRenderer<T> + Send + Sync + 'static>(renderer: R) -> Self {
        Self {
            renderer: Arc::new(renderer),
        }
    }
    
    pub fn get_renderer(&self) -> &dyn ComponentRenderer<T> {
        &*self.renderer
    }
}

/// Registry for component renderers
pub struct ComponentRendererRegistry<T: DrawingContext> {
    renderers: HashMap<String, AnyComponentRenderer<T>>,
}

impl<T: DrawingContext> ComponentRendererRegistry<T> {
    /// Create a new, empty registry
    pub fn new() -> Self {
        Self {
            renderers: HashMap::new(),
        }
    }
    
    /// Register a component renderer for a specific component type
    pub fn register_renderer<R>(&mut self, component_type: &str, renderer: R)
    where
        R: ComponentRenderer<T> + Send + Sync + 'static
    {
        self.renderers.insert(
            component_type.to_string(), 
            AnyComponentRenderer::new(renderer)
        );
    }
    
    /// Get a renderer for a specific component type
    pub fn get_renderer(&self, component_type: &str) -> Option<&dyn ComponentRenderer<T>> {
        self.renderers.get(component_type)
            .map(|wrapper| wrapper.get_renderer())
    }
    
    /// Check if a renderer is registered for a component type
    pub fn has_renderer(&self, component_type: &str) -> bool {
        self.renderers.contains_key(component_type)
    }
    
    /// Get all registered component types
    pub fn component_types(&self) -> Vec<String> {
        self.renderers.keys().cloned().collect()
    }
    
    /// Register standard renderers
    pub fn register_standard_renderers(&mut self) 
    where T: 'static
    {
        use crate::render::components::*;
        
        // Register renderers for standard components
        self.register_renderer("VStack", VStackRenderer);
        self.register_renderer("HStack", HStackRenderer);
        self.register_renderer("ZStack", ZStackRenderer);
        self.register_renderer("Text", TextRenderer);
        self.register_renderer("Button", ButtonRenderer);
        self.register_renderer("Image", ImageRenderer);
        self.register_renderer("Scroll", ScrollRenderer);
        self.register_renderer("Spacer", SpacerRenderer);
        self.register_renderer("Divider", DividerRenderer);
    }
}

// Create lazy static globals for both registries
use std::sync::OnceLock;

// Global transformer registry
static TRANSFORMER_REGISTRY: OnceLock<RwLock<ComponentTransformerRegistry>> = OnceLock::new();

pub fn transformer_registry() -> &'static RwLock<ComponentTransformerRegistry> {
    TRANSFORMER_REGISTRY.get_or_init(|| {
        let mut registry = ComponentTransformerRegistry::new();
        registry.register_standard_transformers();
        RwLock::new(registry)
    })
}

// Helper function for the render function
pub fn transform_component(component: &UIComponent) -> RenderNode {
    let registry = transformer_registry().read().unwrap();
    
    // Try to use the registry
    if let Some(node) = registry.transform(component) {
        return node;
    }
    
    // Fallback to direct matching for backward compatibility
    match component {
        UIComponent::Text(props) => crate::render::transformers::transform_text(props),
        UIComponent::Button(props) => crate::render::transformers::transform_button(props),
        UIComponent::VStack(props) => crate::render::transformers::transform_vstack(props),
        UIComponent::HStack(props) => crate::render::transformers::transform_hstack(props),
        UIComponent::ZStack(props) => crate::render::transformers::transform_zstack(props),
        UIComponent::Image(props) => crate::render::transformers::transform_image(props),
        UIComponent::Scroll(props) => crate::render::transformers::transform_scroll(props),
        UIComponent::Spacer(props) => crate::render::transformers::transform_spacer(props),
        UIComponent::Divider(props) => crate::render::transformers::transform_divider(props),
    }
}

// Global renderer registry factory - type-specific
pub fn renderer_registry<T: DrawingContext + 'static>() -> &'static RwLock<ComponentRendererRegistry<T>> {
    // This is a type map approach
    static REGISTRIES: OnceLock<RwLock<HashMap<TypeId, Box<dyn Any + Send + Sync>>>> = OnceLock::new();
    
    use std::any::{Any, TypeId};
    
    let type_id = TypeId::of::<T>();
    let registries = REGISTRIES.get_or_init(|| RwLock::new(HashMap::new()));
    
    let mut registries_lock = registries.write().unwrap();
    
    if !registries_lock.contains_key(&type_id) {
        let mut registry = ComponentRendererRegistry::<T>::new();
        registry.register_standard_renderers();
        let registry = RwLock::new(registry);
        
        registries_lock.insert(type_id, Box::new(registry) as Box<dyn Any + Send + Sync>);
    }
    
    let registry_any = registries_lock.get(&type_id).unwrap();
    let registry_box = registry_any.downcast_ref::<RwLock<ComponentRendererRegistry<T>>>().unwrap();
    
    unsafe {
        // We need to extend the lifetime here since the registry exists for the program's lifetime
        std::mem::transmute(registry_box)
    }
}