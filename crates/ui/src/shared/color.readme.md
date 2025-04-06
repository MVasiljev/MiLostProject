# Color System

## Overview

The `color.rs` file in the shared module implements the color system for the MiLost UI framework. It provides a comprehensive set of color definitions, manipulation utilities, theming capabilities, and color scheme management that forms the foundation for consistent visual styling across the application.

## Core Components

### `Color` Enum

The central type representing colors in the system:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "PascalCase")]
pub enum Color {
    // Basic colors
    White, Black, Red, Green, Blue, Yellow,

    // Extended colors
    Orange, Purple, Pink, Teal, Indigo, Cyan,
    Gray, LightGray, DarkGray,

    // Semantic colors
    Primary, Secondary, Accent, Background, Surface, Error,
    OnPrimary, OnSecondary, OnBackground, OnSurface, OnError,

    // Functional colors
    Success, Warning, Info, Danger,

    // Brand colors
    Twitter, Facebook, LinkedIn, Instagram,

    // UI specific colors
    Link, Disabled, Placeholder,

    // Special colors
    Transparent,

    // Custom colors
    Custom(u8, u8, u8),
    CustomWithAlpha(u8, u8, u8, f32),
    Hex(String),
}
```

The enum provides:

- Standard named colors (white, black, red, etc.)
- Semantic UI colors (primary, secondary, background, etc.)
- Functional colors for states (success, warning, error)
- Brand colors for social networks
- UI-specific colors (link, disabled)
- Custom RGB and RGBA colors
- Hex string colors

### Color Methods

The `Color` enum includes methods for manipulating and using colors:

- `to_css_string()`: Converts the color to a CSS-compatible string representation.
- `rgb(r, g, b)`: Creates a custom RGB color.
- `rgba(r, g, b, a)`: Creates a custom RGBA color with alpha.
- `from_hex(hex)`: Creates a color from a hex string.
- `is_dark()`: Determines if the color is dark (for contrast calculations).
- `contrasting_text_color()`: Returns white or black depending on the color's brightness.
- `lighten(amount)`: Creates a lighter version of the color.
- `darken(amount)`: Creates a darker version of the color.
- `with_opacity(opacity)`: Creates a version of the color with modified opacity.

### Theming System

#### `ThemeMode` Enum

Defines the available theme modes:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ThemeMode {
    Light,
    Dark,
    System,
}
```

#### `ColorScheme` Struct

Represents a complete color scheme for theming:

```rust
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ColorScheme {
    pub primary: Color,
    pub secondary: Color,
    pub background: Color,
    pub surface: Color,
    pub error: Color,
    pub on_primary: Color,
    pub on_secondary: Color,
    pub on_background: Color,
    pub on_surface: Color,
    pub on_error: Color,
}
```

The struct includes:

- Primary and secondary brand colors
- Background and surface colors for different UI layers
- Error color for indicating problems
- "On" colors for text and icons that appear on top of each color

### Predefined Color Schemes

The `color_schemes` module provides predefined color schemes:

- `light()`: Default light theme colors
- `dark()`: Default dark theme colors
- `blue_light()`: Blue-based light theme
- `red_light()`: Red-based light theme
- `green_light()`: Green-based light theme

## Usage Patterns

### Basic Color Usage

```rust
// Using predefined colors
let button_background = Color::Primary;
let button_text = Color::OnPrimary;

// Using custom colors
let custom_blue = Color::rgb(0, 100, 255);
let semi_transparent = Color::rgba(255, 0, 0, 0.5);
let branded_color = Color::from_hex("#FF5722");

// Converting to CSS
let css_color = button_background.to_css_string();
```

### Color Manipulation

```rust
// Checking and manipulating colors
let is_dark_background = background_color.is_dark();
let text_color = background_color.contrasting_text_color();

// Creating variants
let hover_color = button_color.lighten(0.1);
let pressed_color = button_color.darken(0.1);
let disabled_color = button_color.with_opacity(0.5);
```

### Theme Integration

```rust
// Creating a theme
let theme = ColorScheme {
    primary: Color::Blue,
    secondary: Color::Teal,
    background: Color::White,
    surface: Color::LightGray,
    error: Color::Red,
    on_primary: Color::White,
    on_secondary: Color::White,
    on_background: Color::Black,
    on_surface: Color::Black,
    on_error: Color::White,
};

// Using preset themes
let dark_theme = color_schemes::dark();
```

## Color Calculations

### Brightness Calculation

The color system uses a luminance-based formula to determine brightness:

```rust
let brightness = 0.299 * (r as f32) + 0.587 * (g as f32) + 0.114 * (b as f32);
```

This formula gives more weight to green, which human eyes perceive as brighter.

### Contrast Calculation

The contrast calculation determines whether white or black text is more readable:

```rust
fn is_dark(&self) -> bool {
    // Implementation calculates brightness and returns true if below 128
    // (midpoint of 0-255 range)
}
```

### Color Modification

Color modifications follow these patterns:

- **Lighten**: Interpolates between the color and white.
- **Darken**: Interpolates between the color and black.
- **Opacity**: Adjusts the alpha channel while maintaining RGB values.

## Integration Points

- **Component System**: Colors are used for styling visual components.
- **Theme System**: Colors form the foundation of theming capabilities.
- **Rendering System**: Colors are converted to appropriate formats for drawing.
- **Accessibility**: Color utilities help ensure proper contrast for readability.

## Future Improvements

1. **Color Spaces**:

   - Add support for HSL and HSV color spaces.
   - Implement color space conversion utilities.
   - Support for perceptually uniform color spaces (Lab, LCH).

2. **Advanced Color Functions**:

   - Implement color harmonization (complementary, analogous, etc.).
   - Add color palette generation utilities.
   - Support for color blending modes (multiply, screen, etc.).

3. **Accessibility Enhancements**:

   - Add WCAG contrast ratio calculation.
   - Implement automatic color adjustment for accessibility.
   - Add color blindness simulation and compensation.

4. **Theme Expansion**:

   - Support for theme variants (high contrast, reduced motion).
   - Add dynamic theme generation from seed colors.
   - Implement theme transition animations.

5. **Performance Optimizations**:
   - Cache common color calculations.
   - Optimize string generation for frequently used colors.
   - Reduce memory footprint of color representations.

## Best Practices

1. **Semantic Usage**:

   - Use semantic colors (Primary, Error) rather than literal colors (Blue, Red).
   - Associate "On" colors with their background colors.
   - Use functional colors according to their meaning (Success, Warning, Info).

2. **Contrast Awareness**:

   - Always check contrast ratios for text readability.
   - Use `contrasting_text_color()` for automatic text color selection.
   - Consider color blindness when designing color schemes.

3. **Consistency**:

   - Use colors from the same palette or scheme.
   - Maintain consistent color meanings throughout the application.
   - Apply colors systematically across similar components.

4. **Theming Support**:

   - Design components to work with both light and dark themes.
   - Use theme-aware color selection rather than hardcoded colors.
   - Test color schemes across different screen types.

5. **Performance Considerations**:
   - Cache color strings for frequently used colors.
   - Avoid excessive color manipulations in hot paths.
   - Use appropriate color types (RGB vs RGBA) based on needs.
