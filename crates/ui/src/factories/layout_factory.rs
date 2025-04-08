
use crate::{components::{HStackProps, UIComponent, VStackProps}, hooks::{
    use_hstack_center_alignment, use_hstack_layout, use_hstack_styling, use_stack_card_style, use_vstack_center_alignment, use_vstack_layout, use_vstack_styling, StackLayoutOptions, StackStylingOptions
}, shared::Color};

pub fn create_card(children: Vec<UIComponent>) -> UIComponent {
    let card_style = use_vstack_card_style();
    let layout = use_vstack_layout(StackLayoutOptions {
        padding: Some(16.0),
        spacing: Some(8.0),
        edge_insets: None,
        min_width: None,
        max_width: None,
        min_height: None,
        max_height: None,
        equal_spacing: None,
        clip_to_bounds: None,
    });

    let props = VStackProps::new();
    let props = card_style(props);
    let props = layout(props);
    let props = props.add_children(children);

    UIComponent::VStack(props)
}

pub fn use_vstack_card_style() -> impl Fn(VStackProps) -> VStackProps {
    move |props| {
        let styling = StackStylingOptions {
            background: Some(Color::White),
            border_width: Some(1.0),
            border_color: Some(Color::from_hex("#e0e0e0")),
            border_radius: Some(8.0),
            shadow_radius: Some(4.0),
            shadow_color: Some(Color::rgba(0, 0, 0, 0.1)),
            shadow_offset: Some((0.0, 2.0)),
        };

        let apply = use_vstack_styling(styling);
        apply(props)
    }
}


pub fn create_row(children: Vec<UIComponent>) -> UIComponent {
    let layout = use_hstack_layout(StackLayoutOptions {
        spacing: Some(8.0),
        padding: Some(0.0),
        edge_insets: None,
        min_width: None,
        max_width: None,
        min_height: None,
        max_height: None,
        equal_spacing: None,
        clip_to_bounds: None,
    });
    
    let alignment = use_hstack_center_alignment();
    
    let props = HStackProps::new();
    let props = layout(props);
    let props = alignment(props);
    let props = props.add_children(children);
    
    UIComponent::HStack(props)
}

pub fn create_column(children: Vec<UIComponent>) -> UIComponent {
    let layout = use_vstack_layout(StackLayoutOptions {
        spacing: Some(8.0),
        padding: Some(0.0),
        edge_insets: None,
        min_width: None,
        max_width: None,
        min_height: None,
        max_height: None,
        equal_spacing: None,
        clip_to_bounds: None,
    });
    
    let alignment = use_vstack_center_alignment();
    
    let props = VStackProps::new();
    let props = layout(props);
    let props = alignment(props);
    let props = props.add_children(children);
    
    UIComponent::VStack(props)
}

pub fn create_spacer() -> UIComponent {
    UIComponent::Spacer(Default::default())
}

pub fn create_divider() -> UIComponent {
    UIComponent::Divider(Default::default())
}

pub fn create_container(child: UIComponent, color: Color, padding: f32) -> UIComponent {
    let styling = use_vstack_styling(StackStylingOptions {
        background: Some(color),
        border_width: None,
        border_color: None,
        border_radius: Some(8.0),
        shadow_radius: None,
        shadow_color: None,
        shadow_offset: None,
    });
    
    let layout = use_vstack_layout(StackLayoutOptions {
        padding: Some(padding),
        spacing: None,
        edge_insets: None,
        min_width: None,
        max_width: None,
        min_height: None,
        max_height: None,
        equal_spacing: None,
        clip_to_bounds: None,
    });
    
    let props = VStackProps::new();
    let props = styling(props);
    let props = layout(props);
    let props = props.add_children(vec![child]);
    
    UIComponent::VStack(props)
}

pub fn create_toolbar(children: Vec<UIComponent>) -> UIComponent {
    let styling = use_hstack_styling(StackStylingOptions {
        background: Some(Color::White),
        border_width: Some(1.0),
        border_color: Some(Color::LightGray),
        border_radius: None,
        shadow_radius: Some(2.0),
        shadow_color: Some(Color::rgba(0, 0, 0, 0.1)),
        shadow_offset: Some((0.0, 1.0)),
    });
    
    let layout = use_hstack_layout(StackLayoutOptions {
        spacing: Some(8.0),
        padding: Some(12.0),
        edge_insets: None,
        min_width: None,
        max_width: None,
        min_height: None,
        max_height: None,
        equal_spacing: None,
        clip_to_bounds: None,
    });
    
    let props = HStackProps::new();
    let props = styling(props);
    let props = layout(props);
    let props = props.add_children(children);
    
    UIComponent::HStack(props)
}

pub fn create_grid(rows: Vec<Vec<UIComponent>>) -> UIComponent {
    let row_components = rows.into_iter().map(|row_items| {
        let layout = use_hstack_layout(StackLayoutOptions {
            spacing: Some(8.0),
            padding: Some(0.0),
            edge_insets: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,
            equal_spacing: Some(true),
            clip_to_bounds: None,
        });
        
        let props = HStackProps::new();
        let props = layout(props);
        let props = props.add_children(row_items);
        
        UIComponent::HStack(props)
    }).collect();
    
    let layout = use_vstack_layout(StackLayoutOptions {
        spacing: Some(8.0),
        padding: Some(0.0),
        edge_insets: None,
        min_width: None,
        max_width: None,
        min_height: None,
        max_height: None,
        equal_spacing: None,
        clip_to_bounds: None,
    });
    
    let props = VStackProps::new();
    let props = layout(props);
    let props = props.add_children(row_components);
    
    UIComponent::VStack(props)
}