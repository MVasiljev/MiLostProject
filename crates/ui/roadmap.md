# MiLost UI

## Overview

MiLost UI is a declarative UI framework built in Rust that takes inspiration from SwiftUI and Flutter. It provides a component-based architecture for building user interfaces with a clean separation between component definition, layout, and rendering.

The library allows for creating complex UI hierarchies with a variety of basic components such as stacks, text, buttons, images, and more. It supports flexible layouts with features like alignment, padding, and automatic sizing.

## Architecture

The framework is organized around several core concepts:

1. **Components** - Reusable UI elements with properties
2. **Layout Engine** - Computes sizes and positions
3. **Render System** - Translates layout information into visual output
4. **Event System** - Handles user interactions

## Directory Structure & File Responsibilities

```
/crates/ui
├── Cargo.toml           # Project dependencies and metadata
└── src/
    ├── lib.rs           # Public exports and module organization
    ├── button.rs        # Button component definition
    ├── color.rs         # Color definitions and utilities
    ├── component.rs     # UIComponent enum and shared component logic
    ├── divider.rs       # Divider component definition
    ├── events.rs        # Event handling system
    ├── font.rs          # Typography definitions
    ├── image.rs         # Image component definition
    ├── layout/          # Layout calculation system
    │   ├── layout_engine.rs    # Layout engine core logic
    │   ├── layout_info.rs # Layout information data structures
    │   ├── layout_utils.rs # Shared layout utilities
    │   ├── mod.rs       # Layout module organization
    │   ├── types.rs     # Core layout types (Rect, Size, etc.)
    │   ├── stack_layout.rs # Stack-specific layout logic
    │   ├── zstack_layout.rs # ZStack-specific layout logic
    │   ├── text_layout.rs # Text-specific layout logic
    │   ├── button_layout.rs # Button-specific layout logic
    │   ├── image_layout.rs # Image-specific layout logic
    │   ├── scroll_layout.rs # Scroll-specific layout logic
    │   ├── spacer_layout.rs # Spacer-specific layout logic
    │   └── divider_layout.rs # Divider-specific layout logic
    ├── platform/        # Rendering backends
    │   ├── canvas/      # Canvas rendering implementation
    │   │   ├── mod.rs   # Canvas module organization
    │   │   └── renderer.rs # Canvas renderer implementation
    │   ├── mod.rs       # Platform module organization
    │   └── native/      # Native rendering placeholders
    │       └── mod.rs   # Native module organization
    ├── render/          # Render system
    │   ├── component.rs # Component to RenderNode conversion
    │   ├── mod.rs       # Render module organization
    │   └── node.rs      # RenderNode implementation
    ├── scroll.rs        # Scroll component definition
    ├── spacer.rs        # Spacer component definition
    ├── stack.rs         # HStack and VStack component definitions
    ├── text.rs          # Text component definition
    └── zstack.rs        # ZStack component definition
```

## Core Components

### Component Definitions

Each component file defines a struct with properties and methods for configuring that component:

- **stack.rs**: Defines `VStackProps` and `HStackProps` for vertical and horizontal arrangements of components
- **zstack.rs**: Defines `ZStackProps` for layering components on top of each other
- **text.rs**: Defines `TextProps` for displaying text
- **button.rs**: Defines `ButtonProps` for creating interactive buttons
- **image.rs**: Defines `ImageProps` for displaying images
- **scroll.rs**: Defines `ScrollProps` for scrollable content
- **spacer.rs**: Defines `SpacerProps` for flexible spacing
- **divider.rs**: Defines `DividerProps` for visual separators

### Component Enum

- **component.rs**: Defines the `UIComponent` enum that can represent any of the supported component types

## Layout System

### Core Layout Types

- **layout/types.rs**: Defines fundamental layout types like `Rect`, `Size`, `Point`, `EdgeInsets`, and `Alignment`

### Layout Engine

- **layout/layout_info.rs**: Defines the `LayoutInfo` struct that stores layout information for a component
- **layout/engine.rs**: The main layout engine that coordinates the layout calculation for all components
- **layout/layout_utils.rs**: Shared utilities for layout calculations

### Component-Specific Layout

- **layout/stack_layout.rs**: Layout logic for `VStack` and `HStack`
- **layout/zstack_layout.rs**: Layout logic for `ZStack`
- **layout/text_layout.rs**: Layout logic for `Text`
- **layout/button_layout.rs**: Layout logic for `Button`
- **layout/image_layout.rs**: Layout logic for `Image`
- **layout/scroll_layout.rs**: Layout logic for `Scroll`
- **layout/spacer_layout.rs**: Layout logic for `Spacer`
- **layout/divider_layout.rs**: Layout logic for `Divider`

## Rendering System

### Render Node

- **render/node.rs**: Defines the `RenderNode` structure which represents a component in the render tree

### Component Rendering

- **render/component.rs**: Converts `UIComponent` instances to `RenderNode` instances

### Platform-Specific Rendering

- **platform/canvas/renderer.rs**: Implements rendering to a canvas context
- **platform/native/mod.rs**: Placeholder for native rendering implementations

## Event System

- **events.rs**: Defines event types, event handlers, and the event system

## Key Architectural Patterns

1. **Builder Pattern**: Component properties are configured using a fluent builder API
2. **Trait-Based Layout**: Component layout functions use traits to interact with the layout engine
3. **Two-Pass Layout**: Layout calculation occurs in two passes: measure and position
4. **Component Composition**: Complex UIs are built by composing simpler components

## How It All Works Together

1. **Component Definition**: Components are defined with their properties
2. **Layout Calculation**:
   - Measure: Determines the size of each component
   - Position: Places each component within its parent's frame
3. **Rendering**: The component tree is traversed and each component is drawn
4. **Event Handling**: User interactions trigger events that are dispatched to handlers

## Roadmap for Next Steps

### 1. Immediate Improvements

- [x] Restructure layout engine to better separate component-specific layout logic
- [ ] Fix warnings throughout the codebase
- [ ] Add comprehensive documentation for all public APIs
- [ ] Implement proper tests for core functionality

### 2. Component Enhancements

- [ ] Add missing properties to existing components
- [ ] Implement more sophisticated text layout with proper text metrics
- [ ] Enhance image component with proper image loading and caching
- [ ] Add form components (TextField, Checkbox, Radio, etc.)
- [ ] Add list and grid components for data display
- [ ] Implement proper accessibility features

### 3. Layout System Improvements

- [ ] Implement more sophisticated layout constraints
- [ ] Support for animations and transitions
- [ ] Add support for relative positioning and anchoring
- [ ] Implement proper text measurement using platform text metrics
- [ ] Support for RTL layouts and internationalization

### 4. Rendering Enhancements

- [ ] Complete the canvas renderer with all visual styles
- [ ] Implement proper image rendering
- [ ] Add support for gradients, shadows, and other visual effects
- [ ] Optimize rendering performance with clipping and dirty region tracking
- [ ] Create a WebAssembly bridge for browser rendering

### 5. Event System Improvements

- [ ] Enhance event bubbling and capturing
- [ ] Implement focus management
- [ ] Add keyboard navigation support
- [ ] Implement gesture recognition

### 6. Platform Integration

- [ ] Complete the WebAssembly target for browser integration
- [ ] Begin work on native rendering backends
- [ ] Implement platform-specific optimizations
- [ ] Create platform-specific component variants

### 7. Tooling & Developer Experience

- [ ] Create a visual UI builder
- [ ] Add hot reloading support for development
- [ ] Implement state management system
- [ ] Create debugging tools for inspecting component hierarchy and layout

### 8. Documentation & Examples

- [ ] Write comprehensive guides and tutorials
- [ ] Create example applications
- [ ] Document best practices and patterns
- [ ] Create component gallery with examples

### 9. Performance Optimization

- [ ] Optimize layout calculation with caching
- [ ] Implement incremental rendering
- [ ] Minimize memory usage with pooling and recycling

### 10. Release Planning

- [ ] Finalize API design and ensure stability
- [ ] Complete version 0.1.0 with core functionality
- [ ] Establish versioning and backwards compatibility strategy
- [ ] Set up CI/CD pipeline for automated testing and releases
