use std::time::{Duration, Instant};
use std::collections::{VecDeque, HashMap};
use std::sync::atomic::{AtomicUsize, Ordering};

use super::event_system::{Event, EventType, EventPayload, SwipeDirection};

#[derive(Clone)]
pub struct GestureRecognitionConfig {
    pub tap_max_duration: Duration,
    pub tap_max_distance: f32,
    pub double_tap_max_interval: Duration,
    
    pub swipe_min_distance: f32,
    pub swipe_max_duration: Duration,
    pub swipe_min_velocity: f32,
    pub multi_swipe_cooldown: Duration,
    
    pub long_press_min_duration: Duration,
    pub long_press_max_distance: f32,
    
    pub pinch_min_scale_change: f32,
    pub rotate_min_angle: f32,
}

impl Default for GestureRecognitionConfig {
    fn default() -> Self {
        Self {
            tap_max_duration: Duration::from_millis(250),
            tap_max_distance: 10.0,
            double_tap_max_interval: Duration::from_millis(300),
            
            swipe_min_distance: 50.0,
            swipe_max_duration: Duration::from_millis(500),
            swipe_min_velocity: 0.5,
            multi_swipe_cooldown: Duration::from_millis(200),
            
            long_press_min_duration: Duration::from_millis(500),
            long_press_max_distance: 20.0,
            
            pinch_min_scale_change: 0.1,
            rotate_min_angle: 15.0,
        }
    }
}

#[derive(Clone, Debug)]
pub struct GesturePayload {
    pub start_position: (f32, f32),
    pub end_position: (f32, f32),
    pub duration: Duration,
    pub velocity: f32,
    pub additional_details: HashMap<String, String>,
}

impl EventPayload for GesturePayload {
    fn as_any(&self) -> &dyn std::any::Any {
        self
    }
    
    fn clone_box(&self) -> Box<dyn EventPayload> {
        Box::new(self.clone())
    }
}

pub struct GestureRecognizer {
    config: GestureRecognitionConfig,
    touch_history: VecDeque<(Instant, Event)>,
    max_history_size: usize,
    tap_count: AtomicUsize,
    last_tap_time: Option<Instant>,
    multi_swipe_tracker: HashMap<SwipeDirection, Instant>,
}

impl GestureRecognizer {
    pub fn new(config: Option<GestureRecognitionConfig>) -> Self {
        Self {
            config: config.unwrap_or_default(),
            touch_history: VecDeque::new(),
            max_history_size: 20,
            tap_count: AtomicUsize::new(0),
            last_tap_time: None,
            multi_swipe_tracker: HashMap::new(),
        }
    }
    
    pub fn process_event(&mut self, event: Event) -> Option<Event> {
        self.update_touch_history(event.clone());
        
        match event.event_type {
            EventType::TouchStart => self.handle_touch_start(event),
            EventType::TouchMove => self.handle_touch_move(event),
            EventType::TouchEnd => self.handle_touch_end(event),
            _ => None
        }
    }
    
    fn update_touch_history(&mut self, event: Event) {
        let now = Instant::now();
        self.touch_history.push_back((now, event));
        
        while self.touch_history.len() > self.max_history_size {
            self.touch_history.pop_front();
        }
    }
    
    fn handle_touch_start(&mut self, event: Event) -> Option<Event> {
        None
    }
    
    fn handle_touch_move(&mut self, event: Event) -> Option<Event> {
        None
    }
    
    fn handle_touch_end(&mut self, event: Event) -> Option<Event> {
        if let Some(tap_event) = self.detect_tap() {
            return Some(tap_event);
        }
        
        if let Some(long_press_event) = self.detect_long_press() {
            return Some(long_press_event);
        }
        
        if let Some(swipe_event) = self.detect_swipe() {
            return Some(swipe_event);
        }
        
        None
    }
    
    pub fn detect_tap(&mut self) -> Option<Event> {
        if self.touch_history.len() < 2 {
            return None;
        }
        
        let (start_time, start_event) = &self.touch_history[0];
        let (end_time, end_event) = self.touch_history.back()?;
        
        let duration = end_time.duration_since(*start_time);
        let start_pos = start_event.position?;
        let end_pos = end_event.position?;
        
        let distance = ((start_pos.0 - end_pos.0).powi(2) + (start_pos.1 - end_pos.1).powi(2)).sqrt();
        
        if duration <= self.config.tap_max_duration && distance <= self.config.tap_max_distance {
            let current_time = Instant::now();
            let tap_count = self.tap_count.fetch_add(1, Ordering::SeqCst) + 1;
            
            let event_type = if tap_count > 1 && 
               self.last_tap_time.map_or(false, |last| 
                   current_time.duration_since(last) <= self.config.double_tap_max_interval
               ) {
                EventType::DoubleTap
            } else {
                EventType::Tap
            };
            
            self.last_tap_time = Some(current_time);
            
            let mut tap_event = Event::new(event_type, end_event.metadata.source.clone())
                .with_position(end_pos.0, end_pos.1);
                
            let gesture_payload = GesturePayload {
                start_position: start_pos,
                end_position: end_pos,
                duration,
                velocity: 0.0,
                additional_details: HashMap::from([
                    ("tap_count".to_string(), tap_count.to_string())
                ]),
            };
            
            tap_event = tap_event.with_payload(gesture_payload);
            
            if let Some(target_id) = &end_event.target_id {
                tap_event = tap_event.with_target(target_id.clone());
            }
            
            return Some(tap_event);
        }
        
        None
    }
    
    fn detect_long_press(&self) -> Option<Event> {
        if self.touch_history.len() < 2 {
            return None;
        }
        
        let (start_time, start_event) = &self.touch_history[0];
        let (end_time, end_event) = self.touch_history.back()?;
        
        let duration = end_time.duration_since(*start_time);
        let start_pos = start_event.position?;
        let end_pos = end_event.position?;
        
        let distance = ((start_pos.0 - end_pos.0).powi(2) + (start_pos.1 - end_pos.1).powi(2)).sqrt();
        
        if duration >= self.config.long_press_min_duration && 
           distance <= self.config.long_press_max_distance {
            
            let mut long_press_event = Event::new(
                EventType::LongPress, 
                end_event.metadata.source.clone()
            )
            .with_position(end_pos.0, end_pos.1);
            
            let gesture_payload = GesturePayload {
                start_position: start_pos,
                end_position: end_pos,
                duration,
                velocity: 0.0,
                additional_details: HashMap::from([
                    ("press_duration_ms".to_string(), duration.as_millis().to_string())
                ]),
            };
            
            long_press_event = long_press_event.with_payload(gesture_payload);
            
            if let Some(target_id) = &end_event.target_id {
                long_press_event = long_press_event.with_target(target_id.clone());
            }
            
            return Some(long_press_event);
        }
        
        None
    }
    
    fn detect_swipe(&mut self) -> Option<Event> {
        if self.touch_history.len() < 2 {
            return None;
        }
        
        let (start_time, start_event) = &self.touch_history[0];
        let (end_time, end_event) = self.touch_history.back()?;
        
        let duration = end_time.duration_since(*start_time);
        let start_pos = start_event.position?;
        let end_pos = end_event.position?;
        
        let dx = end_pos.0 - start_pos.0;
        let dy = end_pos.1 - start_pos.1;
        let distance = (dx.powi(2) + dy.powi(2)).sqrt();
        let velocity = distance / duration.as_secs_f32();
        
        if duration <= self.config.swipe_max_duration && 
           distance >= self.config.swipe_min_distance && 
           velocity >= self.config.swipe_min_velocity {
            
            let direction = if dx.abs() > dy.abs() {
                if dx > 0.0 { SwipeDirection::Right } else { SwipeDirection::Left }
            } else {
                if dy > 0.0 { SwipeDirection::Down } else { SwipeDirection::Up }
            };
            
            let now = Instant::now();
            
            let is_multi_swipe = match self.multi_swipe_tracker.get(&direction) {
                Some(last_swipe_time) => now.duration_since(*last_swipe_time) <= self.config.multi_swipe_cooldown,
                None => false
            };
            
            self.multi_swipe_tracker.insert(direction.clone(), now);
            
            let mut swipe_event = Event::new(
                EventType::Swipe(direction),
                end_event.metadata.source.clone()
            )
            .with_position(end_pos.0, end_pos.1);
            
            let gesture_payload = GesturePayload {
                start_position: start_pos,
                end_position: end_pos,
                duration,
                velocity,
                additional_details: HashMap::from([
                    ("is_multi_swipe".to_string(), is_multi_swipe.to_string())
                ]),
            };
            
            swipe_event = swipe_event.with_payload(gesture_payload);
            
            if let Some(target_id) = &end_event.target_id {
                swipe_event = swipe_event.with_target(target_id.clone());
            }
            
            return Some(swipe_event);
        }
        
        None
    }
}