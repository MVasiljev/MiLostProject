# Render Node

## Overview

The `RenderNode` is a fundamental structure in the MiLost UI framework that represents a node in the render tree. It serves as the intermediary representation between high-level component definitions and the actual rendering process. Each visual element in the UI is represented by a `RenderNode` with specific properties, children, and event handlers.

## Core Structure

### `RenderNode` Struct

The main structure with the following key properties:

- `id`: A unique identifier for the node.
- `type_name`: The type of component this node represents (e.g., "VStack", "Text", "Button").
- `resolved_props`: A key-value map of all properties that influence rendering and layout.
- `children`: A vector of child nodes, forming the render tree hierarchy.
- `event_handlers`: A collection of event handlers attached to this node.
- `node_events`: A structured representation of event handlers for common interactions.

### Event Handling Structures

#### `EventHandler` Struct

Represents a single event handler:

- `event_type`: The type of event this handler responds to.
- `handler_id`: A unique identifier for the handler function.

#### `NodeEventHandlers` Struct

Organizes common event handlers for a node:

- Tap, double tap, long press handlers
- Hover enter/exit handlers
- Focus and blur handlers
- Swipe direction handlers
- Value change and submit handlers

## Key Methods

### Node Creation and Manipulation

- `new(id, type_name)`: Creates a new render node with the specified ID and type.
- `add_child(child)`: Adds a child node to this node.
- `set_prop(key, value)`: Sets a property with the given key and value.

### Property Access

- `get_prop(key)`: Retrieves a property value as a string.
- `get_prop_f32(key)`: Parses and retrieves a property as an f32 value.
- `has_children()`: Checks if the node has any children.
- `child_count()`: Returns the number of children.

### Event Handler Management

- `add_event_handler(handler)`: Adds an event handler to the node.
- `on_event(event_type, handler_id)`: Registers a handler for a specific event type.
- `get_node_events()`: Retrieves all event handlers attached to the node.

Convenience methods for common events:

- `on_tap(handler_id)`: Registers a tap handler.
- `on_double_tap(handler_id)`: Registers a double tap handler.
- `on_long_press(handler_id)`: Registers a long press handler.
- `on_hover_enter(handler_id)`: Registers a hover enter handler.
- `on_hover_exit(handler_id)`: Registers a hover exit handler.
- `on_swipe(direction, handler_id)`: Registers a swipe handler for a specific direction.

### Node Tree Navigation

- `find_child_by_id(id)`: Searches for a child node with the specified ID.
- `find_child_by_id_mut(id)`: Same as above but returns a mutable reference.
- `to_button_event_handler()`: Converts node event handlers to a button-specific format.

## Property Conventions

Properties in the `resolved_props` map follow certain conventions:

1. **Layout Properties**:

   - `x`, `y`: Position coordinates
   - `width`, `height`: Dimensions
   - `min_width`, `min_height`: Minimum dimensions
   - `max_width`, `max_height`: Maximum dimensions
   - `padding`: Simple uniform padding around content
   - `edge_insets`: Detailed padding with format "top,right,bottom,left"
   - `alignment`: Alignment within parent

2. **Visual Properties**:

   - `background`: Background color or pattern
   - `border_width`, `border_color`, `border_radius`: Border properties
   - `opacity`: Transparency level
   - `shadow_radius`, `shadow_color`, `shadow_offset_x`, `shadow_offset_y`: Shadow effects

3. **Component-Specific Properties**:

   - Text-specific: `font_size`, `font_weight`, `text_color`, `line_height`
   - Image-specific: `content_mode`, `tint_color`
   - Stack-specific: `spacing`, `distribution`

4. **Interaction Properties**:
   - `enabled`: Whether the node can be interacted with
   - `focusable`: Whether the node can receive focus
   - `accessibility_label`: Text description for accessibility

## Usage in the Rendering Pipeline

1. **Component Transformation**:

   - High-level components are transformed into `RenderNode` instances.
   - Component properties are resolved and converted to string values.
   - Child components are recursively transformed into child nodes.

2. **Layout Calculation**:

   - The layout engine queries properties from nodes to calculate sizes.
   - Layout results are attached to nodes via properties like `x`, `y`, `width`, `height`.

3. **Rendering Process**:

   - The renderer traverses the node tree and renders each node.
   - Node properties are used to determine visual appearance.
   - The node hierarchy establishes the drawing order.

4. **Event Processing**:
   - When an event occurs, it's routed to the appropriate node based on position.
   - The node's event handlers are invoked to respond to the event.
   - Event propagation follows the node hierarchy.

## Integration Points

- **Component System**: Components are transformed into `RenderNode` instances.
- **Layout Engine**: Uses node properties for layout calculations through specialized utility parsers.
- **Layout Utilities**: Parse string-based properties into typed layout structures (e.g., converting "edge_insets" strings to `EdgeInsets` objects).
- **Rendering System**: Renders nodes based on their properties and hierarchy.
- **Event System**: Routes events to nodes and invokes their handlers.

## Examples

### Creating a Basic Node

```rust
// Create a text node
let mut text_node = RenderNode::new("text-1", "Text");
text_node.set_prop("text", "Hello, World!".to_string());
text_node.set_prop("font_size", "16.0".to_string());
text_node.set_prop("text_color", "Red".to_string());

// Register an event handler
text_node.on_tap("handle_text_tap");
```

### Building a Node Tree

```rust
// Create a container
let mut container = RenderNode::new("container-1", "VStack");
container.set_prop("padding", "10.0".to_string());
container.set_prop("background", "White".to_string());

// Add children
container.add_child(text_node);

// Add an image
let mut image_node = RenderNode::new("image-1", "Image");
image_node.set_prop("source", "profile.png".to_string());
image_node.set_prop("width", "100.0".to_string());
image_node.set_prop("height", "100.0".to_string());

container.add_child(image_node);
```

## Future Improvements

1. **Property Type Safety**:

   - Add stronger typing for properties to reduce parsing errors.
   - Implement structured property objects instead of string key-value pairs.

2. **Performance Optimizations**:

   - Optimize property storage for commonly used properties.
   - Implement property change tracking for incremental updates.
   - Add dirty flag system to minimize unnecessary re-rendering.

3. **Enhanced Serialization**:

   - Add efficient serialization support for network transmission.
   - Implement differential node updates for partial tree modifications.

4. **Developer Experience**:

   - Add debug visualization for node trees.
   - Implement validation for property values.
   - Add runtime type checking for critical properties.

5. **Advanced Event Handling**:
   - Support for complex gesture recognition directly in nodes.
   - Add delegate pattern for component-specific event handling.
   - Implement event capture and bubble phases.

## Best Practices

1. **Node Creation**:

   - Always use unique, predictable IDs for nodes.
   - Group related properties logically when creating nodes.
   - Set required properties first, then optional ones.

2. **Property Management**:

   - Use appropriate data types and conversions for properties.
   - Document custom properties for component-specific nodes.
   - Consider property dependencies when setting values.

3. **Tree Structure**:

   - Keep node hierarchies as shallow as possible for performance.
   - Group related UI elements under common parent nodes.
   - Consider z-ordering when organizing nodes for proper rendering.

4. **Event Handling**:
   - Use the most specific event type for handlers.
   - Keep event handlers focused on single responsibilities.
   - Consider event bubbling when structuring node hierarchies.
