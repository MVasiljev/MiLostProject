use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Str {
    value: String,
}

#[wasm_bindgen]
impl Str {
    #[wasm_bindgen(constructor)]
    pub fn new(s: &str) -> Str {
        Str {
            value: s.to_string(),
        }
    }
    
    #[wasm_bindgen(js_name = "fromRaw")]
    pub fn from_raw(s: &str) -> Str {
        Str::new(s)
    }
    
    #[wasm_bindgen(js_name = "empty")]
    pub fn empty() -> Str {
        Str::new("")
    }

    #[wasm_bindgen]
    pub fn unwrap(&self) -> String {
        self.value.clone()
    }

    #[wasm_bindgen]
    pub fn to_string(&self) -> String {
        self.value.clone()
    }

    #[wasm_bindgen(js_name = "getToStringTag")]
    pub fn to_string_tag() -> String {
        "Str".to_string()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.value.len()
    }

    #[wasm_bindgen(js_name = "isEmpty")]
    pub fn is_empty(&self) -> bool {
        self.value.is_empty()
    }

    #[wasm_bindgen(js_name = "toUpperCase")]
    pub fn to_uppercase(&self) -> Str {
        Str {
            value: self.value.to_uppercase(),
        }
    }

    #[wasm_bindgen(js_name = "toLowerCase")]
    pub fn to_lowercase(&self) -> Str {
        Str {
            value: self.value.to_lowercase(),
        }
    }

    #[wasm_bindgen]
    pub fn contains(&self, other: &str) -> bool {
        self.value.contains(other)
    }

    #[wasm_bindgen]
    pub fn trim(&self) -> Str {
        Str {
            value: self.value.trim().to_string(),
        }
    }
    
    #[wasm_bindgen(js_name = "charAt")]
    pub fn char_at(&self, index: usize) -> String {
        if index >= self.value.len() {
            return "".to_string();
        }
        
        self.value.chars().nth(index).map(|c| c.to_string()).unwrap_or_default()
    }
    
    #[wasm_bindgen(js_name = "substring")]
    pub fn substring(&self, start: usize, end: usize) -> Str {
        let start = start.min(self.value.len());
        let end = end.min(self.value.len());
        
        if start > end {
            return Str::new("");
        }
        
        let chars: Vec<char> = self.value.chars().collect();
        let slice: String = chars[start..end].iter().collect();
        
        Str::new(&slice)
    }
    
    #[wasm_bindgen]
    pub fn concat(&self, other: &Str) -> Str {
        Str::new(&format!("{}{}", self.value, other.value))
    }
    
    #[wasm_bindgen(js_name = "startsWith")]
    pub fn starts_with(&self, prefix: &str) -> bool {
        self.value.starts_with(prefix)
    }
    
    #[wasm_bindgen(js_name = "endsWith")]
    pub fn ends_with(&self, suffix: &str) -> bool {
        self.value.ends_with(suffix)
    }
    
    #[wasm_bindgen(js_name = "indexOf")]
    pub fn index_of(&self, search_str: &str, position: Option<usize>) -> i32 {
        let pos = position.unwrap_or(0);
        
        if pos >= self.value.len() {
            return -1;
        }
        
        let substring: String = self.value.chars().skip(pos).collect();
        
        match substring.find(search_str) {
            Some(index) => (index + pos) as i32,
            None => -1,
        }
    }
    
    #[wasm_bindgen(js_name = "lastIndexOf")]
    pub fn last_index_of(&self, search_str: &str) -> i32 {
        match self.value.rfind(search_str) {
            Some(index) => index as i32,
            None => -1,
        }
    }
    
    #[wasm_bindgen]
    pub fn split(&self, separator: &str) -> js_sys::Array {
        let parts = self.value.split(separator);
        let result = js_sys::Array::new();
        
        for part in parts {
            result.push(&JsValue::from(Str::new(part)));
        }
        
        result
    }
    
    #[wasm_bindgen]
    pub fn replace(&self, search_value: &str, replace_value: &str) -> Str {
        Str::new(&self.value.replace(search_value, replace_value))
    }
    
    #[wasm_bindgen(js_name = "valueOf")]
    pub fn value_of(&self) -> String {
        self.value.clone()
    }
    
    #[wasm_bindgen(js_name = "equals")]
    pub fn equals(&self, other: &Str) -> bool {
        self.value == other.value
    }
}

#[wasm_bindgen(inline_js = "
export function initialize_str_symbol() {
    const proto = Str.prototype;
    Object.defineProperty(proto, Symbol.toStringTag, {
        value: 'Str',
        writable: false,
        enumerable: false,
        configurable: true
    });
}
")]
extern "C" {
    fn initialize_str_symbol();
}