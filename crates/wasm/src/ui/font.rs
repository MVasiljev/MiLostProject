use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

use crate::font::{
    FontWeight, FontWidth, FontSlant, TextCapitalization, TextBaseline,
    FontFeatures, FontDescriptor, SystemFont, FontFamily, FontStyle,
    TextStyle, Typography, FontTheme, FontRegistry
};

#[derive(Serialize, Deserialize)]
struct FontFeaturesJs {
    liga: Option<bool>,
    dlig: Option<bool>,
    hlig: Option<bool>,
    calt: Option<bool>,
    swsh: Option<bool>,
    kern: Option<bool>,
    smcp: Option<bool>,
    c2sc: Option<bool>,
    onum: Option<bool>,
    tnum: Option<bool>,
    zero: Option<bool>,
    frac: Option<bool>,
    ordn: Option<bool>,
    custom: Option<HashMap<String, bool>>,
}

impl From<FontFeatures> for FontFeaturesJs {
    fn from(features: FontFeatures) -> Self {
        Self {
            liga: features.liga,
            dlig: features.dlig,
            hlig: features.hlig,
            calt: features.calt,
            swsh: features.swsh,
            kern: features.kern,
            smcp: features.smcp,
            c2sc: features.c2sc,
            onum: features.onum,
            tnum: features.tnum,
            zero: features.zero,
            frac: features.frac,
            ordn: features.ordn,
            custom: features.custom,
        }
    }
}

impl From<FontFeaturesJs> for FontFeatures {
    fn from(js: FontFeaturesJs) -> Self {
        Self {
            liga: js.liga,
            dlig: js.dlig,
            hlig: js.hlig,
            calt: js.calt,
            swsh: js.swsh,
            kern: js.kern,
            smcp: js.smcp,
            c2sc: js.c2sc,
            onum: js.onum,
            tnum: js.tnum,
            zero: js.zero,
            frac: js.frac,
            ordn: js.ordn,
            custom: js.custom,
        }
    }
}

#[wasm_bindgen]
pub enum FontWeightJs {
    Thin,
    ExtraLight,
    Light,
    Regular,
    Medium,
    SemiBold,
    Bold,
    ExtraBold,
    Black,
}

impl From<FontWeightJs> for FontWeight {
    fn from(weight: FontWeightJs) -> Self {
        match weight {
            FontWeightJs::Thin => FontWeight::Thin,
            FontWeightJs::ExtraLight => FontWeight::ExtraLight,
            FontWeightJs::Light => FontWeight::Light,
            FontWeightJs::Regular => FontWeight::Regular,
            FontWeightJs::Medium => FontWeight::Medium,
            FontWeightJs::SemiBold => FontWeight::SemiBold,
            FontWeightJs::Bold => FontWeight::Bold,
            FontWeightJs::ExtraBold => FontWeight::ExtraBold,
            FontWeightJs::Black => FontWeight::Black,
        }
    }
}

#[wasm_bindgen]
pub struct FontFamilyBuilder {
    primary: String,
    fallbacks: Vec<String>,
    system_fallback: Option<String>,
}

#[wasm_bindgen]
impl FontFamilyBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(primary: &str) -> Self {
        Self {
            primary: primary.to_string(),
            fallbacks: Vec::new(),
            system_fallback: Some("sans-serif".to_string()),
        }
    }

    #[wasm_bindgen(method)]
    pub fn add_fallback(mut self, fallback: &str) -> Self {
        self.fallbacks.push(fallback.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_system_fallback(mut self, fallback: &str) -> Self {
        self.system_fallback = Some(match fallback {
            "default" => "sans-serif",
            "serif" => "serif",
            "sans-serif" => "sans-serif",
            "monospace" => "monospace",
            "cursive" => "cursive",
            "fantasy" => "fantasy",
            "system-ui" => "system-ui",
            _ => "sans-serif",
        }.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn to_css_string(&self) -> String {
        let mut families = Vec::new();
        
        if self.primary.contains(' ') && !self.primary.starts_with('"') {
            families.push(format!("\"{}\"", self.primary));
        } else {
            families.push(self.primary.clone());
        }
        
        for fallback in &self.fallbacks {
            if fallback.contains(' ') && !fallback.starts_with('"') {
                families.push(format!("\"{}\"", fallback));
            } else {
                families.push(fallback.clone());
            }
        }
        
        if let Some(system) = &self.system_fallback {
            families.push(system.clone());
        }
        
        families.join(", ")
    }
    
    fn to_font_family(&self) -> FontFamily {
        let system_fallback = match self.system_fallback.as_deref() {
            Some("serif") => Some(SystemFont::Serif),
            Some("sans-serif") => Some(SystemFont::SansSerif),
            Some("monospace") => Some(SystemFont::Monospace),
            Some("cursive") => Some(SystemFont::Cursive),
            Some("fantasy") => Some(SystemFont::Fantasy),
            Some("system-ui") => Some(SystemFont::SystemUI),
            _ => Some(SystemFont::Default),
        };
        
        FontFamily {
            primary: self.primary.clone(),
            fallbacks: self.fallbacks.clone(),
            system_fallback,
        }
    }
}

#[wasm_bindgen]
pub struct FontDescriptorBuilder {
    family: String,
    weight: Option<FontWeight>,
    size: Option<f32>,
    slant: Option<FontSlant>,
    width: Option<FontWidth>,
    line_height: Option<f32>,
    letter_spacing: Option<f32>,
    features: Option<FontFeatures>,
}

#[wasm_bindgen]
impl FontDescriptorBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(family: &str) -> Self {
        Self {
            family: family.to_string(),
            weight: None,
            size: None,
            slant: None,
            width: None,
            line_height: None,
            letter_spacing: None,
            features: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn with_weight(mut self, weight: FontWeightJs) -> Self {
        self.weight = Some(weight.into());
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_custom_weight(mut self, weight: u16) -> Self {
        if weight >= 100 && weight <= 900 {
            self.weight = Some(FontWeight::Custom(weight));
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_size(mut self, size: f32) -> Self {
        self.size = Some(size);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_slant(mut self, slant: &str) -> Self {
        self.slant = match slant {
            "normal" => Some(FontSlant::Normal),
            "italic" => Some(FontSlant::Italic),
            "oblique" => Some(FontSlant::Oblique),
            _ => None
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_width(mut self, width: &str) -> Self {
        self.width = match width {
            "ultraCondensed" => Some(FontWidth::UltraCondensed),
            "extraCondensed" => Some(FontWidth::ExtraCondensed),
            "condensed" => Some(FontWidth::Condensed),
            "semiCondensed" => Some(FontWidth::SemiCondensed),
            "normal" => Some(FontWidth::Normal),
            "semiExpanded" => Some(FontWidth::SemiExpanded),
            "expanded" => Some(FontWidth::Expanded),
            "extraExpanded" => Some(FontWidth::ExtraExpanded),
            "ultraExpanded" => Some(FontWidth::UltraExpanded),
            _ => None
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_line_height(mut self, line_height: f32) -> Self {
        self.line_height = Some(line_height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_letter_spacing(mut self, letter_spacing: f32) -> Self {
        self.letter_spacing = Some(letter_spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_features_js(mut self, features_js: JsValue) -> Result<Self, JsValue> {
        let features: FontFeaturesJs = serde_wasm_bindgen::from_value(features_js)?;
        self.features = Some(features.into());
        Ok(self)
    }

    #[wasm_bindgen(method)]
    pub fn to_css_string(&self) -> String {
        let descriptor = self.to_font_descriptor();
        descriptor.to_css_string()
    }
    
    fn to_font_descriptor(&self) -> FontDescriptor {
        let mut descriptor = FontDescriptor::new(self.family.clone());
        
        if let Some(weight) = &self.weight {
            descriptor = descriptor.with_weight(weight.clone());
        }
        
        if let Some(size) = self.size {
            descriptor = descriptor.with_size(size);
        }
        
        if let Some(slant) = &self.slant {
            descriptor = descriptor.with_slant(slant.clone());
        }
        
        if let Some(width) = &self.width {
            descriptor = descriptor.with_width(width.clone());
        }
        
        if let Some(line_height) = self.line_height {
            descriptor = descriptor.with_line_height(line_height);
        }
        
        if let Some(letter_spacing) = self.letter_spacing {
            descriptor = descriptor.with_letter_spacing(letter_spacing);
        }
        
        if let Some(features) = &self.features {
            descriptor = descriptor.with_features(features.clone());
        }
        
        descriptor
    }
}

#[wasm_bindgen]
pub struct TextStyleBuilder {
    font: FontDescriptor,
    line_spacing: Option<f32>,
    paragraph_spacing: Option<f32>,
    text_case: Option<TextCapitalization>,
    baseline: Option<TextBaseline>,
}

#[wasm_bindgen]
impl TextStyleBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(font_descriptor_builder: &FontDescriptorBuilder) -> Self {
        Self {
            font: font_descriptor_builder.to_font_descriptor(),
            line_spacing: None,
            paragraph_spacing: None,
            text_case: None,
            baseline: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn with_line_spacing(mut self, spacing: f32) -> Self {
        self.line_spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_paragraph_spacing(mut self, spacing: f32) -> Self {
        self.paragraph_spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_text_case(mut self, case: &str) -> Self {
        self.text_case = match case {
            "none" => Some(TextCapitalization::None),
            "words" => Some(TextCapitalization::Words),
            "sentences" => Some(TextCapitalization::Sentences),
            "characters" => Some(TextCapitalization::Characters),
            _ => None
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn with_baseline(mut self, baseline: &str) -> Self {
        self.baseline = match baseline {
            "alphabetic" => Some(TextBaseline::Alphabetic),
            "ideographic" => Some(TextBaseline::Ideographic),
            "top" => Some(TextBaseline::Top),
            "bottom" => Some(TextBaseline::Bottom),
            "middle" => Some(TextBaseline::Middle),
            "hanging" => Some(TextBaseline::Hanging),
            _ => None
        };
        self
    }
    
    fn to_text_style(&self) -> TextStyle {
        let mut style = TextStyle::new(self.font.clone());
        
        if let Some(line_spacing) = self.line_spacing {
            style = style.with_line_spacing(line_spacing);
        }
        
        if let Some(paragraph_spacing) = self.paragraph_spacing {
            style = style.with_paragraph_spacing(paragraph_spacing);
        }
        
        if let Some(text_case) = &self.text_case {
            style = style.with_text_case(text_case.clone());
        }
        
        if let Some(baseline) = &self.baseline {
            style = style.with_baseline(baseline.clone());
        }
        
        style
    }
}

#[wasm_bindgen]
pub struct FontRegistryJs {
    registry: FontRegistry,
}

#[wasm_bindgen]
impl FontRegistryJs {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            registry: FontRegistry::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn register_font(&mut self, name: &str, sources_js: Box<[JsValue]>) -> Result<(), JsValue> {
        let mut sources = Vec::new();
        for source in sources_js.iter() {
            sources.push(source.as_string().ok_or("Source must be a string")?);
        }
        
        self.registry.register_font(name, sources);
        Ok(())
    }

    #[wasm_bindgen(method)]
    pub fn get_font_face_css(&self) -> String {
        self.registry.get_font_face_css()
    }
    
    #[wasm_bindgen(method)]
    pub fn apply_to_document(&self) -> Result<(), JsValue> {
        let window = web_sys::window().ok_or("No window found")?;
        let document = window.document().ok_or("No document found")?;
        
        let head = document.head().ok_or("No head element found")?;
        let existing_style = document.get_element_by_id("milost-ui-fonts");
        
        let style_element = match existing_style {
            Some(element) => element,
            None => {
                let element = document.create_element("style")?;
                element.set_attribute("id", "milost-ui-fonts")?;
                head.append_child(&element)?;
                element
            }
        };
        
        style_element.set_text_content(Some(&self.get_font_face_css()));
        
        Ok(())
    }
}

#[wasm_bindgen]
pub struct FontThemeBuilder {
    primary_font: FontFamily,
    heading_font: Option<FontFamily>,
    code_font: FontFamily,
    typography: Option<Typography>,
}

#[wasm_bindgen]
impl FontThemeBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(primary_font_builder: &FontFamilyBuilder, code_font_builder: &FontFamilyBuilder) -> Self {
        Self {
            primary_font: primary_font_builder.to_font_family(),
            heading_font: None,
            code_font: code_font_builder.to_font_family(),
            typography: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn with_heading_font(mut self, heading_font_builder: &FontFamilyBuilder) -> Self {
        self.heading_font = Some(heading_font_builder.to_font_family());
        self
    }

    #[wasm_bindgen(method)]
    pub fn use_default_typography(mut self) -> Self {
        self.typography = Some(Typography::default());
        self
    }

    #[wasm_bindgen(method)]
    pub fn use_preset(mut self, preset: &str) -> Self {
        let theme = match preset {
            "minimalist" => crate::font::font_presets::minimalist(),
            "classic_serif" => crate::font::font_presets::classic_serif(),
            "modern_geometric" => crate::font::font_presets::modern_geometric(),
            "accessibility_focused" => crate::font::font_presets::accessibility_focused(),
            _ => FontTheme::default(),
        };
        
        self.typography = Some(theme.typography);
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let theme = FontTheme {
            primary_font: self.primary_font.clone(),
            heading_font: self.heading_font.clone(),
            code_font: self.code_font.clone(),
            typography: self.typography.clone().unwrap_or_default(),
        };
        
        serde_wasm_bindgen::to_value(&theme).map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

#[wasm_bindgen]
pub enum FontStyleJs {
    LargeTitle,
    Title1,
    Title2,
    Title3,
    Headline,
    Subheadline,
    Body,
    Callout,
    Caption1,
    Caption2,
    Footnote,
    Code,
    Button,
    Link,
    Title,
    Caption,
}

impl From<FontStyleJs> for FontStyle {
    fn from(style_js: FontStyleJs) -> Self {
        match style_js {
            FontStyleJs::LargeTitle => FontStyle::LargeTitle,
            FontStyleJs::Title1 => FontStyle::Title1,
            FontStyleJs::Title2 => FontStyle::Title2,
            FontStyleJs::Title3 => FontStyle::Title3,
            FontStyleJs::Headline => FontStyle::Headline,
            FontStyleJs::Subheadline => FontStyle::Subheadline,
            FontStyleJs::Body => FontStyle::Body,
            FontStyleJs::Callout => FontStyle::Callout,
            FontStyleJs::Caption1 => FontStyle::Caption1,
            FontStyleJs::Caption2 => FontStyle::Caption2,
            FontStyleJs::Footnote => FontStyle::Footnote,
            FontStyleJs::Code => FontStyle::Code,
            FontStyleJs::Button => FontStyle::Button,
            FontStyleJs::Link => FontStyle::Link,
            FontStyleJs::Title => FontStyle::Title,
            FontStyleJs::Caption => FontStyle::Caption,
        }
    }
}

#[wasm_bindgen]
pub fn get_font_css_for_style(style_js: FontStyleJs) -> String {
    let typography = Typography::default();
    let font_style: FontStyle = style_js.into();
    let text_style = typography.get_style(&font_style);
    text_style.font.to_css_string()
}

#[wasm_bindgen]
pub fn get_font_size_for_style(style_js: FontStyleJs) -> Option<f32> {
    let typography = Typography::default();
    let font_style: FontStyle = style_js.into();
    let text_style = typography.get_style(&font_style);
    text_style.font.size
}

#[wasm_bindgen]
pub async fn are_system_fonts_loaded() -> bool {
    let window = match web_sys::window() {
        Some(win) => win,
        None => return false,
    };
    
    let document = match window.document() {
        Some(doc) => doc,
        None => return false,
    };
    
    let promise = js_sys::Promise::new(&mut |resolve, _| {
        if let Some(fonts) = document.fonts() {
            let ready_promise = fonts.ready();
            let _ = ready_promise.then(&resolve);
        } else {
            let _ = resolve.call0(&JsValue::NULL);
        }
    });
    
    match wasm_bindgen_futures::JsFuture::from(promise).await {
        Ok(_) => true,
        Err(_) => false,
    }
}