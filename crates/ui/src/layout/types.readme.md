# Geometry Types

## Overview

The `types.rs` file defines the fundamental geometry primitives used throughout the MiLost UI framework. These types form the building blocks for layout calculations, positioning, and drawing operations. The module provides a set of efficient, immutable structures with utility methods that simplify common geometric operations.

## Core Types

### `Rect` Struct

Represents a rectangle with position and size:

```rust
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Rect {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}
```

#### Key Methods:

- `new(x, y, width, height)`: Creates a new rectangle.
- `zero()`: Creates a rectangle at origin with zero size.
- `from_size(width, height)`: Creates a rectangle at origin with given size.
- `right()`: Returns the x-coordinate of the right edge.
- `bottom()`: Returns the y-coordinate of the bottom edge.
- `center()`: Returns the center point of the rectangle.
- `contains(point)`: Checks if a point is inside the rectangle.
- `inset(amount)`: Creates a new rectangle inset by the specified amount.
- `contains_point(x, y)`: Checks if specific coordinates are inside the rectangle.

### `Size` Struct

Represents a two-dimensional size:

```rust
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Size {
    pub width: f32,
    pub height: f32,
}
```

#### Key Methods:

- `new(width, height)`: Creates a new size.
- `zero()`: Creates a size with zero dimensions.
- `square(size)`: Creates a square size with equal dimensions.
- `is_empty()`: Checks if either dimension is zero or negative.

### `Point` Struct

Represents a two-dimensional point:

```rust
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Point {
    pub x: f32,
    pub y: f32,
}
```

#### Key Methods:

- `new(x, y)`: Creates a new point.
- `zero()`: Creates a point at the origin.

### `EdgeInsets` Struct

Represents padding or margins on all four sides of a rectangle:

```rust
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct EdgeInsets {
    pub top: f32,
    pub right: f32,
    pub bottom: f32,
    pub left: f32,
}
```

#### Key Methods:

- `new(top, right, bottom, left)`: Creates new edge insets with specific values.
- `all(value)`: Creates uniform edge insets with the same value on all sides.
- `symmetric(horizontal, vertical)`: Creates edge insets with symmetric horizontal and vertical values.
- `horizontal(value)`: Creates edge insets with horizontal values only.
- `vertical(value)`: Creates edge insets with vertical values only.
- `zero()`: Creates edge insets with zero padding on all sides.

#### Integration with Layout System:

In the MiLost UI framework, `EdgeInsets` are typically:

- Stored as string properties on render nodes in the format "top,right,bottom,left"
- Extracted during layout using the `parse_edge_insets` utility function
- Used to calculate the content area within a component's frame
- Applied consistently across different component types

The framework includes utility functions for converting between `EdgeInsets` objects and their string representation to ensure consistent handling throughout the layout process.

### `Alignment` Enum

Defines alignment options for positioning elements:

```rust
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum Alignment {
    TopLeading,
    Top,
    TopTrailing,
    Leading,
    Center,
    Trailing,
    BottomLeading,
    Bottom,
    BottomTrailing,
}
```

#### Key Methods:

- `get_point(&self, rect: &Rect) -> Point`: Calculates the alignment point within a rectangle.

## Usage Patterns

### Layout Calculations

```rust
// Calculate a component frame
let container = Rect::new(0.0, 0.0, 400.0, 300.0);
let padding = EdgeInsets::all(16.0);

// Apply padding to get content area
let content_rect = Rect::new(
    container.x + padding.left,
    container.y + padding.top,
    container.width - padding.left - padding.right,
    container.height - padding.top - padding.bottom
);

// Center an element in the content area
let element_size = Size::new(200.0, 150.0);
let element_point = content_rect.center();
let element_rect = Rect::new(
    element_point.x - element_size.width / 2.0,
    element_point.y - element_size.height / 2.0,
    element_size.width,
    element_size.height
);
```

### Alignment Usage

```rust
// Create a rectangle
let container = Rect::new(0.0, 0.0, 400.0, 300.0);

// Get alignment points
let top_left = Alignment::TopLeading.get_point(&container);
let center = Alignment::Center.get_point(&container);
let bottom_right = Alignment::BottomTrailing.get_point(&container);

// Position an element using alignment
let element_size = Size::new(100.0, 80.0);
let element_rect = Rect::new(
    center.x - element_size.width / 2.0,
    center.y - element_size.height / 2.0,
    element_size.width,
    element_size.height
);
```

### Hit Testing

```rust
// Check if a point is inside a rectangle
let button_rect = Rect::new(50.0, 50.0, 200.0, 60.0);
let touch_point = Point::new(120.0, 70.0);

if button_rect.contains(touch_point) {
    // Handle the touch on button
}

// Alternatively, check by coordinates
if button_rect.contains_point(120.0, 70.0) {
    // Handle the touch on button
}
```

## Integration Points

The geometry types are used throughout the framework:

- **Layout Engine**: Uses Rect, Size, and EdgeInsets for layout calculations.
- **Rendering System**: Uses Rect for defining drawing regions.
- **Event System**: Uses Point and Rect for hit testing.
- **Component Properties**: Components use these types for size and positioning.
- **Animation System**: Animates changes in these geometric properties.

## Design Principles

The geometry types follow several key design principles:

1. **Immutability**: All types are designed to be immutable for thread safety and predictable behavior.
2. **Efficiency**: Types use `Copy` semantics for efficient value passing without allocations.
3. **Floating-Point Precision**: Uses `f32` for all measurements to balance precision and performance.
4. **Composition**: Types are designed to work together through composition rather than inheritance.
5. **Serialization Support**: All types support serialization for storage or network transport.

## Mathematical Foundation

The geometric operations are based on a 2D Cartesian coordinate system where:

- The origin (0,0) is at the top-left corner.
- The x-axis increases to the right.
- The y-axis increases downward.

This follows the standard computer graphics convention rather than the mathematical convention of y increasing upward.

## Future Improvements

1. **Extended Geometric Types**:

   - Add `Path` type for complex shapes.
   - Implement `Transform` type for affine transformations.
   - Add `Ellipse` and `Circle` types for rounded shapes.
   - Create `Polygon` type for multi-point shapes.

2. **Enhanced Operations**:

   - Add rectangle intersection and union operations.
   - Implement rectangle splitting and merging.
   - Add distance calculations between points and shapes.
   - Implement more sophisticated hit testing (e.g., for irregular shapes).

3. **Performance Optimizations**:

   - Add specialized operations for common cases.
   - Implement SIMD-based calculations for bulk operations.
   - Add caching for expensive calculations.

4. **Coordinate System Enhancements**:

   - Add support for different coordinate spaces (local, parent, global).
   - Implement coordinate space transformations.
   - Add viewport-relative positioning.

5. **Advanced Layout Support**:
   - Add constraint-based rectangle calculations.
   - Implement grid-based positioning.
   - Add support for fractional coordinates and dimensions.

## Best Practices

1. **Coordinate Handling**:

   - Be consistent with coordinate spaces when combining operations.
   - Remember that y-coordinates increase downward in screen space.
   - Use the appropriate geometric types rather than raw numbers.

2. **Performance Considerations**:

   - Minimize creation of temporary geometric objects in tight loops.
   - Use the provided utility methods rather than manual calculations.
   - Be aware of potential floating-point precision issues.

3. **Layout Calculations**:

   - Account for edge insets and padding correctly.
   - Use alignment utilities for consistent positioning.
   - Ensure proper nesting of rectangles for valid layout.

4. **Edge Cases**:

   - Handle zero or negative sizes appropriately.
   - Check for empty rectangles before performing operations.
   - Be careful with division operations that could result in NaN or infinity.

5. **Serialization**:
   - When serializing geometric types, maintain precision requirements.
   - Consider rounding or truncating values for storage efficiency when appropriate.
   - Validate deserialized values for geometric consistency.
