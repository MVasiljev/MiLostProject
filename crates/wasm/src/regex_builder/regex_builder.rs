use wasm_bindgen::prelude::*;
use regex::escape;

use super::operators::Operator;
use super::expressions::{Expr, ExprKind};
use super::patterns::Pattern;

#[wasm_bindgen]
pub struct RegexBuilder {
    expressions: Vec<Expr>,
    current_op: Operator,
}

#[wasm_bindgen]
impl RegexBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> RegexBuilder {
        RegexBuilder {
            expressions: vec![],
            current_op: Operator::And,
        }
    }

    #[wasm_bindgen]
    pub fn and(mut self) -> RegexBuilder {
        self.current_op = Operator::And;
        self
    }

    #[wasm_bindgen]
    pub fn or(mut self) -> RegexBuilder {
        self.current_op = Operator::Or;
        self
    }

    #[wasm_bindgen]
    pub fn find(mut self, text: &str) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Literal(escape(text)),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn anything(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(".*?".to_string()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn something(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(".+".to_string()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn maybe(mut self, text: &str) -> RegexBuilder {
        let escaped = escape(text);
        let pattern = format!("(?:{})?", escaped);
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(pattern),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn digits(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern("\\d+".to_string()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn letters(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern("[a-zA-Z]+".to_string()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn whitespace(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern("\\s+".to_string()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn optional_whitespace(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern("\\s*".to_string()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_email(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::Email.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_url(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::Url.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_ip_address(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::IpAddress.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_phone_number(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::PhoneNumber.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_date(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::Date.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_time(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::Time.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_object_with_email(mut self, key: &str) -> RegexBuilder {
        let pattern = format!(r#""{}"\s*:\s*"([^"]*@[^"]*)"#, escape(key));
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(pattern),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_object_with_id(mut self, key: &str) -> RegexBuilder {
        let pattern = format!(r#""{}"\s*:\s*"([^"]*)"#, escape(key));
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(pattern),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_objects_that_contains_key(mut self, key: &str) -> RegexBuilder {
        let pattern = format!(r#"\{{[^}}]*"{}"\s*:[^}}]*\}}"#, escape(key));
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(pattern),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn find_word_that_starts_with(mut self, prefix: &str) -> RegexBuilder {
        let pattern = format!(r"\b{}\w*\b", escape(prefix));
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(pattern),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn start_capture(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::StartCapture,
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn end_capture(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::EndCapture,
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn start_group(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::StartGroup,
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn end_group(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::EndGroup,
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn repeat_previous(mut self, min: usize, max_opt: Option<usize>) -> RegexBuilder {
        if self.expressions.is_empty() {
            return self;
        }
        
        let last_index = self.expressions.len() - 1;
        if let Some(max_val) = max_opt {
            let quantifier = format!("{{{},{}}}", min, max_val);
            self.expressions[last_index].add_quantifier(quantifier);
        } else {
            let quantifier = format!("{{{},}}", min);
            self.expressions[last_index].add_quantifier(quantifier);
        }
        
        self
    }

    #[wasm_bindgen(js_name = repeatZeroOrMore)]
    pub fn repeat_zero_or_more(mut self) -> RegexBuilder {
        if self.expressions.is_empty() {
            return self;
        }
        
        let last_index = self.expressions.len() - 1;
        self.expressions[last_index].add_quantifier("*".to_string());
        self
    }

    #[wasm_bindgen(js_name = repeatOneOrMore)]
    pub fn repeat_one_or_more(mut self) -> RegexBuilder {
        if self.expressions.is_empty() {
            return self;
        }
        
        let last_index = self.expressions.len() - 1;
        self.expressions[last_index].add_quantifier("+".to_string());
        self
    }

    #[wasm_bindgen(js_name = repeatZeroOrOne)]
    pub fn repeat_zero_or_one(mut self) -> RegexBuilder {
        if self.expressions.is_empty() {
            return self;
        }
        
        let last_index = self.expressions.len() - 1;
        self.expressions[last_index].add_quantifier("?".to_string());
        self
    }

    #[wasm_bindgen(js_name = findJsonObject)]
    pub fn find_json_object(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::JsonObject.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen(js_name = findJsonArray)]
    pub fn find_json_array(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::JsonArray.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen(js_name = findJsonString)]
    pub fn find_json_string(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::JsonString.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen(js_name = findJsonKey)]
    pub fn find_json_key(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::JsonKey.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen(js_name = findJsonNumber)]
    pub fn find_json_number(mut self) -> RegexBuilder {
        self.expressions.push(Expr {
            kind: ExprKind::Pattern(Pattern::JsonNumber.to_regex()),
            op: self.current_op,
            quantifier: None,
        });
        self
    }

    #[wasm_bindgen]
    pub fn done(&self) -> String {
        self.compile_regex()
    }

    fn compile_regex(&self) -> String {
        if self.expressions.is_empty() {
            return String::new();
        }

        let mut result = String::new();
        let mut current_group = Vec::new();
        let mut current_op = Operator::And;
        let mut first_expr = true;

        for expr in &self.expressions {
            if first_expr {
                first_expr = false;
                current_op = expr.op;
                current_group.push(expr.to_regex());
                continue;
            }

            if expr.op != current_op {
                if !current_group.is_empty() {
                    if current_op == Operator::Or && !result.is_empty() {
                        result.push_str("|");
                    }
                    
                    if current_group.len() > 1 && current_op == Operator::Or {
                        result.push_str(&format!("(?:{})", current_group.join("|")));
                    } else {
                        result.push_str(&current_group.join(""));
                    }
                    current_group.clear();
                }
                current_op = expr.op;
            }
            
            current_group.push(expr.to_regex());
        }

        if !current_group.is_empty() {
            if current_op == Operator::Or && !result.is_empty() {
                result.push_str("|");
            }
            
            if current_group.len() > 1 && current_op == Operator::Or {
                result.push_str(&format!("(?:{})", current_group.join("|")));
            } else {
                result.push_str(&current_group.join(""));
            }
        }

        result
    }

    #[wasm_bindgen(js_name = createRegex)]
    pub fn create_regex(&self) -> Result<JsValue, JsValue> {
        let pattern = self.done();
        match regex::Regex::new(&pattern) {
            Ok(_) => Ok(JsValue::from_str(&pattern)),
            Err(e) => Err(JsValue::from_str(&format!("Invalid regex: {}", e))),
        }
    }

    #[wasm_bindgen(js_name = test)]
    pub fn test(&self, text: &str) -> Result<bool, JsValue> {
        let pattern = self.done();
        match regex::Regex::new(&pattern) {
            Ok(re) => Ok(re.is_match(text)),
            Err(e) => Err(JsValue::from_str(&format!("Invalid regex: {}", e))),
        }
    }

    #[wasm_bindgen(js_name = extractMatches)]
    pub fn extract_matches(&self, text: &str) -> Result<JsValue, JsValue> {
        let pattern = self.done();
        match regex::Regex::new(&pattern) {
            Ok(re) => {
                let matches: Vec<String> = re
                    .captures_iter(text)
                    .map(|cap| {
                        if cap.len() > 1 {
                            cap.get(1).map_or("", |m| m.as_str()).to_string()
                        } else {
                            cap.get(0).map_or("", |m| m.as_str()).to_string()
                        }
                    })
                    .collect();
                
                Ok(JsValue::from_str(&serde_json::to_string(&matches).unwrap()))
            },
            Err(e) => Err(JsValue::from_str(&format!("Invalid regex: {}", e))),
        }
    }
}