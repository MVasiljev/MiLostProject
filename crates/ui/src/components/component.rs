use serde::{Serialize, Deserialize};

use super::{ButtonProps, DividerProps, HStackProps, ImageProps, ScrollProps, SpacerProps, TextProps, VStackProps, ZStackProps};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum UIComponent {
    VStack(VStackProps),
    HStack(HStackProps),
    ZStack(ZStackProps),
    Text(TextProps),
    Button(ButtonProps),
    Image(ImageProps),
    Scroll(ScrollProps),
    Spacer(SpacerProps),
    Divider(DividerProps),
}
