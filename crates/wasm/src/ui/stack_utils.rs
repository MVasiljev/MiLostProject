
use milost_ui::{
    shared::{Color, EdgeInsets},
    components::stack::{
        HStackAlignment, 
        VStackAlignment, 
        LayoutPriority,
        Gradient
    }
};

pub fn parse_layout_priority(priority_value: f32) -> LayoutPriority {
    match priority_value {
        0.0 => LayoutPriority::Low,
        1.0 => LayoutPriority::Medium,
        2.0 => LayoutPriority::High,
        _ => LayoutPriority::Custom(priority_value),
    }
}

pub fn create_gradient(
    colors: &[Color], 
    is_radial: bool, 
    start_point: Option<(f32, f32)>, 
    end_point: Option<(f32, f32)>
) -> Option<Gradient> {
    if colors.is_empty() {
        return None;
    }

    Some(Gradient {
        colors: colors.to_vec(),
        positions: (0..colors.len())
            .map(|i| i as f32 / (colors.len() - 1) as f32)
            .collect(),
        start_point: start_point.unwrap_or((0.0, 0.0)),
        end_point: end_point.unwrap_or((1.0, 1.0)),
        is_radial,
    })
}

pub fn create_edge_insets(
    top: Option<f32>, 
    right: Option<f32>, 
    bottom: Option<f32>, 
    left: Option<f32>
) -> Option<EdgeInsets> {
    if let (Some(t), Some(r), Some(b), Some(l)) = (top, right, bottom, left) {
        Some(EdgeInsets::new(t, r, b, l))
    } else {
        None
    }
}