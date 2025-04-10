pub mod event_handler;
pub mod event_middleware;
pub mod event_system;   
pub mod event_types;
pub mod gesture_recognition;
pub mod registration;

pub use event_handler::{
    EventHandlerFn,
    HandlerResult,
    TypedEventHandler,
    HandlerPriority,
    ButtonEventHandler,
    EventDispatcher,
};

pub use event_middleware::{
    MiddlewareResult,
    EventProcessingTrace,
    EventMiddleware,
    EventMiddlewarePipeline,
    middlewares,
};

pub use event_system::{
    EventPhase,
    EventPayload,
    GenericPayload,
    EventType,
    SwipeDirection,
    Event,
};

pub use event_types::{
    EventError,
    EventSource,
    MouseButton,
    PointerType,
    GamePadConnectionType,
    TrackingSpace,
    EventMetadata,
    SafeEventPayload,
    Payload,
};

pub use gesture_recognition::{
    GestureRecognitionConfig,
    GesturePayload,
    GestureRecognizer,
};

pub use registration::{
    event_registry,
    register_handlers_from_node,
    process_event,
    register_handler,
    register_global_handler,
    clear_handlers,
    helpers as event_helpers,
};