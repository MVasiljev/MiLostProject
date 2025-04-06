# MiLost UI Framework

## Overview

The `lib.rs` file serves as the central entry point and public API for the MiLost UI framework. It organizes and exports the core modules, types, and functionality that make up the framework. This file defines what users of the library have access to and establishes the framework's organizational structure.

## Module Structure

The framework is organized into several key modules:

```rust
pub mod shared;
pub mod render;
pub mod layout;
pub mod components;
pub mod events;
```

### Shared Module

Contains common utilities and foundational types used throughout the framework:

- Color system for styling and theming
- Typography system for text styling
- Shared styling utilities (gradients, shadows, etc.)

### Render Module

Implements the rendering system that draws UI components:

- RenderNode structure for component representation
- Transformation pipeline from components to nodes
- Rendering implementations for different contexts
- Component-specific renderers

### Layout Module

Handles component sizing and positioning:

- Geometry types (Rect, Size, Point, etc.)
- Layout engine for calculating component positions
- Component-specific layout algorithms
- Constraint-based layout system

### Components Module

Defines the high-level UI components:

- Basic components (Text, Button, Image)
- Container components (VStack, HStack, ZStack)
- Specialized components (Scroll, Spacer, Divider)
- Component properties and configuration

### Events Module

Implements the event handling system:

- Event types and representation
- Event dispatch and handling
- Middleware pipeline for event processing
- Gesture recognition

## Public Exports

The file re-exports key types and functions for convenient access:

```rust
pub use shared::*;
pub use render::node::RenderNode;
pub use render::component::render;
pub use components::*;
pub use render::renderer::{DrawingContext, Renderer, ComponentRenderer};
pub use render::components::canvas_renderer::{CanvasRenderer, CanvasContext};
pub use layout::{Rect, Size, Point, EdgeInsets, Alignment, LayoutEngine};
```

This approach allows users to import commonly used types directly from the root without navigating the module hierarchy.

## Framework Architecture

MiLost UI follows a declarative UI architecture with a clear separation of concerns:

1. **Component Definition**: High-level, user-friendly component APIs
2. **Component Transformation**: Conversion to render nodes
3. **Layout Calculation**: Determination of component sizes and positions
4. **Rendering**: Drawing components to the target context
5. **Event Handling**: Processing user interactions

This architecture allows for:

- Clean separation between what components look like and how they're rendered
- Platform-agnostic component definitions
- Flexible rendering backends
- Consistent layout behavior

## Initialization and Usage Flow

The typical usage flow for the framework is:

1. **Create Components**: Define UI components with their properties
2. **Set Up Rendering Context**: Initialize a platform-specific context
3. **Create Renderer**: Initialize with the context
4. **Transform Components**: Convert to render nodes
5. **Calculate Layout**: Determine component positions
6. **Render Components**: Draw to the context
7. **Process Events**: Handle user interactions

## Sample Usage

```rust
use milost_ui::{
    VStack, Text, Button, Color, EdgeInsets,
    CanvasRenderer, Renderer, render
};

// Create components
let button = Button {
    label: "Click Me".to_string(),
    background: Some(Color::Primary),
    on_tap: Some("handle_tap".to_string()),
    ..Default::default()
};

let text = Text {
    content: "Hello, World!".to_string(),
    font_size: Some(24.0),
    text_color: Some(Color::Black),
    ..Default::default()
};

let container = VStack {
    children: vec![text.into(), button.into()],
    padding: Some(16.0),
    background: Some(Color::White),
    edge_insets: Some(EdgeInsets::all(20.0)),
    ..Default::default()
};

// Create rendering context (platform-specific)
let canvas_context = CanvasContext::new(canvas_element);

// Initialize renderer
let mut renderer = Renderer::new(canvas_context);

// Transform component to render node
let render_tree = render(&container.into());

// Calculate layout (based on available size)
let available_size = Size::new(800.0, 600.0);
layout_engine.layout(&render_tree, available_size);

// Render the UI
renderer.render(&render_tree);

// Register event handler
renderer.register_event_handler(
    EventType::Tap,
    TypedEventHandler::new("handle_tap", |event| {
        println!("Button tapped!");
        HandlerResult::Handled
    })
);
```

## Integration Points

The library integrates with various systems:

- **Platform Rendering**: Through the `DrawingContext` trait
- **Asset Management**: For images, fonts, and other resources
- **Input Systems**: For events and user interactions
- **Animation Systems**: For UI transitions and effects
- **Application Logic**: Through event handlers and callbacks

## Feature Support

The framework supports a wide range of UI features:

- Rich component library (containers, controls, text, images)
- Flexible layout system with constraints
- Comprehensive styling (colors, typography, shadows, gradients)
- Event handling with gesture recognition
- Theming and dark mode support
- Accessibility properties

## Performance Considerations

The framework is designed with performance in mind:

- Minimal allocations during rendering
- Efficient transformation pipeline
- Dirty region tracking for partial updates
- Optimized layout calculations
- Event delegation for efficient handling

## Future Extensions

Areas for future development in the library:

1. **Animation System**: For transitions and effects
2. **State Management**: For declarative UI updates
3. **Form Handling**: For input validation and submission
4. **Accessibility**: Enhanced screen reader support
5. **Internationalization**: For multi-language support

## Best Practices

When using the MiLost UI framework:

1. **Component Organization**:

   - Group related components logically
   - Use composition for complex UIs
   - Extract reusable component patterns

2. **Performance Optimization**:

   - Minimize component tree depth
   - Use appropriate container types
   - Consider layout impact of nested components

3. **Event Handling**:

   - Register handlers early in the application lifecycle
   - Use event delegation for similar components
   - Keep handlers focused on specific tasks

4. **Styling Approach**:

   - Use semantic colors rather than literal colors
   - Apply consistent spacing and sizing
   - Follow platform design guidelines

5. **Architecture Integration**:
   - Separate UI logic from business logic
   - Use a unidirectional data flow when possible
   - Consider component reusability across the application
