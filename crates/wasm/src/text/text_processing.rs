use wasm_bindgen::prelude::*;
use js_sys::{Array, Object, RegExp, Reflect};
use std::collections::{HashMap, HashSet};
use regex::Regex;

#[wasm_bindgen]
pub struct TextProcessing;

#[wasm_bindgen]
impl TextProcessing {
    #[wasm_bindgen(js_name = "wordCount")]
    pub fn word_count(text: &str) -> u32 {
        let re = Regex::new(r"\S+").unwrap();
        re.find_iter(text).count() as u32
    }

    #[wasm_bindgen(js_name = "sentenceCount")]
    pub fn sentence_count(text: &str) -> u32 {
        let re = Regex::new(r"[.!?]+\s*").unwrap();
        let count = re.find_iter(text).count();
        if count == 0 && !text.trim().is_empty() {
            1
        } else {
            count as u32
        }
    }

    #[wasm_bindgen(js_name = "findAllMatches")]
    pub fn find_all_matches(text: &str, pattern: &str, flags: Option<String>) -> Array {
        let flags_str = flags.unwrap_or_default();
        let re = RegExp::new(pattern, &flags_str);
        let result = Array::new();
        
        let mut start_idx = 0;
        let js_text = JsValue::from_str(text);
        
        loop {
            re.set_last_index(start_idx as f64);
            let match_result = re.exec(&js_text);
            
            if match_result.is_null() {
                break;
            }
            
            if match_result.is_object() {
                let match_obj = match_result.dyn_into::<Object>().unwrap();
                let match_str = Reflect::get(&match_obj, &JsValue::from(0)).unwrap();
                let match_idx = re.last_index() - match_str.as_string().unwrap_or_default().len() as f64;
                
                let result_obj = Object::new();
                Reflect::set(&result_obj, &JsValue::from_str("text"), &match_str).unwrap();
                Reflect::set(&result_obj, &JsValue::from_str("index"), &JsValue::from_f64(match_idx)).unwrap();
                
                let groups = Array::new();
                let match_len = match_obj.get("length").as_f64().unwrap_or(0.0) as u32;
                
                for i in 1..match_len {
                    let group = Reflect::get(&match_obj, &JsValue::from(i)).unwrap_or(JsValue::UNDEFINED);
                    groups.push(&group);
                }
                
                Reflect::set(&result_obj, &JsValue::from_str("groups"), &groups).unwrap();
                result.push(&result_obj);
                
                if re.last_index() <= start_idx as f64 {
                    start_idx += 1;
                } else {
                    start_idx = re.last_index() as usize;
                }
            } else {
                break;
            }
            
            if !flags_str.contains('g') {
                break;
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "replaceAll")]
    pub fn replace_all(text: &str, pattern: &str, replacement: &str, flags: Option<String>) -> String {
        let mut flags_str = flags.unwrap_or_default();
        if !flags_str.contains('g') {
            flags_str.push('g');
        }
        
        let re = RegExp::new(pattern, &flags_str);
        let text_js = JsValue::from_str(text);
        let replacement_js = JsValue::from_str(replacement);
        
        let result = text_js.as_string().unwrap_or_default().replace_by_pattern(&re, &replacement_js);
        result
    }

    #[wasm_bindgen(js_name = "levenshteinDistance")]
    pub fn levenshtein_distance(a: &str, b: &str) -> u32 {
        let a_chars: Vec<char> = a.chars().collect();
        let b_chars: Vec<char> = b.chars().collect();
        
        let len_a = a_chars.len();
        let len_b = b_chars.len();
        
        if len_a == 0 {
            return len_b as u32;
        }
        if len_b == 0 {
            return len_a as u32;
        }
        
        let mut matrix = vec![vec![0; len_b + 1]; len_a + 1];
        
        for i in 0..=len_a {
            matrix[i][0] = i;
        }
        for j in 0..=len_b {
            matrix[0][j] = j;
        }
        
        for i in 1..=len_a {
            for j in 1..=len_b {
                let cost = if a_chars[i - 1] == b_chars[j - 1] { 0 } else { 1 };
                
                matrix[i][j] = (matrix[i-1][j] + 1)
                    .min(matrix[i][j-1] + 1)
                    .min(matrix[i-1][j-1] + cost);
            }
        }
        
        matrix[len_a][len_b] as u32
    }

    #[wasm_bindgen(js_name = "frequencyAnalysis")]
    pub fn frequency_analysis(text: &str) -> Object {
        let mut freq: HashMap<char, u32> = HashMap::new();
        
        for c in text.chars() {
            *freq.entry(c).or_insert(0) += 1;
        }
        
        let result = Object::new();
        
        for (c, count) in freq {
            let key = c.to_string();
            Reflect::set(&result, &JsValue::from_str(&key), &JsValue::from_f64(count as f64)).unwrap();
        }
        
        result
    }

    #[wasm_bindgen(js_name = "slugify")]
    pub fn slugify(text: &str) -> String {
        let mut result = String::new();
        let normalized = text.to_lowercase();
        
        let mut prev_dash = true;
        
        for c in normalized.chars() {
            if c.is_alphanumeric() {
                result.push(c);
                prev_dash = false;
            } else if !prev_dash {
                result.push('-');
                prev_dash = true;
            }
        }
        
        if result.ends_with('-') {
            result.pop();
        }
        
        result
    }

    #[wasm_bindgen(js_name = "extractDates")]
    pub fn extract_dates(text: &str) -> Array {
        let date_patterns = [
            r"\b\d{4}-\d{2}-\d{2}\b",                             
            r"\b\d{2}/\d{2}/\d{4}\b",                             
            r"\b\d{2}\.\d{2}\.\d{4}\b",                           
            r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b", 
        ];
        
        let mut result = Array::new();
        
        for pattern in &date_patterns {
            let re = Regex::new(pattern).unwrap();
            for mtch in re.find_iter(text) {
                let date_str = &text[mtch.start()..mtch.end()];
                let date_obj = Object::new();
                Reflect::set(&date_obj, &JsValue::from_str("text"), &JsValue::from_str(date_str)).unwrap();
                Reflect::set(&date_obj, &JsValue::from_str("index"), &JsValue::from_f64(mtch.start() as f64)).unwrap();
                result.push(&date_obj);
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "tokenize")]
    pub fn tokenize(text: &str) -> Array {
        let result = Array::new();
        let re = Regex::new(r"\b\w+\b").unwrap();
        
        for mtch in re.find_iter(text) {
            let token = &text[mtch.start()..mtch.end()];
            result.push(&JsValue::from_str(token));
        }
        
        result
    }

    #[wasm_bindgen(js_name = "isEmail")]
    pub fn is_email(text: &str) -> bool {
        let re = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
        re.is_match(text)
    }

    #[wasm_bindgen(js_name = "isUrl")]
    pub fn is_url(text: &str) -> bool {
        let re = Regex::new(r"^(https?|ftp)://[^\s/$.?#].[^\s]*$").unwrap();
        re.is_match(text)
    }

    #[wasm_bindgen(js_name = "isIPv4")]
    pub fn is_ipv4(text: &str) -> bool {
        let re = Regex::new(r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$").unwrap();
        re.is_match(text)
    }

    #[wasm_bindgen(js_name = "isIPv6")]
    pub fn is_ipv6(text: &str) -> bool {
        let re = Regex::new(r"^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$").unwrap();
        re.is_match(text)
    }

    #[wasm_bindgen(js_name = "pluralize")]
    pub fn pluralize(word: &str) -> String {
        let special_cases: HashMap<&str, &str> = [
            ("child", "children"),
            ("goose", "geese"),
            ("man", "men"),
            ("woman", "women"),
            ("tooth", "teeth"),
            ("foot", "feet"),
            ("mouse", "mice"),
            ("person", "people"),
        ].iter().cloned().collect();
        
        if let Some(plural) = special_cases.get(word) {
            return plural.to_string();
        }
        
        let lowercase = word.to_lowercase();
        
        if lowercase.ends_with("s") || lowercase.ends_with("x") || 
           lowercase.ends_with("z") || lowercase.ends_with("ch") || 
           lowercase.ends_with("sh") {
            return format!("{}es", word);
        } else if lowercase.ends_with("y") && word.len() > 1 {
            let penultimate = lowercase.chars().nth(word.len() - 2).unwrap();
            if !['a', 'e', 'i', 'o', 'u'].contains(&penultimate) {
                return format!("{}ies", &word[0..word.len() - 1]);
            }
        }
        
        format!("{}s", word)
    }

    #[wasm_bindgen(js_name = "extractEntities")]
    pub fn extract_entities(text: &str) -> Object {
        let email_re = Regex::new(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b").unwrap();
        let url_re = Regex::new(r"https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)").unwrap();
        let phone_re = Regex::new(r"\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b").unwrap();
        let hashtag_re = Regex::new(r"#[a-zA-Z0-9_]+").unwrap();
        let mention_re = Regex::new(r"@[a-zA-Z0-9_]+").unwrap();
        
        let result = Object::new();
        
        let emails = Array::new();
        for mtch in email_re.find_iter(text) {
            emails.push(&JsValue::from_str(&text[mtch.start()..mtch.end()]));
        }
        Reflect::set(&result, &JsValue::from_str("emails"), &emails).unwrap();
        
        let urls = Array::new();
        for mtch in url_re.find_iter(text) {
            urls.push(&JsValue::from_str(&text[mtch.start()..mtch.end()]));
        }
        Reflect::set(&result, &JsValue::from_str("urls"), &urls).unwrap();
        
        let phones = Array::new();
        for mtch in phone_re.find_iter(text) {
            phones.push(&JsValue::from_str(&text[mtch.start()..mtch.end()]));
        }
        Reflect::set(&result, &JsValue::from_str("phones"), &phones).unwrap();
        
        let hashtags = Array::new();
        for mtch in hashtag_re.find_iter(text) {
            hashtags.push(&JsValue::from_str(&text[mtch.start()..mtch.end()]));
        }
        Reflect::set(&result, &JsValue::from_str("hashtags"), &hashtags).unwrap();
        
        let mentions = Array::new();
        for mtch in mention_re.find_iter(text) {
            mentions.push(&JsValue::from_str(&text[mtch.start()..mtch.end()]));
        }
        Reflect::set(&result, &JsValue::from_str("mentions"), &mentions).unwrap();
        
        result
    }

    #[wasm_bindgen(js_name = "extractKeywords")]
    pub fn extract_keywords(text: &str, stop_words: Option<Vec<String>>) -> Array {
        let default_stop_words = vec![
            "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", 
            "be", "been", "being", "in", "on", "at", "to", "for", "with", "by", 
            "about", "against", "between", "into", "through", "during", "before", 
            "after", "above", "below", "from", "up", "down", "of", "off", "over", "under",
        ];
        
        let stop_words_set: HashSet<String> = stop_words
            .unwrap_or_else(|| default_stop_words.iter().map(|s| s.to_string()).collect())
            .into_iter()
            .collect();
        
        let mut word_counts: HashMap<String, u32> = HashMap::new();
        let word_re = Regex::new(r"\b[a-zA-Z]{3,}\b").unwrap();
        
        for mtch in word_re.find_iter(text.to_lowercase().as_str()) {
            let word = text[mtch.start()..mtch.end()].to_lowercase();
            if !stop_words_set.contains(&word) {
                *word_counts.entry(word).or_insert(0) += 1;
            }
        }
        
        let mut words: Vec<(String, u32)> = word_counts.into_iter().collect();
        words.sort_by(|a, b| b.1.cmp(&a.1));
        
        let result = Array::new();
        for (word, count) in words.iter().take(10) {
            let keyword = Object::new();
            Reflect::set(&keyword, &JsValue::from_str("word"), &JsValue::from_str(word)).unwrap();
            Reflect::set(&keyword, &JsValue::from_str("count"), &JsValue::from_f64(*count as f64)).unwrap();
            result.push(&keyword);
        }
        
        result
    }
}