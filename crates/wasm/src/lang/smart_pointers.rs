use wasm_bindgen::prelude::*;
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[wasm_bindgen]
#[derive(Clone)]
pub struct JsNumRc {
    inner: Rc<RefCell<f64>>,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct JsStrRc {
    inner: Rc<RefCell<String>>,
}

#[wasm_bindgen]
impl JsNumRc {
    #[wasm_bindgen(constructor)]
    pub fn new(value: f64) -> Self {
        JsNumRc {
            inner: Rc::new(RefCell::new(value)),
        }
    }

    #[wasm_bindgen(js_name = borrow)]
    pub fn borrow(&self) -> f64 {
        *self.inner.borrow()
    }

    #[wasm_bindgen(js_name = borrowMut)]
    pub fn borrow_mut(&self, updater: &js_sys::Function) -> Result<(), JsValue> {
        let mut borrowed = self.inner.borrow_mut();
        let this = JsValue::NULL;
        let current_value = *borrowed;
        let updated = updater.call1(&this, &JsValue::from_f64(current_value))?;
        *borrowed = updated.as_f64().ok_or_else(|| JsValue::from_str("Invalid numeric value"))?;
        Ok(())
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_rc(&self) -> Self {
        JsNumRc {
            inner: Rc::clone(&self.inner),
        }
    }

    #[wasm_bindgen(js_name = drop)]
    pub fn drop_rc(&mut self) {
        drop(Rc::clone(&self.inner));
    }

    #[wasm_bindgen(js_name = refCount)]
    pub fn ref_count(&self) -> u32 {
        Rc::strong_count(&self.inner) as u32
    }
}

#[wasm_bindgen]
impl JsStrRc {
    #[wasm_bindgen(constructor)]
    pub fn new(value: &str) -> Self {
        JsStrRc {
            inner: Rc::new(RefCell::new(value.to_string())),
        }
    }

    #[wasm_bindgen(js_name = borrow)]
    pub fn borrow(&self) -> String {
        self.inner.borrow().clone()
    }

    #[wasm_bindgen(js_name = borrowMut)]
    pub fn borrow_mut(&self, updater: &js_sys::Function) -> Result<(), JsValue> {
        let mut borrowed = self.inner.borrow_mut();
        let this = JsValue::NULL;
        let current_value = borrowed.clone();
        let updated = updater.call1(&this, &JsValue::from_str(&current_value))?;
        *borrowed = updated.as_string().ok_or_else(|| JsValue::from_str("Invalid string value"))?;
        Ok(())
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_rc(&self) -> Self {
        JsStrRc {
            inner: Rc::clone(&self.inner),
        }
    }

    #[wasm_bindgen(js_name = drop)]
    pub fn drop_rc(&mut self) {
        drop(Rc::clone(&self.inner));
    }

    #[wasm_bindgen(js_name = refCount)]
    pub fn ref_count(&self) -> u32 {
        Rc::strong_count(&self.inner) as u32
    }
}

#[wasm_bindgen]
pub struct JsNumWeak {
    inner: Weak<RefCell<f64>>,
    stored_value: Option<f64>,
}

#[wasm_bindgen]
pub struct JsStrWeak {
    inner: Weak<RefCell<String>>,
    stored_value: Option<String>,
}

#[wasm_bindgen]
impl JsNumWeak {
    #[wasm_bindgen(constructor)]
    pub fn new(value: f64) -> Self {
        let rc = Rc::new(RefCell::new(value));
        JsNumWeak {
            inner: Rc::downgrade(&rc),
            stored_value: Some(value),
        }
    }

    #[wasm_bindgen(js_name = getOrDefault)]
    pub fn get_or_default(&self, default_value: f64) -> f64 {
        self.inner.upgrade()
            .map(|rc| *rc.borrow())
            .unwrap_or(default_value)
    }

    #[wasm_bindgen(js_name = drop)]
    pub fn drop_weak(&mut self) {
        self.inner = Weak::new();
        self.stored_value = None;
    }
}

#[wasm_bindgen]
impl JsStrWeak {
    #[wasm_bindgen(constructor)]
    pub fn new(value: &str) -> Self {
        let rc = Rc::new(RefCell::new(value.to_string()));
        JsStrWeak {
            inner: Rc::downgrade(&rc),
            stored_value: Some(value.to_string()),
        }
    }

    #[wasm_bindgen(js_name = getOrDefault)]
    pub fn get_or_default(&self, default_value: &str) -> String {
        self.inner.upgrade()
            .map(|rc| rc.borrow().clone())
            .unwrap_or_else(|| default_value.to_string())
    }

    #[wasm_bindgen(js_name = drop)]
    pub fn drop_weak(&mut self) {
        self.inner = Weak::new();
        self.stored_value = None;
    }
}

#[wasm_bindgen]
pub struct JsNumRefCell {
    inner: RefCell<f64>,
}

#[wasm_bindgen]
pub struct JsStrRefCell {
    inner: RefCell<String>,
}

#[wasm_bindgen]
impl JsNumRefCell {
    #[wasm_bindgen(constructor)]
    pub fn new(value: f64) -> Self {
        JsNumRefCell {
            inner: RefCell::new(value),
        }
    }

    #[wasm_bindgen(js_name = borrow)]
    pub fn borrow(&self) -> f64 {
        *self.inner.borrow()
    }

    #[wasm_bindgen(js_name = borrowMut)]
    pub fn borrow_mut(&self, updater: &js_sys::Function) -> Result<(), JsValue> {
        let mut borrowed = self.inner.borrow_mut();
        let this = JsValue::NULL;
        let current_value = *borrowed;
        let updated = updater.call1(&this, &JsValue::from_f64(current_value))?;
        *borrowed = updated.as_f64().ok_or_else(|| JsValue::from_str("Invalid numeric value"))?;
        Ok(())
    }
}

#[wasm_bindgen]
impl JsStrRefCell {
    #[wasm_bindgen(constructor)]
    pub fn new(value: &str) -> Self {
        JsStrRefCell {
            inner: RefCell::new(value.to_string()),
        }
    }

    #[wasm_bindgen(js_name = borrow)]
    pub fn borrow(&self) -> String {
        self.inner.borrow().clone()
    }

    #[wasm_bindgen(js_name = borrowMut)]
    pub fn borrow_mut(&self, updater: &js_sys::Function) -> Result<(), JsValue> {
        let mut borrowed = self.inner.borrow_mut();
        let this = JsValue::NULL;
        let current_value = borrowed.clone();
        let updated = updater.call1(&this, &JsValue::from_str(&current_value))?;
        *borrowed = updated.as_string().ok_or_else(|| JsValue::from_str("Invalid string value"))?;
        Ok(())
    }
}

#[wasm_bindgen]
pub struct JsNumArc {
    inner: std::sync::Arc<std::sync::Mutex<f64>>,
}

#[wasm_bindgen]
pub struct JsStrArc {
    inner: std::sync::Arc<std::sync::Mutex<String>>,
}

#[wasm_bindgen]
impl JsNumArc {
    #[wasm_bindgen(constructor)]
    pub fn new(value: f64) -> Self {
        JsNumArc {
            inner: std::sync::Arc::new(std::sync::Mutex::new(value)),
        }
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> f64 {
        *self.inner.lock().unwrap()
    }

    #[wasm_bindgen(js_name = set)]
    pub fn set(&self, updater: &js_sys::Function) -> Result<(), JsValue> {
        let mut value = self.inner.lock().unwrap();
        let this = JsValue::NULL;
        let current_value = *value;
        let updated = updater.call1(&this, &JsValue::from_f64(current_value))?;
        *value = updated.as_f64().ok_or_else(|| JsValue::from_str("Invalid numeric value"))?;
        Ok(())
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_arc(&self) -> Self {
        JsNumArc {
            inner: std::sync::Arc::clone(&self.inner),
        }
    }
}

#[wasm_bindgen]
impl JsStrArc {
    #[wasm_bindgen(constructor)]
    pub fn new(value: &str) -> Self {
        JsStrArc {
            inner: std::sync::Arc::new(std::sync::Mutex::new(value.to_string())),
        }
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> String {
        self.inner.lock().unwrap().clone()
    }

    #[wasm_bindgen(js_name = set)]
    pub fn set(&self, updater: &js_sys::Function) -> Result<(), JsValue> {
        let mut value = self.inner.lock().unwrap();
        let this = JsValue::NULL;
        let current_value = value.clone();
        let updated = updater.call1(&this, &JsValue::from_str(&current_value))?;
        *value = updated.as_string().ok_or_else(|| JsValue::from_str("Invalid string value"))?;
        Ok(())
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_arc(&self) -> Self {
        JsStrArc {
            inner: std::sync::Arc::clone(&self.inner),
        }
    }
}