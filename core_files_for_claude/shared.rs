use crate::render::renderer::DrawingContext;
use crate::render::node::RenderNode;
use crate::layout::Rect;
use crate::{Color, Gradient, GradientType};
use std::f32::consts::PI;

pub fn parse_color(color: &str) -> String {
    Color::from_hex(color).to_css_string()
}

fn is_named_color(color: &str) -> bool {
    const NAMED_COLORS: [&str; 148] = [
        "black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", 
        "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", 
        "aliceblue", "antiquewhite", "aquamarine", "azure", "beige", "bisque", 
        "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", 
        "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", 
        "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", 
        "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", 
        "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", 
        "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", 
        "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", 
        "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", 
        "ghostwhite", "gold", "goldenrod", "greenyellow", "grey", "honeydew", 
        "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", 
        "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", 
        "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", 
        "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", 
        "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", 
        "limegreen", "linen", "magenta", "mediumaquamarine", "mediumblue", 
        "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", 
        "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", 
        "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", 
        "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", 
        "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", 
        "peru", "pink", "plum", "powderblue", "rosybrown", "royalblue", 
        "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", 
        "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", 
        "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "wheat", 
        "whitesmoke", "yellowgreen", "transparent"
    ];

    NAMED_COLORS.contains(&color.to_lowercase().as_str())
}

pub fn draw_rounded_rect<T: DrawingContext>(
    context: &T, 
    x: f32, 
    y: f32, 
    width: f32, 
    height: f32, 
    radius: f32
) -> Result<(), String> {
    if radius <= 0.0 {
        context.rect(x, y, width, height)?;
        return Ok(());
    }
    
    let radius = radius.min(width / 2.0).min(height / 2.0);
    
    context.begin_path()?;
    
    context.move_to(x + radius, y)?;
    
    context.line_to(x + width - radius, y)?;
    context.arc(x + width - radius, y + radius, radius, -0.5 * PI, 0.0, false)?;
    
    context.line_to(x + width, y + height - radius)?;
    context.arc(x + width - radius, y + height - radius, radius, 0.0, 0.5 * PI, false)?;
    
    context.line_to(x + radius, y + height)?;
    context.arc(x + radius, y + height - radius, radius, 0.5 * PI, PI, false)?;
    
    context.line_to(x, y + radius)?;
    context.arc(x + radius, y + radius, radius, PI, 1.5 * PI, false)?;
    
    context.close_path()?;
    
    Ok(())
}

pub fn draw_background<T: DrawingContext>(
    context: &T, 
    node: &RenderNode, 
    frame: Rect
) -> Result<(), String> {
    if let Some(bg_color) = node.get_prop("background") {
        context.set_fill_color(&parse_color(&bg_color))?;
        context.begin_path()?;
        draw_rounded_rect(
            context, 
            frame.x, 
            frame.y, 
            frame.width, 
            frame.height, 
            node.get_prop_f32("border_radius").unwrap_or(0.0)
        )?;
        context.fill()?;
    }
    
    Ok(())
}

pub fn draw_border<T: DrawingContext>(
    context: &T, 
    node: &RenderNode, 
    frame: Rect
) -> Result<(), String> {
    if let Some(border_width) = node.get_prop_f32("border_width") {
        if border_width > 0.0 {
            let border_color = node.get_prop("border_color")
                .map(|c| parse_color(c))
                .unwrap_or_else(|| "#000000".to_string());
            
            let border_radius = node.get_prop_f32("border_radius").unwrap_or(0.0);
            
            context.begin_path()?;
            draw_rounded_rect(
                context, 
                frame.x, 
                frame.y, 
                frame.width, 
                frame.height, 
                border_radius
            )?;
            
            context.set_stroke_color(&border_color)?;
            context.set_line_width(border_width)?;
            context.stroke()?;
        }
    }
    
    Ok(())
}

pub fn apply_shadow<T: DrawingContext>(
    context: &T,
    shadow_color: Option<&str>,
    shadow_offset_x: Option<f32>,
    shadow_offset_y: Option<f32>,
    shadow_blur: Option<f32>
) -> Result<bool, String> {
    if let (Some(color), Some(blur)) = (shadow_color, shadow_blur) {
        if blur > 0.0 {
            let offset_x = shadow_offset_x.unwrap_or(0.0);
            let offset_y = shadow_offset_y.unwrap_or(0.0);
            context.set_shadow(offset_x, offset_y, blur, &parse_color(color))?;
            return Ok(true);
        }
    }
    
    Ok(false)
}

pub fn clear_shadow<T: DrawingContext>(
    context: &T,
    shadow_applied: bool
) -> Result<(), String> {
    if shadow_applied {
        context.clear_shadow()?;
    }
    
    Ok(())
}

pub fn create_gradient<T: DrawingContext>(
    context: &T,
    node: &RenderNode,
    frame: Rect
) -> Result<Option<String>, String> {
    let gradient_type = node.get_prop("gradient_type");
    let gradient_color_count = node.get_prop_f32("gradient_color_count")
        .unwrap_or(0.0) as usize;
    
    if gradient_color_count == 0 {
        return Ok(None);
    }
    
    let mut color_stops = Vec::new();
    for i in 0..gradient_color_count {
        let color = node.get_prop(&format!("gradient_color_{}", i))
            .map(|c| parse_color(c))
            .unwrap_or_else(|| "#000000".to_string());
        
        let position = node.get_prop_f32(&format!("gradient_position_{}", i))
            .unwrap_or((i as f32) / ((gradient_color_count - 1) as f32));
        
        color_stops.push((position, color));
    }
    
    let start_x = node.get_prop_f32("gradient_start_x").unwrap_or(0.0);
    let start_y = node.get_prop_f32("gradient_start_y").unwrap_or(0.0);
    let end_x = node.get_prop_f32("gradient_end_x").unwrap_or(1.0);
    let end_y = node.get_prop_f32("gradient_end_y").unwrap_or(1.0);
    
    let gradient_id = if gradient_type.map(|t| t == "radial").unwrap_or(false) {
        let center_x = frame.x + frame.width * start_x;
        let center_y = frame.y + frame.height * start_y;
        let radius = ((frame.width * frame.width + frame.height * frame.height) as f32).sqrt() / 2.0;
        
        context.create_radial_gradient(
            center_x, 
            center_y, 
            0.0,
            center_x, 
            center_y, 
            radius,
            color_stops
        )?
    } else {
        context.create_linear_gradient(
            frame.x + frame.width * start_x,
            frame.y + frame.height * start_y,
            frame.x + frame.width * end_x,
            frame.y + frame.height * end_y,
            color_stops
        )?
    };
    
    Ok(Some(gradient_id))
}


pub fn apply_background<T: DrawingContext>(
    context: &T,
    gradient: Option<&Gradient>,
    background_color: Option<&str>,
    frame_x: f32,
    frame_y: f32,
    frame_width: f32,
    frame_height: f32
) -> Result<(), String> {
    if let Some(gradient_def) = gradient {
        let gradient_id = match gradient_def.gradient_type {
            GradientType::Radial => {
                let center_x = frame_x + frame_width / 2.0;
                let center_y = frame_y + frame_height / 2.0;
                let radius = (frame_width.powi(2) + frame_height.powi(2)).sqrt() / 2.0;
                let color_stops: Vec<(f32, String)> = gradient_def.stops
                            .iter()
                            .map(|stop| (stop.position, parse_color(&stop.color)))
                            .collect();
                context.create_radial_gradient(
                            center_x,
                            center_y,
                            0.0,
                            center_x,
                            center_y,
                            radius,
                            color_stops
                        )?
            }
            _ => {
                    let (start_x, start_y) = (
                        frame_x + gradient_def.start_point.0 * frame_width,
                        frame_y + gradient_def.start_point.1 * frame_height
                    );
            
                    let (end_x, end_y) = (
                        frame_x + gradient_def.end_point.0 * frame_width,
                        frame_y + gradient_def.end_point.1 * frame_height
                    );
            
                    let color_stops: Vec<(f32, String)> = gradient_def.stops
                        .iter()
                        .map(|stop| (stop.position, parse_color(&stop.color)))
                        .collect();
            
                    context.create_linear_gradient(
                        start_x,
                        start_y,
                        end_x,
                        end_y,
                        color_stops
                    )?
                }
        };
        
        context.set_fill_gradient(&gradient_id)?;
    } else if let Some(color) = background_color {
        context.set_fill_color(&parse_color(color))?;
    } else {
        context.set_fill_color("#000000")?;
    }
    
    Ok(())
}