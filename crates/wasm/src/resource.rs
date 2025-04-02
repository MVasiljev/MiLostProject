use wasm_bindgen::prelude::*;
use js_sys::{Function, Object, Promise, Reflect};
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub struct ManagedResource {
    value: JsValue,
    disposed: bool,
    dispose_fn: Function,
}

impl AsRef<JsValue> for ManagedResource {
    fn as_ref(&self) -> &JsValue {
        &self.value
    }
}

#[wasm_bindgen]
impl ManagedResource {
    #[wasm_bindgen(constructor)]
    pub fn new(value: JsValue, dispose_fn: Function) -> Self {
        Self {
            value,
            disposed: false,
            dispose_fn,
        }
    }

    #[wasm_bindgen(js_name = "use")]
    pub fn use_resource(&self, fn_callback: &Function) -> Result<JsValue, JsValue> {
        if self.disposed {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"ResourceError".into())?;
            Reflect::set(&error, &"message".into(), &"Resource has been disposed".into())?;
            return Err(error.into());
        }

        fn_callback.call1(&JsValue::null(), &self.value)
    }

    #[wasm_bindgen(js_name = "dispose")]
    pub fn dispose(&mut self) -> Promise {
        if self.disposed {
            return Promise::resolve(&JsValue::undefined());
        }

        self.disposed = true;
        let result = self.dispose_fn.call1(&JsValue::null(), &self.value);

        match result {
            Ok(value) => {
                if value.is_instance_of::<Promise>() {
                    value.dyn_into::<Promise>().unwrap()
                } else {
                    Promise::resolve(&JsValue::undefined())
                }
            },
            Err(err) => {
                Promise::reject(&err)
            }
        }
    }

    #[wasm_bindgen(getter, js_name = "isDisposed")]
    pub fn is_disposed(&self) -> bool {
        self.disposed
    }

    #[wasm_bindgen(getter, js_name = "valueOrNone")]
    pub fn value_or_none(&self) -> JsValue {
        let result = Object::new();
        
        if self.disposed {
            Reflect::set(&result, &"isSome".into(), &JsValue::from(false)).unwrap();
            Reflect::set(&result, &"value".into(), &JsValue::null()).unwrap();
        } else {
            Reflect::set(&result, &"isSome".into(), &JsValue::from(true)).unwrap();
            Reflect::set(&result, &"value".into(), &self.value).unwrap();
        }
        
        result.into()
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        format!("[Resource {}]", if self.disposed { "disposed" } else { "active" })
    }
}

#[wasm_bindgen(js_name = "createManagedResource")]
pub fn create_managed_resource(value: JsValue, dispose_fn: Function) -> ManagedResource {
    ManagedResource::new(value, dispose_fn)
}

#[wasm_bindgen(js_name = "withManagedResource")]
pub fn with_managed_resource(resource: &ManagedResource, fn_callback: &Function) -> Promise {
    let code = r#"
    (function(resource, callback) {
        return new Promise((resolve, reject) => {
            try {
                const result = resource.use(callback);
                
                const handleResult = (value) => {
                    if (resource.isDisposed) {
                        resolve(value);
                        return;
                    }
                    
                    resource.dispose().then(() => {
                        resolve(value);
                    }).catch(disposeErr => {
                        reject(new Error("Resource disposal failed: " + disposeErr));
                    });
                };
                
                const handleError = (error) => {
                    if (resource.isDisposed) {
                        reject(error);
                        return;
                    }
                    
                    resource.dispose().then(() => {
                        reject(error);
                    }).catch(disposeErr => {
                        const combinedErr = new Error(
                            "Operation failed: " + error + ". Also failed to dispose: " + disposeErr
                        );
                        reject(combinedErr);
                    });
                };
                
                if (result instanceof Promise) {
                    result.then(handleResult).catch(handleError);
                } else {
                    handleResult(result);
                }
            } catch (error) {
                if (resource.isDisposed) {
                    reject(error);
                    return;
                }
                
                resource.dispose().then(() => {
                    reject(error);
                }).catch(disposeErr => {
                    const combinedErr = new Error(
                        "Operation failed: " + error + ". Also failed to dispose: " + disposeErr
                    );
                    reject(combinedErr);
                });
            }
        });
    })
    "#;
    
    let eval_fn = js_sys::eval(code).unwrap();
    let fn_result = eval_fn.dyn_into::<Function>().unwrap();
    
    let resource_js: JsValue = resource.as_ref().clone();
    
    fn_result.call2(&JsValue::null(), &resource_js, fn_callback)
        .unwrap()
        .dyn_into::<Promise>()
        .unwrap()
}