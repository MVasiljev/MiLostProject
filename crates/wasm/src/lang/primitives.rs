use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Primitives;

#[wasm_bindgen]
impl Primitives {
    #[wasm_bindgen(js_name = "validateU8")]
    pub fn validate_u8(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 255.0
    }

    #[wasm_bindgen(js_name = "validateU16")]
    pub fn validate_u16(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 65535.0
    }

    #[wasm_bindgen(js_name = "validateU32")]
    pub fn validate_u32(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 4294967295.0
    }

    #[wasm_bindgen(js_name = "validateU64")]
    pub fn validate_u64(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 9007199254740991.0
    }

    #[wasm_bindgen(js_name = "validateUsize")]
    pub fn validate_usize(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= 0.0 && n <= 9007199254740991.0
    }

    #[wasm_bindgen(js_name = "validateI8")]
    pub fn validate_i8(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -128.0 && n <= 127.0
    }

    #[wasm_bindgen(js_name = "validateI16")]
    pub fn validate_i16(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -32768.0 && n <= 32767.0
    }

    #[wasm_bindgen(js_name = "validateI32")]
    pub fn validate_i32(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -2147483648.0 && n <= 2147483647.0
    }

    #[wasm_bindgen(js_name = "validateI64")]
    pub fn validate_i64(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -9007199254740991.0 && n <= 9007199254740991.0
    }

    #[wasm_bindgen(js_name = "validateIsize")]
    pub fn validate_isize(n: f64) -> bool {
        n.is_finite() && n.floor() == n && n >= -9007199254740991.0 && n <= 9007199254740991.0
    }

    #[wasm_bindgen(js_name = "validateF32")]
    pub fn validate_f32(n: f64) -> bool {
        n.is_finite() && n >= -3.40282347e38 && n <= 3.40282347e38
    }

    #[wasm_bindgen(js_name = "validateF64")]
    pub fn validate_f64(n: f64) -> bool {
        n.is_finite()
    }

    #[wasm_bindgen(js_name = "isPowerOfTwo")]
    pub fn is_power_of_two(n: u32) -> bool {
        n > 0 && (n & (n - 1)) == 0
    }

    #[wasm_bindgen(js_name = "nextPowerOfTwo")]
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

    #[wasm_bindgen(js_name = "leadingZeros")]
    pub fn leading_zeros(n: u32) -> u32 {
        n.leading_zeros()
    }

    #[wasm_bindgen(js_name = "trailingZeros")]
    pub fn trailing_zeros(n: u32) -> u32 {
        n.trailing_zeros()
    }

    #[wasm_bindgen(js_name = "countOnes")]
    pub fn count_ones(n: u32) -> u32 {
        n.count_ones()
    }

    #[wasm_bindgen(js_name = "add_u8")]
    pub fn add_u8(a: u8, b: u8) -> Option<u8> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_u16")]
    pub fn add_u16(a: u16, b: u16) -> Option<u16> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_u32")]
    pub fn add_u32(a: u32, b: u32) -> Option<u32> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_u64")]
    pub fn add_u64(a: u64, b: u64) -> Option<u64> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_usize")]
    pub fn add_usize(a: usize, b: usize) -> Option<usize> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_i8")]
    pub fn add_i8(a: i8, b: i8) -> Option<i8> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_i16")]
    pub fn add_i16(a: i16, b: i16) -> Option<i16> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_i32")]
    pub fn add_i32(a: i32, b: i32) -> Option<i32> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_i64")]
    pub fn add_i64(a: i64, b: i64) -> Option<i64> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "add_isize")]
    pub fn add_isize(a: isize, b: isize) -> Option<isize> {
        a.checked_add(b)
    }

    #[wasm_bindgen(js_name = "sub_u8")]
    pub fn sub_u8(a: u8, b: u8) -> Option<u8> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_u16")]
    pub fn sub_u16(a: u16, b: u16) -> Option<u16> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_u32")]
    pub fn sub_u32(a: u32, b: u32) -> Option<u32> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_u64")]
    pub fn sub_u64(a: u64, b: u64) -> Option<u64> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_usize")]
    pub fn sub_usize(a: usize, b: usize) -> Option<usize> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_i8")]
    pub fn sub_i8(a: i8, b: i8) -> Option<i8> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_i16")]
    pub fn sub_i16(a: i16, b: i16) -> Option<i16> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_i32")]
    pub fn sub_i32(a: i32, b: i32) -> Option<i32> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_i64")]
    pub fn sub_i64(a: i64, b: i64) -> Option<i64> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "sub_isize")]
    pub fn sub_isize(a: isize, b: isize) -> Option<isize> {
        a.checked_sub(b)
    }

    #[wasm_bindgen(js_name = "mul_u8")]
    pub fn mul_u8(a: u8, b: u8) -> Option<u8> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_u16")]
    pub fn mul_u16(a: u16, b: u16) -> Option<u16> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_u32")]
    pub fn mul_u32(a: u32, b: u32) -> Option<u32> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_u64")]
    pub fn mul_u64(a: u64, b: u64) -> Option<u64> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_usize")]
    pub fn mul_usize(a: usize, b: usize) -> Option<usize> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_i8")]
    pub fn mul_i8(a: i8, b: i8) -> Option<i8> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_i16")]
    pub fn mul_i16(a: i16, b: i16) -> Option<i16> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_i32")]
    pub fn mul_i32(a: i32, b: i32) -> Option<i32> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_i64")]
    pub fn mul_i64(a: i64, b: i64) -> Option<i64> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "mul_isize")]
    pub fn mul_isize(a: isize, b: isize) -> Option<isize> {
        a.checked_mul(b)
    }

    #[wasm_bindgen(js_name = "div_u8")]
    pub fn div_u8(a: u8, b: u8) -> Option<u8> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_u16")]
    pub fn div_u16(a: u16, b: u16) -> Option<u16> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_u32")]
    pub fn div_u32(a: u32, b: u32) -> Option<u32> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_u64")]
    pub fn div_u64(a: u64, b: u64) -> Option<u64> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_usize")]
    pub fn div_usize(a: usize, b: usize) -> Option<usize> {
        if b == 0 {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_i8")]
    pub fn div_i8(a: i8, b: i8) -> Option<i8> {
        if b == 0 || (a == i8::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_i16")]
    pub fn div_i16(a: i16, b: i16) -> Option<i16> {
        if b == 0 || (a == i16::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_i32")]
    pub fn div_i32(a: i32, b: i32) -> Option<i32> {
        if b == 0 || (a == i32::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_i64")]
    pub fn div_i64(a: i64, b: i64) -> Option<i64> {
        if b == 0 || (a == i64::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "div_isize")]
    pub fn div_isize(a: isize, b: isize) -> Option<isize> {
        if b == 0 || (a == isize::MIN && b == -1) {
            None
        } else {
            Some(a / b)
        }
    }

    #[wasm_bindgen(js_name = "format_bin")]
    pub fn format_bin(n: u32) -> String {
        format!("{:b}", n)
    }

    #[wasm_bindgen(js_name = "format_hex")]
    pub fn format_hex(n: u32) -> String {
        format!("{:x}", n)
    }

    #[wasm_bindgen(js_name = "format_oct")]
    pub fn format_oct(n: u32) -> String {
        format!("{:o}", n)
    }

    #[wasm_bindgen(js_name = "format_int")]
    pub fn format_int(n: u32, radix: u8, pad: u8) -> String {
        match radix {
            2 => format!("{:0width$b}", n, width = pad as usize),
            8 => format!("{:0width$o}", n, width = pad as usize),
            16 => format!("{:0width$x}", n, width = pad as usize),
            10 => format!("{:0width$}", n, width = pad as usize),
            _ => format!("{}", n),
        }
    }

    #[wasm_bindgen(js_name = "format_float")]
    pub fn format_float(n: f32, digits: u8) -> String {
        format!("{:.1$}", n, digits as usize)
    }

    #[wasm_bindgen(js_name = "u8_to_u16")]
    pub fn u8_to_u16(value: u8) -> u16 {
        value as u16
    }

    #[wasm_bindgen(js_name = "u8_to_u32")]
    pub fn u8_to_u32(value: u8) -> u32 {
        value as u32
    }

    #[wasm_bindgen(js_name = "u8_to_u64")]
    pub fn u8_to_u64(value: u8) -> u64 {
        value as u64
    }

    #[wasm_bindgen(js_name = "u16_to_u32")]
    pub fn u16_to_u32(value: u16) -> u32 {
        value as u32
    }

    #[wasm_bindgen(js_name = "u16_to_u64")]
    pub fn u16_to_u64(value: u16) -> u64 {
        value as u64
    }

    #[wasm_bindgen(js_name = "u32_to_u64")]
    pub fn u32_to_u64(value: u32) -> u64 {
        value as u64
    }

    #[wasm_bindgen(js_name = "i8_to_i16")]
    pub fn i8_to_i16(value: i8) -> i16 {
        value as i16
    }

    #[wasm_bindgen(js_name = "i8_to_i32")]
    pub fn i8_to_i32(value: i8) -> i32 {
        value as i32
    }

    #[wasm_bindgen(js_name = "i8_to_i64")]
    pub fn i8_to_i64(value: i8) -> i64 {
        value as i64
    }

    #[wasm_bindgen(js_name = "i16_to_i32")]
    pub fn i16_to_i32(value: i16) -> i32 {
        value as i32
    }

    #[wasm_bindgen(js_name = "i16_to_i64")]
    pub fn i16_to_i64(value: i16) -> i64 {
        value as i64
    }

    #[wasm_bindgen(js_name = "i32_to_i64")]
    pub fn i32_to_i64(value: i32) -> i64 {
        value as i64
    }

    #[wasm_bindgen(js_name = "f32_to_f64")]
    pub fn f32_to_f64(value: f32) -> f64 {
        value as f64
    }

    #[wasm_bindgen(js_name = "u8_to_i8")]
    pub fn u8_to_i8(value: u8) -> Option<i8> {
        if value <= 127 {
            Some(value as i8)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "u16_to_i16")]
    pub fn u16_to_i16(value: u16) -> Option<i16> {
        if value <= 32767 {
            Some(value as i16)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "u32_to_i32")]
    pub fn u32_to_i32(value: u32) -> Option<i32> {
        if value <= 2147483647 {
            Some(value as i32)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "u64_to_i64")]
    pub fn u64_to_i64(value: u64) -> Option<i64> {
        if value <= 9223372036854775807 {
            Some(value as i64)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "i8_to_u8")]
    pub fn i8_to_u8(value: i8) -> Option<u8> {
        if value >= 0 {
            Some(value as u8)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "i16_to_u16")]
    pub fn i16_to_u16(value: i16) -> Option<u16> {
        if value >= 0 {
            Some(value as u16)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "i32_to_u32")]
    pub fn i32_to_u32(value: i32) -> Option<u32> {
        if value >= 0 {
            Some(value as u32)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "i64_to_u64")]
    pub fn i64_to_u64(value: i64) -> Option<u64> {
        if value >= 0 {
            Some(value as u64)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "f32_to_i32")]
    pub fn f32_to_i32(value: f32) -> Option<i32> {
        if value.is_finite() && value >= -2147483648.0 && value <= 2147483647.0 && value.trunc() == value {
            Some(value as i32)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "f64_to_i64")]
    pub fn f64_to_i64(value: f64) -> Option<i64> {
        if value.is_finite() && value >= -9223372036854775808.0 && value <= 9223372036854775807.0 && value.trunc() == value {
            Some(value as i64)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "f32_to_u32")]
    pub fn f32_to_u32(value: f32) -> Option<u32> {
        if value.is_finite() && value >= 0.0 && value <= 4294967295.0 && value.trunc() == value {
            Some(value as u32)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "f64_to_u64")]
    pub fn f64_to_u64(value: f64) -> Option<u64> {
        if value.is_finite() && value >= 0.0 && value <= 18446744073709551615.0 && value.trunc() == value {
            Some(value as u64)
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "i32_to_f32")]
    pub fn i32_to_f32(value: i32) -> f32 {
        value as f32
    }

    #[wasm_bindgen(js_name = "i64_to_f64")]
    pub fn i64_to_f64(value: i64) -> f64 {
        value as f64
    }

    #[wasm_bindgen(js_name = "u32_to_f32")]
    pub fn u32_to_f32(value: u32) -> f32 {
        value as f32
    }

    #[wasm_bindgen(js_name = "u64_to_f64")]
    pub fn u64_to_f64(value: u64) -> f64 {
        value as f64
    }

    #[wasm_bindgen(js_name = "to_binary")]
    pub fn to_binary(value: i32) -> String {
        format!("{:b}", value)
    }

    #[wasm_bindgen(js_name = "to_hex")]
    pub fn to_hex(value: i32) -> String {
        format!("{:x}", value)
    }

    #[wasm_bindgen(js_name = "to_octal")]
    pub fn to_octal(value: i32) -> String {
        format!("{:o}", value)
    }

    #[wasm_bindgen(js_name = "bitwise_and")]
    pub fn bitwise_and(a: u32, b: u32) -> u32 {
        a & b
    }

    #[wasm_bindgen(js_name = "bitwise_or")]
    pub fn bitwise_or(a: u32, b: u32) -> u32 {
        a | b
    }

    #[wasm_bindgen(js_name = "bitwise_xor")]
    pub fn bitwise_xor(a: u32, b: u32) -> u32 {
        a ^ b
    }

    #[wasm_bindgen(js_name = "bitwise_not")]
    pub fn bitwise_not(a: u32) -> u32 {
        !a
    }

    #[wasm_bindgen(js_name = "shift_left")]
    pub fn shift_left(a: u32, bits: u32) -> u32 {
        a << bits
    }

    #[wasm_bindgen(js_name = "shift_right")]
    pub fn shift_right(a: u32, bits: u32) -> u32 {
        a >> bits
    }

    #[wasm_bindgen(js_name = "unsigned_shift_right")]
    pub fn unsigned_shift_right(a: i32, bits: u32) -> u32 {
        (a as u32) >> bits
    }
}