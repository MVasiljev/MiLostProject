use crate::{components::{ImageProps, ImageSource, UIComponent}, hooks::{
    use_avatar_image, 
    use_blurred_background, 
    use_rounded_image
}};

pub fn create_remote_image(url: &str) -> UIComponent {
    UIComponent::Image(
        ImageProps::new(ImageSource::Remote(url.to_string()))
    )
}

pub fn create_asset_image(path: &str) -> UIComponent {
    UIComponent::Image(
        ImageProps::new(ImageSource::Asset(path.to_string()))
    )
}

pub fn create_avatar(url: &str) -> UIComponent {
    let avatar_style = use_avatar_image();
    let props = avatar_style(
        ImageProps::new(ImageSource::Remote(url.to_string()))
    );
    UIComponent::Image(props)
}

pub fn create_rounded_image(url: &str) -> UIComponent {
    let rounded_style = use_rounded_image();
    let props = rounded_style(
        ImageProps::new(ImageSource::Remote(url.to_string()))
    );
    UIComponent::Image(props)
}

pub fn create_blurred_background(url: &str) -> UIComponent {
    let background_style = use_blurred_background();
    let props = background_style(
        ImageProps::new(ImageSource::Remote(url.to_string()))
    );
    UIComponent::Image(props)
}

pub fn create_memory_image(data: Vec<u8>) -> UIComponent {
    UIComponent::Image(
        ImageProps::new(ImageSource::Memory(data))
    )
}