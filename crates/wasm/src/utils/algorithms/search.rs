use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Object, Reflect};

#[wasm_bindgen]
pub struct Search;

#[wasm_bindgen]
impl Search {
    
    #[wasm_bindgen(js_name = "binarySearch")]
    pub fn binary_search(arr: &js_sys::Array, target: &JsValue, comparator: Option<Function>) -> i32 {
        if arr.length() == 0 {
            return -1;
        }
        
        let length = arr.length() as usize;
        let mut low = 0;
        let mut high = length - 1;
        
        while low <= high {
            let mid = low + (high - low) / 2;
            let mid_val = arr.get(mid as u32);
            
            let result = if let Some(cmp) = &comparator {
                cmp.call2(&JsValue::NULL, &mid_val, target)
                    .unwrap_or(JsValue::from(0))
                    .as_f64()
                    .unwrap_or(0.0) as i32
            } else {
                let mid_num = mid_val.as_f64().unwrap_or(f64::NAN);
                let target_num = target.as_f64().unwrap_or(f64::NAN);
                
                if mid_num.is_nan() && target_num.is_nan() {
                    0
                } else if mid_num.is_nan() {
                    1
                } else if target_num.is_nan() {
                    -1
                } else if mid_num < target_num {
                    -1
                } else if mid_num > target_num {
                    1
                } else {
                    0
                }
            };
            
            if result == 0 {
                return mid as i32;
            } else if result < 0 {
                low = mid + 1;
            } else {
                if mid == 0 {
                    break;
                }
                high = mid - 1;
            }
        }
        
        -1
    }
    
    #[wasm_bindgen(js_name = "linearSearch")]
    pub fn linear_search(arr: &js_sys::Array, target: &JsValue, comparator: Option<Function>) -> i32 {
        let length = arr.length() as usize;
        
        for i in 0..length {
            let item = arr.get(i as u32);
            
            let result = if let Some(cmp) = &comparator {
                cmp.call2(&JsValue::NULL, &item, target)
                    .unwrap_or(JsValue::from(0))
                    .as_f64()
                    .unwrap_or(0.0) as i32
            } else {
                if js_sys::Object::is(&item, target) {
                    0
                } else {
                    1
                }
            };
            
            if result == 0 {
                return i as i32;
            }
        }
        
        -1
    }
    
    #[wasm_bindgen(js_name = "findIndex")]
    pub fn find_index(arr: &js_sys::Array, predicate: &Function) -> i32 {
        let length = arr.length() as usize;
        
        for i in 0..length {
            let item = arr.get(i as u32);
            
            let result = predicate.call1(&JsValue::NULL, &item)
                .unwrap_or(JsValue::from(false));
                
            if result.is_truthy() {
                return i as i32;
            }
        }
        
        -1
    }
    
    #[wasm_bindgen(js_name = "findAll")]
    pub fn find_all(arr: &js_sys::Array, predicate: &Function) -> js_sys::Array {
        let length = arr.length() as usize;
        let result = js_sys::Array::new();
        
        for i in 0..length {
            let item = arr.get(i as u32);
            
            let matches = predicate.call1(&JsValue::NULL, &item)
                .unwrap_or(JsValue::from(false));
                
            if matches.is_truthy() {
                result.push(&item);
            }
        }
        
        result
    }
    
    #[wasm_bindgen(js_name = "kmpSearch")]
    pub fn kmp_search(haystack: &str, needle: &str) -> i32 {
        if needle.is_empty() {
            return 0;
        }
        
        if haystack.is_empty() {
            return -1;
        }
        
        let h_chars: Vec<char> = haystack.chars().collect();
        let n_chars: Vec<char> = needle.chars().collect();
        
        let lps = Self::compute_lps(&n_chars);
        
        let mut i = 0;
        let mut j = 0;
        
        while i < h_chars.len() {
            if h_chars[i] == n_chars[j] {
                i += 1;
                j += 1;
            }
            
            if j == n_chars.len() {
                return (i - j) as i32;
            } else if i < h_chars.len() && h_chars[i] != n_chars[j] {
                if j != 0 {
                    j = lps[j - 1];
                } else {
                    i += 1;
                }
            }
        }
        
        -1
    }
    
    fn compute_lps(pattern: &[char]) -> Vec<usize> {
        let mut lps = vec![0; pattern.len()];
        let mut len = 0;
        let mut i = 1;
        
        while i < pattern.len() {
            if pattern[i] == pattern[len] {
                len += 1;
                lps[i] = len;
                i += 1;
            } else {
                if len != 0 {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i += 1;
                }
            }
        }
        
        lps
    }
}