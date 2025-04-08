use wasm_bindgen::prelude::*;
use js_sys::{Uint8Array, Object, Reflect};
use std::collections::{HashMap, BinaryHeap};
use std::cmp::Reverse;
use flate2::write::{GzEncoder, ZlibEncoder, DeflateEncoder};
use flate2::read::{GzDecoder, ZlibDecoder, DeflateDecoder};
use flate2::Compression;
use std::io::{Read, Write};

#[wasm_bindgen]
pub struct Compression;

#[wasm_bindgen]
impl Compression {
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

    #[wasm_bindgen(js_name = "compressHuffman")]
    pub fn compress_huffman(data: &[u8]) -> Object {
        if data.is_empty() {
            let empty_result = Object::new();
            Reflect::set(&empty_result, &JsValue::from_str("data"), &Uint8Array::new_with_length(0)).unwrap();
            Reflect::set(&empty_result, &JsValue::from_str("tree"), &Uint8Array::new_with_length(0)).unwrap();
            return empty_result;
        }
        
        let frequencies = Self::calculate_frequencies(data);
        let tree = Self::build_huffman_tree(&frequencies);
        let codes = Self::generate_huffman_codes(&tree);
        
        let serialized_tree = Self::serialize_huffman_tree(&tree);
        let compressed = Self::encode_data(data, &codes);
        
        let result = Object::new();
        
        let tree_array = Uint8Array::new_with_length(serialized_tree.len() as u32);
        for (i, &byte) in serialized_tree.iter().enumerate() {
            tree_array.set_index(i as u32, byte);
        }
        
        let data_array = Uint8Array::new_with_length(compressed.len() as u32);
        for (i, &byte) in compressed.iter().enumerate() {
            data_array.set_index(i as u32, byte);
        }
        
        Reflect::set(&result, &JsValue::from_str("tree"), &tree_array).unwrap();
        Reflect::set(&result, &JsValue::from_str("data"), &data_array).unwrap();
        
        result
    }

    #[wasm_bindgen(js_name = "decompressHuffman")]
    pub fn decompress_huffman(compressed_data: &[u8], tree_data: &[u8]) -> Result<Uint8Array, JsValue> {
        if compressed_data.is_empty() || tree_data.is_empty() {
            return Ok(Uint8Array::new_with_length(0));
        }
        
        let tree = Self::deserialize_huffman_tree(tree_data)?;
        let decompressed = Self::decode_data(compressed_data, &tree)?;
        
        let result = Uint8Array::new_with_length(decompressed.len() as u32);
        for (i, &byte) in decompressed.iter().enumerate() {
            result.set_index(i as u32, byte);
        }
        
        Ok(result)
    }
    
    fn calculate_frequencies(data: &[u8]) -> HashMap<u8, usize> {
        let mut frequencies = HashMap::new();
        
        for &byte in data {
            *frequencies.entry(byte).or_insert(0) += 1;
        }
        
        frequencies
    }
    
    #[derive(Clone)]
    enum HuffmanNode {
        Leaf { byte: u8, freq: usize },
        Internal { freq: usize, left: Box<HuffmanNode>, right: Box<HuffmanNode> },
    }
    
    impl PartialEq for HuffmanNode {
        fn eq(&self, other: &Self) -> bool {
            match (self, other) {
                (HuffmanNode::Leaf { freq: f1, .. }, HuffmanNode::Leaf { freq: f2, .. }) => f1 == f2,
                (HuffmanNode::Internal { freq: f1, .. }, HuffmanNode::Internal { freq: f2, .. }) => f1 == f2,
                _ => false,
            }
        }
    }
    
    impl Eq for HuffmanNode {}
    
    impl PartialOrd for HuffmanNode {
        fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
            Some(self.cmp(other))
        }
    }
    
    impl Ord for HuffmanNode {
        fn cmp(&self, other: &Self) -> std::cmp::Ordering {
            let self_freq = match self {
                HuffmanNode::Leaf { freq, .. } => *freq,
                HuffmanNode::Internal { freq, .. } => *freq,
            };
            
            let other_freq = match other {
                HuffmanNode::Leaf { freq, .. } => *freq,
                HuffmanNode::Internal { freq, .. } => *freq,
            };
            
            self_freq.cmp(&other_freq)
        }
    }
    
    fn build_huffman_tree(frequencies: &HashMap<u8, usize>) -> HuffmanNode {
        if frequencies.len() == 1 {
            let (&byte, &freq) = frequencies.iter().next().unwrap();
            return HuffmanNode::Leaf { byte, freq };
        }
        
        let mut heap = BinaryHeap::new();
        
        for (&byte, &freq) in frequencies {
            heap.push(Reverse(HuffmanNode::Leaf { byte, freq }));
        }
        
        while heap.len() > 1 {
            let Reverse(left) = heap.pop().unwrap();
            let Reverse(right) = heap.pop().unwrap();
            
            let left_freq = match &left {
                HuffmanNode::Leaf { freq, .. } => *freq,
                HuffmanNode::Internal { freq, .. } => *freq,
            };
            
            let right_freq = match &right {
                HuffmanNode::Leaf { freq, .. } => *freq,
                HuffmanNode::Internal { freq, .. } => *freq,
            };
            
            let internal = HuffmanNode::Internal {
                freq: left_freq + right_freq,
                left: Box::new(left),
                right: Box::new(right),
            };
            
            heap.push(Reverse(internal));
        }
        
        if let Some(Reverse(root)) = heap.pop() {
            root
        } else {
            HuffmanNode::Leaf { byte: 0, freq: 0 }
        }
    }
    
    fn generate_huffman_codes(tree: &HuffmanNode) -> HashMap<u8, Vec<bool>> {
        let mut codes = HashMap::new();
        let mut prefix = Vec::new();
        
        Self::generate_codes_recursive(tree, &mut prefix, &mut codes);
        
        codes
    }
    
    fn generate_codes_recursive(node: &HuffmanNode, prefix: &mut Vec<bool>, codes: &mut HashMap<u8, Vec<bool>>) {
        match node {
            HuffmanNode::Leaf { byte, .. } => {
                codes.insert(*byte, prefix.clone());
            },
            HuffmanNode::Internal { left, right, .. } => {
                prefix.push(false);
                Self::generate_codes_recursive(left, prefix, codes);
                prefix.pop();
                
                prefix.push(true);
                Self::generate_codes_recursive(right, prefix, codes);
                prefix.pop();
            },
        }
    }
    
    fn serialize_huffman_tree(tree: &HuffmanNode) -> Vec<u8> {
        let mut result = Vec::new();
        Self::serialize_node(tree, &mut result);
        result
    }
    
    fn serialize_node(node: &HuffmanNode, output: &mut Vec<u8>) {
        match node {
            HuffmanNode::Leaf { byte, .. } => {
                output.push(0);
                output.push(*byte);
            },
            HuffmanNode::Internal { left, right, .. } => {
                output.push(1);
                Self::serialize_node(left, output);
                Self::serialize_node(right, output);
            },
        }
    }
    
    fn deserialize_huffman_tree(data: &[u8]) -> Result<HuffmanNode, JsValue> {
        let mut index = 0;
        let (tree, _) = Self::deserialize_node(data, &mut index)?;
        Ok(tree)
    }
    
    fn deserialize_node(data: &[u8], index: &mut usize) -> Result<(HuffmanNode, usize), JsValue> {
        if *index >= data.len() {
            return Err(JsValue::from_str("Invalid Huffman tree data"));
        }
        
        let node_type = data[*index];
        *index += 1;
        
        if node_type == 0 {
            if *index >= data.len() {
                return Err(JsValue::from_str("Invalid Huffman tree data"));
            }
            
            let byte = data[*index];
            *index += 1;
            
            Ok((HuffmanNode::Leaf { byte, freq: 0 }, *index))
        } else {
            let (left, new_index) = Self::deserialize_node(data, index)?;
            *index = new_index;
            
            let (right, new_index) = Self::deserialize_node(data, index)?;
            *index = new_index;
            
            Ok((HuffmanNode::Internal {
                freq: 0,
                left: Box::new(left),
                right: Box::new(right),
            }, *index))
        }
    }
    
    fn encode_data(data: &[u8], codes: &HashMap<u8, Vec<bool>>) -> Vec<u8> {
        let mut result = Vec::new();
        let mut current_byte = 0u8;
        let mut bit_position = 0;
        
        for &byte in data {
            if let Some(code) = codes.get(&byte) {
                for &bit in code {
                    if bit {
                        current_byte |= 1 << bit_position;
                    }
                    
                    bit_position += 1;
                    
                    if bit_position == 8 {
                        result.push(current_byte);
                        current_byte = 0;
                        bit_position = 0;
                    }
                }
            }
        }
        
        if bit_position > 0 {
            result.push(current_byte);
        }
        
        let total_bits = data.iter()
            .map(|&byte| codes.get(&byte).map_or(0, |code| code.len()))
            .sum::<usize>();
        
        let mut header = Vec::new();
        header.extend_from_slice(&(total_bits as u32).to_le_bytes());
        header.append(&mut result);
        
        header
    }
    
    fn decode_data(compressed: &[u8], tree: &HuffmanNode) -> Result<Vec<u8>, JsValue> {
        if compressed.len() < 4 {
            return Err(JsValue::from_str("Invalid compressed data"));
        }
        
        let mut total_bits_bytes = [0u8; 4];
        total_bits_bytes.copy_from_slice(&compressed[0..4]);
        let total_bits = u32::from_le_bytes(total_bits_bytes) as usize;
        
        let mut result = Vec::new();
        let mut current_node = tree;
        let mut bit_count = 0;
        
        for &byte in &compressed[4..] {
            for bit_pos in 0..8 {
                if bit_count >= total_bits {
                    break;
                }
                
                let bit = (byte >> bit_pos) & 1 == 1;
                
                current_node = match current_node {
                    HuffmanNode::Internal { left, right, .. } => {
                        if bit {
                            right
                        } else {
                            left
                        }
                    },
                    _ => return Err(JsValue::from_str("Invalid Huffman tree")),
                };
                
                if let HuffmanNode::Leaf { byte, .. } = *current_node {
                    result.push(byte);
                    current_node = tree;
                }
                
                bit_count += 1;
            }
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "compressRLE")]
    pub fn compress_rle(data: &[u8]) -> Uint8Array {
        if data.is_empty() {
            return Uint8Array::new_with_length(0);
        }
        
        let mut result = Vec::new();
        let mut current_byte = data[0];
        let mut count = 1;
        
        for &byte in &data[1..] {
            if byte == current_byte && count < 255 {
                count += 1;
            } else {
                result.push(count);
                result.push(current_byte);
                current_byte = byte;
                count = 1;
            }
        }
        
        result.push(count);
        result.push(current_byte);
        
        let output = Uint8Array::new_with_length(result.len() as u32);
        for (i, &byte) in result.iter().enumerate() {
            output.set_index(i as u32, byte);
        }
        
        output
    }

    #[wasm_bindgen(js_name = "decompressRLE")]
    pub fn decompress_rle(data: &[u8]) -> Uint8Array {
        if data.is_empty() || data.len() % 2 != 0 {
            return Uint8Array::new_with_length(0);
        }
        
        let mut result = Vec::new();
        
        for chunk in data.chunks(2) {
            let count = chunk[0] as usize;
            let byte = chunk[1];
            
            for _ in 0..count {
                result.push(byte);
            }
        }
        
        let output = Uint8Array::new_with_length(result.len() as u32);
        for (i, &byte) in result.iter().enumerate() {
            output.set_index(i as u32, byte);
        }
        
        output
    }

    #[wasm_bindgen(js_name = "compressionStats")]
    pub fn compression_stats(original: &[u8], compressed: &[u8]) -> Object {
        let original_size = original.len();
        let compressed_size = compressed.len();
        
        let ratio = if original_size > 0 {
            compressed_size as f64 / original_size as f64
        } else {
            0.0
        };
        
        let savings = if original_size > 0 {
            (1.0 - ratio) * 100.0
        } else {
            0.0
        };
        
        let result = Object::new();
        Reflect::set(&result, &JsValue::from_str("originalSize"), &JsValue::from_f64(original_size as f64)).unwrap();
        Reflect::set(&result, &JsValue::from_str("compressedSize"), &JsValue::from_f64(compressed_size as f64)).unwrap();
        Reflect::set(&result, &JsValue::from_str("ratio"), &JsValue::from_f64(ratio)).unwrap();
        Reflect::set(&result, &JsValue::from_str("savings"), &JsValue::from_f64(savings)).unwrap();
        
        result
    }
}