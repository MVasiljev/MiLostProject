use std::sync::{
    Arc, 
    Mutex, 
    atomic::{AtomicBool, AtomicUsize, Ordering}
};
use std::time::{Duration, Instant};
use std::collections::{VecDeque, HashMap, HashSet};

use super::event_system::{Event, EventType};
use super::event_types::{EventError, EventSource};

#[derive(Debug, Clone, PartialEq)]
pub enum MiddlewareResult {
    Continue,
    Modified,
    Stop,
    Delay(Duration),
    Retry(usize),
}

#[derive(Debug, Clone)]
pub struct EventProcessingTrace {
    pub trace_id: String,
    pub timestamps: HashMap<String, Instant>,
    pub middleware_results: Vec<(String, MiddlewareResult)>,
    pub trace_data: HashMap<String, String>,
    pub error_count: usize,
}

impl EventProcessingTrace {
    pub fn new(trace_id: String) -> Self {
        Self {
            trace_id,
            timestamps: HashMap::new(),
            middleware_results: Vec::new(),
            trace_data: HashMap::new(),
            error_count: 0,
        }
    }
    
    pub fn mark_timestamp(&mut self, key: &str) {
        self.timestamps.insert(key.to_string(), Instant::now());
    }
    
    pub fn add_data(&mut self, key: &str, value: &str) {
        self.trace_data.insert(key.to_string(), value.to_string());
    }
    
    pub fn duration_between(&self, start_key: &str, end_key: &str) -> Option<Duration> {
        let start = self.timestamps.get(start_key)?;
        let end = self.timestamps.get(end_key)?;
        Some(end.duration_since(*start))
    }
    
    pub fn add_middleware_result(&mut self, middleware_name: &str, result: MiddlewareResult) {
        self.middleware_results.push((middleware_name.to_string(), result));
    }
    
    pub fn increment_error_count(&mut self) {
        self.error_count += 1;
    }
}

pub trait EventMiddleware: Send + Sync {
    fn process(&self, event: &mut Event) -> MiddlewareResult;
    
    fn name(&self) -> &'static str;
    
    fn cleanup(&mut self) -> Result<(), EventError> {
        Ok(())
    }
    
    fn initialize(&mut self) -> Result<(), EventError> {
        Ok(())
    }
}

pub struct EventMiddlewarePipeline {
    middlewares: Vec<Arc<Mutex<dyn EventMiddleware>>>,
    is_paused: AtomicBool,
    global_event_counter: AtomicUsize,
    timeout: Duration,
    max_retries: usize,
    trace_history: Mutex<VecDeque<EventProcessingTrace>>,
    max_trace_history: usize,
}

impl EventMiddlewarePipeline {
    pub fn new(timeout: Duration) -> Self {
        Self {
            middlewares: Vec::new(),
            is_paused: AtomicBool::new(false),
            global_event_counter: AtomicUsize::new(0),
            timeout,
            max_retries: 3,
            trace_history: Mutex::new(VecDeque::new()),
            max_trace_history: 100,
        }
    }
    
    pub fn with_max_retries(mut self, max_retries: usize) -> Self {
        self.max_retries = max_retries;
        self
    }
    
    pub fn with_max_trace_history(mut self, max_history: usize) -> Self {
        self.max_trace_history = max_history;
        self
    }
    
    pub fn add_middleware<M: EventMiddleware + 'static>(&mut self, mut middleware: M) -> Result<(), EventError> {
        middleware.initialize()?;
        self.middlewares.push(Arc::new(Mutex::new(middleware)));
        Ok(())
    }
    
    pub fn pause(&self) {
        self.is_paused.store(true, Ordering::SeqCst);
    }
    
    pub fn resume(&self) {
        self.is_paused.store(false, Ordering::SeqCst);
    }
    
    pub fn is_paused(&self) -> bool {
        self.is_paused.load(Ordering::SeqCst)
    }
    
    pub fn process(&self, event: &mut Event) -> Result<MiddlewareResult, EventError> {
        if self.is_paused() {
            return Err(EventError::ValidationError(
                "Middleware pipeline is currently paused".to_string()
            ));
        }
        
        let event_counter = self.global_event_counter.fetch_add(1, Ordering::SeqCst);
        
        let mut trace = EventProcessingTrace::new(format!("event_{}", event_counter));
        trace.mark_timestamp("start");
        trace.add_data("event_type", &format!("{:?}", event.event_type));
        
        let mut current_event = event.clone();
        let mut retry_count = 0;
        
        for middleware in &self.middlewares {
            if trace.timestamps.get("start").unwrap().elapsed() > self.timeout {
                trace.increment_error_count();
                trace.add_data("error", "Event processing exceeded global timeout");
                self.store_trace(trace);
                return Err(EventError::ValidationError(
                    "Event processing exceeded global timeout".to_string()
                ));
            }
            
            let middleware_name;
            let result;
            
            {
                let mut mw = middleware.lock().map_err(|_| {
                    trace.increment_error_count();
                    trace.add_data("error", "Failed to acquire middleware lock");
                    self.store_trace(trace.clone());
                    EventError::ValidationError("Failed to acquire middleware lock".to_string())
                })?;
                
                middleware_name = mw.name().to_string();
                trace.mark_timestamp(&format!("before_{}", middleware_name));
                
                result = mw.process(&mut current_event);
                
                trace.mark_timestamp(&format!("after_{}", middleware_name));
                trace.add_middleware_result(&middleware_name, result.clone());
            }
            
            match result {
                MiddlewareResult::Continue => continue,
                MiddlewareResult::Modified => continue,
                MiddlewareResult::Stop => {
                    trace.mark_timestamp("stop");
                    trace.add_data("stopped_by", &middleware_name);
                    self.store_trace(trace);
                    return Ok(MiddlewareResult::Stop);
                },
                MiddlewareResult::Delay(duration) => {
                    trace.add_data("delay", &format!("{:?}", duration));
                    std::thread::sleep(duration);
                },
                MiddlewareResult::Retry(suggested_retry) => {
                    retry_count += 1;
                    trace.add_data("retry_count", &retry_count.to_string());
                    
                    if retry_count > self.max_retries || retry_count > suggested_retry {
                        trace.increment_error_count();
                        trace.add_data("error", "Max retry attempts exceeded");
                        self.store_trace(trace);
                        return Err(EventError::ValidationError(
                            "Max retry attempts exceeded".to_string()
                        ));
                    }
                }
            }
        }
        
        trace.mark_timestamp("end");
        self.store_trace(trace);
        
        *event = current_event;
        
        Ok(MiddlewareResult::Continue)
    }
    
    fn store_trace(&self, trace: EventProcessingTrace) {
        let mut history = self.trace_history.lock().unwrap();
        history.push_back(trace);
        
        while history.len() > self.max_trace_history {
            history.pop_front();
        }
    }
    
    pub fn get_event_trace(&self, trace_id: &str) -> Option<EventProcessingTrace> {
        let history = self.trace_history.lock().unwrap();
        history.iter()
            .find(|trace| trace.trace_id == trace_id)
            .cloned()
    }
    
    pub fn clear_middlewares(&mut self) {
        for middleware in &self.middlewares {
            if let Ok(mut mw) = middleware.lock() {
                let _ = mw.cleanup();
            }
        }
        self.middlewares.clear();
    }
    
    pub fn middleware_names(&self) -> Vec<String> {
        self.middlewares.iter()
            .filter_map(|mw| {
                mw.lock().ok().map(|mw| mw.name().to_string())
            })
            .collect()
    }
}

pub mod middlewares {
    use super::*;
    
    pub struct LoggingMiddleware {
        log_level: LogLevel,
        custom_logger: Option<Box<dyn Fn(String) + Send + Sync>>,
        include_metadata: bool,
    }
    
    #[derive(Debug, PartialEq, Clone, Copy)]
    pub enum LogLevel {
        Debug,
        Info,
        Warn,
        Error,
        Trace,
    }
    
    impl LoggingMiddleware {
        pub fn new(log_level: LogLevel) -> Self {
            Self { 
                log_level, 
                custom_logger: None,
                include_metadata: false,
            }
        }
        
        pub fn with_custom_logger(
            mut self, 
            logger: impl Fn(String) + Send + Sync + 'static
        ) -> Self {
            self.custom_logger = Some(Box::new(logger));
            self
        }
        
        pub fn with_metadata(mut self, include_metadata: bool) -> Self {
            self.include_metadata = include_metadata;
            self
        }
        
        fn log(&self, message: String) {
            if let Some(custom_logger) = &self.custom_logger {
                custom_logger(message);
            } else {
                match self.log_level {
                    LogLevel::Debug => println!("DEBUG: {}", message),
                    LogLevel::Info => println!("INFO: {}", message),
                    LogLevel::Warn => println!("WARN: {}", message),
                    LogLevel::Error => println!("ERROR: {}", message),
                    LogLevel::Trace => println!("TRACE: {}", message),
                }
            }
        }
    }
    
    impl EventMiddleware for LoggingMiddleware {
        fn process(&self, event: &mut Event) -> MiddlewareResult {
            match self.log_level {
                LogLevel::Debug => {
                    self.log(format!(
                        "Event Debug: {:?} at {:?} from {:?}", 
                        event.event_type, 
                        event.metadata.timestamp,
                        event.metadata.source
                    ));
                },
                LogLevel::Info => {
                    self.log(format!(
                        "Event Info: {:?} target:{:?}", 
                        event.event_type, 
                        event.target_id
                    ));
                },
                LogLevel::Trace => {
                    if self.include_metadata {
                        self.log(format!(
                            "Event Trace: Full Event {:?}, Metadata {:?}", 
                            event.event_type, 
                            event.metadata
                        ));
                    } else {
                        self.log(format!(
                            "Event Trace: {:?} at {:?}", 
                            event.event_type, 
                            event.timestamp
                        ));
                    }
                },
                _ => {}
            }
            
            MiddlewareResult::Continue
        }
        
        fn name(&self) -> &'static str {
            "LoggingMiddleware"
        }
    }
    
    pub struct RateLimitMiddleware {
        max_events_per_window: usize,
        window_duration: Duration,
        event_queue: Mutex<VecDeque<Instant>>,
        enforcement_mode: RateLimitMode,
        event_type_filters: Option<HashSet<EventType>>,
    }
    
    #[derive(Debug, Clone, Copy)]
    pub enum RateLimitMode {
        Drop,
        Queue,
        Delay,
        Throttle,
    }
    
    impl RateLimitMiddleware {
        pub fn new(
            max_events: usize, 
            window: Duration, 
            mode: RateLimitMode
        ) -> Self {
            Self {
                max_events_per_window: max_events,
                window_duration: window,
                event_queue: Mutex::new(VecDeque::new()),
                enforcement_mode: mode,
                event_type_filters: None,
            }
        }
        
        pub fn with_event_types(mut self, event_types: &[EventType]) -> Self {
            self.event_type_filters = Some(event_types.iter().cloned().collect());
            self
        }
    }
    
    impl EventMiddleware for RateLimitMiddleware {
        fn process(&self, event: &mut Event) -> MiddlewareResult {
            if let Some(filters) = &self.event_type_filters {
                if !filters.contains(&event.event_type) {
                    return MiddlewareResult::Continue;
                }
            }
            
            let now = Instant::now();
            let mut queue = self.event_queue.lock().unwrap();
            
            queue.retain(|&timestamp| now.duration_since(timestamp) <= self.window_duration);
            
            if queue.len() >= self.max_events_per_window {
                match self.enforcement_mode {
                    RateLimitMode::Drop => return MiddlewareResult::Stop,
                    RateLimitMode::Queue => {
                        return MiddlewareResult::Delay(Duration::from_millis(100));
                    },
                    RateLimitMode::Delay => {
                        return MiddlewareResult::Delay(
                            Duration::from_millis(50 * (queue.len() as u64))
                        );
                    },
                    RateLimitMode::Throttle => {
                        return MiddlewareResult::Retry(queue.len());
                    }
                }
            }
            
            queue.push_back(now);
            
            MiddlewareResult::Continue
        }
        
        fn name(&self) -> &'static str {
            "RateLimitMiddleware"
        }
    }
    
    pub struct FilterMiddleware {
        filters: Vec<Box<dyn Fn(&Event) -> bool + Send + Sync>>,
        rejection_logger: Option<Box<dyn Fn(&Event) + Send + Sync>>,
        rejection_reason: Mutex<Option<String>>,
    }
    
    impl FilterMiddleware {
        pub fn new() -> Self {
            Self {
                filters: Vec::new(),
                rejection_logger: None,
                rejection_reason: Mutex::new(None),
            }
        }
        
        pub fn add_filter<F>(mut self, filter: F) -> Self 
        where 
            F: Fn(&Event) -> bool + Send + Sync + 'static 
        {
            self.filters.push(Box::new(filter));
            self
        }
        
        pub fn with_rejection_logger(
            mut self, 
            logger: impl Fn(&Event) + Send + Sync + 'static
        ) -> Self {
            self.rejection_logger = Some(Box::new(logger));
            self
        }
        
        pub fn allow_sources(sources: &[EventSource]) -> Self {
            let sources_set: std::collections::HashSet<_> = sources.iter().cloned().collect();
            Self::new().add_filter(move |event| {
                sources_set.contains(&event.metadata.source)
            })
        }
        
        pub fn block_event_types(blocked_types: &[EventType]) -> Self {
            let blocked_set: std::collections::HashSet<_> = blocked_types.iter().cloned().collect();
            Self::new().add_filter(move |event| {
                !blocked_set.contains(&event.event_type)
            })
        }
        
        pub fn only_event_types(allowed_types: &[EventType]) -> Self {
            let allowed_set: std::collections::HashSet<_> = allowed_types.iter().cloned().collect();
            Self::new().add_filter(move |event| {
                allowed_set.contains(&event.event_type)
            })
        }
        
        pub fn get_last_rejection_reason(&self) -> Option<String> {
            self.rejection_reason.lock().unwrap().clone()
        }
    }
    
    impl EventMiddleware for FilterMiddleware {
        fn process(&self, event: &mut Event) -> MiddlewareResult {
            for (i, filter) in self.filters.iter().enumerate() {
                if !filter(event) {
                    let reason = format!("Rejected by filter {}", i);
                    *self.rejection_reason.lock().unwrap() = Some(reason);
                    
                    if let Some(logger) = &self.rejection_logger {
                        logger(event);
                    }
                    return MiddlewareResult::Stop;
                }
            }
            
            *self.rejection_reason.lock().unwrap() = None;
            MiddlewareResult::Continue
        }
        
        fn name(&self) -> &'static str {
            "FilterMiddleware"
        }
    }
    
    pub struct EventTransformerMiddleware {
        transformers: Vec<Box<dyn Fn(&mut Event) -> bool + Send + Sync>>,
    }
    
    impl EventTransformerMiddleware {
        pub fn new() -> Self {
            Self {
                transformers: Vec::new(),
            }
        }
        
        pub fn add_transformer<F>(mut self, transformer: F) -> Self 
        where 
            F: Fn(&mut Event) -> bool + Send + Sync + 'static 
        {
            self.transformers.push(Box::new(transformer));
            self
        }
    }
    
    impl EventMiddleware for EventTransformerMiddleware {
        fn process(&self, event: &mut Event) -> MiddlewareResult {
            let mut modified = false;
            
            for transformer in &self.transformers {
                if transformer(event) {
                    modified = true;
                }
            }
            
            if modified {
                MiddlewareResult::Modified
            } else {
                MiddlewareResult::Continue
            }
        }
        
        fn name(&self) -> &'static str {
            "EventTransformerMiddleware"
        }
    }
    
    pub struct EventDebugMiddleware {
        enabled: AtomicBool,
        debug_log: Arc<Mutex<Vec<String>>>,
        max_logs: usize,
    }
    
    impl EventDebugMiddleware {
        pub fn new(max_logs: usize) -> Self {
            Self {
                enabled: AtomicBool::new(true),
                debug_log: Arc::new(Mutex::new(Vec::new())),
                max_logs,
            }
        }
        
        pub fn enable(&self) {
            self.enabled.store(true, Ordering::SeqCst);
        }
        
        pub fn disable(&self) {
            self.enabled.store(false, Ordering::SeqCst);
        }
        
        pub fn is_enabled(&self) -> bool {
            self.enabled.load(Ordering::SeqCst)
        }
        
        pub fn get_logs(&self) -> Vec<String> {
            self.debug_log.lock().unwrap().clone()
        }
        
        pub fn clear_logs(&self) {
            self.debug_log.lock().unwrap().clear();
        }
        
        fn add_log(&self, message: String) {
            let mut logs = self.debug_log.lock().unwrap();
            logs.push(message);
            
            while logs.len() > self.max_logs {
                logs.remove(0);
            }
        }
    }
    
    impl EventMiddleware for EventDebugMiddleware {
        fn process(&self, event: &mut Event) -> MiddlewareResult {
            if self.is_enabled() {
                let log_entry = format!(
                    "[{}] {:?} from {:?} with target {:?}", 
                    event.id,
                    event.event_type,
                    event.metadata.source,
                    event.target_id
                );
                
                self.add_log(log_entry);
            }
            
            MiddlewareResult::Continue
        }
        
        fn name(&self) -> &'static str {
            "EventDebugMiddleware"
        }
    }
}