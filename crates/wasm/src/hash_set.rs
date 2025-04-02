use wasm_bindgen::prelude::*;
use js_sys::{Array, Set};

#[wasm_bindgen]
pub struct HashSet {
    set: Set,
}

#[wasm_bindgen]
impl HashSet {
    #[wasm_bindgen(constructor)]
    pub fn new() -> HashSet {
        HashSet {
            set: Set::new(&JsValue::UNDEFINED),
        }
    }

    #[wasm_bindgen(js_name = fromArray)]
    pub fn from_array(values: &js_sys::Array) -> HashSet {
        let set = Set::new(values);
        HashSet { set }
    }

    #[wasm_bindgen(js_name = empty)]
    pub fn empty() -> HashSet {
        HashSet::new()
    }

    #[wasm_bindgen]
    pub fn size(&self) -> usize {
        self.set.size() as usize
    }

    #[wasm_bindgen(js_name = isEmpty)]
    pub fn is_empty(&self) -> bool {
        self.set.size() == 0
    }

    #[wasm_bindgen]
    pub fn contains(&self, value: &JsValue) -> bool {
        self.set.has(value)
    }

    #[wasm_bindgen]
    pub fn insert(&self, value: &JsValue) -> HashSet {
        let new_set = Set::new(&JsValue::UNDEFINED);
        
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                new_set.add(&iter_next.value());
            } else {
                break;
            }
        }
        
        new_set.add(value);
        
        HashSet { set: new_set }
    }

    #[wasm_bindgen]
    pub fn remove(&self, value: &JsValue) -> HashSet {
        let new_set = Set::new(&JsValue::UNDEFINED);
        
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                let val = iter_next.value();
                if !val.eq(value) {
                    new_set.add(&val);
                }
            } else {
                break;
            }
        }
        
        HashSet { set: new_set }
    }

    #[wasm_bindgen]
    pub fn values(&self) -> Array {
        let result = Array::new();
        
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                result.push(&iter_next.value());
            } else {
                break;
            }
        }
        
        result
    }

    #[wasm_bindgen]
    pub fn union(&self, other: &HashSet) -> HashSet {
        let new_set = Set::new(&JsValue::UNDEFINED);
        
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                new_set.add(&iter_next.value());
            } else {
                break;
            }
        }
        
        let other_values_iter = other.set.values();
        loop {
            let next_result = other_values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                new_set.add(&iter_next.value());
            } else {
                break;
            }
        }
        
        HashSet { set: new_set }
    }

    #[wasm_bindgen]
    pub fn intersection(&self, other: &HashSet) -> HashSet {
        let new_set = Set::new(&JsValue::UNDEFINED);
        
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                let val = iter_next.value();
                if other.contains(&val) {
                    new_set.add(&val);
                }
            } else {
                break;
            }
        }
        
        HashSet { set: new_set }
    }

    #[wasm_bindgen]
    pub fn difference(&self, other: &HashSet) -> HashSet {
        let new_set = Set::new(&JsValue::UNDEFINED);
        
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                let val = iter_next.value();
                if !other.contains(&val) {
                    new_set.add(&val);
                }
            } else {
                break;
            }
        }
        
        HashSet { set: new_set }
    }

    #[wasm_bindgen(js_name = symmetricDifference)]
    pub fn symmetric_difference(&self, other: &HashSet) -> HashSet {
        let union = self.union(other);
        let intersection = self.intersection(other);
        
        union.difference(&intersection)
    }

    #[wasm_bindgen(js_name = isSubset)]
    pub fn is_subset(&self, other: &HashSet) -> bool {
        let values_iter = self.set.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                let val = iter_next.value();
                if !other.contains(&val) {
                    return false;
                }
            } else {
                break;
            }
        }
        
        true
    }

    #[wasm_bindgen(js_name = isSuperset)]
    pub fn is_superset(&self, other: &HashSet) -> bool {
        other.is_subset(self)
    }

    #[wasm_bindgen]
    pub fn clear(&self) -> HashSet {
        HashSet::new()
    }

    #[wasm_bindgen(js_name = toArray)]
    pub fn to_array(&self) -> Array {
        self.values()
    }
}