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

    #[wasm_bindgen]
    pub fn unwrap(&self) -> String {
        self.value.clone()
    }

    #[wasm_bindgen]
    pub fn to_string(&self) -> String {
        self.value.clone()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.value.len()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.value.is_empty()
    }

    #[wasm_bindgen]
    pub fn to_uppercase(&self) -> Str {
        Str {
            value: self.value.to_uppercase(),
        }
    }

    #[wasm_bindgen]
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
}