# Event System

## Overview

The `event_system.rs` file defines the core event infrastructure for the MiLost UI framework. It provides the fundamental structures for representing, serializing, and transporting events throughout the system. This module serves as the foundation for all event-related functionality in the framework.

## Key Components

### `EventPhase` Enum

Represents the phase of event propagation:

- `Capturing`: Event is traveling down the component tree.
- `AtTarget`: Event has reached its target component.
- `Bubbling`: Event is traveling back up the component tree.

### `EventPayload` Trait

A base trait for attaching type-safe data to events:

- `as_any(&self) -> &dyn Any`: Allows downcasting to concrete types.
- `clone_box(&self) -> Box<dyn EventPayload>`: Provides cloning support.

### `GenericPayload<T>` Struct

A generic implementation of `EventPayload` for wrapping arbitrary data:

- Holds a value of type `T`.
- Provides a simple way to attach custom data to events.

### `EventType` Enum

Defines the types of events supported by the system:

- Basic input events (Tap, DoubleTap, LongPress, etc.).
- Pointer events (PointerDown, PointerUp, PointerMove).
- Touch events (TouchStart, TouchEnd, TouchMove).
- Focus events (Focus, Blur).
- Hover events (HoverEnter, HoverExit).
- Form events (ValueChange, Submit).
- Gesture events (Swipe, Pinch, Rotate).
- Drag-and-drop events (DragStart, Drag, DragEnd).
- Keyboard events (KeyDown, KeyUp).
- Lifecycle events (LoadingStart, LoadingEnd).
- Custom events with string identifiers.

### `SwipeDirection` Enum

Specifies the direction of swipe gestures:

- Left, Right, Up, Down.

### `Event` Struct

The central event representation that carries all event data:

- Contains identifiers, timestamp, and event type.
- Tracks propagation phase and coordinates.
- Holds target information.
- Contains custom properties as key-value pairs.
- Carries typed payload data.
- Includes metadata about the event source.
- Provides propagation control flags.

## Core Functions and Methods

### Event Creation

- `Event::new(event_type, source)`: Creates a new event with the specified type and source.
- Specialized constructors for common events: `tap()`, `double_tap()`, `long_press()`.

### Event Configuration

- `with_position(x, y)`: Sets the event's coordinates.
- `with_target(target_id)`: Sets the target component.
- `with_property(key, value)`: Adds a custom property.
- `with_payload(payload)`: Attaches typed data.

### Event Control

- `stop_propagation()`: Prevents further propagation.
- `prevent_default()`: Prevents the default action.

### Payload Access

- `get_payload<T>()`: Safely retrieves the payload as a specific type.

### Serialization Support

The `Event` struct implements `Serialize` and `Deserialize` traits:

- Provides JSON serialization for network transport or storage.
- Handles special cases like non-serializable payloads.

## Usage Patterns

1. **Event Creation**: Events are created from input sources (mouse, touch, etc.).
2. **Event Enrichment**: Additional data is attached to events (position, target, etc.).
3. **Event Dispatch**: Events are sent to the middleware pipeline and dispatcher.
4. **Event Handling**: Components receive and process events.
5. **Propagation Control**: Handlers can control how events flow through the system.

## Integration Points

- Forms the foundation for `event_handler.rs` and `event_middleware.rs`.
- Uses types defined in `event_types.rs`.
- Consumed by the rendering system for event dispatch.
- Used by components to handle user interactions.
- Connected to the gesture recognition system.

## Example Flow

1. A user taps the screen, generating an input event.
2. The system creates a `Tap` event with the appropriate source.
3. The event is enriched with position data and a target ID.
4. The event is processed through middleware.
5. The event is dispatched to handlers through the component hierarchy.
6. Handlers respond to the event, potentially stopping propagation.

## Future Improvements

1. **Performance Optimizations**:

   - Optimize event creation for high-frequency events.
   - Implement object pooling for event instances.
   - Add support for batch event processing.

2. **Enhanced Event Model**:

   - Implement a more sophisticated phase system for event propagation.
   - Add support for capture-phase-only and bubble-phase-only handlers.
   - Implement event delegation patterns.

3. **Payload Enhancements**:

   - Add type-safe payload wrappers for common event data.
   - Implement data validation for event payloads.
   - Support for structured payloads with schema validation.

4. **Serialization Improvements**:

   - Add binary serialization for better performance.
   - Implement differential event encoding for network transport.
   - Add versioning for backward compatibility.

5. **Accessibility Support**:
   - Add specialized events for accessibility interactions.
   - Implement focus navigation events.
   - Support for screen reader events.
