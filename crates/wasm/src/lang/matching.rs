use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Object, Reflect, Symbol};

#[wasm_bindgen(js_name = "getSomePattern")]
pub fn get_some_pattern() -> Symbol {
    Symbol::for_("Some")
}

#[wasm_bindgen(js_name = "getNonePattern")]
pub fn get_none_pattern() -> Symbol {
    Symbol::for_("None")
}

#[wasm_bindgen(js_name = "getOkPattern")]
pub fn get_ok_pattern() -> Symbol {
    Symbol::for_("Ok")
}

#[wasm_bindgen(js_name = "getErrPattern")]
pub fn get_err_pattern() -> Symbol {
    Symbol::for_("Err")
}

#[wasm_bindgen(js_name = "getWildcardPattern")]
pub fn get_wildcard_pattern() -> Symbol {
    Symbol::for_("_")
}

#[wasm_bindgen(js_name = "matchesPattern")]
pub fn matches_pattern(value: &JsValue, pattern: &JsValue) -> Result<bool, JsValue> {
    if pattern.is_symbol() {
        let pattern_symbol = js_sys::Symbol::from(pattern.clone());
        let wildcard = js_sys::Symbol::for_("_");
        if pattern_symbol.to_string() == wildcard.to_string() {
            return Ok(true);
        }
    }

    if pattern.is_symbol() {
        let pattern_symbol = js_sys::Symbol::from(pattern.clone());
        
        let some_pattern = Symbol::for_("Some");
        if pattern_symbol.to_string() == some_pattern.to_string() {
            if value.is_object() {
                let is_some_method = Reflect::get(value, &"isSome".into())?;
                if is_some_method.is_function() {
                    let is_some_fn = is_some_method.dyn_ref::<Function>().unwrap();
                    let result = is_some_fn.call0(value)?;
                    return Ok(result.is_truthy());
                }
            }
            return Ok(false);
        }
        
        let none_pattern = Symbol::for_("None");
        if pattern_symbol.to_string() == none_pattern.to_string() {
            if value.is_object() {
                let is_none_method = Reflect::get(value, &"isNone".into())?;
                if is_none_method.is_function() {
                    let is_none_fn = is_none_method.dyn_ref::<Function>().unwrap();
                    let result = is_none_fn.call0(value)?;
                    return Ok(result.is_truthy());
                }
            }
            return Ok(false);
        }
        
        let ok_pattern = Symbol::for_("Ok");
        if pattern_symbol.to_string() == ok_pattern.to_string() {
            if value.is_object() {
                let is_ok_method = Reflect::get(value, &"isOk".into())?;
                if is_ok_method.is_function() {
                    let is_ok_fn = is_ok_method.dyn_ref::<Function>().unwrap();
                    let result = is_ok_fn.call0(value)?;
                    return Ok(result.is_truthy());
                }
            }
            return Ok(false);
        }
        
        let err_pattern = Symbol::for_("Err");
        if pattern_symbol.to_string() == err_pattern.to_string() {
            if value.is_object() {
                let is_err_method = Reflect::get(value, &"isErr".into())?;
                if is_err_method.is_function() {
                    let is_err_fn = is_err_method.dyn_ref::<Function>().unwrap();
                    let result = is_err_fn.call0(value)?;
                    return Ok(result.is_truthy());
                }
            }
            return Ok(false);
        }
    }

    if pattern.is_function() {
        let pattern_fn = pattern.dyn_ref::<Function>().unwrap();
        let result = pattern_fn.call1(&JsValue::null(), value)?;
        return Ok(result.is_truthy());
    }

    if pattern.is_object() && !pattern.is_null() && !pattern.is_function() && !Array::is_array(pattern) {
        if !value.is_object() || value.is_null() {
            return Ok(false);
        }

        let pattern_obj = pattern.dyn_ref::<Object>().unwrap();
        let keys = Object::keys(pattern_obj);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            
            if !Reflect::has(value, &key)? {
                return Ok(false);
            }
            
            let sub_value = Reflect::get(value, &key)?;
            let sub_pattern = Reflect::get(pattern_obj, &key)?;
            
            if !matches_pattern(&sub_value, &sub_pattern)? {
                return Ok(false);
            }
        }
        
        return Ok(true);
    }

    Ok(js_sys::Object::is(&value, &pattern))
}

#[wasm_bindgen(js_name = "extractValue")]
pub fn extract_value(value: &JsValue, pattern: &JsValue) -> Result<JsValue, JsValue> {
    if pattern.is_symbol() {
        let pattern_symbol = js_sys::Symbol::from(pattern.clone());
        let some_pattern = Symbol::for_("Some");
        
        if pattern_symbol.to_string() == some_pattern.to_string() && value.is_object() {
            let unwrap_method = Reflect::get(value, &"unwrap".into())?;
            if unwrap_method.is_function() {
                let unwrap_fn = unwrap_method.dyn_ref::<Function>().unwrap();
                return unwrap_fn.call0(value);
            }
        }
        
        let err_pattern = Symbol::for_("Err");
        if pattern_symbol.to_string() == err_pattern.to_string() && value.is_object() {
            let get_error_method = Reflect::get(value, &"getError".into())?;
            if get_error_method.is_function() {
                let get_error_fn = get_error_method.dyn_ref::<Function>().unwrap();
                return get_error_fn.call0(value);
            }
        }
    }
    
    Ok(value.clone())
}

#[wasm_bindgen(js_name = "matchValue")]
pub fn match_value(value: &JsValue, patterns: &JsValue) -> Result<JsValue, JsValue> {
    if Array::is_array(patterns) {
        let patterns_array = Array::from(patterns);
        let length = patterns_array.length();
        
        for i in 0..length {
            let pair = patterns_array.get(i);
            if !Array::is_array(&pair) {
                continue;
            }
            
            let pair_array = Array::from(&pair);
            if pair_array.length() != 2 {
                continue;
            }
            
            let pattern = pair_array.get(0);
            let handler = pair_array.get(1);
            
            if !handler.is_function() {
                continue;
            }
            
            if matches_pattern(value, &pattern)? {
                let extracted = extract_value(value, &pattern)?;
                let handler_fn = handler.dyn_ref::<Function>().unwrap();
                return handler_fn.call1(&JsValue::null(), &extracted);
            }
        }
        
        let error = Object::new();
        Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
        Reflect::set(&error, &"message".into(), &"No pattern matched and no default provided".into())?;
        return Err(error.into());
    }
    
    if patterns.is_object() && !patterns.is_null() && !Array::is_array(patterns) {
        if js_sys::Reflect::has(value, &"isSome".into())? && 
           js_sys::Reflect::has(value, &"isNone".into())? {
            
            let is_some_method = Reflect::get(value, &"isSome".into())?;
            let is_some_fn = is_some_method.dyn_ref::<Function>().unwrap();
            let is_some = is_some_fn.call0(value)?.is_truthy();
            
            if is_some && js_sys::Reflect::has(patterns, &"Some".into())? {
                let some_handler = Reflect::get(patterns, &"Some".into())?;
                if some_handler.is_function() {
                    let unwrap_method = Reflect::get(value, &"unwrap".into())?;
                    let unwrap_fn = unwrap_method.dyn_ref::<Function>().unwrap();
                    let inner_value = unwrap_fn.call0(value)?;
                    
                    let handler_fn = some_handler.dyn_ref::<Function>().unwrap();
                    return handler_fn.call1(&JsValue::null(), &inner_value);
                }
            } else if !is_some && js_sys::Reflect::has(patterns, &"None".into())? {
                let none_handler = Reflect::get(patterns, &"None".into())?;
                if none_handler.is_function() {
                    let handler_fn = none_handler.dyn_ref::<Function>().unwrap();
                    return handler_fn.call1(&JsValue::null(), value);
                }
            }
            
            if js_sys::Reflect::has(patterns, &"_".into())? {
                let wildcard_handler = Reflect::get(patterns, &"_".into())?;
                if wildcard_handler.is_function() {
                    let handler_fn = wildcard_handler.dyn_ref::<Function>().unwrap();
                    return handler_fn.call1(&JsValue::null(), value);
                }
            }
            
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
            Reflect::set(&error, &"message".into(), &"No matching pattern found for Option value".into())?;
            return Err(error.into());
        }
        
        if js_sys::Reflect::has(value, &"isOk".into())? && 
           js_sys::Reflect::has(value, &"isErr".into())? {
            
            let is_ok_method = Reflect::get(value, &"isOk".into())?;
            let is_ok_fn = is_ok_method.dyn_ref::<Function>().unwrap();
            let is_ok = is_ok_fn.call0(value)?.is_truthy();
            
            if is_ok && js_sys::Reflect::has(patterns, &"Ok".into())? {
                let ok_handler = Reflect::get(patterns, &"Ok".into())?;
                if ok_handler.is_function() {
                    let unwrap_method = Reflect::get(value, &"unwrap".into())?;
                    let unwrap_fn = unwrap_method.dyn_ref::<Function>().unwrap();
                    let inner_value = unwrap_fn.call0(value)?;
                    
                    let handler_fn = ok_handler.dyn_ref::<Function>().unwrap();
                    return handler_fn.call1(&JsValue::null(), &inner_value);
                }
            } else if !is_ok && js_sys::Reflect::has(patterns, &"Err".into())? {
                let err_handler = Reflect::get(patterns, &"Err".into())?;
                if err_handler.is_function() {
                    let get_error_method = Reflect::get(value, &"getError".into())?;
                    let get_error_fn = get_error_method.dyn_ref::<Function>().unwrap();
                    let error_value = get_error_fn.call0(value)?;
                    
                    let handler_fn = err_handler.dyn_ref::<Function>().unwrap();
                    return handler_fn.call1(&JsValue::null(), &error_value);
                }
            }
            
            if js_sys::Reflect::has(patterns, &"_".into())? {
                let wildcard_handler = Reflect::get(patterns, &"_".into())?;
                if wildcard_handler.is_function() {
                    let handler_fn = wildcard_handler.dyn_ref::<Function>().unwrap();
                    return handler_fn.call1(&JsValue::null(), value);
                }
            }
            
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
            Reflect::set(&error, &"message".into(), &"No matching pattern found for Result value".into())?;
            return Err(error.into());
        }
        
        let pattern_array = Array::new();
        let pattern_obj = Object::from(patterns.clone());
        let keys = Object::keys(&pattern_obj);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let handler = Reflect::get(&pattern_obj, &key)?;
            
            if handler.is_function() {
                let pair = Array::new();
                
                if key.is_string() {
                    let key_str = key.as_string().unwrap();
                    match key_str.as_str() {
                        "Some" => { pair.push(&get_some_pattern().into()); }
                        "None" => { pair.push(&get_none_pattern().into()); }
                        "Ok" => { pair.push(&get_ok_pattern().into()); }
                        "Err" => { pair.push(&get_err_pattern().into()); }
                        "_" => { pair.push(&get_wildcard_pattern().into()); }
                        _ => { pair.push(&key); }
                    }
                } else {
                    pair.push(&key);
                }
                
                pair.push(&handler);
                pattern_array.push(&pair);
            }
        }
        
        return match_value(value, &pattern_array.into());
    }
    
    let error = Object::new();
    Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
    Reflect::set(&error, &"message".into(), &"Invalid patterns argument".into())?;
    Err(error.into())
}

#[wasm_bindgen(js_name = "createPatternMatcherIs")]
pub fn create_pattern_matcher_is() -> Result<Object, JsValue> {
    let is_obj = Object::new();
    
    let is_nullish = js_sys::Function::new_with_args("val", "return val === null || val === undefined;");
    Reflect::set(&is_obj, &"nullish".into(), &is_nullish)?;
    
    let is_str = js_sys::Function::new_with_args("val", "return val && typeof val === 'object' && val.constructor && val.constructor._type === 'Str';");
    Reflect::set(&is_obj, &"str".into(), &is_str)?;
    
    let is_raw_string = js_sys::Function::new_with_args("val", "return typeof val === 'string';");
    Reflect::set(&is_obj, &"rawString".into(), &is_raw_string)?;
    
    let is_numeric = js_sys::Function::new_with_args("val", 
        "return (typeof val === 'number' && !isNaN(val)) || 
                (val instanceof Number && !isNaN(val.valueOf()));");
    Reflect::set(&is_obj, &"numeric".into(), &is_numeric)?;
    
    let is_raw_number = js_sys::Function::new_with_args("val", "return typeof val === 'number' && !isNaN(val);");
    Reflect::set(&is_obj, &"rawNumber".into(), &is_raw_number)?;
    
    let is_boolean = js_sys::Function::new_with_args("val", "return typeof val === 'boolean';");
    Reflect::set(&is_obj, &"boolean".into(), &is_boolean)?;
    
    let is_vec = js_sys::Function::new_with_args("val", "return val && typeof val === 'object' && val.constructor && val.constructor._type === 'Vec';");
    Reflect::set(&is_obj, &"vec".into(), &is_vec)?;
    
    let is_object = js_sys::Function::new_with_args("val", 
        "return val !== null && 
                typeof val === 'object' && 
                !(val && val.constructor && val.constructor._type === 'Vec') && 
                !(val && val.constructor && val.constructor._type === 'Str') && 
                !(val instanceof Array);");
    Reflect::set(&is_obj, &"object".into(), &is_object)?;
    
    let is_function = js_sys::Function::new_with_args("val", "return typeof val === 'function';");
    Reflect::set(&is_obj, &"function".into(), &is_function)?;
    
    let is_some = js_sys::Function::new_with_args("val", "return val && typeof val === 'object' && typeof val.isSome === 'function' && val.isSome();");
    Reflect::set(&is_obj, &"some".into(), &is_some)?;
    
    let is_none = js_sys::Function::new_with_args("val", "return val && typeof val === 'object' && typeof val.isNone === 'function' && val.isNone();");
    Reflect::set(&is_obj, &"none".into(), &is_none)?;
    
    let is_ok = js_sys::Function::new_with_args("val", "return val && typeof val === 'object' && typeof val.isOk === 'function' && val.isOk();");
    Reflect::set(&is_obj, &"ok".into(), &is_ok)?;
    
    let is_err = js_sys::Function::new_with_args("val", "return val && typeof val === 'object' && typeof val.isErr === 'function' && val.isErr();");
    Reflect::set(&is_obj, &"err".into(), &is_err)?;
    
    let is_empty = js_sys::Function::new_with_args("val", 
        "if (val === null || val === undefined) return true;
         if (val && val.constructor && val.constructor._type === 'Str') return val.unwrap().length === 0;
         if (val && val.constructor && val.constructor._type === 'Vec') return val.isEmpty();
         if (typeof val === 'string') return val.length === 0;
         if (typeof val === 'object') return Object.keys(val).length === 0;
         return false;");
    Reflect::set(&is_obj, &"empty".into(), &is_empty)?;
    
    let equal_to = js_sys::Function::new_with_args("target", "return function(val) { return val === target; };");
    Reflect::set(&is_obj, &"equalTo".into(), &equal_to)?;
    
    let in_range = js_sys::Function::new_with_args("min, max", "return function(val) { return val >= min && val <= max; };");
    Reflect::set(&is_obj, &"inRange".into(), &in_range)?;
    
    let predicate = js_sys::Function::new_with_args("fn", "return fn;");
    Reflect::set(&is_obj, &"predicate".into(), &predicate)?;
    
    Ok(is_obj)
}