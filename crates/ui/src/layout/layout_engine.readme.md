# Layout Engine

## Overview

The layout engine is the core system responsible for calculating the size and position of all UI elements in the MiLost UI framework. It implements a constraint-based layout system that resolves component dimensions and positions based on their properties, contents, and relationship to parent and sibling components.

## Key Components

### Layout Engine Structure

The layout engine implements a two-pass layout algorithm:

1. **Measurement Pass**: Calculates the intrinsic size of components based on their content and constraints.
2. **Positioning Pass**: Determines the final position of each component within its parent's coordinate space.

### Core Interfaces

#### `LayoutMeasurement` Trait

Defines the interface for measuring component sizes:

- `measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size`: Calculates the desired size of a component given available space.
- `get_layout_cache(&self) -> &HashMap<String, LayoutInfo>`: Provides access to previously calculated layout information.

#### `LayoutPositioning` Trait

Defines the interface for positioning components:

- `position_node(&mut self, node: &RenderNode, frame: Rect)`: Sets the position and size of a component.
- `get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo>`: Provides mutable access to layout information.

### Data Structures

#### `LayoutInfo` Struct

Stores layout information for a component:

- `content_size`: The calculated size of the component.
- `frame`: The assigned position and size in parent's coordinate space.
- `min_width`, `max_width`, `min_height`, `max_height`: Size constraints for the component.
- `padding`: Spacing within the component.
- `alignment`: How the component aligns within its allocated space.
- `flex_grow`, `flex_shrink`, `flex_basis`: Flex layout properties.
- `parent_type`: The type of the parent component (for specialized layout logic).
- `resolved_props`: Additional layout-related properties.

A detailed description of this structure can be found in the `layout_info.readme.md` document.

#### Layout Types

- `Rect`: Represents position and size.
- `Size`: Represents width and height.
- `Point`: Represents x and y coordinates.
- `EdgeInsets`: Represents space on all four sides.
- `Alignment`: Defines alignment options (e.g., center, top-leading).

## Layout Process

### Measurement Phase

1. Layout begins at the root component and traverses down the component tree.
2. Each component first measures its children to determine their desired sizes.
3. Based on child sizes and its own properties, each component calculates its desired size.
4. The calculated sizes are stored in the layout cache for use in the positioning phase.

### Positioning Phase

1. Starting from the root component, each parent assigns positions to its children.
2. Positions are calculated based on:
   - The available space in the parent
   - The alignment of children
   - The layout direction (LTR/RTL)
   - Spacing between children
   - Component-specific layout logic

### Constraint Resolution

The layout engine resolves constraints in this order:

1. Minimum size constraints (min_width, min_height)
2. Maximum size constraints (max_width, max_height)
3. Preferred/ideal size (ideal_width, ideal_height)
4. Stretch factors (flex_grow, flex_shrink)
5. Alignment within available space

### Property Parsing

The layout engine relies on specialized utility functions to parse string-based properties from render nodes:

- `parse_edge_insets`: Extracts padding information from "edge_insets" or "padding" properties
- `parse_edge_insets_from_string`: Parses raw edge insets strings in "top,right,bottom,left" format

These utilities (defined in `layout_utils.rs`) ensure consistent interpretation of layout properties across different components and provide appropriate fallbacks for missing or malformed properties.

## Component-Specific Layout

Each component type has specialized layout logic:

- **HStack**: Arranges children horizontally with configurable spacing and alignment.
- **VStack**: Arranges children vertically with configurable spacing and alignment.
- **ZStack**: Layers children on top of each other with alignment options.
- **Spacer**: Creates flexible space between other components.
- **Text**: Calculates size based on text content, font, and line wrapping.
- **Image**: Handles different content modes (fit, fill, etc.) for image display.
- **Button**: Combines text and image layout with padding for interactive elements.
- **Scroll**: Manages scrollable content that exceeds the available viewport.

## Integration Points

The layout engine integrates with several other systems:

- **Rendering System**: Uses the calculated layouts to draw components on screen.
- **Event System**: Provides spatial information for hit testing and event targeting.
- **Component System**: Translates high-level layout properties to concrete sizes and positions.
- **Animation System**: Provides target layouts for animated transitions.

## Usage Example

```rust
// Example of how the layout engine is used:

// 1. Create a layout engine instance
let mut layout_engine = LayoutEngine::new();

// 2. Register component-specific layout handlers
layout_engine.register_layout_handler("VStack", Box::new(VStackLayout));
layout_engine.register_layout_handler("HStack", Box::new(HStackLayout));
// ... register other handlers

// 3. Perform the two-pass layout
let root_size = Size::new(screen_width, screen_height);
layout_engine.layout(root_node, root_size);

// 4. Access calculated layouts
let component_frame = layout_engine.get_layout(&component_id);
```

## Future Improvements

1. **Performance Optimizations**:

   - Add incremental layout calculations for partial updates
   - Implement layout caching for static subtrees
   - Add parallel layout calculations for independent subtrees

2. **Enhanced Layout Capabilities**:

   - Implement grid layout with rows and columns
   - Add support for different layout directions (RTL support)
   - Implement constraints-based layout similar to AutoLayout

3. **Animation Integration**:

   - Add layout transition calculations
   - Implement physics-based layout animations
   - Support for layout-driven animations

4. **Developer Experience**:

   - Add layout debugging visualization
   - Implement layout constraints solver with better error reporting
   - Create a layout profiling system

5. **Responsiveness**:
   - Implement adaptive layouts based on available space
   - Add support for different layout configurations based on screen size
   - Create container queries for responsive components

## Best Practices

1. **Performance Considerations**:

   - Minimize layout recalculations by batching property changes
   - Avoid deeply nested layout hierarchies
   - Use fixed sizes where appropriate to reduce calculation complexity

2. **Layout Stability**:

   - Provide explicit size constraints to prevent layout thrashing
   - Use flex factors consistently to create predictable resizing behavior
   - Consider the impact of dynamic content on layout stability

3. **Component Boundaries**:

   - Respect the measurement protocol when implementing custom components
   - Don't bypass the layout engine with manual positioning
   - Properly implement layout-relevant properties

4. **Accessibility**:
   - Ensure minimum touch target sizes for interactive elements
   - Consider text resizing in your layout calculations
   - Support dynamic type and ensure layouts adapt appropriately
