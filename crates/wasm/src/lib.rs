use wasm_bindgen::prelude::*;

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
mod task;
mod channel;
mod invariant;
mod contract;
mod match_builder;
mod matching;
mod disposable;
mod resource;

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
pub use task::*;
pub use channel::*;
pub use invariant::*;
pub use contract::*;
pub use match_builder::*;
pub use matching::*;
pub use disposable::*;
pub use resource::{
    ManagedResource,
    create_managed_resource,
    with_managed_resource
};

