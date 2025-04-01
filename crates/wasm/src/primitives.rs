use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Primitives;

#[wasm_bindgen]
impl Primitives {

    #[wasm_bindgen(js_name = validateU8)]
    pub fn validate_u8(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 255.0
    }

    #[wasm_bindgen(js_name = validateU16)]
    pub fn validate_u16(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 65535.0
    }

    #[wasm_bindgen(js_name = validateU32)]
    pub fn validate_u32(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 4294967295.0
    }

    #[wasm_bindgen(js_name = validateI8)]
    pub fn validate_i8(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -128.0 && n <= 127.0
    }

    #[wasm_bindgen(js_name = validateI16)]
    pub fn validate_i16(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -32768.0 && n <= 32767.0
    }

    #[wasm_bindgen(js_name = validateI32)]
    pub fn validate_i32(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -2147483648.0 && n <= 2147483647.0
    }

    #[wasm_bindgen(js_name = validateF32)]
    pub fn validate_f32(n: f64) -> bool {
        n.is_finite() && n >= -3.40282347e38 && n <= 3.40282347e38
    }

    #[wasm_bindgen(js_name = validateF64)]
    pub fn validate_f64(n: f64) -> bool {
        n.is_finite()
    }

    #[wasm_bindgen(js_name = isPowerOfTwo)]
    pub fn is_power_of_two(n: u32) -> bool {
        n > 0 && (n & (n - 1)) == 0
    }

    #[wasm_bindgen(js_name = nextPowerOfTwo)]
    pub fn next_power_of_two(n: u32) -> u32 {
        if n == 0 {
            return 1;
        }
        
        let mut v = n;
        v -= 1;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        v + 1
    }

    #[wasm_bindgen(js_name = leadingZeros)]
    pub fn leading_zeros(n: u32) -> u32 {
        n.leading_zeros()
    }

    #[wasm_bindgen(js_name = trailingZeros)]
    pub fn trailing_zeros(n: u32) -> u32 {
        n.trailing_zeros()
    }

    #[wasm_bindgen(js_name = countOnes)]
    pub fn count_ones(n: u32) -> u32 {
        n.count_ones()
    }

    #[wasm_bindgen(js_name = addU8)]
    pub fn add_u8(a: u8, b: u8) -> Option<u8> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = addU16)]
    pub fn add_u16(a: u16, b: u16) -> Option<u16> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = addU32)]
    pub fn add_u32(a: u32, b: u32) -> Option<u32> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = addI8)]
    pub fn add_i8(a: i8, b: i8) -> Option<i8> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = addI16)]
    pub fn add_i16(a: i16, b: i16) -> Option<i16> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = addI32)]
    pub fn add_i32(a: i32, b: i32) -> Option<i32> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = subU8)]
    pub fn sub_u8(a: u8, b: u8) -> Option<u8> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = subU16)]
    pub fn sub_u16(a: u16, b: u16) -> Option<u16> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = subU32)]
    pub fn sub_u32(a: u32, b: u32) -> Option<u32> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = subI8)]
    pub fn sub_i8(a: i8, b: i8) -> Option<i8> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = subI16)]
    pub fn sub_i16(a: i16, b: i16) -> Option<i16> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = subI32)]
    pub fn sub_i32(a: i32, b: i32) -> Option<i32> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = mulU8)]
    pub fn mul_u8(a: u8, b: u8) -> Option<u8> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = mulU16)]
    pub fn mul_u16(a: u16, b: u16) -> Option<u16> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = mulU32)]
    pub fn mul_u32(a: u32, b: u32) -> Option<u32> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = mulI8)]
    pub fn mul_i8(a: i8, b: i8) -> Option<i8> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = mulI16)]
    pub fn mul_i16(a: i16, b: i16) -> Option<i16> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = mulI32)]
    pub fn mul_i32(a: i32, b: i32) -> Option<i32> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = divU8)]
    pub fn div_u8(a: u8, b: u8) -> Option<u8> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = divU16)]
    pub fn div_u16(a: u16, b: u16) -> Option<u16> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = divU32)]
    pub fn div_u32(a: u32, b: u32) -> Option<u32> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = divI8)]
    pub fn div_i8(a: i8, b: i8) -> Option<i8> {
        if b == 0 || (a == i8::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = divI16)]
    pub fn div_i16(a: i16, b: i16) -> Option<i16> {
        if b == 0 || (a == i16::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = divI32)]
    pub fn div_i32(a: i32, b: i32) -> Option<i32> {
        if b == 0 || (a == i32::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = formatBin)]
    pub fn format_bin(n: u32) -> String {
        format!("{:b}", n)
    }

    #[wasm_bindgen(js_name = formatHex)]
    pub fn format_hex(n: u32) -> String {
        format!("{:x}", n)
    }

    #[wasm_bindgen(js_name = formatOct)]
    pub fn format_oct(n: u32) -> String {
        format!("{:o}", n)
    }

    #[wasm_bindgen(js_name = formatInt)]
    pub fn format_int(n: u32, radix: u8, pad: u8) -> String {
        match radix {
            2 => format!("{:0width$b}", n, width = pad as usize),
            8 => format!("{:0width$o}", n, width = pad as usize),
            16 => format!("{:0width$x}", n, width = pad as usize),
            10 => format!("{:0width$}", n, width = pad as usize),
            _ => format!("{}", n),
        }
    }

    #[wasm_bindgen(js_name = formatFloat)]
    pub fn format_float(n: f32, digits: u8) -> String {
        format!("{:.1$}", n, digits as usize)
    }
}