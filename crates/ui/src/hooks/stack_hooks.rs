use crate::stack::{VStackProps, HStackProps, LayoutPriority};
use crate::Color;
use crate::EdgeInsets;
use crate::{VStackAlignment, HStackAlignment};

pub struct StackLayoutOptions {
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
    pub equal_spacing: Option<bool>,
    pub clip_to_bounds: Option<bool>,
}

pub fn use_vstack_layout(options: StackLayoutOptions) -> impl Fn(VStackProps) -> VStackProps {
    move |props| {
        let mut updated = props;
        
        if let Some(spacing) = options.spacing {
            updated.spacing = Some(spacing);
        }
        
        if let Some(padding) = options.padding {
            updated.padding = Some(padding);
        }
        
        if let Some(edge_insets) = &options.edge_insets {
            updated.edge_insets = Some(edge_insets.clone());
        }
        
        if let Some(min_width) = options.min_width {
            updated.min_width = Some(min_width);
        }
        
        if let Some(max_width) = options.max_width {
            updated.max_width = Some(max_width);
        }
        
        if let Some(min_height) = options.min_height {
            updated.min_height = Some(min_height);
        }
        
        if let Some(max_height) = options.max_height {
            updated.max_height = Some(max_height);
        }
        
        if let Some(equal_spacing) = options.equal_spacing {
            updated.equal_spacing = Some(equal_spacing);
        }
        
        if let Some(clip_to_bounds) = options.clip_to_bounds {
            updated.clip_to_bounds = Some(clip_to_bounds);
        }
        
        updated
    }
}

pub fn use_hstack_layout(options: StackLayoutOptions) -> impl Fn(HStackProps) -> HStackProps {
    move |props| {
        let mut updated = props;
        
        if let Some(spacing) = options.spacing {
            updated.spacing = Some(spacing);
        }
        
        if let Some(padding) = options.padding {
            updated.padding = Some(padding);
        }
        
        if let Some(edge_insets) = &options.edge_insets {
            updated.edge_insets = Some(edge_insets.clone());
        }
        
        if let Some(min_width) = options.min_width {
            updated.min_width = Some(min_width);
        }
        
        if let Some(max_width) = options.max_width {
            updated.max_width = Some(max_width);
        }
        
        if let Some(min_height) = options.min_height {
            updated.min_height = Some(min_height);
        }
        
        if let Some(max_height) = options.max_height {
            updated.max_height = Some(max_height);
        }
        
        if let Some(equal_spacing) = options.equal_spacing {
            updated.equal_spacing = Some(equal_spacing);
        }
        
        if let Some(clip_to_bounds) = options.clip_to_bounds {
            updated.clip_to_bounds = Some(clip_to_bounds);
        }
        
        updated
    }
}

pub struct StackStylingOptions {
    pub background: Option<Color>,
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
}

pub fn use_vstack_styling(options: StackStylingOptions) -> impl Fn(VStackProps) -> VStackProps {
    move |props| {
        let mut updated = props;
        
        if let Some(background) = &options.background {
            updated.background = Some(background.clone());
        }
        
        if let Some(border_width) = options.border_width {
            updated.border_width = Some(border_width);
        }
        
        if let Some(border_color) = &options.border_color {
            updated.border_color = Some(border_color.clone());
        }
        
        if let Some(border_radius) = options.border_radius {
            updated.border_radius = Some(border_radius);
        }
        
        if let Some(shadow_radius) = options.shadow_radius {
            updated.shadow_radius = Some(shadow_radius);
        }
        
        if let Some(shadow_color) = &options.shadow_color {
            updated.shadow_color = Some(shadow_color.clone());
        }
        
        if let Some(shadow_offset) = options.shadow_offset {
            updated.shadow_offset = Some(shadow_offset);
        }
        
        updated
    }
}

pub fn use_hstack_styling(options: StackStylingOptions) -> impl Fn(HStackProps) -> HStackProps {
    move |props| {
        let mut updated = props;
        
        if let Some(background) = &options.background {
            updated.background = Some(background.clone());
        }
        
        if let Some(border_width) = options.border_width {
            updated.border_width = Some(border_width);
        }
        
        if let Some(border_color) = &options.border_color {
            updated.border_color = Some(border_color.clone());
        }
        
        if let Some(border_radius) = options.border_radius {
            updated.border_radius = Some(border_radius);
        }
        
        if let Some(shadow_radius) = options.shadow_radius {
            updated.shadow_radius = Some(shadow_radius);
        }
        
        if let Some(shadow_color) = &options.shadow_color {
            updated.shadow_color = Some(shadow_color.clone());
        }
        
        if let Some(shadow_offset) = options.shadow_offset {
            updated.shadow_offset = Some(shadow_offset);
        }
        
        updated
    }
}

pub fn use_vstack_leading_alignment() -> impl Fn(VStackProps) -> VStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(VStackAlignment::Leading);
        updated
    }
}

pub fn use_vstack_center_alignment() -> impl Fn(VStackProps) -> VStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(VStackAlignment::Center);
        updated
    }
}

pub fn use_vstack_trailing_alignment() -> impl Fn(VStackProps) -> VStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(VStackAlignment::Trailing);
        updated
    }
}

pub fn use_hstack_top_alignment() -> impl Fn(HStackProps) -> HStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(HStackAlignment::Top);
        updated
    }
}

pub fn use_hstack_center_alignment() -> impl Fn(HStackProps) -> HStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(HStackAlignment::Center);
        updated
    }
}

pub fn use_hstack_bottom_alignment() -> impl Fn(HStackProps) -> HStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(HStackAlignment::Bottom);
        updated
    }
}

pub fn use_stack_priority(priority: LayoutPriority) -> impl Fn(VStackProps) -> VStackProps + Fn(HStackProps) -> HStackProps {
    move |props| {
        match props {
            VStackProps { .. } => {
                let mut vstack_props = props;
                vstack_props.layout_priority = Some(priority.clone());
                vstack_props
            },
            HStackProps { .. } => {
                let mut hstack_props = props;
                hstack_props.layout_priority = Some(priority.clone());
                hstack_props
            }
        }
    }
}

pub fn use_stack_card_style() -> impl Fn(VStackProps) -> VStackProps + Fn(HStackProps) -> HStackProps {
    |props| {
        let styling = StackStylingOptions {
            background: Some(Color::White),
            border_width: Some(1.0),
            border_color: Some(Color::from_hex("#e0e0e0")),
            border_radius: Some(8.0),
            shadow_radius: Some(4.0),
            shadow_color: Some(Color::rgba(0, 0, 0, 0.1)),
            shadow_offset: Some((0.0, 2.0)),
        };
        
        match props {
            VStackProps { .. } => {
                let vstack_styling = use_vstack_styling(styling);
                vstack_styling(props)
            },
            HStackProps { .. } => {
                let hstack_styling = use_hstack_styling(styling);
                hstack_styling(props)
            }
        }
    }
}