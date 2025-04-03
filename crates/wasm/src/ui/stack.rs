use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{Color, UIComponent};

#[wasm_bindgen]
pub struct VStackBuilder {
    spacing: Option<f32>,
    padding: Option<f32>,
    background: Option<Color>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl VStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { spacing: None, padding: None, background: None, children: Vec::new() }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing); self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding); self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        use web_sys::console;
    
        console::log_1(&"👀 VStackBuilder.child called".into());
    
        match component_js.as_string() {
            Some(component_str) => {
                console::log_1(&format!("📥 Received string: {}", component_str).into());
    
                match serde_json::from_str::<UIComponent>(&component_str) {
                    Ok(component) => {
                        self.children.push(component);
                        console::log_1(&"✅ Successfully deserialized child".into());
                    }
                    Err(e) => {
                        console::log_1(&format!("❌ JSON parse error: {}", e).into());
                    }
                }
            }
            None => {
                console::log_1(&"❌ component_js is not a string".into());
                console::log_1(component_js); // Logs the raw JsValue
            }
        }
    
        self
    }
    

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::VStack(milost_ui::VStackProps {
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

#[wasm_bindgen]
pub struct HStackBuilder {
    spacing: Option<f32>,
    padding: Option<f32>,
    background: Option<Color>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl HStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            spacing: None,
            padding: None,
            background: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        use web_sys::console;
    
        console::log_1(&"👀 HStackBuilder.child called".into());
    
        match component_js.as_string() {
            Some(component_str) => {
                console::log_1(&format!("📥 Received string: {}", component_str).into());
    
                match serde_json::from_str::<UIComponent>(&component_str) {
                    Ok(component) => {
                        self.children.push(component);
                        console::log_1(&"✅ Successfully deserialized child".into());
                    }
                    Err(e) => {
                        console::log_1(&format!("❌ JSON parse error: {}", e).into());
                    }
                }
            }
            None => {
                console::log_1(&"❌ component_js is not a string".into());
                console::log_1(component_js); // Logs the raw JsValue
            }
        }
    
        self
    }
    

    #[wasm_bindgen(method)]
pub fn build(&self) -> Result<JsValue, JsValue> {
    use web_sys::console;

    console::log_1(&"🛠️ HStackBuilder.build() called".into());

    console::log_1(&format!("📏 spacing: {:?}", self.spacing).into());
    console::log_1(&format!("📦 padding: {:?}", self.padding).into());
    console::log_1(&format!("🎨 background: {:?}", self.background).into());
    console::log_1(&format!("👶 children count: {}", self.children.len()).into());

    let component = UIComponent::HStack(milost_ui::HStackProps {
        spacing: self.spacing,
        padding: self.padding,
        background: self.background.clone(),
        children: self.children.clone(),
    });

    match serde_json::to_string(&component) {
        Ok(json) => {
            console::log_1(&format!("✅ Serialized JSON: {}", json).into());
            Ok(JsValue::from_str(&json))
        }
        Err(e) => {
            console::log_1(&format!("❌ Serialization error: {}", e).into());
            Err(JsValue::from_str(&format!("Serialization error: {}", e)))
        }
    }
}

}