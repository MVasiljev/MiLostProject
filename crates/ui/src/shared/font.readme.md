# Typography System

## Overview

The `font.rs` file in the shared module implements the typography system for the MiLost UI framework. It provides a comprehensive set of structures and utilities for defining, managing, and applying typography styles throughout the application. The system handles font families, weights, styles, features, and text formatting, creating a foundation for consistent and accessible text rendering.

## Core Components

### Font Properties

#### `FontWeight` Enum

Defines the weight (thickness) of fonts:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontWeight {
    Thin,           // 100
    ExtraLight,     // 200
    Light,          // 300
    Regular,        // 400
    Medium,         // 500
    SemiBold,       // 600
    Bold,           // 700
    ExtraBold,      // 800
    Black,          // 900
    Custom(u16),    // For non-standard weights
}
```

Includes methods:

- `to_css_weight()`: Converts to CSS weight value.
- `value()`: Returns the numeric weight value.

#### `FontWidth` Enum

Defines the width (condensed to expanded) of fonts:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontWidth {
    UltraCondensed,
    ExtraCondensed,
    Condensed,
    SemiCondensed,
    Normal,
    SemiExpanded,
    Expanded,
    ExtraExpanded,
    UltraExpanded,
}
```

Includes method:

- `to_css_stretch()`: Converts to CSS stretch value.

#### `FontSlant` Enum

Defines the slant style of fonts:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontSlant {
    Normal,
    Italic,
    Oblique,
}
```

Includes method:

- `to_css_style()`: Converts to CSS font style.

### Font Features

#### `FontFeatures` Struct

Controls advanced typographic features:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FontFeatures {
    pub liga: Option<bool>,     // Standard ligatures
    pub dlig: Option<bool>,     // Discretionary ligatures
    pub hlig: Option<bool>,     // Historical ligatures
    pub calt: Option<bool>,     // Contextual alternates
    pub swsh: Option<bool>,     // Swashes
    pub kern: Option<bool>,     // Kerning
    pub smcp: Option<bool>,     // Small capitals
    pub c2sc: Option<bool>,     // Capitals to small capitals
    pub onum: Option<bool>,     // Old-style numerals
    pub tnum: Option<bool>,     // Tabular numerals
    pub zero: Option<bool>,     // Slashed zero
    pub frac: Option<bool>,     // Fractions
    pub ordn: Option<bool>,     // Ordinals
    pub custom: Option<HashMap<String, bool>>, // Custom features
}
```

Includes method:

- `to_css_features()`: Converts to CSS font-feature-settings.

### Font Descriptors

#### `FontDescriptor` Struct

Describes a complete font specification:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FontDescriptor {
    pub family: String,
    pub weight: Option<FontWeight>,
    pub size: Option<f32>,
    pub slant: Option<FontSlant>,
    pub width: Option<FontWidth>,
    pub line_height: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub features: Option<FontFeatures>,
}
```

Includes builder methods:

- `new(family)`: Creates a new descriptor with the specified family.
- `with_weight()`, `with_size()`, `with_slant()`, etc.: Builder methods for setting properties.
- `to_css_string()`: Converts to a CSS font specification.

### Font Families

#### `SystemFont` Enum

Represents system font categories:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum SystemFont {
    Default,
    Serif,
    SansSerif,
    Monospace,
    Cursive,
    Fantasy,
    SystemUI,
}
```

Includes method:

- `to_css_family()`: Converts to CSS font-family value.

#### `FontFamily` Struct

Defines a font family with fallbacks:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FontFamily {
    pub primary: String,
    pub fallbacks: Vec<String>,
    pub system_fallback: Option<SystemFont>,
}
```

Includes methods:

- `new(primary)`: Creates a new family with the specified primary font.
- `add_fallback(fallback)`: Adds a fallback font.
- `with_system_fallback(system_font)`: Sets the system fallback.
- `to_css_string()`: Converts to a CSS font-family string.

### Typography System

#### `FontStyle` Enum

Predefined semantic text styles:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontStyle {
    LargeTitle, Title1, Title2, Title3,
    Headline, Subheadline, Body, Callout,
    Caption1, Caption2, Footnote,
    Code, Button, Link,
    // Aliases
    Title, Caption,
}
```

#### `TextStyle` Struct

Complete text styling information:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct TextStyle {
    pub font: FontDescriptor,
    pub line_spacing: Option<f32>,
    pub paragraph_spacing: Option<f32>,
    pub text_case: Option<TextCapitalization>,
    pub baseline: Option<TextBaseline>,
}
```

Includes builder methods for configuring text styling.

#### `Typography` Struct

The complete typography system with predefined styles:

```rust
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Typography {
    // Predefined styles
    pub large_title: TextStyle,
    pub title1: TextStyle,
    pub title2: TextStyle,
    pub title3: TextStyle,
    pub headline: TextStyle,
    pub subheadline: TextStyle,
    pub body: TextStyle,
    pub callout: TextStyle,
    pub caption1: TextStyle,
    pub caption2: TextStyle,
    pub footnote: TextStyle,
    pub code: TextStyle,
    pub button: TextStyle,
    pub link: TextStyle,

    // Custom styles
    pub custom_styles: HashMap<String, TextStyle>,

    // Global adjustment
    pub text_size_adjustment: f32,
}
```

Includes methods:

- `get_style(&FontStyle)`: Gets a predefined style.
- `get_custom_style(name)`: Gets a custom style by name.
- `register_custom_style(name, style)`: Registers a new custom style.
- `set_text_size_adjustment(adjustment)`: Sets global text size adjustment.
- `scale_font_size(base_size)`: Applies the global adjustment to a font size.

### Theme Integration

#### `FontTheme` Struct

Defines a complete typography theme:

```rust
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FontTheme {
    pub primary_font: FontFamily,
    pub heading_font: Option<FontFamily>,
    pub code_font: FontFamily,
    pub typography: Typography,
}
```

#### `FontRegistry` Struct

Manages font registrations:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct FontRegistry {
    pub registered_fonts: HashMap<String, Vec<String>>,
}
```

Includes methods:

- `register_font(name, sources)`: Registers a font with its source files.
- `get_font_face_css()`: Generates CSS @font-face declarations.

### Predefined Font Themes

The `font_presets` module provides predefined typography themes:

- `minimalist()`: Clean, modern typography with sans-serif fonts.
- `classic_serif()`: Traditional typography with serif fonts.
- `modern_geometric()`: Contemporary typography with geometric sans-serif fonts.
- `accessibility_focused()`: High-legibility typography optimized for readability.

## Usage Patterns

### Basic Typography Usage

```rust
// Using predefined styles
let typography = Typography::default();
let body_style = typography.get_style(&FontStyle::Body);
let heading_style = typography.get_style(&FontStyle::Title1);

// Accessing font properties
let font_family = body_style.font.family.clone();
let font_size = body_style.font.size.unwrap_or(16.0);
```

### Custom Font Creation

```rust
// Creating a custom font descriptor
let custom_font = FontDescriptor::new("Roboto")
    .with_weight(FontWeight::Medium)
    .with_size(18.0)
    .with_slant(FontSlant::Italic)
    .with_letter_spacing(0.5);

// Creating a custom text style
let custom_style = TextStyle::new(custom_font)
    .with_line_spacing(1.5)
    .with_text_case(TextCapitalization::Uppercase);
```

### Font Family Configuration

```rust
// Creating a font family with fallbacks
let sans_serif = FontFamily::new("Inter")
    .add_fallback("Roboto")
    .add_fallback("Helvetica Neue")
    .with_system_fallback(SystemFont::SansSerif);

// Converting to CSS
let css_family = sans_serif.to_css_string();
```

### Typography Theming

```rust
// Using a predefined theme
let theme = font_presets::minimalist();

// Creating a custom theme
let custom_theme = FontTheme {
    primary_font: sans_serif,
    heading_font: Some(serif_family),
    code_font: monospace_family,
    typography: custom_typography,
};
```

## Integration Points

- **Component System**: Typography styles are applied to text-containing components.
- **Rendering System**: Font specifications are used during text rendering.
- **Theme System**: Typography forms a key part of the theming capabilities.
- **Accessibility**: Typography settings influence text readability and accessibility.

## Future Improvements

1. **Variable Fonts Support**:

   - Add support for variable font axes.
   - Implement interpolation between font instances.
   - Add utilities for dynamic font adjustment.

2. **Internationalization Enhancements**:

   - Add support for vertical text layouts.
   - Implement right-to-left text support.
   - Add language-specific typography adjustments.

3. **Performance Optimizations**:

   - Implement font subsetting for reduced file sizes.
   - Add font loading strategies (progressive, lazy).
   - Optimize font caching for frequent text rendering.

4. **Advanced Typography**:

   - Add support for multi-column text layouts.
   - Implement drop caps and initial letter styling.
   - Add support for baseline grids and vertical rhythm.

5. **Accessibility Improvements**:
   - Add dyslexia-friendly font alternatives.
   - Implement automatic contrast checking for text.
   - Add support for variable text sizes based on user preferences.

## Best Practices

1. **Semantic Styling**:

   - Use semantic styles (Body, Headline) rather than direct font properties.
   - Maintain consistent typography hierarchy throughout the application.
   - Associate text styles with their purpose rather than appearance.

2. **Performance Considerations**:

   - Limit the number of font weights and styles loaded.
   - Use system fonts where appropriate to reduce loading times.
   - Consider font loading impact on initial rendering.

3. **Accessibility**:

   - Ensure minimum font sizes for readability.
   - Maintain sufficient line spacing for legibility.
   - Test typography with screen readers and other assistive technologies.

4. **Responsive Typography**:

   - Adjust typography based on screen size and device characteristics.
   - Use relative units (rem, em) for scalable typography.
   - Test typography across various devices and screen sizes.

5. **Consistency**:
   - Maintain a limited set of font styles for visual coherence.
   - Use spacing and sizing consistently throughout the application.
   - Establish clear relationships between different text elements.
