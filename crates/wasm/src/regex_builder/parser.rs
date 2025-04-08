use regex::Regex;

pub fn parse_regex(pattern: &str) -> Result<Vec<String>, String> {
    match Regex::new(pattern) {
        Ok(re) => Ok(re.capture_names()
            .filter_map(|name| name.map(|n| n.to_string()))
            .collect()),
        Err(e) => Err(format!("Invalid regex: {}", e)),
    }
}

pub fn extract_matches(pattern: &str, text: &str) -> Result<Vec<String>, String> {
    match Regex::new(pattern) {
        Ok(re) => {
            let matches = re.captures_iter(text)
                .map(|cap| {
                    if cap.len() > 1 {
                        cap.get(1).map_or("", |m| m.as_str()).to_string()
                    } else {
                        cap.get(0).map_or("", |m| m.as_str()).to_string()
                    }
                })
                .collect();
            Ok(matches)
        },
        Err(e) => Err(format!("Invalid regex: {}", e)),
    }
}

pub fn test_pattern(pattern: &str, text: &str) -> Result<bool, String> {
    match Regex::new(pattern) {
        Ok(re) => Ok(re.is_match(text)),
        Err(e) => Err(format!("Invalid regex: {}", e)),
    }
}

pub fn replace_matches(pattern: &str, text: &str, replacement: &str) -> Result<String, String> {
    match Regex::new(pattern) {
        Ok(re) => Ok(re.replace_all(text, replacement).to_string()),
        Err(e) => Err(format!("Invalid regex: {}", e)),
    }
}