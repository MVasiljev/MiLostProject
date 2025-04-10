pub mod color;
pub mod font;
pub mod styles;
pub mod properties;
pub mod edge_insets;

// Color exports
pub use color::{
    Color,
    ThemeMode,
    ColorScheme,
    color_schemes,
};

// Font exports
pub use font::{
    FontWeight,
    FontWidth,
    FontSlant,
    TextCapitalization,
    TextBaseline,
    FontFeatures,
    FontDescriptor,
    SystemFont,
    FontFamily,
    FontStyle,
    TextStyle,
    Typography,
    FontTheme,
    FontRegistry,
    font_presets,
};

// Styles exports
pub use styles::{
    GradientStop,
    GradientType,
    Gradient,
    SpreadMethod,
    ShadowEffect,
    BorderStyle,
    TextTransform,
    TextAlign,
    Overflow,
    LoadingIndicatorType,
};

// Properties exports
pub use properties::{
    Property as SharedProperty,
    PropertyBag as SharedPropertyBag,
    parse_edge_insets as parse_insets_from_properties,
    parse_color as parse_color_from_properties,
    utils as property_utils,
};

// Edge insets exports
pub use edge_insets::{
    EdgeInsets,
    parse_edge_insets,
    format_edge_insets,
    normalize_edge_insets,
    utils as insets_utils,
};