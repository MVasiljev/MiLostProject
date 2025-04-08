use std::sync::atomic::{AtomicUsize, Ordering};
use crate::render::node::RenderNode;
use crate::render::property::{Property, PropertyBag};
use crate::components::UIComponent;
use crate::shared::EdgeInsets;

static NODE_COUNTER: AtomicUsize = AtomicUsize::new(0);

pub fn generate_unique_id(prefix: &str) -> String {
    let id = NODE_COUNTER.fetch_add(1, Ordering::SeqCst);
    format!("{}-{}", prefix, id)
}

pub fn set_optional_prop<T: Into<Property> + Clone>(node: &mut RenderNode, key: &str, value: &Option<T>) {
    if let Some(val) = value {
        node.set_prop(key, val.clone());
    }
}

pub fn set_edge_insets(node: &mut RenderNode, edge_insets: &Option<EdgeInsets>) {
    if let Some(insets) = edge_insets {
        node.set_prop("edge_insets", insets.clone());
    }
}

pub fn add_children(node: &mut RenderNode, children: &[UIComponent], render_fn: fn(&UIComponent) -> RenderNode) {
    for child in children {
        let child_node = render_fn(child);
        node.add_child(child_node);
    }
}

pub fn map_properties<T, F>(source: &T, mapper: F) -> PropertyBag 
where 
    F: FnOnce(&T) -> PropertyBag 
{
    mapper(source)
}

pub fn set_properties<I, K, V>(node: &mut RenderNode, properties: I)
where 
    I: IntoIterator<Item = (K, V)>,
    K: AsRef<str>,
    V: Into<Property> + Clone
{
    for (key, value) in properties {
        node.set_prop(key.as_ref(), value.clone());
    }
}

pub fn set_enum_prop<T: std::fmt::Debug>(node: &mut RenderNode, key: &str, value: &Option<T>) {
    if let Some(val) = value {
        node.set_prop(key, format!("{:?}", val));
    }
}

pub fn update_props_from_base(target: &mut RenderNode, base: &RenderNode) {
    for (key, prop) in base.properties.entries() {
        target.set_prop(key, prop.clone());
    }
}

#[deprecated(since = "1.0.0", note = "Use new property API instead")]
pub fn set_optional_prop_legacy<T: ToString>(node: &mut RenderNode, key: &str, value: &Option<T>) {
    if let Some(val) = value {
        node.set_prop(key, val.to_string());
    }
}

#[deprecated(since = "1.0.0", note = "Use new property API instead")]
pub fn set_edge_insets_legacy(node: &mut RenderNode, edge_insets: &Option<EdgeInsets>) {
    if let Some(insets) = edge_insets {
        node.set_prop("edge_insets", format!("{},{},{},{}", 
            insets.top, insets.right, insets.bottom, insets.left));
    }
}