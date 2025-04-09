use wasm_bindgen::prelude::*;
use js_sys::{Function, Symbol};
use std::cell::RefCell;
use std::rc::Rc;

#[wasm_bindgen]
pub struct MatchBuilder {
    value: JsValue,
    arms: Rc<RefCell<Vec<(JsValue, Function)>>>,
}

#[wasm_bindgen]
impl MatchBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(value: JsValue) -> MatchBuilder {
        MatchBuilder {
            value,
            arms: Rc::new(RefCell::new(Vec::new())),
        }
    }

    #[wasm_bindgen(js_name = "with")]
    pub fn with(&self, pattern: JsValue, handler: Function) -> MatchBuilder {
        self.arms.borrow_mut().push((pattern, handler));
        
        MatchBuilder {
            value: self.value.clone(),
            arms: Rc::clone(&self.arms),
        }
    }

    #[wasm_bindgen(js_name = "otherwise")]
    pub fn otherwise(&self, default_handler: Function) -> Result<JsValue, JsValue> {
        let value = self.value.clone();
        
        for (pattern, handler) in self.arms.borrow().iter() {
            if match_pattern(pattern, &value)? {
                return handler.call1(&JsValue::null(), &value);
            }
        }
        
        default_handler.call1(&JsValue::null(), &value)
    }
}

#[wasm_bindgen(js_name = "createMatchBuilder")]
pub fn create_match_builder(value: JsValue) -> MatchBuilder {
    MatchBuilder::new(value)
}

#[wasm_bindgen(js_name = "getWildcardSymbol")]
pub fn get_wildcard_symbol() -> Symbol {
    Symbol::for_("Wildcard")
}

fn match_pattern(pattern: &JsValue, value: &JsValue) -> Result<bool, JsValue> {
    if pattern.is_symbol() {
        let pattern_symbol = js_sys::Symbol::from(pattern.clone());
        let wildcard = js_sys::Symbol::for_("Wildcard");
        if pattern_symbol.to_string() == wildcard.to_string() {
            return Ok(true);
        }
    }
    
    if pattern.is_function() {
        let pattern_fn = pattern.dyn_ref::<Function>().unwrap();
        let result = pattern_fn.call1(&JsValue::null(), value)?;
        return Ok(result.is_truthy());
    }
    
    Ok(pattern == value)
}