use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Object, Promise, Reflect};
use std::cell::RefCell;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "Resource")]
    pub type JsResource;

    #[wasm_bindgen(constructor, js_class = "Resource")]
    fn new(value: JsValue, dispose_fn: Function) -> JsResource;
}

#[wasm_bindgen(js_name = "asResource")]
pub fn as_resource(disposable: &JsValue) -> Result<JsResource, JsValue> {
    if !Reflect::has(disposable, &"dispose".into())? {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"Object must implement IDisposable".into())?;
        return Err(error.into());
    }

    let dispose_fn = Function::new_with_args(
        "disposable",
        "return disposable.dispose();"
    );

    Ok(JsResource::new(disposable.clone(), dispose_fn))
}

#[wasm_bindgen]
pub struct DisposableGroup {
    disposables: RefCell<Vec<JsValue>>,
    disposed: RefCell<bool>,
}

#[wasm_bindgen]
impl DisposableGroup {
    #[wasm_bindgen(constructor)]
    pub fn new() -> DisposableGroup {
        DisposableGroup {
            disposables: RefCell::new(Vec::new()),
            disposed: RefCell::new(false),
        }
    }

    #[wasm_bindgen(js_name = "add")]
    pub fn add(&self, disposable: JsValue) -> Result<DisposableGroup, JsValue> {
        if *self.disposed.borrow() {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Cannot add to disposed group".into())?;
            return Err(error.into());
        }

        if !Reflect::has(&disposable, &"dispose".into())? {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Object must implement IDisposable".into())?;
            return Err(error.into());
        }

        self.disposables.borrow_mut().push(disposable);
        
        Ok(DisposableGroup {
            disposables: self.disposables.clone(),
            disposed: self.disposed.clone(),
        })
    }

    #[wasm_bindgen(js_name = "dispose")]
    pub fn dispose(&self) -> Promise {
        let this = self;
        
        Promise::new(&mut |resolve, _reject| {
            if !*this.disposed.borrow() {
                *this.disposed.borrow_mut() = true;
                
                let process_disposable = Function::new_with_args(
                    "index, disposables, onComplete",
                    r#"
                    if (index < 0) {
                        onComplete();
                        return;
                    }
                    
                    const disposable = disposables[index];
                    const result = disposable.dispose();
                    
                    if (result instanceof Promise) {
                        result.then(() => {
                            process_disposable(index - 1, disposables, onComplete);
                        }).catch((err) => {
                            console.error('Error disposing:', err);
                            process_disposable(index - 1, disposables, onComplete);
                        });
                    } else {
                        process_disposable(index - 1, disposables, onComplete);
                    }
                    "#
                );
                
                let disposables_array = Array::new();
                for disposable in this.disposables.borrow().iter() {
                    disposables_array.push(disposable);
                }
                
                this.disposables.borrow_mut().clear();
                
                let last_index = disposables_array.length() as i32 - 1;
                process_disposable.call3(
                    &JsValue::null(),
                    &JsValue::from(last_index),
                    &disposables_array,
                    &resolve
                ).unwrap();
            } else {
                resolve.call0(&JsValue::null()).unwrap();
            }
        })
    }

    #[wasm_bindgen(getter, js_name = "isDisposed")]
    pub fn is_disposed(&self) -> bool {
        *self.disposed.borrow()
    }

    #[wasm_bindgen(getter, js_name = "size")]
    pub fn size(&self) -> usize {
        self.disposables.borrow().len()
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        format!(
            "[DisposableGroup size={} disposed={}]",
            self.disposables.borrow().len(),
            self.is_disposed()
        )
    }
}

#[wasm_bindgen(js_name = "createDisposableGroup")]
pub fn create_disposable_group() -> DisposableGroup {
    DisposableGroup::new()
}