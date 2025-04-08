use wasm_bindgen::prelude::*;

use super::RegexBuilder;

#[wasm_bindgen]
pub struct RegexLanguage {
    builder: RegexBuilder,
}

#[wasm_bindgen]
impl RegexLanguage {
    #[wasm_bindgen(constructor)]
    pub fn new() -> RegexLanguage {
        RegexLanguage {
            builder: RegexBuilder::new(),
        }
    }

    #[wasm_bindgen]
    pub fn i_want_to_find(self) -> RegexLanguage {
        self
    }

    #[wasm_bindgen]
    pub fn find_me(mut self, text: &str) -> RegexLanguage {
        self.builder = self.builder.find(text);
        self
    }

    #[wasm_bindgen]
    pub fn anything(mut self) -> RegexLanguage {
        self.builder = self.builder.anything();
        self
    }

    #[wasm_bindgen]
    pub fn something(mut self) -> RegexLanguage {
        self.builder = self.builder.something();
        self
    }

    #[wasm_bindgen]
    pub fn digits(mut self) -> RegexLanguage {
        self.builder = self.builder.digits();
        self
    }

    #[wasm_bindgen]
    pub fn an_email(mut self) -> RegexLanguage {
        self.builder = self.builder.find_email();
        self
    }

    #[wasm_bindgen]
    pub fn a_url(mut self) -> RegexLanguage {
        self.builder = self.builder.find_url();
        self
    }

    #[wasm_bindgen]
    pub fn an_ip_address(mut self) -> RegexLanguage {
        self.builder = self.builder.find_ip_address();
        self
    }

    #[wasm_bindgen]
    pub fn a_phone_number(mut self) -> RegexLanguage {
        self.builder = self.builder.find_phone_number();
        self
    }

    #[wasm_bindgen]
    pub fn a_date(mut self) -> RegexLanguage {
        self.builder = self.builder.find_date();
        self
    }

    #[wasm_bindgen]
    pub fn a_time(mut self) -> RegexLanguage {
        self.builder = self.builder.find_time();
        self
    }

    #[wasm_bindgen]
    pub fn with_email_in(mut self, field: &str) -> RegexLanguage {
        self.builder = self.builder.find_object_with_email(field);
        self
    }

    #[wasm_bindgen]
    pub fn that_contains_key(mut self, key: &str) -> RegexLanguage {
        self.builder = self.builder.find_objects_that_contains_key(key);
        self
    }

    #[wasm_bindgen]
    pub fn followed_by(mut self) -> RegexLanguage {
        self.builder = self.builder.and();
        self
    }

    #[wasm_bindgen]
    pub fn or_maybe(mut self) -> RegexLanguage {
        self.builder = self.builder.or();
        self
    }

    #[wasm_bindgen]
    pub fn that_repeats_at_least(mut self, count: usize) -> RegexLanguage {
        self.builder = self.builder.repeat_previous(count, None);
        self
    }

    #[wasm_bindgen]
    pub fn that_repeats_exactly(mut self, count: usize) -> RegexLanguage {
        self.builder = self.builder.repeat_previous(count, Some(count));
        self
    }

    #[wasm_bindgen]
    pub fn words_starting_with(mut self, prefix: &str) -> RegexLanguage {
        self.builder = self.builder.find_word_that_starts_with(prefix);
        self
    }

    #[wasm_bindgen]
    pub fn start_capturing(mut self) -> RegexLanguage {
        self.builder = self.builder.start_capture();
        self
    }

    #[wasm_bindgen]
    pub fn end_capturing(mut self) -> RegexLanguage {
        self.builder = self.builder.end_capture();
        self
    }

    #[wasm_bindgen]
    pub fn json_object(mut self) -> RegexLanguage {
        self.builder = self.builder.find_json_object();
        self
    }

    #[wasm_bindgen]
    pub fn json_array(mut self) -> RegexLanguage {
        self.builder = self.builder.find_json_array();
        self
    }

    #[wasm_bindgen]
    pub fn json_string(mut self) -> RegexLanguage {
        self.builder = self.builder.find_json_string();
        self
    }

    #[wasm_bindgen]
    pub fn json_number(mut self) -> RegexLanguage {
        self.builder = self.builder.find_json_number();
        self
    }

    #[wasm_bindgen]
    pub fn json_key(mut self) -> RegexLanguage {
        self.builder = self.builder.find_json_key();
        self
    }

    #[wasm_bindgen]
    pub fn that_repeats_zero_or_more(mut self) -> RegexLanguage {
        self.builder = self.builder.repeat_zero_or_more();
        self
    }

    #[wasm_bindgen]
    pub fn that_repeats_one_or_more(mut self) -> RegexLanguage {
        self.builder = self.builder.repeat_one_or_more();
        self
    }

    #[wasm_bindgen]
    pub fn that_is_optional(mut self) -> RegexLanguage {
        self.builder = self.builder.repeat_zero_or_one();
        self
    }

    #[wasm_bindgen]
    pub fn done(&self) -> String {
        self.builder.done()
    }

    #[wasm_bindgen(js_name = createRegex)]
    pub fn create_regex(&self) -> Result<JsValue, JsValue> {
        self.builder.create_regex()
    }

    #[wasm_bindgen(js_name = test)]
    pub fn test(&self, text: &str) -> Result<bool, JsValue> {
        self.builder.test(text)
    }

    #[wasm_bindgen(js_name = extractMatches)]
    pub fn extract_matches(&self, text: &str) -> Result<JsValue, JsValue> {
        self.builder.extract_matches(text)
    }
}