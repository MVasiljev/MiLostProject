# Event Types System

## Overview

The `event_types.rs` file defines the foundational structures for event sources, metadata, and payloads in the MiLost UI framework. It provides type-safe representations for the origin of events, contextual information, and strongly-typed event data. This module forms the basis for the event classification and categorization system.

## Key Components

### Error Handling

#### `EventError` Enum

Represents errors that can occur during event processing:

- `SerializationError`: Errors during event serialization.
- `DeserializationError`: Errors during event deserialization.
- `PayloadError`: Errors related to event payloads.
- `ValidationError`: Errors from validation failures.

### Event Sources

#### `EventSource` Enum

Describes the origin of an event with device-specific details:

- `Mouse`: Mouse input with optional button information.
- `Touch`: Touch input with multi-touch and pressure data.
- `Pointer`: Generic pointing device with type information.
- `Keyboard`: Keyboard input with virtual keyboard flag.
- `GamePad`: Game controller input with connection type.
- `VirtualReality`: VR input with tracking space information.
- `Custom`: Allows for custom event sources with categories.

#### Supporting Enums

- `MouseButton`: Left, Right, Middle, or Additional buttons.
- `PointerType`: Mouse, Pen, Touch, Eraser, Camera, or Custom.
- `GamePadConnectionType`: Wired, Bluetooth, Wireless, or Custom.
- `TrackingSpace`: Standing, Seated, RoomScale, or Custom.

### Event Metadata

#### `EventMetadata` Struct

Contains contextual information about an event:

- Unique identifier and timestamps.
- Source information detailing event origin.
- Device identifier for multi-device scenarios.
- Contextual key-value pairs for additional data.
- Trace ID for correlation across processing stages.

**Methods**:

- `new(source)`: Creates metadata with the specified source.
- `with_trace_id(trace_id)`: Adds a trace ID for correlation.
- `add_performance_context(key, value)`: Adds performance-related contextual data.
- `elapsed()`: Calculates time elapsed since the event occurred.

### Event Payloads

#### `SafeEventPayload` Trait

A trait for type-safe event data that can be validated:

- `as_any(&self) -> &dyn Any`: Allows downcasting to concrete types.
- `clone_box(&self) -> Box<dyn SafeEventPayload>`: Provides cloning support.
- `validate(&self) -> Result<(), EventError>`: Validates payload data.

#### `Payload<T>` Struct

A generic implementation of `SafeEventPayload` for any type:

- Holds a value of type `T`.
- Supports optional validation rules.
- Provides methods for creating and validating payloads.

## Serialization Support

The module implements serialization/deserialization for event structures:

- Custom `Serialize` implementation for `EventMetadata`.
- Custom `Deserialize` implementation for `EventMetadata`.
- Special handling for non-serializable components.

## Usage Patterns

1. **Event Source Classification**: Events are classified by their source device.
2. **Metadata Enrichment**: Events are enriched with contextual information.
3. **Payload Attachment**: Strongly-typed data is attached to events.
4. **Payload Validation**: Event data is validated before processing.
5. **Error Handling**: Structured error handling for event processing failures.

## Integration Points

- Used extensively by `event_system.rs` for event representation.
- Provides source information for event filtering in `event_middleware.rs`.
- Consumed by event handlers for type-safe data access.
- Used by the input system to classify and enrich events.
- Connected to middleware for event validation.

## Example Flow

1. An input device generates raw input data.
2. The system creates an appropriate `EventSource` with device details.
3. Event metadata is generated with the source and timing information.
4. Payloads are created with typed data relevant to the event.
5. Validation rules ensure payload correctness.
6. The event is processed through the system with source-aware handling.

## Future Improvements

1. **Enhanced Source Classification**:

   - Add support for emerging input devices (brain interfaces, eye tracking, etc.).
   - Implement more detailed source classification for advanced interactions.
   - Add device capability discovery through source information.

2. **Metadata Enhancements**:

   - Add user context information for multi-user scenarios.
   - Implement device state snapshots for more accurate event reproduction.
   - Add support for environmental context (lighting, noise, etc.).

3. **Payload Improvements**:

   - Create a library of standard payload types for common interactions.
   - Implement serialization support for complex payload types.
   - Add schema-based validation for structured payloads.

4. **Performance Optimizations**:

   - Optimize metadata structure for minimal memory usage.
   - Implement payload pooling for frequently used data types.
   - Add binary serialization formats for efficient transport.

5. **Security Enhancements**:
   - Add cryptographic verification for event sources.
   - Implement payload sanitization for untrusted events.
   - Add support for secure event channels with encryption.
