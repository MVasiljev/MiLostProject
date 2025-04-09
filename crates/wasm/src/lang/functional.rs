use wasm_bindgen::prelude::*;
use js_sys::{Object, Map, JSON, Date, Reflect, Function, Array, Symbol, JsString};
use super::vec::Vec as RustVec;

#[wasm_bindgen(js_name = "isMergeableObjectRust")]
pub fn is_mergeable_object(value: &JsValue) -> bool {
    if !value.is_object() || value.is_null() {
        return false;
    }
    
    let constructor_key = JsValue::from_str("constructor");
    if let Ok(constructor) = Reflect::get(value, &constructor_key) {
        let name_key = JsValue::from_str("name");
        if let Ok(name) = Reflect::get(&constructor, &name_key) {
            let name_str = name.as_string().unwrap_or_default();
            if ["Vec", "HashMap", "HashSet"].contains(&name_str.as_str()) {
                return false;
            }
        }
    }
    
    true
}

#[wasm_bindgen(js_name = "noopRust")]
pub fn noop() {}

#[wasm_bindgen(js_name = "identityRust")]
pub fn identity(value: JsValue) -> JsValue {
    value
}

#[wasm_bindgen(js_name = "notRust")]
pub fn not(value: bool) -> bool {
    !value
}

#[wasm_bindgen(js_name = "propAccessRust")]
pub fn prop_access(obj: &JsValue, key: &JsValue) -> Result<JsValue, JsValue> {
    Reflect::get(obj, key)
}

#[wasm_bindgen(js_name = "propEqRust")]
pub fn prop_eq(obj: &JsValue, key: &JsValue, value: &JsValue) -> Result<bool, JsValue> {
    let prop_value = Reflect::get(obj, key)?;
    Ok(js_sys::Object::is(&prop_value, value))
}

#[wasm_bindgen(js_name = "mapHasRust")]
pub fn map_has(map: &Map, key: &JsValue) -> bool {
    map.has(key)
}

#[wasm_bindgen(js_name = "mapGetRust")]
pub fn map_get(map: &Map, key: &JsValue) -> JsValue {
    map.get(key)
}

#[wasm_bindgen(js_name = "mapSetRust")]
pub fn map_set(map: &Map, key: &JsValue, value: &JsValue) {
    map.set(key, value);
}

#[wasm_bindgen(js_name = "shouldThrottleExecuteRust")]
pub fn should_throttle_execute(last_call: f64, wait_ms: f64) -> bool {
    let now = Date::now();
    now - last_call >= wait_ms
}

#[wasm_bindgen(js_name = "createCacheKeyRust")]
pub fn create_cache_key(args: &JsValue) -> Result<String, JsValue> {
    Ok(JSON::stringify(args)?.as_string().unwrap_or_default())
}

#[wasm_bindgen(js_name = "toHashMapRust")]
pub fn to_hash_map(iterable: &JsValue, key_value_fn: &Function) -> Result<JsValue, JsValue> {
    let map = Map::new();
    let symbol_iterator = Symbol::iterator();
    
    if !Reflect::has(iterable, &symbol_iterator)? {
        let error = Object::new();
        let msg = JsValue::from_str("Object is not iterable");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let iterator_method = Reflect::get(iterable, &symbol_iterator)?;
    if !iterator_method.is_function() {
        let error = Object::new();
        let msg = JsValue::from_str("Symbol.iterator is not a function");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let iterator_fn = iterator_method.dyn_ref::<Function>().unwrap();
    let iterator = iterator_fn.call0(iterable)?;
    
    let next_key = JsValue::from_str("next");
    if !Reflect::has(&iterator, &next_key)? {
        let error = Object::new();
        let msg = JsValue::from_str("Iterator does not have a next method");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let next_method = Reflect::get(&iterator, &next_key)?;
    if !next_method.is_function() {
        let error = Object::new();
        let msg = JsValue::from_str("Iterator next is not a function");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let next_fn = next_method.dyn_ref::<Function>().unwrap();
    
    loop {
        let next_result = next_fn.call0(&iterator)?;
        let done_key = JsValue::from_str("done");
        let value_key = JsValue::from_str("value");
        
        if !next_result.is_object() {
            let error = Object::new();
            let msg = JsValue::from_str("Iterator next() did not return an object");
            Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
            return Err(error.into());
        }
        
        let done = Reflect::get(&next_result, &done_key)?;
        if done.is_truthy() {
            break;
        }
        
        let value = Reflect::get(&next_result, &value_key)?;
        let pair = key_value_fn.call1(&JsValue::null(), &value)?;
        
        if Array::is_array(&pair) {
            let array = Array::from(&pair);
            if array.length() == 2 {
                let key = array.get(0);
                let val = array.get(1);
                map.set(&key, &val);
            }
        }
    }
    
    Ok(JsValue::from(map))
}

#[wasm_bindgen(js_name = "toHashSetRust")]
pub fn to_hash_set(iterable: &JsValue) -> Result<JsValue, JsValue> {
    let set = js_sys::Set::new(&JsValue::undefined());
    let symbol_iterator = Symbol::iterator();
    
    if !Reflect::has(iterable, &symbol_iterator)? {
        let error = Object::new();
        let msg = JsValue::from_str("Object is not iterable");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let iterator_method = Reflect::get(iterable, &symbol_iterator)?;
    if !iterator_method.is_function() {
        let error = Object::new();
        let msg = JsValue::from_str("Symbol.iterator is not a function");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let iterator_fn = iterator_method.dyn_ref::<Function>().unwrap();
    let iterator = iterator_fn.call0(iterable)?;
    
    let next_key = JsValue::from_str("next");
    if !Reflect::has(&iterator, &next_key)? {
        let error = Object::new();
        let msg = JsValue::from_str("Iterator does not have a next method");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let next_method = Reflect::get(&iterator, &next_key)?;
    if !next_method.is_function() {
        let error = Object::new();
        let msg = JsValue::from_str("Iterator next is not a function");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let next_fn = next_method.dyn_ref::<Function>().unwrap();
    
    loop {
        let next_result = next_fn.call0(&iterator)?;
        let done_key = JsValue::from_str("done");
        let value_key = JsValue::from_str("value");
        
        if !next_result.is_object() {
            let error = Object::new();
            let msg = JsValue::from_str("Iterator next() did not return an object");
            Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
            return Err(error.into());
        }
        
        let done = Reflect::get(&next_result, &done_key)?;
        if done.is_truthy() {
            break;
        }
        
        let value = Reflect::get(&next_result, &value_key)?;
        set.add(&value);
    }
    
    Ok(JsValue::from(set))
}

#[wasm_bindgen(js_name = "toVecRust")]
pub fn to_vec(iterable: &JsValue) -> Result<RustVec, JsValue> {
    let array = Array::new();
    let symbol_iterator = Symbol::iterator();
    
    if !Reflect::has(iterable, &symbol_iterator)? {
        let error = Object::new();
        let msg = JsValue::from_str("Object is not iterable");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let iterator_method = Reflect::get(iterable, &symbol_iterator)?;
    if !iterator_method.is_function() {
        let error = Object::new();
        let msg = JsValue::from_str("Symbol.iterator is not a function");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let iterator_fn = iterator_method.dyn_ref::<Function>().unwrap();
    let iterator = iterator_fn.call0(iterable)?;
    
    let next_key = JsValue::from_str("next");
    if !Reflect::has(&iterator, &next_key)? {
        let error = Object::new();
        let msg = JsValue::from_str("Iterator does not have a next method");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let next_method = Reflect::get(&iterator, &next_key)?;
    if !next_method.is_function() {
        let error = Object::new();
        let msg = JsValue::from_str("Iterator next is not a function");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let next_fn = next_method.dyn_ref::<Function>().unwrap();
    
    loop {
        let next_result = next_fn.call0(&iterator)?;
        let done_key = JsValue::from_str("done");
        let value_key = JsValue::from_str("value");
        
        if !next_result.is_object() {
            let error = Object::new();
            let msg = JsValue::from_str("Iterator next() did not return an object");
            Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
            return Err(error.into());
        }
        
        let done = Reflect::get(&next_result, &done_key)?;
        if done.is_truthy() {
            break;
        }
        
        let value = Reflect::get(&next_result, &value_key)?;
        array.push(&value);
    }
    
    Ok(RustVec::from_array(&array))
}

#[wasm_bindgen(js_name = "mapObjectRust")]
pub fn map_object(obj: &JsValue, fn_val: &Function) -> Result<JsValue, JsValue> {
    if !obj.is_object() || obj.is_null() {
        let error = Object::new();
        let msg = JsValue::from_str("Expected an object");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let result = Object::new();
    let obj_ref = obj.dyn_ref::<Object>().ok_or_else(|| {
        let error = Object::new();
        let msg = JsValue::from_str("Expected an object");
        Reflect::set(&error, &JsValue::from_str("message"), &msg).unwrap();
        error
    })?;
    let keys = Object::keys(obj_ref);
    
    for i in 0..keys.length() {
        let key = keys.get(i);
        let value = Reflect::get(obj, &key)?;
        let mapped = fn_val.call2(&JsValue::null(), &value, &key)?;
        Reflect::set(&result, &key, &mapped)?;
    }
    
    Ok(JsValue::from(result))
}

#[wasm_bindgen(js_name = "filterObjectRust")]
pub fn filter_object(obj: &JsValue, fn_val: &Function) -> Result<JsValue, JsValue> {
    if !obj.is_object() || obj.is_null() {
        let error = Object::new();
        let msg = JsValue::from_str("Expected an object");
        Reflect::set(&error, &JsValue::from_str("message"), &msg)?;
        return Err(error.into());
    }
    
    let result = Object::new();
    let obj_ref = obj.dyn_ref::<Object>().ok_or_else(|| {
        let error = Object::new();
        let msg = JsValue::from_str("Expected an object");
        Reflect::set(&error, &JsValue::from_str("message"), &msg).unwrap();
        error
    })?;
    let keys = Object::keys(obj_ref);
    
    for i in 0..keys.length() {
        let key = keys.get(i);
        let value = Reflect::get(obj, &key)?;
        let keep = fn_val.call2(&JsValue::null(), &value, &key)?;
        
        if keep.is_truthy() {
            Reflect::set(&result, &key, &value)?;
        }
    }
    
    Ok(JsValue::from(result))
}

#[wasm_bindgen(js_name = "pipeRust")]
pub fn pipe(fns: &Array, arg: &JsValue) -> Result<JsValue, JsValue> {
    let mut result = arg.clone();
    
    for i in 0..fns.length() {
        let fn_val = fns.get(i);
        if fn_val.is_function() {
            let func = fn_val.dyn_ref::<Function>().unwrap();
            result = func.call1(&JsValue::null(), &result)?;
        }
    }
    
    Ok(result)
}

#[wasm_bindgen(js_name = "composeRust")]
pub fn compose(fns: &Array, arg: &JsValue) -> Result<JsValue, JsValue> {
    let mut result = arg.clone();
    
    for i in (0..fns.length()).rev() {
        let fn_val = fns.get(i);
        if fn_val.is_function() {
            let func = fn_val.dyn_ref::<Function>().unwrap();
            result = func.call1(&JsValue::null(), &result)?;
        }
    }
    
    Ok(result)
}

#[wasm_bindgen(js_name = "allOfRust")]
pub fn all_of(predicates: &Array, value: &JsValue) -> Result<bool, JsValue> {
    for i in 0..predicates.length() {
        let predicate = predicates.get(i);
        if predicate.is_function() {
            let func = predicate.dyn_ref::<Function>().unwrap();
            let result = func.call1(&JsValue::null(), value)?;
            if !result.is_truthy() {
                return Ok(false);
            }
        }
    }
    
    Ok(true)
}

#[wasm_bindgen(js_name = "anyOfRust")]
pub fn any_of(predicates: &Array, value: &JsValue) -> Result<bool, JsValue> {
    for i in 0..predicates.length() {
        let predicate = predicates.get(i);
        if predicate.is_function() {
            let func = predicate.dyn_ref::<Function>().unwrap();
            let result = func.call1(&JsValue::null(), value)?;
            if result.is_truthy() {
                return Ok(true);
            }
        }
    }
    
    Ok(false)
}

#[wasm_bindgen(js_name = "zipWithRust")]
pub fn zip_with(fn_val: &Function, as_vec: &RustVec, bs_vec: &RustVec) -> Result<RustVec, JsValue> {
    let a_len = as_vec.len();
    let b_len = bs_vec.len();
    let min_len = std::cmp::min(a_len, b_len);
    
    let result = Array::new_with_length(min_len as u32);
    
    for i in 0..min_len {
        if let Some(a) = as_vec.get(i as usize) {
            if let Some(b) = bs_vec.get(i as usize) {
                let value = fn_val.call2(&JsValue::null(), &JsValue::from(a), &JsValue::from(b))?;
                result.set(i as u32, value);
            }
        }
    }
    
    Ok(RustVec::from_array(&result))
}

#[wasm_bindgen(js_name = "convergeRust")]
pub fn converge(after: &Function, fns: &Array, args: &Array) -> Result<JsValue, JsValue> {
    let results = Array::new();
    
    for i in 0..fns.length() {
        let fn_val = fns.get(i);
        if fn_val.is_function() {
            let func = fn_val.dyn_ref::<Function>().unwrap();
            let result = func.apply(&JsValue::null(), args)?;
            results.push(&result);
        }
    }
    
    let vec = RustVec::from_array(&results);
    after.call1(&JsValue::null(), &JsValue::from(vec))
}