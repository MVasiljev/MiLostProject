use std::sync::atomic::{AtomicUsize, Ordering};
use crate::render::node::RenderNode;

static NODE_COUNTER: AtomicUsize = AtomicUsize::new(0);

/// Generate a unique ID for render nodes
pub fn generate_unique_id(prefix: &str) -> String {
    let id = NODE_COUNTER.fetch_add(1, Ordering::SeqCst);
    format!("{}-{}", prefix, id)
}

/// Helper function to set an optional property on a render node
pub fn set_optional_prop<T: ToString>(node: &mut RenderNode, key: &str, value: &Option<T>) {
    if let Some(val) = value {
        node.set_prop(key, val.to_string());
    }
}

/// Helper function to set edge insets property
pub fn set_edge_insets(node: &mut RenderNode, edge_insets: &Option<crate::EdgeInsets>) {
    if let Some(insets) = edge_insets {
        node.set_prop("edge_insets", format!("{},{},{},{}", 
            insets.top, insets.right, insets.bottom, insets.left));
    }
}

/// Helper function to add children to a node
pub fn add_children(node: &mut RenderNode, children: &[crate::UIComponent], render_fn: impl Fn(&crate::UIComponent) -> RenderNode) {
    for child in children {
        let child_node = render_fn(child);
        node.add_child(child_node);
    }
}