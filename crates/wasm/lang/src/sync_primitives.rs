use wasm_bindgen::prelude::*;
use std::sync::{Arc, Mutex};
use std::cell::Cell;
use js_sys::Function;

#[wasm_bindgen]
pub struct JsMutexNum {
    inner: Arc<Mutex<f64>>,
    locked: Cell<bool>,
}

#[wasm_bindgen]
impl JsMutexNum {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: f64) -> JsMutexNum {
        JsMutexNum {
            inner: Arc::new(Mutex::new(initial)),
            locked: Cell::new(false),
        }
    }

    #[wasm_bindgen(js_name = lock)]
    pub fn lock(&self, updater: Function) -> Result<(), JsValue> {
        if self.locked.get() {
            return Ok(());
        }
        self.locked.set(true);
        let val = *self.inner.lock().unwrap();
        let updated = updater.call1(&JsValue::NULL, &JsValue::from_f64(val))?;
        if let Some(new_val) = updated.as_f64() {
            let mut guard = self.inner.lock().unwrap();
            *guard = new_val;
        }
        self.locked.set(false);
        Ok(())
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> f64 {
        *self.inner.lock().unwrap()
    }

    #[wasm_bindgen(js_name = isLocked)]
    pub fn is_locked(&self) -> bool {
        self.locked.get()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("[Mutex locked={}]", self.locked.get())
    }
}

#[wasm_bindgen]
pub struct JsMutexStr {
    inner: Arc<Mutex<String>>,
    locked: Cell<bool>,
}

#[wasm_bindgen]
impl JsMutexStr {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: &str) -> JsMutexStr {
        JsMutexStr {
            inner: Arc::new(Mutex::new(initial.to_string())),
            locked: Cell::new(false),
        }
    }

    #[wasm_bindgen(js_name = lock)]
    pub fn lock(&self, updater: Function) -> Result<(), JsValue> {
        if self.locked.get() {
            return Ok(());
        }
        self.locked.set(true);
        let val = self.inner.lock().unwrap().clone();
        let updated = updater.call1(&JsValue::NULL, &JsValue::from_str(&val))?;
        if let Some(new_val) = updated.as_string() {
            let mut guard = self.inner.lock().unwrap();
            *guard = new_val;
        }
        self.locked.set(false);
        Ok(())
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> String {
        self.inner.lock().unwrap().clone()
    }

    #[wasm_bindgen(js_name = isLocked)]
    pub fn is_locked(&self) -> bool {
        self.locked.get()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("[Mutex locked={}]", self.locked.get())
    }
}


#[wasm_bindgen]
pub struct JsRwLockNum {
    inner: Arc<Mutex<f64>>,
    readers: Cell<u32>,
    locked: Cell<bool>,
}

#[wasm_bindgen]
impl JsRwLockNum {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: f64) -> JsRwLockNum {
        JsRwLockNum {
            inner: Arc::new(Mutex::new(initial)),
            readers: Cell::new(0),
            locked: Cell::new(false),
        }
    }

    #[wasm_bindgen(js_name = read)]
    pub fn read(&self) -> Result<f64, JsValue> {
        if self.locked.get() {
            return Err(JsValue::from_str("RwLock is locked for writing"));
        }
        self.readers.set(self.readers.get() + 1);
        Ok(*self.inner.lock().unwrap())
    }

    #[wasm_bindgen(js_name = releaseRead)]
    pub fn release_read(&self) {
        if self.readers.get() > 0 {
            self.readers.set(self.readers.get() - 1);
        }
    }

    #[wasm_bindgen(js_name = write)]
    pub fn write(&self, updater: Function) -> Result<(), JsValue> {
        if self.locked.get() || self.readers.get() > 0 {
            return Err(JsValue::from_str("RwLock is in use"));
        }
        
        self.locked.set(true);
        let val = *self.inner.lock().unwrap();
        let updated = updater.call1(&JsValue::NULL, &JsValue::from_f64(val))?;
        
        if let Some(new_val) = updated.as_f64() {
            let mut guard = self.inner.lock().unwrap();
            *guard = new_val;
        }
        
        self.locked.set(false);
        Ok(())
    }

    #[wasm_bindgen(js_name = getReaders)]
    pub fn get_readers(&self) -> u32 {
        self.readers.get()
    }

    #[wasm_bindgen(js_name = isWriteLocked)]
    pub fn is_write_locked(&self) -> bool {
        self.locked.get()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("[RwLock readers={} writeLocked={}]", self.readers.get(), self.locked.get())
    }
}

#[wasm_bindgen]
pub struct JsRwLockStr {
    inner: Arc<Mutex<String>>,
    readers: Cell<u32>,
    locked: Cell<bool>,
}

#[wasm_bindgen]
impl JsRwLockStr {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: &str) -> JsRwLockStr {
        JsRwLockStr {
            inner: Arc::new(Mutex::new(initial.to_string())),
            readers: Cell::new(0),
            locked: Cell::new(false),
        }
    }

    #[wasm_bindgen(js_name = read)]
    pub fn read(&self) -> Result<String, JsValue> {
        if self.locked.get() {
            return Err(JsValue::from_str("RwLock is locked for writing"));
        }
        self.readers.set(self.readers.get() + 1);
        Ok(self.inner.lock().unwrap().clone())
    }

    #[wasm_bindgen(js_name = releaseRead)]
    pub fn release_read(&self) {
        if self.readers.get() > 0 {
            self.readers.set(self.readers.get() - 1);
        }
    }

    #[wasm_bindgen(js_name = write)]
    pub fn write(&self, updater: Function) -> Result<(), JsValue> {
        if self.locked.get() || self.readers.get() > 0 {
            return Err(JsValue::from_str("RwLock is in use"));
        }
        
        self.locked.set(true);
        let val = self.inner.lock().unwrap().clone();
        let updated = updater.call1(&JsValue::NULL, &JsValue::from_str(&val))?;
        
        if let Some(new_val) = updated.as_string() {
            let mut guard = self.inner.lock().unwrap();
            *guard = new_val;
        }
        
        self.locked.set(false);
        Ok(())
    }

    #[wasm_bindgen(js_name = getReaders)]
    pub fn get_readers(&self) -> u32 {
        self.readers.get()
    }

    #[wasm_bindgen(js_name = isWriteLocked)]
    pub fn is_write_locked(&self) -> bool {
        self.locked.get()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("[RwLock readers={} writeLocked={}]", self.readers.get(), self.locked.get())
    }
}

#[wasm_bindgen]
pub struct JsArcMutexNum {
    inner: Arc<Mutex<f64>>,
    locked: Cell<bool>,
}

#[wasm_bindgen]
impl JsArcMutexNum {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: f64) -> JsArcMutexNum {
        JsArcMutexNum {
            inner: Arc::new(Mutex::new(initial)),
            locked: Cell::new(false),
        }
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> f64 {
        *self.inner.lock().unwrap()
    }

    #[wasm_bindgen(js_name = set)]
    pub fn set(&self, updater: Function) -> Result<(), JsValue> {
        if self.locked.get() {
            return Ok(());
        }
        
        self.locked.set(true);
        let val = *self.inner.lock().unwrap();
        let updated = updater.call1(&JsValue::NULL, &JsValue::from_f64(val))?;
        
        if let Some(new_val) = updated.as_f64() {
            let mut guard = self.inner.lock().unwrap();
            *guard = new_val;
        }
        
        self.locked.set(false);
        Ok(())
    }

    #[wasm_bindgen(js_name = setAsync)]
    pub fn set_async(
        &self,
        updater: Function,
        retries: Option<u32>,
        fallback: Option<Function>
    ) -> Result<(), JsValue> {
        let max_retries = retries.unwrap_or(3);
        let mut current_retry = 0;

        while current_retry < max_retries {
            if self.locked.get() {
                current_retry += 1;
                continue;
            }

            self.locked.set(true);
            
            let val = *self.inner.lock().unwrap();
            let updated = match updater.call1(&JsValue::NULL, &JsValue::from_f64(val)) {
                Ok(updated) => updated,
                Err(e) => {
                    if current_retry + 1 >= max_retries {
                        if let Some(fallback_fn) = &fallback {
                            let fallback_result = fallback_fn.call1(&JsValue::NULL, &e)?;
                            if let Some(new_val) = fallback_result.as_f64() {
                                let mut guard = self.inner.lock().unwrap();
                                *guard = new_val;
                            }
                            self.locked.set(false);
                            return Ok(());
                        }
                        self.locked.set(false);
                        return Err(e);
                    }
                    self.locked.set(false);
                    current_retry += 1;
                    continue;
                }
            };

            if let Some(new_val) = updated.as_f64() {
                let mut guard = self.inner.lock().unwrap();
                *guard = new_val;
            }
            
            self.locked.set(false);
            return Ok(());
        }

        Err(JsValue::from_str("Unexpected error in setAsync"))
    }

    #[wasm_bindgen(js_name = isLocked)]
    pub fn is_locked(&self) -> bool {
        self.locked.get()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("[ArcMutex locked={}]", self.locked.get())
    }
}

#[wasm_bindgen]
pub struct JsArcMutexStr {
    inner: Arc<Mutex<String>>,
    locked: Cell<bool>,
}

#[wasm_bindgen]
impl JsArcMutexStr {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: &str) -> JsArcMutexStr {
        JsArcMutexStr {
            inner: Arc::new(Mutex::new(initial.to_string())),
            locked: Cell::new(false),
        }
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> String {
        self.inner.lock().unwrap().clone()
    }

    #[wasm_bindgen(js_name = set)]
    pub fn set(&self, updater: Function) -> Result<(), JsValue> {
        if self.locked.get() {
            return Ok(());
        }
        
        self.locked.set(true);
        let val = self.inner.lock().unwrap().clone();
        let updated = updater.call1(&JsValue::NULL, &JsValue::from_str(&val))?;
        
        if let Some(new_val) = updated.as_string() {
            let mut guard = self.inner.lock().unwrap();
            *guard = new_val;
        }
        
        self.locked.set(false);
        Ok(())
    }

    #[wasm_bindgen(js_name = setAsync)]
    pub fn set_async(
        &self,
        updater: Function,
        retries: Option<u32>,
        fallback: Option<Function>
    ) -> Result<(), JsValue> {
        let max_retries = retries.unwrap_or(3);
        let mut current_retry = 0;

        while current_retry < max_retries {
            if self.locked.get() {
                current_retry += 1;
                continue;
            }

            self.locked.set(true);
            
            let val = self.inner.lock().unwrap().clone();
            let updated = match updater.call1(&JsValue::NULL, &JsValue::from_str(&val)) {
                Ok(updated) => updated,
                Err(e) => {
                    if current_retry + 1 >= max_retries {
                        if let Some(fallback_fn) = &fallback {
                            let fallback_result = fallback_fn.call1(&JsValue::NULL, &e)?;
                            if let Some(new_val) = fallback_result.as_string() {
                                let mut guard = self.inner.lock().unwrap();
                                *guard = new_val;
                            }
                            self.locked.set(false);
                            return Ok(());
                        }
                        self.locked.set(false);
                        return Err(e);
                    }
                    self.locked.set(false);
                    current_retry += 1;
                    continue;
                }
            };

            if let Some(new_val) = updated.as_string() {
                let mut guard = self.inner.lock().unwrap();
                *guard = new_val;
            }
            
            self.locked.set(false);
            return Ok(());
        }

        Err(JsValue::from_str("Unexpected error in setAsync"))
    }

    #[wasm_bindgen(js_name = isLocked)]
    pub fn is_locked(&self) -> bool {
        self.locked.get()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("[ArcMutex locked={}]", self.locked.get())
    }
}