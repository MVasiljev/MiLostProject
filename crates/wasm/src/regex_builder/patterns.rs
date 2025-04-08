pub enum Pattern {
    Email,
    Url,
    IpAddress,
    PhoneNumber,
    Date,
    Time,
    JsonKey,
    JsonString,
    JsonNumber,
    JsonObject,
    JsonArray,
}

impl Pattern {
    pub fn to_regex(&self) -> String {
        match self {
            Pattern::Email => r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}".to_string(),
            Pattern::Url => r"https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)".to_string(),
            Pattern::IpAddress => r"(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)".to_string(),
            Pattern::PhoneNumber => r"(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})".to_string(),
            Pattern::Date => r"(?:\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}\.\d{2}\.\d{4})".to_string(),
            Pattern::Time => r"(?:\d{2}:\d{2}(?::\d{2})?)".to_string(),
            Pattern::JsonKey => r#""([^"]+)"\s*:"#.to_string(),
            Pattern::JsonString => r#""([^"]*)""#.to_string(),
            Pattern::JsonNumber => r"(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)".to_string(),
            Pattern::JsonObject => r"\{(?:[^{}]|(?R))*\}".to_string(),
            Pattern::JsonArray => r"\[(?:[^\[\]]|(?R))*\]".to_string(),
        }
    }
}