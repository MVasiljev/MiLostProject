use crate::{components::{zstack::ZStackAlignment, ZStackProps}, shared::{Color, EdgeInsets}};

pub struct ZStackLayoutOptions {
    pub padding: Option<f32>,
    pub edge_insets: Option<EdgeInsets>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
}

pub fn use_zstack_layout(options: ZStackLayoutOptions) -> impl Fn(ZStackProps) -> ZStackProps {
    move |props| {
        let mut updated = props;
        
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
        
        updated
    }
}

pub struct ZStackStylingOptions {
    pub background: Option<Color>,
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
}

pub fn use_zstack_styling(options: ZStackStylingOptions) -> impl Fn(ZStackProps) -> ZStackProps {
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

pub fn use_zstack_center_alignment() -> impl Fn(ZStackProps) -> ZStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(ZStackAlignment::Center);
        updated
    }
}

pub fn use_zstack_top_alignment() -> impl Fn(ZStackProps) -> ZStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(ZStackAlignment::Top);
        updated
    }
}

pub fn use_zstack_bottom_alignment() -> impl Fn(ZStackProps) -> ZStackProps {
    |props| {
        let mut updated = props;
        updated.alignment = Some(ZStackAlignment::Bottom);
        updated
    }
}