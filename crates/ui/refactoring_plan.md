# Refactoring Plan for MiLost UI

## 1. Property Definition System

### New Files to Create:

- `src/shared/properties.rs`: Define centralized property types and conversion utilities

### Files to Modify:

- `src/render/node.rs`: Update to use typed properties instead of string HashMap
- `src/render/transformers/utils.rs`: Update property setting utilities
- All component transformer files: Update to use new property system

### Implementation Details:

- Create a `Property` enum with variants for different types (String, Number, Color, etc.)
- Add serialization/deserialization between Property and string representation
- Implement conversion utilities for common property types

## 2. Base Component Properties

### New Files to Create:

- `src/components/base_props.rs`: Define shared component properties

### Files to Modify:

- All component property structs (VStackProps, TextProps, etc.): Inherit from base props
- All component transformer files: Update to handle base properties

### Implementation Details:

- Create a `BaseComponentProps` struct with common fields:
  ```rust
  pub struct BaseComponentProps {
      pub background: Option<Color>,
      pub padding: Option<f32>,
      pub edge_insets: Option<EdgeInsets>,
      pub min_width: Option<f32>,
      pub max_width: Option<f32>,
      pub min_height: Option<f32>,
      pub max_height: Option<f32>,
      pub clip_to_bounds: Option<bool>,
      // Other common properties
  }
  ```
- Update component props to use composition: `pub base: BaseComponentProps`

## 3. Edge Insets Handling

### New Files to Create:

- `src/shared/edge_insets.rs`: Centralized edge insets utilities

### Files to Modify:

- `src/layout/layout_utils.rs`: Remove duplicate parsing code
- `src/render/transformers/utils.rs`: Update edge insets setting code
- Any other files with edge insets parsing

### Implementation Details:

- Create canonical functions for edge insets formatting and parsing
- Implement consistent serialization/deserialization
- Add validation and normalization functions

## 4. Layout Algorithm Parameterization

### New Files to Create:

- `src/layout/flex_layout.rs`: Parameterized flex layout implementation

### Files to Modify:

- `src/layout/stack_layout.rs`: Refactor to use parameterized algorithm
- `src/layout/hstack_layout.rs` and `src/layout/vstack_layout.rs`: Simplify to use common code

### Implementation Details:

- Create a single flex layout algorithm parameterized by axis (horizontal/vertical)
- Add configuration for main axis/cross axis behavior
- Extract common layout logic for reuse

## 5. Strongly-Typed Render Node Properties

### New Files to Create:

- `src/render/property.rs`: Define property type system

### Files to Modify:

- `src/render/node.rs`: Update to use typed property storage
- All component renderers: Update property access
- Layout utilities: Update property parsing

### Implementation Details:

- Replace string HashMap with typed property storage
- Implement type-safe property getters and setters
- Add compile-time validation where possible

## 6. Component Registration System

### New Files to Create:

- `src/components/registry.rs`: Component registration system

### Files to Modify:

- `src/lib.rs`: Add component registration
- Component transformer and renderer modules: Use registration system

### Implementation Details:

- Create a registry for component types, transformers, and renderers
- Implement automatic registration of standard components
- Add lookup by component type for transformers and renderers

## 7. Event Handler Registration

### New Files to Create:

- `src/events/registration.rs`: Centralized event registration utilities

### Files to Modify:

- `src/render/node.rs`: Update event handler attachment
- Component files: Simplify event handler configuration

### Implementation Details:

- Create helper functions for common event handler patterns
- Standardize event handler registration
- Reduce boilerplate in node event handling

## 8. Renderer Base Implementations

### New Files to Create:

- `src/render/components/base_renderer.rs`: Common renderer functionality

### Files to Modify:

- Component renderer files: Inherit from base implementation

### Implementation Details:

- Extract common rendering operations (background, borders, shadows)
- Create base renderer traits or structures
- Simplify component renderers to focus on unique aspects

## Implementation Priority

1. Property Definition System (highest priority)
2. Base Component Properties
3. Edge Insets Handling
4. Strongly-Typed Render Node Properties
5. Component Registration System
6. Layout Algorithm Parameterization
7. Event Handler Registration
8. Renderer Base Implementations (lowest priority)

## Expected Benefits

- Reduced code duplication
- More type safety and fewer runtime errors
- Better maintainability and extensibility
- Clearer architecture with enforced patterns
- Easier onboarding for new developers
- Simpler component implementation process
