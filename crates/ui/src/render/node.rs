
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderNode {
    pub id: String,
    pub type_name: String,
    pub resolved_props: HashMap<String, String>,
    pub children: Vec<RenderNode>,
}

impl RenderNode {
    pub fn new(id: &str, type_name: &str) -> Self {
        Self {
            id: id.to_string(),
            type_name: type_name.to_string(),
            resolved_props: HashMap::new(),
            children: Vec::new(),
        }
    }
    
    pub fn add_child(&mut self, child: RenderNode) -> &mut Self {
        self.children.push(child);
        self
    }
    
    pub fn set_prop(&mut self, key: &str, value: String) -> &mut Self {
        self.resolved_props.insert(key.to_string(), value);
        self
    }
    
    pub fn get_prop(&self, key: &str) -> Option<&String> {
        self.resolved_props.get(key)
    }
    
    pub fn get_prop_f32(&self, key: &str) -> Option<f32> {
        self.get_prop(key).and_then(|val| val.parse::<f32>().ok())
    }
    
    pub fn has_children(&self) -> bool {
        !self.children.is_empty()
    }
    
    pub fn child_count(&self) -> usize {
        self.children.len()
    }
}