use std::sync::atomic::{AtomicUsize, Ordering};
use crate::render::node::RenderNode;
use crate::shared::properties::{Property, PropertyBag};

static NODE_COUNTER: AtomicUsize = AtomicUsize::new(0);

/// Generate a unique ID for render nodes
pub fn generate_unique_id(prefix: &str) -> String {
    let id = NODE_COUNTER.fetch_add(1, Ordering::SeqCst);
    format!("{}-{}", prefix, id)
}

/// Helper function to set an optional property on a render node.
/// If the value is Some, converts it to a Property and sets it on the node.
/// If the value is None, does nothing.
pub fn set_optional_prop<T: Into<Property> + Clone>(node: &mut RenderNode, key: &str, value: &Option<T>) {
    if let Some(val) = value {
        node.set_prop(key, val.clone());
    }
}

/// Helper function to set edge insets property using strongly-typed EdgeInsets
pub fn set_edge_insets(node: &mut RenderNode, edge_insets: &Option<crate::EdgeInsets>) {
    if let Some(insets) = edge_insets {
        node.set_prop("edge_insets", insets.clone());
    }
}

/// Helper function to add children to a node
pub fn add_children(node: &mut RenderNode, children: &[crate::UIComponent], render_fn: impl Fn(&crate::UIComponent) -> RenderNode) {
    for child in children {
        let child_node = render_fn(child);
        node.add_child(child_node);
    }
}

/// Convert a value to a property and set it on a node, with a custom key transformation function
pub fn set_prop_with_key_transform<T: Into<Property> + Clone>(
    node: &mut RenderNode, 
    base_key: &str, 
    value: &T, 
    transform_fn: impl Fn(&str) -> String
) {
    let key = transform_fn(base_key);
    node.set_prop(&key, value.clone());
}

/// Helper function to set multiple related properties on a node
pub fn set_related_props<T>(
    node: &mut RenderNode,
    base_key: &str,
    value: &T,
    property_fn: impl Fn(&T, &str) -> Option<Property>
) {
    let props = [
        format!("{}", base_key),
        format!("{}_x", base_key),
        format!("{}_y", base_key),
        format!("{}_width", base_key),
        format!("{}_height", base_key)
    ];
    
    for prop_key in props {
        if let Some(prop_value) = property_fn(value, &prop_key) {
            node.set_prop(&prop_key, prop_value);
        }
    }
}

/// Helper function to convert node properties to a struct
pub fn extract_props_to_struct<T>(
    node: &RenderNode,
    extractor_fn: impl Fn(&PropertyBag) -> T
) -> T {
    extractor_fn(&node.properties)
}

/// Helper function to set a property that could be one of multiple types
pub fn set_multi_type_prop<A, B>(
    node: &mut RenderNode,
    key: &str,
    value_a: &Option<A>,
    value_b: &Option<B>,
    convert_a: impl Fn(&A) -> Property,
    convert_b: impl Fn(&B) -> Property
) where
    A: Clone,
    B: Clone,
{
    if let Some(val) = value_a {
        node.set_prop(key, convert_a(val));
    } else if let Some(val) = value_b {
        node.set_prop(key, convert_b(val));
    }
}

/// Helper function to set an enum value with a custom string conversion
pub fn set_enum_prop<T>(
    node: &mut RenderNode,
    key: &str,
    value: &Option<T>,
    to_string_fn: impl Fn(&T) -> &str
) {
    if let Some(val) = value {
        node.set_prop(key, to_string_fn(val));
    }
}

/// Helper function to map from one property to another
pub fn map_property<T, U>(
    node: &RenderNode, 
    source_key: &str, 
    extract_fn: impl Fn(&Property) -> Option<T>,
    map_fn: impl Fn(T) -> U
) -> Option<U> {
    node.get_prop(source_key).and_then(extract_fn).map(map_fn)
}

/// Helper function to set complex object properties by breaking them down
pub fn set_complex_object<T>(
    node: &mut RenderNode,
    prefix: &str, 
    object: &Option<T>,
    property_mapper: impl Fn(&T, &mut RenderNode, &str)
) {
    if let Some(obj) = object {
        property_mapper(obj, node, prefix);
    }
}

/// Helper function to set nested properties
pub fn set_nested_props<T>(
    node: &mut RenderNode, 
    base_key: &str, 
    value: &Option<T>, 
    nested_props: &[&str],
    extract_fn: impl Fn(&T, &str) -> Option<Property>
) {
    if let Some(val) = value {
        for prop in nested_props {
            if let Some(prop_value) = extract_fn(val, prop) {
                let key = format!("{}_{}", base_key, prop);
                node.set_prop(&key, prop_value);
            }
        }
    }
}

/// For backwards compatibility: Helper function with previous API
#[deprecated(since = "1.0.0", note = "Use new property API instead")]
pub fn set_optional_prop_legacy<T: ToString>(node: &mut RenderNode, key: &str, value: &Option<T>) {
    if let Some(val) = value {
        node.set_prop(key, val.to_string());
    }
}

/// For backwards compatibility: Helper function with previous API
#[deprecated(since = "1.0.0", note = "Use new property API instead")]
pub fn set_edge_insets_legacy(node: &mut RenderNode, edge_insets: &Option<crate::EdgeInsets>) {
    if let Some(insets) = edge_insets {
        node.set_prop("edge_insets", format!("{},{},{},{}", 
            insets.top, insets.right, insets.bottom, insets.left));
    }
}