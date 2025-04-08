use milost_ui::{
    shared::{Color, EdgeInsets},
    components::stack::{
        HStackAlignment, 
        VStackAlignment, 
        LayoutPriority,
        Gradient
    }
};

pub fn use_stack_alignment(alignment_str: Option<&str>, is_vertical: bool) -> Option<Box<dyn std::any::Any>> {
    if is_vertical {
        match alignment_str {
            Some("leading") => Some(Box::new(VStackAlignment::Leading)),
            Some("center") => Some(Box::new(VStackAlignment::Center)),
            Some("trailing") => Some(Box::new(VStackAlignment::Trailing)),
            _ => None,
        }
    } else {
        match alignment_str {
            Some("top") => Some(Box::new(HStackAlignment::Top)),
            Some("center") => Some(Box::new(HStackAlignment::Center)),
            Some("bottom") => Some(Box::new(HStackAlignment::Bottom)),
            Some("firstTextBaseline") => Some(Box::new(HStackAlignment::FirstTextBaseline)),
            Some("lastTextBaseline") => Some(Box::new(HStackAlignment::LastTextBaseline)),
            _ => None,
        }
    }
}

pub fn use_layout_priority(priority_value: f32) -> Option<LayoutPriority> {
    match priority_value {
        0.0 => Some(LayoutPriority::Low),
        1.0 => Some(LayoutPriority::Medium),
        2.0 => Some(LayoutPriority::High),
        _ => Some(LayoutPriority::Custom(priority_value)),
    }
}

pub fn use_gradient_stops(colors: &[Color]) -> Option<Gradient> {
    if colors.is_empty() {
        return None;
    }

    Some(Gradient {
        colors: colors.to_vec(),
        positions: (0..colors.len())
            .map(|i| i as f32 / (colors.len() - 1) as f32)
            .collect(),
        start_point: (0.0, 0.0),
        end_point: (1.0, 1.0),
        is_radial: false,
    })
}

pub fn use_edge_insets(
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

// pub fn use_color_parse(color_str: &str) -> Option<Color> {
//     Color::from_hex(color_str).ok()
// }