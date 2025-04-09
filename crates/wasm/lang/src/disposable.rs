use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Object, Promise, Reflect};
use std::cell::RefCell;
use crate::resource::ManagedResource;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "Resource")]
    pub type JsResource;

    #[wasm_bindgen(constructor, js_class = "Resource")]
    fn new(value: JsValue, dispose_fn: Function) -> JsResource;
}

#[wasm_bindgen(js_name = "asResource")]
pub fn as_resource(disposable: &JsValue) -> Result<ManagedResource, JsValue> {
    if !Reflect::has(disposable, &"dispose".into())? {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"Object must implement IDisposable".into())?;
        return Err(error.into());
    }

    let dispose_fn = Function::new_with_args(
        "disposable",
        r#"
        const result = disposable.dispose();
        return (result instanceof Promise) ? result : Promise.resolve();
        "#
    );

    Ok(ManagedResource::new(disposable.clone(), dispose_fn))
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

        let mut new_disposables = Vec::new();
        for item in self.disposables.borrow().iter() {
            new_disposables.push(item.clone());
        }
        new_disposables.push(disposable);
        
        let new_group = DisposableGroup {
            disposables: RefCell::new(new_disposables),
            disposed: RefCell::new(*self.disposed.borrow()),
        };
        
        Ok(new_group)
    }

    #[wasm_bindgen(js_name = "dispose")]
    pub fn dispose(&self) -> Promise {
        let this = self;
        
        Promise::new(&mut |resolve, reject| {
            if !*this.disposed.borrow() {
                *this.disposed.borrow_mut() = true;
                
                let context = Object::new();
                Reflect::set(&context, &"onComplete".into(), &resolve).unwrap();
                Reflect::set(&context, &"onError".into(), &reject).unwrap();
                
                let process_disposable = Function::new_with_args(
                    "index, disposables, context",
                    r#"
                    if (index < 0) {
                        context.onComplete();
                        return;
                    }
                    
                    const disposable = disposables[index];
                    try {
                        const result = disposable.dispose();
                        
                        if (result instanceof Promise) {
                            result.then(() => {
                                process_disposable(index - 1, disposables, context);
                            }).catch((err) => {
                                console.error('Error disposing:', err);
                                process_disposable(index - 1, disposables, context);
                            });
                        } else {
                            process_disposable(index - 1, disposables, context);
                        }
                    } catch (err) {
                        console.error('Error during dispose:', err);
                        process_disposable(index - 1, disposables, context);
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
                    &context
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