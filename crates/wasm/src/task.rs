use wasm_bindgen::prelude::*;
use js_sys::{Function, Object, Promise, Reflect};
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub struct Task {
    promise: Promise,
    is_cancelled: bool,
    controller: JsValue,
}

#[wasm_bindgen]
impl Task {
    #[wasm_bindgen(constructor)]
    pub fn new(promise: Promise) -> Task {
        Task {
            promise,
            is_cancelled: false,
            controller: JsValue::null(),
        }
    }

    #[wasm_bindgen(js_name = "setController")]
    pub fn set_controller(&mut self, controller: JsValue) {
        self.controller = controller;
    }

    #[wasm_bindgen(js_name = "run")]
    pub fn run(&self) -> Promise {
        self.promise.clone()
    }

    #[wasm_bindgen(js_name = "cancel")]
    pub fn cancel(&mut self) -> Result<(), JsValue> {
        if !self.is_cancelled {
            self.is_cancelled = true;
            
            if !self.controller.is_null() {
                let abort_method = Reflect::get(&self.controller, &"abort".into())?;
                let abort_fn = abort_method.dyn_ref::<Function>().ok_or_else(|| {
                    let error = Object::new();
                    Reflect::set(&error, &"message".into(), &"abort is not a function".into()).unwrap();
                    error
                })?;
                
                abort_fn.call0(&self.controller)?;
            }
        }
        Ok(())
    }

    #[wasm_bindgen(js_name = "isCancelled")]
    pub fn is_cancelled(&self) -> bool {
        self.is_cancelled
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        if self.is_cancelled {
            "[Task cancelled]".to_string()
        } else {
            "[Task active]".to_string()
        }
    }
}

#[wasm_bindgen(js_name = "createTask")]
pub fn create_task(promise: Promise) -> Task {
    Task::new(promise)
}

#[wasm_bindgen(js_name = "mapTask")]
pub fn map_task(task: &Task, mapper: &Function) -> Result<Task, JsValue> {
    let promise = task.promise.clone();
    let then_method = Reflect::get(&promise, &"then".into())?;
    let then_fn = then_method.dyn_ref::<Function>().ok_or_else(|| {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"then is not a function".into()).unwrap();
        error
    })?;
    
    let new_promise = then_fn.call1(&promise, mapper)?;
    let new_promise = new_promise.dyn_into::<Promise>()?;
    
    Ok(Task::new(new_promise))
}

#[wasm_bindgen(js_name = "flatMapTask")]
pub fn flat_map_task(task: &Task, mapper: &Function) -> Result<Task, JsValue> {
    let promise = task.promise.clone();
    let then_method = Reflect::get(&promise, &"then".into())?;
    let then_fn = then_method.dyn_ref::<Function>().ok_or_else(|| {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"then is not a function".into()).unwrap();
        error
    })?;
    
    let new_promise = then_fn.call1(&promise, mapper)?;
    let new_promise = new_promise.dyn_into::<Promise>()?;
    
    Ok(Task::new(new_promise))
}

#[wasm_bindgen(js_name = "catchTask")]
pub fn catch_task(task: &Task, handler: &Function) -> Result<Task, JsValue> {
    let promise = task.promise.clone();
    let catch_method = Reflect::get(&promise, &"catch".into())?;
    let catch_fn = catch_method.dyn_ref::<Function>().ok_or_else(|| {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"catch is not a function".into()).unwrap();
        error
    })?;
    
    let new_promise = catch_fn.call1(&promise, handler)?;
    let new_promise = new_promise.dyn_into::<Promise>()?;
    
    Ok(Task::new(new_promise))
}