
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Rect {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}

impl Rect {
    pub fn new(x: f32, y: f32, width: f32, height: f32) -> Self {
        Self { x, y, width, height }
    }

    pub fn zero() -> Self {
        Self::new(0.0, 0.0, 0.0, 0.0)
    }

    pub fn from_size(width: f32, height: f32) -> Self {
        Self::new(0.0, 0.0, width, height)
    }
    
    pub fn right(&self) -> f32 {
        self.x + self.width
    }
    
    pub fn bottom(&self) -> f32 {
        self.y + self.height
    }
    
    pub fn center(&self) -> Point {
        Point::new(self.x + self.width / 2.0, self.y + self.height / 2.0)
    }
    
    pub fn contains(&self, point: Point) -> bool {
        point.x >= self.x && 
        point.x <= self.right() && 
        point.y >= self.y && 
        point.y <= self.bottom()
    }
    
    pub fn inset(&self, amount: f32) -> Self {
        Self::new(
            self.x + amount,
            self.y + amount,
            (self.width - amount * 2.0).max(0.0),
            (self.height - amount * 2.0).max(0.0),
        )
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Size {
    pub width: f32,
    pub height: f32,
}

impl Size {
    pub fn new(width: f32, height: f32) -> Self {
        Self { width, height }
    }

    pub fn zero() -> Self {
        Self::new(0.0, 0.0)
    }
    
    pub fn square(size: f32) -> Self {
        Self::new(size, size)
    }
    
    pub fn is_empty(&self) -> bool {
        self.width <= 0.0 || self.height <= 0.0
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Point {
    pub x: f32,
    pub y: f32,
}

impl Point {
    pub fn new(x: f32, y: f32) -> Self {
        Self { x, y }
    }

    pub fn zero() -> Self {
        Self::new(0.0, 0.0)
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct EdgeInsets {
    pub top: f32,
    pub right: f32,
    pub bottom: f32,
    pub left: f32,
}

impl EdgeInsets {
    pub fn new(top: f32, right: f32, bottom: f32, left: f32) -> Self {
        Self { top, right, bottom, left }
    }
    
    pub fn all(value: f32) -> Self {
        Self::new(value, value, value, value)
    }
    
    pub fn symmetric(horizontal: f32, vertical: f32) -> Self {
        Self::new(vertical, horizontal, vertical, horizontal)
    }
    
    pub fn horizontal(value: f32) -> Self {
        Self::new(0.0, value, 0.0, value)
    }
    
    pub fn vertical(value: f32) -> Self {
        Self::new(value, 0.0, value, 0.0)
    }
    
    pub fn zero() -> Self {
        Self::all(0.0)
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum Alignment {
    TopLeading,
    Top,
    TopTrailing,
    Leading,
    Center,
    Trailing,
    BottomLeading,
    Bottom,
    BottomTrailing,
}

impl Default for Alignment {
    fn default() -> Self {
        Alignment::Center
    }
}

impl Alignment {
    pub fn get_point(&self, rect: &Rect) -> Point {
        match self {
            Alignment::TopLeading => Point::new(rect.x, rect.y),
            Alignment::Top => Point::new(rect.x + rect.width / 2.0, rect.y),
            Alignment::TopTrailing => Point::new(rect.right(), rect.y),
            Alignment::Leading => Point::new(rect.x, rect.y + rect.height / 2.0),
            Alignment::Center => rect.center(),
            Alignment::Trailing => Point::new(rect.right(), rect.y + rect.height / 2.0),
            Alignment::BottomLeading => Point::new(rect.x, rect.bottom()),
            Alignment::Bottom => Point::new(rect.x + rect.width / 2.0, rect.bottom()),
            Alignment::BottomTrailing => Point::new(rect.right(), rect.bottom()),
        }
    }
}