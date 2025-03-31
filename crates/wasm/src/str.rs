use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Str {
    inner: String,
}

#[wasm_bindgen]
impl Str {
    /// Unsafe, internal use only — assume value is valid
    #[wasm_bindgen(js_name = fromRaw)]
    pub fn from_raw(value: &str) -> Str {
        Str {
            inner: value.to_string(),
        }
    }

    /// Validated constructor — returns Result<Str, String>
    #[wasm_bindgen(js_name = create)]
    pub fn create(value: &str) -> Result<Str, JsValue> {
        if value.trim().is_empty() {
            return Err(JsValue::from_str("Str cannot be empty or whitespace"));
        }

        Ok(Str {
            inner: value.to_string(),
        })
    }

    #[wasm_bindgen]
    pub fn unwrap(&self) -> String {
        self.inner.clone()
    }

    #[wasm_bindgen(js_name = toUpperCase)]
    pub fn to_uppercase(&self) -> Str {
        Str::from_raw(&self.inner.to_uppercase())
    }

    #[wasm_bindgen(js_name = toLowerCase)]
    pub fn to_lowercase(&self) -> Str {
        Str::from_raw(&self.inner.to_lowercase())
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.inner.len()
    }

    #[wasm_bindgen(js_name = isEmpty)]
    pub fn is_empty(&self) -> bool {
        self.inner.is_empty()
    }

    #[wasm_bindgen]
    pub fn push(&mut self, ch: &str) -> Result<(), JsValue> {
        if ch.chars().count() != 1 {
            return Err(JsValue::from_str("push requires a single character"));
        }
        self.inner.push_str(ch);
        Ok(())
    }

    #[wasm_bindgen]
    pub fn trim(&self) -> Str {
        Str::from_raw(self.inner.trim())
    }

    #[wasm_bindgen]
    pub fn equals(&self, other: &Str) -> bool {
        self.inner == other.inner
    }

    #[wasm_bindgen]
    pub fn compare(&self, other: &Str) -> i32 {
        self.inner.cmp(&other.inner) as i32
    }

    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> String {
        self.inner.clone()
    }
}
