pub mod node;
pub mod component;
pub mod renderer;
pub mod components;
pub mod transformers;
pub mod property;

// Node exports
pub use node::{
    RenderNode,
    EventHandler,
    NodeEventHandlers,
};

// Renderer exports
pub use renderer::{
    DrawingContext,
    Renderer,
    ComponentRenderer,
};

// Components exports
pub use components::{
    // Renderers
    BaseRenderer,
    BaseContainerRenderer,
    ButtonRenderer,
    DividerRenderer,
    HStackRenderer,
    ImageRenderer, 
    ScrollRenderer,
    SpacerRenderer,
    TextRenderer,
    VStackRenderer,
    ZStackRenderer,
    
    // Shared utilities
    shared,
};

// Transformers exports
pub use transformers::{
    transform_text,
    transform_button,
    transform_vstack,
    transform_hstack,
    transform_zstack,
    transform_image,
    transform_scroll,
    transform_spacer,
    transform_divider,
    utils as transformer_utils,
};

// Property exports
pub use property::{
    Property,
    PropertyBag,
    keys as property_keys,
};