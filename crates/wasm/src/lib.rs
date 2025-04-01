mod str;
mod vec;
mod option;
mod result;
mod ui;
mod primitives;
mod error;
mod iter;
mod functional;
mod ownership;
mod r#ref;
mod refmut;

pub use str::*;
pub use vec::*;
pub use primitives::*;
pub use option::*;
pub use result::*;
pub use ui::*;
pub use error::*;
pub use iter::*;
pub use functional::*;
pub use ownership::*;
pub use r#ref::*;
pub use refmut::*;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen(js_name = getVersion)]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}