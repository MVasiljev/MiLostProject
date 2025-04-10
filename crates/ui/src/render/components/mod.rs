pub mod base_renderer;
pub mod button_renderer;
pub mod divider_renderer;
pub mod hstack_renderer;
pub mod image_renderer;
pub mod scroll_renderer;
pub mod spacer_renderer;
pub mod text_renderer;
pub mod vstack_renderer;
pub mod zstack_renderer;
pub mod canvas_renderer;
pub mod shared;

// Component renderer exports
pub use button_renderer::ButtonRenderer;
pub use divider_renderer::DividerRenderer;
pub use hstack_renderer::HStackRenderer;
pub use image_renderer::ImageRenderer;
pub use scroll_renderer::ScrollRenderer;
pub use spacer_renderer::SpacerRenderer;
pub use text_renderer::TextRenderer;
pub use vstack_renderer::VStackRenderer;
pub use zstack_renderer::ZStackRenderer;

// Base renderer exports
pub use base_renderer::{
    BaseRenderer,
    BaseContainerRenderer,
};

// Canvas renderer exports
pub use canvas_renderer::{
    CanvasRenderer,
    CanvasContext,
    Image as CanvasImage,
    Gradient as CanvasGradient,
    Color as CanvasColor,
};

// Shared utilities exports
pub use shared::{
    parse_color,
    draw_rounded_rect,
    draw_background,
    draw_border,
    apply_shadow,
    clear_shadow,
    create_gradient,
    draw_scrollbar,
};