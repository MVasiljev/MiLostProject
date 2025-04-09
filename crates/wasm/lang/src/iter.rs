use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Reflect, Object, Iterator as JsIterator};
use crate::option::{Option as RustOption, create_some, create_none};

#[wasm_bindgen]
pub struct Iter {
    iterator: JsIterator,
}

#[wasm_bindgen]
impl Iter {
    #[wasm_bindgen(constructor)]
    pub fn new(iterable: &JsValue) -> Result<Iter, JsValue> {
        let symbol_iterator = js_sys::Symbol::iterator();
        let iterator_method = Reflect::get(iterable, &symbol_iterator.into())?;
        let iterator = Reflect::apply(&iterator_method.dyn_into::<Function>()?, iterable, &Array::new())?;
        let js_iterator = iterator.dyn_into::<JsIterator>()?;
        
        Ok(Iter { iterator: js_iterator })
    }

    #[wasm_bindgen(js_name = next)]
    pub fn next(&self) -> Result<RustOption, JsValue> {
        let next_result = self.iterator.next()?;
        let done = Reflect::get(&next_result, &"done".into())?;
        
        if done.as_bool().unwrap_or(false) {
            Ok(create_none())
        } else {
            let value = Reflect::get(&next_result, &"value".into())?;
            create_some(value)
        }
    }

    #[wasm_bindgen]
    pub fn count(&self) -> Result<u32, JsValue> {
        let iterator = self.iterator.clone();
        
        let mut count = 0;
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            if done.as_bool().unwrap_or(false) {
                break;
            }
            count += 1;
        }
        
        Ok(count)
    }
}

#[wasm_bindgen(js_name = "createIterFromIterator")]
pub fn create_iter_from_iterator(iterator: JsValue) -> Result<Iter, JsValue> {
    let js_iterator = iterator.dyn_into::<JsIterator>()?;
    Ok(Iter { iterator: js_iterator })
}

#[wasm_bindgen(js_name = "checkIterableRange")]
pub fn check_iterable_range(_start: i32, _end: i32, step: i32) -> Result<bool, JsValue> {
    if step == 0 {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"Step cannot be zero".into())?;
        Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
        return Err(error.into());
    }
    Ok(true)
}