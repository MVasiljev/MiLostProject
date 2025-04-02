use serde::{Serialize, Deserialize};
use crate::{VStackProps, HStackProps, TextProps, ButtonProps, ZStackProps, ImageProps, ScrollProps, SpacerProps, DividerProps};

#[derive(Debug, Serialize, Deserialize, Clone)]
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
