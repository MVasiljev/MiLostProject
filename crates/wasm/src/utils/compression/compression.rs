use wasm_bindgen::prelude::*;
use js_sys::Uint8Array;
use flate2::write::{GzEncoder, ZlibEncoder, DeflateEncoder};
use flate2::read::{GzDecoder, ZlibDecoder, DeflateDecoder};
use flate2::Compression;
use std::io::{Read, Write};

#[wasm_bindgen]
pub struct Compressions;


#[wasm_bindgen]
impl Compressions {
    #[wasm_bindgen(js_name = "compressGzip")]
    pub fn compress_gzip(data: &[u8], level: Option<u32>) -> Result<Uint8Array, JsValue> {
        let compression_level = match level {
            Some(lvl) => {
                if lvl > 9 {
                    return Err(JsValue::from_str("Compression level must be between 0 and 9"));
                }
                Compression::new(lvl)
            },
            None => Compression::default(),
        };
        
        let mut encoder = GzEncoder::new(Vec::new(), compression_level);
        
        if let Err(e) = encoder.write_all(data) {
            return Err(JsValue::from_str(&format!("Compression error: {}", e)));
        }
        
        match encoder.finish() {
            Ok(compressed) => {
                let result = Uint8Array::new_with_length(compressed.len() as u32);
                for (i, &byte) in compressed.iter().enumerate() {
                    result.set_index(i as u32, byte);
                }
                Ok(result)
            },
            Err(e) => Err(JsValue::from_str(&format!("Compression finalization error: {}", e))),
        }
    }

    #[wasm_bindgen(js_name = "decompressGzip")]
    pub fn decompress_gzip(data: &[u8]) -> Result<Uint8Array, JsValue> {
        let mut decoder = GzDecoder::new(data);
        let mut decompressed = Vec::new();
        
        if let Err(e) = decoder.read_to_end(&mut decompressed) {
            return Err(JsValue::from_str(&format!("Decompression error: {}", e)));
        }
        
        let result = Uint8Array::new_with_length(decompressed.len() as u32);
        for (i, &byte) in decompressed.iter().enumerate() {
            result.set_index(i as u32, byte);
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "compressZlib")]
    pub fn compress_zlib(data: &[u8], level: Option<u32>) -> Result<Uint8Array, JsValue> {
        let compression_level = match level {
            Some(lvl) => {
                if lvl > 9 {
                    return Err(JsValue::from_str("Compression level must be between 0 and 9"));
                }
                Compression::new(lvl)
            },
            None => Compression::default(),
        };
        
        let mut encoder = ZlibEncoder::new(Vec::new(), compression_level);
        
        if let Err(e) = encoder.write_all(data) {
            return Err(JsValue::from_str(&format!("Compression error: {}", e)));
        }
        
        match encoder.finish() {
            Ok(compressed) => {
                let result = Uint8Array::new_with_length(compressed.len() as u32);
                for (i, &byte) in compressed.iter().enumerate() {
                    result.set_index(i as u32, byte);
                }
                Ok(result)
            },
            Err(e) => Err(JsValue::from_str(&format!("Compression finalization error: {}", e))),
        }
    }

    #[wasm_bindgen(js_name = "decompressZlib")]
    pub fn decompress_zlib(data: &[u8]) -> Result<Uint8Array, JsValue> {
        let mut decoder = ZlibDecoder::new(data);
        let mut decompressed = Vec::new();
        
        if let Err(e) = decoder.read_to_end(&mut decompressed) {
            return Err(JsValue::from_str(&format!("Decompression error: {}", e)));
        }
        
        let result = Uint8Array::new_with_length(decompressed.len() as u32);
        for (i, &byte) in decompressed.iter().enumerate() {
            result.set_index(i as u32, byte);
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "compressDeflate")]
    pub fn compress_deflate(data: &[u8], level: Option<u32>) -> Result<Uint8Array, JsValue> {
        let compression_level = match level {
            Some(lvl) => {
                if lvl > 9 {
                    return Err(JsValue::from_str("Compression level must be between 0 and 9"));
                }
                Compression::new(lvl)
            },
            None => Compression::default(),
        };
        
        let mut encoder = DeflateEncoder::new(Vec::new(), compression_level);
        
        if let Err(e) = encoder.write_all(data) {
            return Err(JsValue::from_str(&format!("Compression error: {}", e)));
        }
        
        match encoder.finish() {
            Ok(compressed) => {
                let result = Uint8Array::new_with_length(compressed.len() as u32);
                for (i, &byte) in compressed.iter().enumerate() {
                    result.set_index(i as u32, byte);
                }
                Ok(result)
            },
            Err(e) => Err(JsValue::from_str(&format!("Compression finalization error: {}", e))),
        }
    }

    #[wasm_bindgen(js_name = "decompressDeflate")]
    pub fn decompress_deflate(data: &[u8]) -> Result<Uint8Array, JsValue> {
        let mut decoder = DeflateDecoder::new(data);
        let mut decompressed = Vec::new();
        
        if let Err(e) = decoder.read_to_end(&mut decompressed) {
            return Err(JsValue::from_str(&format!("Decompression error: {}", e)));
        }
        
        let result = Uint8Array::new_with_length(decompressed.len() as u32);
        for (i, &byte) in decompressed.iter().enumerate() {
            result.set_index(i as u32, byte);
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "compressLZ77")]
    pub fn compress_lz77(data: &[u8], window_size: Option<usize>) -> Uint8Array {
        let window = window_size.unwrap_or(4096).min(32768);
        let min_match_length = 3;
        let max_match_length = 258;
        
        let mut compressed = Vec::new();
        let mut i = 0;
        
        while i < data.len() {
            let (offset, length) = Self::find_longest_match(data, i, window, min_match_length, max_match_length);
            
            if length >= min_match_length {
                compressed.push(1);
                
                compressed.push((offset & 0xFF) as u8);
                compressed.push(((offset >> 8) & 0xFF) as u8);
                
                compressed.push(length as u8);
                
                i += length;
            } else {
                compressed.push(0);
                compressed.push(data[i]);
                i += 1;
            }
        }
        
        let result = Uint8Array::new_with_length(compressed.len() as u32);
        for (i, &byte) in compressed.iter().enumerate() {
            result.set_index(i as u32, byte);
        }
        
        result
    }

    #[wasm_bindgen(js_name = "decompressLZ77")]
    pub fn decompress_lz77(data: &[u8]) -> Uint8Array {
        let mut decompressed = Vec::new();
        let mut i = 0;
        
        while i < data.len() {
            let flag = data[i];
            i += 1;
            
            if flag == 0 {
                if i < data.len() {
                    decompressed.push(data[i]);
                    i += 1;
                }
            } else {
                if i + 2 < data.len() {
                    let offset = (data[i] as usize) | ((data[i + 1] as usize) << 8);
                    let length = data[i + 2] as usize;
                    i += 3;
                    
                    if offset <= decompressed.len() {
                        for j in 0..length {
                            let pos = decompressed.len() - offset + (j % offset);
                            decompressed.push(decompressed[pos]);
                        }
                    }
                }
            }
        }
        
        let result = Uint8Array::new_with_length(decompressed.len() as u32);
        for (i, &byte) in decompressed.iter().enumerate() {
            result.set_index(i as u32, byte);
        }
        
        result
    }
    
    fn find_longest_match(data: &[u8], current_pos: usize, window_size: usize, min_length: usize, max_length: usize) -> (usize, usize) {
        let max_search_pos = current_pos.saturating_sub(window_size);
        let search_end = (current_pos + max_length).min(data.len());
        
        let mut best_length = 0;
        let mut best_offset = 0;
        
        for i in (max_search_pos..current_pos).rev() {
            let mut length = 0;
            
            while current_pos + length < search_end && 
                  data[i + (length % (current_pos - i))] == data[current_pos + length] {
                length += 1;
            }
            
            if length >= min_length && length > best_length {
                best_length = length;
                best_offset = current_pos - i;
                
                if length >= max_length {
                    break;
                }
            }
        }
        
        (best_offset, best_length)
    }

}