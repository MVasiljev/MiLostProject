# Event Handler System

## Overview

The `event_handler.rs` file implements the event handling system for the MiLost UI framework. It provides mechanisms for registering, managing, and dispatching event handlers that respond to user interactions such as taps, gestures, focus changes, and other input events.

## Key Components

### `EventHandlerFn` Trait

A trait that defines the core functionality of an event handler:

- `call(&self, event: &mut Event) -> HandlerResult`: The primary method that processes an event and returns a result indicating how the event was handled.
- Implemented automatically for any function with the appropriate signature, allowing for easy creation of handlers.

### `HandlerResult` Enum

Represents the result of handling an event:

- `Handled`: The event was fully handled and should not be processed further.
- `Partial`: The event was partially handled but can continue to other handlers.
- `Unhandled`: The event was not handled by this handler.

### `TypedEventHandler` Struct

Represents a handler for specific event types:

- Contains handler function, optional filters, priority level, and execution constraints.
- Supports filtering by event source and limiting the number of calls.
- Tracks execution count for handlers with usage limits.

### `EventDispatcher` Struct

The central hub for event dispatching:

- Maintains registries of event handlers grouped by event type.
- Also supports global handlers that receive all events.
- Dispatches events to appropriate handlers based on event type.
- Respects event propagation control via the `is_stopped` flag.

### `ButtonEventHandler` Struct

A specialized handler collection for button components:

- Contains handlers for common button interactions (tap, double tap, long press, etc.).
- Provides a convenient interface for managing button-specific event handling.
- Maps event types to handler IDs.

## Usage Patterns

1. **Registration**: Handlers are registered with the `EventDispatcher` either for specific event types or as global handlers.
2. **Dispatch**: Events are dispatched through the dispatcher, which routes them to the appropriate handlers.
3. **Prioritization**: Handlers execute in order of priority (Critical > High > Normal > Low).
4. **Filtering**: Handlers can be filtered by event source or custom filter functions.
5. **Propagation Control**: Handlers can stop event propagation to prevent further handling.

## Integration Points

- Integrates with the `event_system.rs` through the `Event` and `EventType` structures.
- Connects to `event_types.rs` via the `EventSource` enumeration.
- Used by the renderer system to attach event handlers to UI components.
- Consumed by component implementations to define interactive behaviors.

## Example Flow

1. A UI component registers handlers for specific event types during initialization.
2. The rendering system captures user input and creates an `Event`.
3. The event is dispatched through the `EventDispatcher`.
4. Registered handlers process the event in priority order until it's fully handled or all handlers have been tried.

## Future Improvements

1. **Performance Optimizations**:

   - Consider using a more efficient data structure for handler lookup.
   - Implement handler caching for frequently triggered events.

2. **Advanced Handler Features**:

   - Support for handler composition and chaining.
   - Add debouncing and throttling capabilities.
   - Implement handler groups with shared activation/deactivation.

3. **Enhanced Typing**:

   - Create type-safe event/handler connections to reduce runtime errors.
   - Support for strongly-typed event payloads.

4. **Accessibility Improvements**:

   - Add specialized handlers for accessibility events.
   - Implement focus management for keyboard navigation.

5. **Testing Support**:
   - Add mechanisms for simulating events for testing purposes.
   - Provide event recording and playback capabilities.
