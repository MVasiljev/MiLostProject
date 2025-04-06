use std::any::Any;
use std::collections::HashMap;
use std::fmt::{self, Debug, Display};
use std::hash::{Hash, Hasher};
use std::time::{SystemTime, UNIX_EPOCH, Duration, Instant};
use serde::{Serialize, Deserialize, ser::{Serializer, SerializeStruct}, de::{self, Deserializer, Visitor}};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub enum EventError {
    SerializationError(String),
    DeserializationError(String),
    PayloadError(String),
    ValidationError(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EventSource {
    Mouse {
        button: Option<MouseButton>,
    },
    Touch {
        multi_touch: bool,
        pressure: Option<f32>,
    },
    Pointer {
        pointer_type: PointerType,
    },
    Keyboard {
        is_virtual: bool,
    },
    GamePad {
        connection_type: GamePadConnectionType,
    },
    VirtualReality {
        tracking_space: TrackingSpace,
    },
    Custom {
        category: String,
        subcategory: Option<String>,
    },
}

impl Eq for EventSource {}

impl Hash for EventSource {
    fn hash<H: Hasher>(&self, state: &mut H) {
        match self {
            Self::Mouse { button } => {
                0u8.hash(state);
                button.hash(state);
            },
            Self::Touch { multi_touch, pressure } => {
                1u8.hash(state);
                multi_touch.hash(state);
                
                if let Some(p) = pressure {
                    p.to_bits().hash(state);
                } else {
                    Option::<u32>::None.hash(state);
                }
            },
            Self::Pointer { pointer_type } => {
                2u8.hash(state);
                pointer_type.hash(state);
            },
            Self::Keyboard { is_virtual } => {
                3u8.hash(state);
                is_virtual.hash(state);
            },
            Self::GamePad { connection_type } => {
                4u8.hash(state);
                connection_type.hash(state);
            },
            Self::VirtualReality { tracking_space } => {
                5u8.hash(state);
                tracking_space.hash(state);
            },
            Self::Custom { category, subcategory } => {
                6u8.hash(state);
                category.hash(state);
                subcategory.hash(state);
            },
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum MouseButton {
    Left,
    Right,
    Middle,
    Additional(u8),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum PointerType {
    Mouse,
    Pen,
    Touch,
    Eraser,
    Camera,
    Custom(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum GamePadConnectionType {
    Wired,
    Bluetooth,
    Wireless,
    Custom(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum TrackingSpace {
    Standing,
    Seated,
    RoomScale,
    Custom(String),
}

#[derive(Debug, Clone)]
pub struct EventMetadata {
    pub id: String,
    pub timestamp: Instant,
    pub system_timestamp: u128,
    pub source: EventSource,
    pub device_id: Option<String>,
    pub context: HashMap<String, String>,
    pub trace_id: Option<String>,
}

impl EventMetadata {
    pub fn new(source: EventSource) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            timestamp: Instant::now(),
            system_timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or(0),
            source,
            device_id: None,
            context: HashMap::new(),
            trace_id: None,
        }
    }
    
    pub fn with_trace_id(mut self, trace_id: String) -> Self {
        self.trace_id = Some(trace_id);
        self
    }
    
    pub fn add_performance_context(&mut self, key: &str, value: &str) {
        self.context.insert(format!("perf_{}", key), value.to_string());
    }
    
    pub fn elapsed(&self) -> Duration {
        self.timestamp.elapsed()
    }
}

impl Serialize for EventMetadata {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("EventMetadata", 7)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("system_timestamp", &self.system_timestamp)?;
        state.serialize_field("source", &self.source)?;
        state.serialize_field("device_id", &self.device_id)?;
        state.serialize_field("context", &self.context)?;
        state.serialize_field("trace_id", &self.trace_id)?;
        state.end()
    }
}

impl<'de> Deserialize<'de> for EventMetadata {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        enum Field { 
            Id, 
            SystemTimestamp, 
            Source, 
            DeviceId, 
            Context, 
            TraceId 
        }

        impl<'de> Deserialize<'de> for Field {
            fn deserialize<D>(deserializer: D) -> Result<Field, D::Error>
            where D: Deserializer<'de> {
                struct FieldVisitor;

                impl<'de> Visitor<'de> for FieldVisitor {
                    type Value = Field;

                    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                        formatter.write_str("`id`, `system_timestamp`, `source`, `device_id`, `context`, or `trace_id`")
                    }

                    fn visit_str<E>(self, value: &str) -> Result<Field, E>
                    where E: de::Error, {
                        match value {
                            "id" => Ok(Field::Id),
                            "system_timestamp" => Ok(Field::SystemTimestamp),
                            "source" => Ok(Field::Source),
                            "device_id" => Ok(Field::DeviceId),
                            "context" => Ok(Field::Context),
                            "trace_id" => Ok(Field::TraceId),
                            _ => Err(de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }

                deserializer.deserialize_identifier(FieldVisitor)
            }
        }

        struct EventMetadataVisitor;

        impl<'de> Visitor<'de> for EventMetadataVisitor {
            type Value = EventMetadata;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("struct EventMetadata")
            }

            fn visit_map<V>(self, mut map: V) -> Result<EventMetadata, V::Error>
            where V: de::MapAccess<'de>, {
                let mut id: Option<String> = None;
                let mut system_timestamp: Option<u128> = None;
                let mut source: Option<EventSource> = None;
                let mut device_id: Option<String> = None;
                let mut context: Option<HashMap<String, String>> = None;
                let mut trace_id: Option<String> = None;

                while let Some(key) = map.next_key()? {
                    match key {
                        Field::Id => {
                            if id.is_some() {
                                return Err(de::Error::duplicate_field("id"));
                            }
                            id = Some(map.next_value()?);
                        }
                        Field::SystemTimestamp => {
                            if system_timestamp.is_some() {
                                return Err(de::Error::duplicate_field("system_timestamp"));
                            }
                            system_timestamp = Some(map.next_value()?);
                        }
                        Field::Source => {
                            if source.is_some() {
                                return Err(de::Error::duplicate_field("source"));
                            }
                            source = Some(map.next_value()?);
                        }
                        Field::DeviceId => {
                            if device_id.is_some() {
                                return Err(de::Error::duplicate_field("device_id"));
                            }
                            device_id = Some(map.next_value()?);
                        }
                        Field::Context => {
                            if context.is_some() {
                                return Err(de::Error::duplicate_field("context"));
                            }
                            context = Some(map.next_value()?);
                        }
                        Field::TraceId => {
                            if trace_id.is_some() {
                                return Err(de::Error::duplicate_field("trace_id"));
                            }
                            trace_id = Some(map.next_value()?);
                        }
                    }
                }

                let source = source.ok_or_else(|| de::Error::missing_field("source"))?;
                let mut metadata = EventMetadata::new(source);
                
                if let Some(id) = id {
                    metadata.id = id;
                }
                metadata.system_timestamp = system_timestamp.unwrap_or(0);
                metadata.device_id = device_id;
                metadata.context = context.unwrap_or_default();
                metadata.trace_id = trace_id;

                Ok(metadata)
            }
        }

        const FIELDS: &'static [&'static str] = &[
            "id", 
            "system_timestamp", 
            "source", 
            "device_id", 
            "context", 
            "trace_id"
        ];
        
        deserializer.deserialize_struct("EventMetadata", FIELDS, EventMetadataVisitor)
    }
}

pub trait SafeEventPayload: Any + Send + Sync + Debug {
    fn as_any(&self) -> &dyn Any;
    
    fn clone_box(&self) -> Box<dyn SafeEventPayload>;
    
    fn validate(&self) -> Result<(), EventError>;
}

impl Clone for Box<dyn SafeEventPayload> {
    fn clone(&self) -> Self {
        self.clone_box()
    }
}

pub struct Payload<T: Clone + Debug + Send + Sync + 'static> {
    pub value: T,
    #[allow(unused)]
    pub validation_rules: Option<Box<dyn Fn(&T) -> Result<(), EventError> + Send + Sync>>,
}

impl<T: Clone + Debug + Send + Sync + 'static> Debug for Payload<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Payload")
            .field("value", &self.value)
            .field("validation_rules", &format_args!("{}", if self.validation_rules.is_some() { "Some(Fn)" } else { "None" }))
            .finish()
    }
}

impl<T: Clone + Debug + Send + Sync + 'static> Clone for Payload<T> {
    fn clone(&self) -> Self {
        Self {
            value: self.value.clone(),
            validation_rules: None,
        }
    }
}

impl<T: Clone + Debug + Send + Sync + 'static> SafeEventPayload for Payload<T> {
    fn as_any(&self) -> &dyn Any {
        self
    }
    
    fn clone_box(&self) -> Box<dyn SafeEventPayload> {
        Box::new(self.clone())
    }
    
    fn validate(&self) -> Result<(), EventError> {
        if let Some(validator) = &self.validation_rules {
            validator(&self.value)
        } else {
            Ok(())
        }
    }
}

impl<T: Clone + Debug + Send + Sync + 'static> Payload<T> {
    pub fn new(value: T) -> Self {
        Self { 
            value, 
            validation_rules: None 
        }
    }
    
    pub fn with_validation(
        mut self, 
        validator: impl Fn(&T) -> Result<(), EventError> + Send + Sync + 'static
    ) -> Self {
        self.validation_rules = Some(Box::new(validator));
        self
    }
}