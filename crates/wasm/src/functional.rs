use wasm_bindgen::prelude::*;
use js_sys::{Object, Map, JSON, Date, Reflect};

#[wasm_bindgen(js_name = "isMergeableObjectRust")]
pub fn is_mergeable_object(value: &JsValue) -> bool {
    if !value.is_object() || value.is_null() {
        return false;
    }
    
    if let Ok(constructor) = Reflect::get(value, &JsValue::from("constructor")) {
        if let Ok(name) = Reflect::get(&constructor, &JsValue::from("name")) {
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

#[wasm_bindgen(js_name = "propAccessRust")]
pub fn prop_access(obj: &JsValue, key: &JsValue) -> Result<JsValue, JsValue> {
    Reflect::get(obj, key)
}

#[wasm_bindgen(js_name = "propEqRust")]
pub fn prop_eq(obj: &JsValue, key: &JsValue, value: &JsValue) -> Result<bool, JsValue> {
    let prop_value = Reflect::get(obj, key)?;
    Ok(Object::is(&prop_value, value))
}

#[wasm_bindgen(js_name = "notRust")]
pub fn not(value: bool) -> bool {
    !value
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