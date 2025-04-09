use wasm_bindgen::prelude::*;
use js_sys::{ Uint8ClampedArray, Object, Reflect};

#[wasm_bindgen]
pub struct ImageProcessing;

#[wasm_bindgen]
impl ImageProcessing {
    #[wasm_bindgen(js_name = "grayscale")]
    pub fn grayscale(image_data: &Uint8ClampedArray) -> Uint8ClampedArray {
        let length = image_data.length() as usize;
        if length % 4 != 0 {
            return Uint8ClampedArray::new_with_length(0);
        }
        
        let mut result = Uint8ClampedArray::new_with_length(image_data.length());
        
        for i in (0..length).step_by(4) {
            let r = image_data.get_index(i as u32) as f64;
            let g = image_data.get_index((i + 1) as u32) as f64;
            let b = image_data.get_index((i + 2) as u32) as f64;
            let a = image_data.get_index((i + 3) as u32);
            
            let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;
            
            result.set_index(i as u32, gray);
            result.set_index((i + 1) as u32, gray);
            result.set_index((i + 2) as u32, gray);
            result.set_index((i + 3) as u32, a);
        }
        
        result
    }

    #[wasm_bindgen(js_name = "invert")]
    pub fn invert(image_data: &Uint8ClampedArray) -> Uint8ClampedArray {
        let length = image_data.length() as usize;
        if length % 4 != 0 {
            return Uint8ClampedArray::new_with_length(0);
        }
        
        let mut result = Uint8ClampedArray::new_with_length(image_data.length());
        
        for i in (0..length).step_by(4) {
            let r = image_data.get_index(i as u32);
            let g = image_data.get_index((i + 1) as u32);
            let b = image_data.get_index((i + 2) as u32);
            let a = image_data.get_index((i + 3) as u32);
            
            result.set_index(i as u32, 255 - r);
            result.set_index((i + 1) as u32, 255 - g);
            result.set_index((i + 2) as u32, 255 - b);
            result.set_index((i + 3) as u32, a);
        }
        
        result
    }

    #[wasm_bindgen(js_name = "brightness")]
    pub fn brightness(image_data: &Uint8ClampedArray, factor: f64) -> Uint8ClampedArray {
        let length = image_data.length() as usize;
        if length % 4 != 0 {
            return Uint8ClampedArray::new_with_length(0);
        }
        
        let mut result = Uint8ClampedArray::new_with_length(image_data.length());
        
        for i in (0..length).step_by(4) {
            let r = image_data.get_index(i as u32) as f64;
            let g = image_data.get_index((i + 1) as u32) as f64;
            let b = image_data.get_index((i + 2) as u32) as f64;
            let a = image_data.get_index((i + 3) as u32);
            
            let new_r = (r * factor).min(255.0).max(0.0) as u8;
            let new_g = (g * factor).min(255.0).max(0.0) as u8;
            let new_b = (b * factor).min(255.0).max(0.0) as u8;
            
            result.set_index(i as u32, new_r);
            result.set_index((i + 1) as u32, new_g);
            result.set_index((i + 2) as u32, new_b);
            result.set_index((i + 3) as u32, a);
        }
        
        result
    }

    #[wasm_bindgen(js_name = "blur")]
    pub fn blur(image_data: &Uint8ClampedArray, width: u32, height: u32, radius: u32) -> Uint8ClampedArray {
        let length = image_data.length() as usize;
        if length % 4 != 0 || length as u32 != width * height * 4 {
            return Uint8ClampedArray::new_with_length(0);
        }
        
        let mut result = Uint8ClampedArray::new_with_length(image_data.length());
        let r = radius as i32;
        
        for y in 0..height {
            for x in 0..width {
                let mut r_sum = 0.0;
                let mut g_sum = 0.0;
                let mut b_sum = 0.0;
                let mut count = 0.0;
                
                for dy in -r..=r {
                    for dx in -r..=r {
                        let nx = x as i32 + dx;
                        let ny = y as i32 + dy;
                        
                        if nx >= 0 && nx < width as i32 && ny >= 0 && ny < height as i32 {
                            let idx = ((ny * width as i32 + nx) * 4) as u32;
                            
                            r_sum += image_data.get_index(idx) as f64;
                            g_sum += image_data.get_index(idx + 1) as f64;
                            b_sum += image_data.get_index(idx + 2) as f64;
                            count += 1.0;
                        }
                    }
                }
                
                let idx = ((y * width + x) * 4) as u32;
                
                result.set_index(idx, (r_sum / count) as u8);
                result.set_index(idx + 1, (g_sum / count) as u8);
                result.set_index(idx + 2, (b_sum / count) as u8);
                result.set_index(idx + 3, image_data.get_index(idx + 3));
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "edgeDetection")]
    pub fn edge_detection(image_data: &Uint8ClampedArray, width: u32, height: u32) -> Uint8ClampedArray {
        let gray = Self::grayscale(image_data);
        let length = gray.length() as usize;
        
        let mut result = Uint8ClampedArray::new_with_length(gray.length());
        
        for y in 1..height-1 {
            for x in 1..width-1 {
                let idx = ((y * width + x) * 4) as u32;
                
                let top_left = gray.get_index((((y-1) * width + (x-1)) * 4) as u32) as i32;
                let top = gray.get_index((((y-1) * width + x) * 4) as u32) as i32;
                let top_right = gray.get_index((((y-1) * width + (x+1)) * 4) as u32) as i32;
                
                let left = gray.get_index((((y) * width + (x-1)) * 4) as u32) as i32;
                let right = gray.get_index((((y) * width + (x+1)) * 4) as u32) as i32;
                
                let bottom_left = gray.get_index((((y+1) * width + (x-1)) * 4) as u32) as i32;
                let bottom = gray.get_index((((y+1) * width + x) * 4) as u32) as i32;
                let bottom_right = gray.get_index((((y+1) * width + (x+1)) * 4) as u32) as i32;
                
                let h_gradient = -top_left - 2 * left - bottom_left + top_right + 2 * right + bottom_right;
                let v_gradient = -top_left - 2 * top - top_right + bottom_left + 2 * bottom + bottom_right;
                
                let gradient = ((h_gradient.pow(2) + v_gradient.pow(2)) as f64).sqrt().min(255.0) as u8;
                
                result.set_index(idx, gradient);
                result.set_index(idx + 1, gradient);
                result.set_index(idx + 2, gradient);
                result.set_index(idx + 3, gray.get_index(idx + 3));
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "resize")]
    pub fn resize(image_data: &Uint8ClampedArray, source_width: u32, source_height: u32, 
                  target_width: u32, target_height: u32) -> Uint8ClampedArray {
        let source_length = image_data.length() as usize;
        if source_length % 4 != 0 || source_length as u32 != source_width * source_height * 4 {
            return Uint8ClampedArray::new_with_length(0);
        }
        
        let target_length = target_width * target_height * 4;
        let mut result = Uint8ClampedArray::new_with_length(target_length);
        
        let x_ratio = source_width as f64 / target_width as f64;
        let y_ratio = source_height as f64 / target_height as f64;
        
        for y in 0..target_height {
            for x in 0..target_width {
                let px = (x as f64 * x_ratio).floor() as u32;
                let py = (y as f64 * y_ratio).floor() as u32;
                
                let source_idx = ((py * source_width + px) * 4) as u32;
                let target_idx = ((y * target_width + x) * 4) as u32;
                
                result.set_index(target_idx, image_data.get_index(source_idx));
                result.set_index(target_idx + 1, image_data.get_index(source_idx + 1));
                result.set_index(target_idx + 2, image_data.get_index(source_idx + 2));
                result.set_index(target_idx + 3, image_data.get_index(source_idx + 3));
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "rotate")]
    pub fn rotate(image_data: &Uint8ClampedArray, width: u32, height: u32, angle_degrees: f64) -> Object {
        let length = image_data.length() as usize;
        if length % 4 != 0 || length as u32 != width * height * 4 {
            return Object::new();
        }
        
        let angle_radians = angle_degrees * std::f64::consts::PI / 180.0;
        let sin = angle_radians.sin();
        let cos = angle_radians.cos();
        
        let center_x = width as f64 / 2.0;
        let center_y = height as f64 / 2.0;
        
        let mut min_x = f64::MAX;
        let mut min_y = f64::MAX;
        let mut max_x = f64::MIN;
        let mut max_y = f64::MIN;
        
        for y in 0..height {
            for x in 0..width {
                let nx = (x as f64 - center_x) * cos - (y as f64 - center_y) * sin + center_x;
                let ny = (x as f64 - center_x) * sin + (y as f64 - center_y) * cos + center_y;
                
                min_x = min_x.min(nx);
                min_y = min_y.min(ny);
                max_x = max_x.max(nx);
                max_y = max_y.max(ny);
            }
        }
        
        let new_width = (max_x - min_x).ceil() as u32;
        let new_height = (max_y - min_y).ceil() as u32;
        
        let mut result = Uint8ClampedArray::new_with_length(new_width * new_height * 4);
        
        for y in 0..new_height {
            for x in 0..new_width {
                let nx = (x as f64 + min_x - center_x) * cos + (y as f64 + min_y - center_y) * sin + center_x;
                let ny = -(x as f64 + min_x - center_x) * sin + (y as f64 + min_y - center_y) * cos + center_y;
                
                if nx >= 0.0 && nx < width as f64 && ny >= 0.0 && ny < height as f64 {
                    let src_x = nx as u32;
                    let src_y = ny as u32;
                    
                    let src_idx = ((src_y * width + src_x) * 4) as u32;
                    let tgt_idx = ((y * new_width + x) * 4) as u32;
                    
                    result.set_index(tgt_idx, image_data.get_index(src_idx));
                    result.set_index(tgt_idx + 1, image_data.get_index(src_idx + 1));
                    result.set_index(tgt_idx + 2, image_data.get_index(src_idx + 2));
                    result.set_index(tgt_idx + 3, image_data.get_index(src_idx + 3));
                }
            }
        }
        
        let output = Object::new();
        Reflect::set(&output, &JsValue::from_str("data"), &result).unwrap();
        Reflect::set(&output, &JsValue::from_str("width"), &JsValue::from_f64(new_width as f64)).unwrap();
        Reflect::set(&output, &JsValue::from_str("height"), &JsValue::from_f64(new_height as f64)).unwrap();
        
        output
    }
}