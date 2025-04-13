use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Reflect, Object, Iterator as JsIterator};
use crate::lang::Option as RustOption;
use crate::Vec as RustVec;
use crate::lang::{create_none, create_some, Vec};


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

    #[wasm_bindgen(js_name = "next")]
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

    #[wasm_bindgen(js_name = "map")]
    pub fn map(&self, fn_val: &Function) -> Result<Iter, JsValue> {
        let iterator = self.iterator.clone();
        let map_fn = fn_val.clone();
        
        let mapped_iterator = js_sys::Object::new();
        
        let next_fn = Function::new_with_args(
            "", 
            r#"
            var result = this.sourceIterator.next();
            if (result.done) return { done: true };
            var mappedValue = this.mapFn(result.value, this.index++);
            return { done: false, value: mappedValue };
            "#
        );
        
        Reflect::set(&mapped_iterator, &"next".into(), &next_fn)?;
        Reflect::set(&mapped_iterator, &"sourceIterator".into(), &iterator)?;
        Reflect::set(&mapped_iterator, &"mapFn".into(), &map_fn)?;
        Reflect::set(&mapped_iterator, &"index".into(), &JsValue::from(0))?;
        
        let symbol_iterator = js_sys::Symbol::iterator();
        let self_fn = Function::new_with_args("", "return this;");
        Reflect::set(&mapped_iterator, &symbol_iterator.into(), &self_fn)?;
        
        Ok(Iter { iterator: JsValue::from(mapped_iterator).dyn_into::<JsIterator>()? })
    }

    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, fn_val: &Function) -> Result<Iter, JsValue> {
        let iterator = self.iterator.clone();
        let filter_fn = fn_val.clone();
        
        let filtered_iterator = js_sys::Object::new();
        
        let next_fn = Function::new_with_args(
            "", 
            r#"
            while (true) {
                var result = this.sourceIterator.next();
                if (result.done) return { done: true };
                if (this.filterFn(result.value, this.index++)) {
                    return { done: false, value: result.value };
                }
            }
            "#
        );
        
        Reflect::set(&filtered_iterator, &"next".into(), &next_fn)?;
        Reflect::set(&filtered_iterator, &"sourceIterator".into(), &iterator)?;
        Reflect::set(&filtered_iterator, &"filterFn".into(), &filter_fn)?;
        Reflect::set(&filtered_iterator, &"index".into(), &JsValue::from(0))?;
        
        let symbol_iterator = js_sys::Symbol::iterator();
        let self_fn = Function::new_with_args("", "return this;");
        Reflect::set(&filtered_iterator, &symbol_iterator.into(), &self_fn)?;
        
        let filtered_iterator: JsValue = filtered_iterator.into();
        Ok(Iter { iterator: filtered_iterator.dyn_into::<JsIterator>()? })
    }

    #[wasm_bindgen(js_name = "take")]
    pub fn take(&self, n: u32) -> Result<Iter, JsValue> {
        let iterator = self.iterator.clone();
        
        let take_iterator = js_sys::Object::new();
        
        let next_fn = Function::new_with_args(
            "", 
            r#"
            if (this.count >= this.limit) return { done: true };
            var result = this.sourceIterator.next();
            if (result.done) return { done: true };
            this.count++;
            return result;
            "#
        );
        
        Reflect::set(&take_iterator, &"next".into(), &next_fn)?;
        Reflect::set(&take_iterator, &"sourceIterator".into(), &iterator)?;
        Reflect::set(&take_iterator, &"limit".into(), &JsValue::from(n))?;
        Reflect::set(&take_iterator, &"count".into(), &JsValue::from(0))?;
        
        let symbol_iterator = js_sys::Symbol::iterator();
        let self_fn = Function::new_with_args("", "return this;");
        Reflect::set(&take_iterator, &symbol_iterator.into(), &self_fn)?;
        
        Ok(Iter { iterator: JsValue::from(take_iterator).dyn_into::<JsIterator>()? })
    }

    #[wasm_bindgen(js_name = "skip")]
    pub fn skip(&self, n: u32) -> Result<Iter, JsValue> {
        let iterator = self.iterator.clone();
        
        let skip_iterator = js_sys::Object::new();
        
        let next_fn = Function::new_with_args(
            "", 
            r#"
            if (!this.skipped) {
                for (var i = 0; i < this.skipCount; i++) {
                    var skip_result = this.sourceIterator.next();
                    if (skip_result.done) break;
                }
                this.skipped = true;
            }
            return this.sourceIterator.next();
            "#
        );
        
        Reflect::set(&skip_iterator, &"next".into(), &next_fn)?;
        Reflect::set(&skip_iterator, &"sourceIterator".into(), &iterator)?;
        Reflect::set(&skip_iterator, &"skipCount".into(), &JsValue::from(n))?;
        Reflect::set(&skip_iterator, &"skipped".into(), &JsValue::from(false))?;
        
        let symbol_iterator = js_sys::Symbol::iterator();
        let self_fn = Function::new_with_args("", "return this;");
        Reflect::set(&skip_iterator, &symbol_iterator.into(), &self_fn)?;
        
        Ok(Iter { iterator: JsValue::from(skip_iterator).dyn_into::<JsIterator>()? })
    }

    #[wasm_bindgen(js_name = "collect")]
    pub fn collect(&self) -> Result<RustVec, JsValue> {
        let iterator = self.iterator.clone();
        let array = Array::new();
        
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            
            if done.as_bool().unwrap_or(false) {
                break;
            }
            
            let value = Reflect::get(&next_result, &"value".into())?;
            array.push(&value);
        }
        
        Ok(RustVec::from_array(&array))
    }

    #[wasm_bindgen(js_name = "find")]
    pub fn find(&self, predicate: &Function) -> Result<RustOption, JsValue> {
        let iterator = self.iterator.clone();
        
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            
            if done.as_bool().unwrap_or(false) {
                return Ok(create_none());
            }
            
            let value = Reflect::get(&next_result, &"value".into())?;
            let result = predicate.call1(&JsValue::NULL, &value)?;
            
            if result.is_truthy() {
                return create_some(value);
            }
        }
    }

    #[wasm_bindgen(js_name = "forEach")]
    pub fn for_each(&self, fn_val: &Function) -> Result<(), JsValue> {
        let iterator = self.iterator.clone();
        let mut index = 0;
        
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            
            if done.as_bool().unwrap_or(false) {
                break;
            }
            
            let value = Reflect::get(&next_result, &"value".into())?;
            fn_val.call2(&JsValue::NULL, &value, &JsValue::from(index))?;
            index += 1;
        }
        
        Ok(())
    }

    #[wasm_bindgen(js_name = "count")]
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

    #[wasm_bindgen(js_name = "fold")]
    pub fn fold(&self, initial: &JsValue, fn_val: &Function) -> Result<JsValue, JsValue> {
        let iterator = self.iterator.clone();
        let mut acc = initial.clone();
        let mut index = 0;
        
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            
            if done.as_bool().unwrap_or(false) {
                break;
            }
            
            let value = Reflect::get(&next_result, &"value".into())?;
            acc = fn_val.call3(&JsValue::NULL, &acc, &value, &JsValue::from(index))?;
            index += 1;
        }
        
        Ok(acc)
    }

    #[wasm_bindgen(js_name = "all")]
    pub fn all(&self, predicate: &Function) -> Result<bool, JsValue> {
        let iterator = self.iterator.clone();
        
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            
            if done.as_bool().unwrap_or(false) {
                return Ok(true);
            }
            
            let value = Reflect::get(&next_result, &"value".into())?;
            let result = predicate.call1(&JsValue::NULL, &value)?;
            
            if !result.is_truthy() {
                return Ok(false);
            }
        }
    }

    #[wasm_bindgen(js_name = "any")]
    pub fn any(&self, predicate: &Function) -> Result<bool, JsValue> {
        let iterator = self.iterator.clone();
        
        loop {
            let next_result = iterator.next()?;
            let done = Reflect::get(&next_result, &"done".into())?;
            
            if done.as_bool().unwrap_or(false) {
                return Ok(false);
            }
            
            let value = Reflect::get(&next_result, &"value".into())?;
            let result = predicate.call1(&JsValue::NULL, &value)?;
            
            if result.is_truthy() {
                return Ok(true);
            }
        }
    }
}

// #[wasm_bindgen(js_name = "from")]
// pub fn from(iterable: &JsValue) -> Result<Iter, JsValue> {
//     Iter::new(iterable)
// }

#[wasm_bindgen(js_name = "fromVec")]
pub fn from_vec(vec: &RustVec) -> Result<Iter, JsValue> {
    Iter::new(&vec.to_array().into())
}

#[wasm_bindgen(js_name = "empty")]
pub fn empty() -> Iter {
    let empty_array = Array::new();
    Iter::new(&empty_array.into()).unwrap()
}

#[wasm_bindgen(js_name = "range")]
pub fn range(start: i32, end: i32, step: i32) -> Result<Iter, JsValue> {
    if step == 0 {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"Step cannot be zero".into())?;
        Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
        return Err(error.into());
    }
    
    let range_iterator = js_sys::Object::new();
    
    let next_fn = Function::new_with_args(
        "", 
        r#"
        if ((this.step > 0 && this.current >= this.end) || 
            (this.step < 0 && this.current <= this.end)) {
            return { done: true };
        }
        
        var value = this.current;
        this.current += this.step;
        return { done: false, value: value };
        "#
    );
    
    Reflect::set(&range_iterator, &"next".into(), &next_fn)?;
    Reflect::set(&range_iterator, &"current".into(), &JsValue::from(start))?;
    Reflect::set(&range_iterator, &"end".into(), &JsValue::from(end))?;
    Reflect::set(&range_iterator, &"step".into(), &JsValue::from(step))?;
    
    let symbol_iterator = js_sys::Symbol::iterator();
    let self_fn = Function::new_with_args("", "return this;");
    Reflect::set(&range_iterator, &symbol_iterator.into(), &self_fn)?;
    
    Ok(Iter { iterator: JsValue::from(range_iterator).dyn_into::<JsIterator>()? })
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