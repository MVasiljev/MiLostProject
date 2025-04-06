# Layout Information

## Overview

The `layout_info.rs` file defines the `LayoutInfo` structure, which serves as a comprehensive container for all layout-related information about a component in the MiLost UI framework. This structure is used throughout the layout engine to store, track, and manipulate layout properties and calculated dimensions during the layout process.

## Core Structure

### `LayoutInfo` Struct

A data structure that encapsulates all layout-related information for a component:

```rust
#[derive(Debug, Clone)]
pub struct LayoutInfo {
    pub frame: Rect,                     // Position and size in parent's coordinate space
    pub padding: Option<f32>,            // Internal padding
    pub alignment: Option<Alignment>,    // Component alignment
    pub content_size: Size,              // Intrinsic content size
    pub flex_grow: Option<f32>,          // Flex growth factor
    pub flex_shrink: Option<f32>,        // Flex shrink factor
    pub flex_basis: Option<f32>,         // Flex basis size
    pub min_width: Option<f32>,          // Minimum width constraint
    pub max_width: Option<f32>,          // Maximum width constraint
    pub min_height: Option<f32>,         // Minimum height constraint
    pub max_height: Option<f32>,         // Maximum height constraint
    pub parent_type: Option<String>,     // Type of parent component
    pub resolved_props: HashMap<String, String>, // Component properties
}
```

This structure combines:

- **Positional information**: Where the component is placed (frame)
- **Size information**: How big the component is (content_size)
- **Constraints**: Limits on component dimensions (min/max width/height)
- **Flex properties**: How the component behaves in flexible layouts
- **Alignment**: How content is positioned within the component
- **Parent context**: Information about the parent component
- **Runtime properties**: Additional layout-related properties

## Key Methods

### Creation and Configuration

- `new()`: Creates a new empty layout information object.
- `with_frame(frame)`: Sets the frame rectangle.
- `with_padding(padding)`: Sets the internal padding.
- `with_alignment(alignment)`: Sets the content alignment.
- `with_content_size(size)`: Sets the intrinsic content size.
- `with_flex_grow(flex_grow)`: Sets the flex growth factor.
- `with_flex_shrink(flex_shrink)`: Sets the flex shrink factor.
- `with_flex_basis(flex_basis)`: Sets the flex basis size.
- `with_min_width(min_width)`: Sets the minimum width constraint.
- `with_max_width(max_width)`: Sets the maximum width constraint.
- `with_min_height(min_height)`: Sets the minimum height constraint.
- `with_max_height(max_height)`: Sets the maximum height constraint.
- `with_parent_type(parent_type)`: Sets the parent component type.

### Layout Calculations

- `inner_rect()`: Calculates the inner rectangle after applying padding.
- `constrain_size(size)`: Applies min/max constraints to a size.

## Usage in the Layout Engine

The `LayoutInfo` struct is used throughout the layout process:

1. **Initialization**: Created for each component during layout initialization.
2. **Measurement Phase**:
   - Stores the intrinsic content size calculated during measurement.
   - Tracks constraints that affect size calculation.
   - Records flex properties for flexible layouts.
3. **Positioning Phase**:
   - Records the assigned frame after positioning.
   - Contains alignment information for content positioning.
   - Provides context about the parent for specialized layout logic.
4. **Post-Layout**:
   - Serves as a cache of layout results for the rendering system.
   - Can be used for hit testing and event targeting.
   - Provides information for animations and transitions.

## Integration with Other Components

### Layout Engine

- The layout engine creates and manages a cache of `LayoutInfo` objects for all components.
- Component-specific layout algorithms use the information for specialized layout.
- The information flows between the measurement and positioning phases.

### Render System

- The render system uses frame information for drawing operations.
- Padding information affects content rendering within components.
- Constraint information may influence visual representations (e.g., clipping).

### Component Transformers

- Some layout properties originate from component properties.
- Transformers may set initial values for flex and constraint properties.

### Event System

- Frame information is used for hit testing in event propagation.
- Layout information may influence event handling behavior.

## Usage Examples

### Creating Layout Information

```rust
// Create layout info for a component
let layout_info = LayoutInfo::new()
    .with_frame(Rect::new(10.0, 20.0, 200.0, 100.0))
    .with_content_size(Size::new(180.0, 80.0))
    .with_padding(10.0)
    .with_alignment(Alignment::Center)
    .with_min_width(100.0)
    .with_max_width(300.0);
```

### Using in Layout Calculations

```rust
// Calculating inner content area
let content_rect = layout_info.inner_rect();

// Constraining a proposed size
let available_size = Size::new(250.0, 150.0);
let constrained_size = layout_info.constrain_size(available_size);

// Using flex properties in a container layout
if let Some(flex_grow) = layout_info.flex_grow {
    let extra_space = container_width - total_child_width;
    let flex_width = (extra_space * flex_grow) / total_flex_grow;
    // Assign additional width based on flex growth
}
```

## Best Practices

1. **Initialization Order**:

   - Set frame and content size early as they're most often used.
   - Configure constraints before using in size calculations.
   - Set parent information when creating the layout info.

2. **Memory Management**:

   - Clone layout info only when necessary due to its size.
   - Consider using references when possible.
   - Clear the layout cache when no longer needed.

3. **Flexibility Properties**:

   - Use consistent flex factors across siblings.
   - Be mindful of flex_shrink to prevent unintended shrinking.
   - Set flex_basis when precise initial sizes are important.

4. **Constraints Usage**:

   - Use min/max constraints sparingly for more predictable layouts.
   - Consider the interaction between parent and child constraints.
   - Prioritize intrinsic content sizes when possible.

5. **Property Access**:
   - Check for None values when accessing optional properties.
   - Use builder methods for cleaner initialization.
   - Avoid direct modification after initial setup.

## Future Improvements

1. **Extended Properties**:

   - Add support for more sophisticated alignment (e.g., baseline alignment).
   - Implement margin in addition to padding.
   - Add z-index or drawing order information.

2. **Performance Optimizations**:

   - Add change tracking to reduce unnecessary recalculations.
   - Implement property caching for derived values.
   - Optimize memory usage for large component trees.

3. **Layout Enhancements**:

   - Add support for fractional flex factors.
   - Implement aspect ratio constraints.
   - Add grid positioning information.

4. **Developer Experience**:

   - Add debugging helpers for layout inspection.
   - Implement layout validation methods.
   - Add layout comparison utilities.

5. **Type Safety**:
   - Move from string-based properties to typed properties.
   - Add validation for property values.
   - Implement property dependency tracking.
