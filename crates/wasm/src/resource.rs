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

    // ... (rest of the previous implementation, 
    // just replace `Resource` with `ManagedResource`)
}

#[wasm_bindgen(js_name = "createManagedResource")]
pub fn create_managed_resource(value: JsValue, dispose_fn: Function) -> ManagedResource {
    ManagedResource::new(value, dispose_fn)
}

#[wasm_bindgen(js_name = "withManagedResource")]
pub fn with_managed_resource(resource: &ManagedResource, fn_callback: &Function) -> Promise {
    // Previous implementation, 
    // just replace references to `Resource` with `ManagedResource`
    let code = r#"
    (function(resource, callback) {
        return new Promise((resolve, reject) => {
            try {
                const result = resource.use(callback);
                
                const handleResult = (value) => {
                    resource.dispose().then(() => {
                        resolve(value);
                    }).catch(disposeErr => {
                        reject(new Error("Resource disposal failed: " + disposeErr));
                    });
                };
                
                const handleError = (error) => {
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