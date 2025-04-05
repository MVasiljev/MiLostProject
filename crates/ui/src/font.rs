use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontWeight {
    Thin,
    ExtraLight,
    Light,
    Regular,
    Medium,
    SemiBold,
    Bold,
    ExtraBold,
    Black,
    Custom(u16),
}

impl FontWeight {
    pub fn to_css_weight(&self) -> String {
        match self {
            FontWeight::Thin => "100".to_string(),
            FontWeight::ExtraLight => "200".to_string(), 
            FontWeight::Light => "300".to_string(),
            FontWeight::Regular => "400".to_string(),
            FontWeight::Medium => "500".to_string(),
            FontWeight::SemiBold => "600".to_string(),
            FontWeight::Bold => "700".to_string(),
            FontWeight::ExtraBold => "800".to_string(),
            FontWeight::Black => "900".to_string(),
            FontWeight::Custom(weight) => weight.to_string(),
        }
    }
    
    pub fn value(&self) -> u16 {
        match self {
            FontWeight::Thin => 100,
            FontWeight::ExtraLight => 200,
            FontWeight::Light => 300,
            FontWeight::Regular => 400,
            FontWeight::Medium => 500,
            FontWeight::SemiBold => 600,
            FontWeight::Bold => 700,
            FontWeight::ExtraBold => 800,
            FontWeight::Black => 900,
            FontWeight::Custom(weight) => *weight,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontWidth {
    UltraCondensed,
    ExtraCondensed,
    Condensed,
    SemiCondensed,
    Normal,
    SemiExpanded,
    Expanded,
    ExtraExpanded,
    UltraExpanded,
}

impl FontWidth {
    pub fn to_css_stretch(&self) -> String {
        match self {
            FontWidth::UltraCondensed => "ultra-condensed".to_string(),
            FontWidth::ExtraCondensed => "extra-condensed".to_string(),
            FontWidth::Condensed => "condensed".to_string(),
            FontWidth::SemiCondensed => "semi-condensed".to_string(),
            FontWidth::Normal => "normal".to_string(),
            FontWidth::SemiExpanded => "semi-expanded".to_string(),
            FontWidth::Expanded => "expanded".to_string(),
            FontWidth::ExtraExpanded => "extra-expanded".to_string(),
            FontWidth::UltraExpanded => "ultra-expanded".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontSlant {
    Normal,
    Italic,
    Oblique,
}

impl FontSlant {
    pub fn to_css_style(&self) -> String {
        match self {
            FontSlant::Normal => "normal".to_string(),
            FontSlant::Italic => "italic".to_string(),
            FontSlant::Oblique => "oblique".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum TextCapitalization {
    None,
    Words,
    Sentences,
    Characters,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum TextBaseline {
    Alphabetic,
    Ideographic,
    Top,
    Bottom,
    Middle,
    Hanging,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FontFeatures {
    pub liga: Option<bool>,
    pub dlig: Option<bool>,
    pub hlig: Option<bool>,
    pub calt: Option<bool>,
    pub swsh: Option<bool>,
    pub kern: Option<bool>,
    pub smcp: Option<bool>,
    pub c2sc: Option<bool>,
    pub onum: Option<bool>,
    pub tnum: Option<bool>,
    pub zero: Option<bool>,
    pub frac: Option<bool>,
    pub ordn: Option<bool>,
    
    pub custom: Option<HashMap<String, bool>>,
}

impl FontFeatures {
    pub fn new() -> Self {
        Self {
            liga: Some(true),
            dlig: None,
            hlig: None,
            calt: Some(true),
            swsh: None,
            kern: Some(true),
            smcp: None,
            c2sc: None,
            onum: None,
            tnum: None,
            zero: None,
            frac: None,
            ordn: None,
            custom: None,
        }
    }
    
    pub fn to_css_features(&self) -> String {
        let mut features = Vec::new();
        
        if let Some(liga) = self.liga {
            features.push(format!("\"liga\" {}", if liga { 1 } else { 0 }));
        }
        
        if let Some(dlig) = self.dlig {
            features.push(format!("\"dlig\" {}", if dlig { 1 } else { 0 }));
        }
        
        if let Some(hlig) = self.hlig {
            features.push(format!("\"hlig\" {}", if hlig { 1 } else { 0 }));
        }
        
        if let Some(calt) = self.calt {
            features.push(format!("\"calt\" {}", if calt { 1 } else { 0 }));
        }
        
        if let Some(swsh) = self.swsh {
            features.push(format!("\"swsh\" {}", if swsh { 1 } else { 0 }));
        }
        
        if let Some(kern) = self.kern {
            features.push(format!("\"kern\" {}", if kern { 1 } else { 0 }));
        }
        
        if let Some(smcp) = self.smcp {
            features.push(format!("\"smcp\" {}", if smcp { 1 } else { 0 }));
        }
        
        if let Some(c2sc) = self.c2sc {
            features.push(format!("\"c2sc\" {}", if c2sc { 1 } else { 0 }));
        }
        
        if let Some(onum) = self.onum {
            features.push(format!("\"onum\" {}", if onum { 1 } else { 0 }));
        }
        
        if let Some(tnum) = self.tnum {
            features.push(format!("\"tnum\" {}", if tnum { 1 } else { 0 }));
        }
        
        if let Some(zero) = self.zero {
            features.push(format!("\"zero\" {}", if zero { 1 } else { 0 }));
        }
        
        if let Some(frac) = self.frac {
            features.push(format!("\"frac\" {}", if frac { 1 } else { 0 }));
        }
        
        if let Some(ordn) = self.ordn {
            features.push(format!("\"ordn\" {}", if ordn { 1 } else { 0 }));
        }
        
        if let Some(custom) = &self.custom {
            for (feature, value) in custom {
                features.push(format!("\"{}\" {}", feature, if *value { 1 } else { 0 }));
            }
        }
        
        features.join(", ")
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FontDescriptor {
    pub family: String,
    pub weight: Option<FontWeight>,
    pub size: Option<f32>,
    pub slant: Option<FontSlant>,
    pub width: Option<FontWidth>,
    pub line_height: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub features: Option<FontFeatures>,
}

impl FontDescriptor {
    pub fn new(family: impl Into<String>) -> Self {
        Self {
            family: family.into(),
            weight: None,
            size: None,
            slant: None,
            width: None,
            line_height: None,
            letter_spacing: None,
            features: None,
        }
    }
    
    pub fn with_weight(mut self, weight: FontWeight) -> Self {
        self.weight = Some(weight);
        self
    }
    
    pub fn with_size(mut self, size: f32) -> Self {
        self.size = Some(size);
        self
    }
    
    pub fn with_slant(mut self, slant: FontSlant) -> Self {
        self.slant = Some(slant);
        self
    }
    
    pub fn with_width(mut self, width: FontWidth) -> Self {
        self.width = Some(width);
        self
    }
    
    pub fn with_line_height(mut self, line_height: f32) -> Self {
        self.line_height = Some(line_height);
        self
    }
    
    pub fn with_letter_spacing(mut self, letter_spacing: f32) -> Self {
        self.letter_spacing = Some(letter_spacing);
        self
    }
    
    pub fn with_features(mut self, features: FontFeatures) -> Self {
        self.features = Some(features);
        self
    }
    
    pub fn to_css_string(&self) -> String {
        let mut parts = Vec::new();
        
        if let Some(slant) = &self.slant {
            parts.push(slant.to_css_style());
        }
        
        
        if let Some(weight) = &self.weight {
            parts.push(weight.to_css_weight());
        }
        
        
        if let Some(size) = self.size {
            if let Some(line_height) = self.line_height {
                parts.push(format!("{}px/{}em", size, line_height));
            } else {
                parts.push(format!("{}px", size));
            }
        }
        
        parts.push(if self.family.contains(' ') && !self.family.starts_with('"') {
            format!("\"{}\"", self.family)
        } else {
            self.family.clone()
        });
        
        parts.join(" ")
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum SystemFont {
    Default,
    Serif,
    SansSerif,
    Monospace,
    Cursive,
    Fantasy,
    SystemUI,
}

impl SystemFont {
    pub fn to_css_family(&self) -> String {
        match self {
            SystemFont::Default => "sans-serif".to_string(),
            SystemFont::Serif => "serif".to_string(),
            SystemFont::SansSerif => "sans-serif".to_string(),
            SystemFont::Monospace => "monospace".to_string(),
            SystemFont::Cursive => "cursive".to_string(),
            SystemFont::Fantasy => "fantasy".to_string(),
            SystemFont::SystemUI => "system-ui".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FontFamily {
    pub primary: String,
    pub fallbacks: Vec<String>,
    pub system_fallback: Option<SystemFont>,
}

impl FontFamily {
    pub fn new(primary: impl Into<String>) -> Self {
        Self {
            primary: primary.into(),
            fallbacks: Vec::new(),
            system_fallback: Some(SystemFont::Default),
        }
    }
    
    pub fn add_fallback(mut self, fallback: impl Into<String>) -> Self {
        self.fallbacks.push(fallback.into());
        self
    }
    
    pub fn with_system_fallback(mut self, system_font: SystemFont) -> Self {
        self.system_fallback = Some(system_font);
        self
    }
    
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
            families.push(system.to_css_family());
        }
        
        families.join(", ")
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FontStyle {
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

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct TextStyle {
    pub font: FontDescriptor,
    pub line_spacing: Option<f32>,
    pub paragraph_spacing: Option<f32>,
    pub text_case: Option<TextCapitalization>,
    pub baseline: Option<TextBaseline>,
}

impl TextStyle {
    pub fn new(font: FontDescriptor) -> Self {
        Self {
            font,
            line_spacing: None,
            paragraph_spacing: None,
            text_case: None,
            baseline: None,
        }
    }
    
    pub fn with_line_spacing(mut self, spacing: f32) -> Self {
        self.line_spacing = Some(spacing);
        self
    }
    
    pub fn with_paragraph_spacing(mut self, spacing: f32) -> Self {
        self.paragraph_spacing = Some(spacing);
        self
    }
    
    pub fn with_text_case(mut self, case: TextCapitalization) -> Self {
        self.text_case = Some(case);
        self
    }
    
    pub fn with_baseline(mut self, baseline: TextBaseline) -> Self {
        self.baseline = Some(baseline);
        self
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Typography {
    pub large_title: TextStyle,
    pub title1: TextStyle,
    pub title2: TextStyle,
    pub title3: TextStyle,
    pub headline: TextStyle,
    pub subheadline: TextStyle,
    pub body: TextStyle,
    pub callout: TextStyle,
    pub caption1: TextStyle,
    pub caption2: TextStyle,
    pub footnote: TextStyle,
    pub code: TextStyle,
    pub button: TextStyle,
    pub link: TextStyle,
    
    pub custom_styles: HashMap<String, TextStyle>,
    
    pub text_size_adjustment: f32,
}

impl Typography {
    pub fn get_style(&self, style: &FontStyle) -> &TextStyle {
        match style {
            FontStyle::LargeTitle => &self.large_title,
            FontStyle::Title1 => &self.title1,
            FontStyle::Title2 => &self.title2,
            FontStyle::Title3 => &self.title3,
            FontStyle::Headline => &self.headline,
            FontStyle::Subheadline => &self.subheadline,
            FontStyle::Body => &self.body,
            FontStyle::Callout => &self.callout,
            FontStyle::Caption1 => &self.caption1,
            FontStyle::Caption2 => &self.caption2,
            FontStyle::Footnote => &self.footnote,
            FontStyle::Code => &self.code,
            FontStyle::Button => &self.button,
            FontStyle::Link => &self.link,
            
            FontStyle::Title => &self.title1,
            FontStyle::Caption => &self.caption1,
        }
    }
    
    pub fn get_custom_style(&self, name: &str) -> Option<&TextStyle> {
        self.custom_styles.get(name)
    }
    
    pub fn register_custom_style(&mut self, name: impl Into<String>, style: TextStyle) {
        self.custom_styles.insert(name.into(), style);
    }
    
    pub fn set_text_size_adjustment(&mut self, adjustment: f32) {
        self.text_size_adjustment = adjustment;
    }
    
    pub fn scale_font_size(&self, base_size: f32) -> f32 {
        base_size * self.text_size_adjustment
    }
}

impl Default for Typography {
    fn default() -> Self {
        let sans_serif = FontFamily::new("Inter")
            .add_fallback("Roboto")
            .add_fallback("Segoe UI")
            .add_fallback("Helvetica Neue")
            .add_fallback("Helvetica")
            .add_fallback("Arial")
            .with_system_fallback(SystemFont::SansSerif);
        
        let sans_serif_family = sans_serif.to_css_string();
        
        let monospace = FontFamily::new("JetBrains Mono")
            .add_fallback("Menlo")
            .add_fallback("Consolas")
            .add_fallback("Monaco")
            .add_fallback("Courier New")
            .with_system_fallback(SystemFont::Monospace);
            
        let monospace_family = monospace.to_css_string();
        
        Self {
            large_title: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Bold)
                    .with_size(34.0)
                    .with_line_height(1.2)
            ),
            title1: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Bold)
                    .with_size(28.0)
                    .with_line_height(1.2)
            ),
            title2: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Bold)
                    .with_size(22.0)
                    .with_line_height(1.2)
            ),
            title3: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::SemiBold)
                    .with_size(20.0)
                    .with_line_height(1.2)
            ),
            headline: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::SemiBold)
                    .with_size(17.0)
                    .with_line_height(1.3)
            ),
            subheadline: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Medium)
                    .with_size(15.0)
                    .with_line_height(1.3)
            ),
            body: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(17.0)
                    .with_line_height(1.4)
            ),
            callout: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(16.0)
                    .with_line_height(1.4)
            ),
            caption1: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(12.0)
                    .with_line_height(1.3)
            ),
            caption2: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(11.0)
                    .with_line_height(1.3)
            ),
            footnote: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(13.0)
                    .with_line_height(1.2)
            ),
            code: TextStyle::new(
                FontDescriptor::new(monospace_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(15.0)
                    .with_line_height(1.5)
            ),
            button: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Medium)
                    .with_size(16.0)
                    .with_line_height(1.2)
            ),
            link: TextStyle::new(
                FontDescriptor::new(sans_serif_family.clone())
                    .with_weight(FontWeight::Regular)
                    .with_size(17.0)
                    .with_line_height(1.4)
            ),
            custom_styles: HashMap::new(),
            text_size_adjustment: 1.0,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FontTheme {
    pub primary_font: FontFamily,
    pub heading_font: Option<FontFamily>,
    pub code_font: FontFamily,
    pub typography: Typography,
}

impl Default for FontTheme {
    fn default() -> Self {
        let sans_serif = FontFamily::new("Inter")
            .add_fallback("Roboto")
            .add_fallback("Segoe UI")
            .add_fallback("Helvetica Neue")
            .add_fallback("Helvetica")
            .add_fallback("Arial")
            .with_system_fallback(SystemFont::SansSerif);
        
        let monospace = FontFamily::new("JetBrains Mono")
            .add_fallback("Menlo")
            .add_fallback("Consolas")
            .add_fallback("Monaco")
            .add_fallback("Courier New")
            .with_system_fallback(SystemFont::Monospace);
            
        Self {
            primary_font: sans_serif.clone(),
            heading_font: None,
            code_font: monospace,
            typography: Typography::default(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct FontRegistry {
    pub registered_fonts: HashMap<String, Vec<String>>,
}

impl FontRegistry {
    pub fn new() -> Self {
        Self {
            registered_fonts: HashMap::new(),
        }
    }
    
    pub fn register_font(&mut self, name: impl Into<String>, sources: Vec<String>) {
        self.registered_fonts.insert(name.into(), sources);
    }
    
    pub fn get_font_face_css(&self) -> String {
        let mut css = String::new();
        
        for (font_name, sources) in &self.registered_fonts {
            for source in sources {
                let format = if source.ends_with(".woff2") {
                    "woff2"
                } else if source.ends_with(".woff") {
                    "woff"
                } else if source.ends_with(".ttf") {
                    "truetype"
                } else if source.ends_with(".otf") {
                    "opentype"
                } else {
                    "auto"
                };
                
                css.push_str(&format!(
                    "@font-face {{\n  font-family: \"{}\";\n  src: url(\"{}\") format(\"{}\");\n  font-display: swap;\n}}\n\n",
                    font_name, source, format
                ));
            }
        }
        
        css
    }
}

pub mod font_presets {
    use super::*;
    
    pub fn minimalist() -> FontTheme {
        FontTheme::default()
    }
    
    pub fn classic_serif() -> FontTheme {
        let serif = FontFamily::new("Georgia")
            .add_fallback("Times New Roman")
            .add_fallback("Times")
            .with_system_fallback(SystemFont::Serif);
            
        let serif_family = serif.to_css_string();
        
        let sans_serif = FontFamily::new("Helvetica Neue")
            .add_fallback("Arial")
            .add_fallback("Segoe UI")
            .with_system_fallback(SystemFont::SansSerif);
            
        let monospace = FontFamily::new("Consolas")
            .add_fallback("Monaco")
            .add_fallback("Courier New")
            .with_system_fallback(SystemFont::Monospace);
            
        let mono_family = monospace.to_css_string();
        
        let mut typography = Typography::default();
        
        typography.large_title = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::Bold)
                .with_size(36.0)
                .with_line_height(1.2)
        );
        
        typography.title1 = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::Bold)
                .with_size(30.0)
                .with_line_height(1.2)
        );
        
        typography.title2 = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::Bold)
                .with_size(24.0)
                .with_line_height(1.2)
        );
        
        typography.title3 = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::SemiBold)
                .with_size(22.0)
                .with_line_height(1.25)
        );
        
        typography.headline = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::SemiBold)
                .with_size(18.0)
                .with_line_height(1.3)
        );
        
        typography.subheadline = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::Medium)
                .with_size(16.0)
                .with_line_height(1.3)
        );
        
        typography.body = TextStyle::new(
            FontDescriptor::new(serif_family.clone())
                .with_weight(FontWeight::Regular)
                .with_size(18.0)
                .with_line_height(1.5)
        );
        
        typography.code = TextStyle::new(
            FontDescriptor::new(mono_family)
                .with_weight(FontWeight::Regular)
                .with_size(16.0)
                .with_line_height(1.5)
        );
        
        FontTheme {
            primary_font: serif,
            heading_font: None,
            code_font: monospace,
            typography,
        }
    }
    
    pub fn modern_geometric() -> FontTheme {
        let geometric = FontFamily::new("Futura")
            .add_fallback("Century Gothic")
            .add_fallback("Avenir")
            .add_fallback("Proxima Nova")
            .with_system_fallback(SystemFont::SansSerif);
            
        let geo_family = geometric.to_css_string();
        
        let monospace = FontFamily::new("IBM Plex Mono")
            .add_fallback("Fira Code")
            .add_fallback("Source Code Pro")
            .with_system_fallback(SystemFont::Monospace);
            
        let mono_family = monospace.to_css_string();
        
        let mut typography = Typography::default();
        
        typography.large_title = TextStyle::new(
            FontDescriptor::new(geo_family.clone())
                .with_weight(FontWeight::Light)
                .with_size(40.0)
                .with_line_height(1.1)
                .with_letter_spacing(0.2)
        );
        
        typography.title1 = TextStyle::new(
            FontDescriptor::new(geo_family.clone())
                .with_weight(FontWeight::Light)
                .with_size(32.0)
                .with_line_height(1.1)
                .with_letter_spacing(0.2)
        );
        
        typography.title2 = TextStyle::new(
            FontDescriptor::new(geo_family.clone())
                .with_weight(FontWeight::Medium)
                .with_size(24.0)
                .with_line_height(1.2)
                .with_letter_spacing(0.15)
        );
        
        typography.title3 = TextStyle::new(
            FontDescriptor::new(geo_family.clone())
                .with_weight(FontWeight::Medium)
                .with_size(20.0)
                .with_line_height(1.2)
                .with_letter_spacing(0.1)
        );
        
        typography.headline = TextStyle::new(
            FontDescriptor::new(geo_family.clone())
                .with_weight(FontWeight::Medium)
                .with_size(18.0)
                .with_line_height(1.3)
        );
        
        typography.body = TextStyle::new(
            FontDescriptor::new(geo_family.clone())
                .with_weight(FontWeight::Regular)
                .with_size(16.0)
                .with_line_height(1.5)
                .with_letter_spacing(0.05)
        );
        
        typography.code = TextStyle::new(
            FontDescriptor::new(mono_family)
                .with_weight(FontWeight::Regular)
                .with_size(15.0)
                .with_line_height(1.5)
        );
        
        FontTheme {
            primary_font: geometric,
            heading_font: None,
            code_font: monospace,
            typography,
        }
    }
    
    pub fn accessibility_focused() -> FontTheme {
        let accessible = FontFamily::new("Atkinson Hyperlegible")
            .add_fallback("Open Sans")
            .add_fallback("Verdana")
            .add_fallback("Arial")
            .with_system_fallback(SystemFont::SansSerif);
            
        let access_family = accessible.to_css_string();
        
        let monospace = FontFamily::new("Fira Code")
            .add_fallback("Consolas")
            .add_fallback("Courier New")
            .with_system_fallback(SystemFont::Monospace);
            
        let mono_family = monospace.to_css_string();
        
        let mut typography = Typography::default();
        
        let accessible_features = FontFeatures {
            liga: Some(true),
            kern: Some(true),
            tnum: Some(true),
            zero: Some(true),
            ..FontFeatures::new()
        };
        
        typography.large_title = TextStyle::new(
            FontDescriptor::new(access_family.clone())
                .with_weight(FontWeight::Bold)
                .with_size(38.0)
                .with_line_height(1.3)
                .with_letter_spacing(0.1)
                .with_features(accessible_features.clone())
        );
        
        typography.title1 = TextStyle::new(
            FontDescriptor::new(access_family.clone())
                .with_weight(FontWeight::Bold)
                .with_size(32.0)
                .with_line_height(1.3)
                .with_letter_spacing(0.1)
                .with_features(accessible_features.clone())
        );
        
        typography.title2 = TextStyle::new(
            FontDescriptor::new(access_family.clone())
                .with_weight(FontWeight::Bold)
                .with_size(26.0)
                .with_line_height(1.3)
                .with_letter_spacing(0.05)
                .with_features(accessible_features.clone())
        );
        
        typography.body = TextStyle::new(
            FontDescriptor::new(access_family.clone())
                .with_weight(FontWeight::Regular)
                .with_size(18.0)
                .with_line_height(1.6)
                .with_letter_spacing(0.05)
                .with_features(accessible_features.clone())
        );
        
        typography.code = TextStyle::new(
            FontDescriptor::new(mono_family)
                .with_weight(FontWeight::Regular)
                .with_size(18.0)
                .with_line_height(1.6)
                .with_features(accessible_features.clone())
        );
        
        typography.text_size_adjustment = 1.1;
        
        FontTheme {
            primary_font: accessible,
            heading_font: None,
            code_font: monospace,
            typography,
        }
    }
}