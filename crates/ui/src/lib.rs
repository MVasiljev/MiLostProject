pub mod shared;
pub mod render;
pub mod layout;
pub mod components;
pub mod events;
pub mod factories;
pub mod hooks;
pub mod themes;

// Export key types from shared module
pub use shared::{
    Color,
    ThemeMode,
    ColorScheme,
    FontWeight,
    FontWidth,
    FontSlant,
    FontFamily,
    FontStyle,
    TextStyle,
    Typography,
    FontTheme,
    FontRegistry,
    GradientStop,
    GradientType,
    Gradient,
    ShadowEffect,
    BorderStyle,
    TextTransform,
    TextAlign,
    Overflow,
    EdgeInsets,
};

// Export key types from render module
pub use render::{
    RenderNode,
    EventHandler as RenderEventHandler,
    NodeEventHandlers,
    DrawingContext,
    Renderer, 
    ComponentRenderer,
    Property,
    PropertyBag,
    property_keys,
};

// Export key types from layout module
pub use layout::{
    Rect, 
    Size, 
    Point, 
    Alignment, 
    LayoutEngine,
    LayoutInfo,
};

// Export key types from components module
pub use components::{
    TextProps,
    ButtonProps,
    ButtonStyle,
    ButtonSize,
    ButtonState,
    VStackProps,
    HStackProps,
    ZStackProps,
    ImageProps,
    ImageSource,
    ResizeMode,
    ScrollProps,
    SpacerProps,
    DividerProps,
    UIComponent,
    transform_component,
};

// Export key types from events module
pub use events::{
    Event,
    EventType,
    SwipeDirection,
    EventSource,
    EventError,
    HandlerResult,
    TypedEventHandler,
    HandlerPriority,
    EventDispatcher,
    MiddlewareResult,
    EventMiddleware,
    EventMiddlewarePipeline,
    GestureRecognizer,
    register_handler,
    register_global_handler,
    process_event,
};

// Factory functions
pub use factories::{
    create_title, 
    create_body_text, 
    create_label,
    create_link, 
    create_error_text,
};

// Hook functions
pub use hooks::{
    use_heading_style, 
    use_body_style, 
    use_link_style,
    use_text_decoration, 
    use_text_container,
};

// Theme functions
// pub use themes::{
//     TextTheme, 
//     ThemedTextStyles,
//     apply_theme_to_text, 
//     create_themed_text_styles,
// };