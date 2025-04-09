use std::{cmp::Reverse, collections::{BinaryHeap, HashMap}};

use js_sys::{Object, Reflect, Uint8Array};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

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
    
    generate_codes_recursive(tree, &mut prefix, &mut codes);
    
    codes
}

fn generate_codes_recursive(node: &HuffmanNode, prefix: &mut Vec<bool>, codes: &mut HashMap<u8, Vec<bool>>) {
    match node {
        HuffmanNode::Leaf { byte, .. } => {
            codes.insert(*byte, prefix.clone());
        },
        HuffmanNode::Internal { left, right, .. } => {
            prefix.push(false);
            generate_codes_recursive(left, prefix, codes);
            prefix.pop();
            
            prefix.push(true);
            generate_codes_recursive(right, prefix, codes);
            prefix.pop();
        },
    }
}

fn serialize_huffman_tree(tree: &HuffmanNode) -> Vec<u8> {
    let mut result = Vec::new();
    serialize_node(tree, &mut result);
    result
}

pub fn serialize_node(node: &HuffmanNode, output: &mut Vec<u8>) {
    match node {
        HuffmanNode::Leaf { byte, .. } => {
            output.push(0);
            output.push(*byte);
        },
        HuffmanNode::Internal { left, right, .. } => {
            output.push(1);
            serialize_node(left, output);
            serialize_node(right, output);
        },
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
            let (left, new_index) = deserialize_node(data, index)?;
            *index = new_index;
            
            let (right, new_index) = deserialize_node(data, index)?;
            *index = new_index;
            
            Ok((HuffmanNode::Internal {
                freq: 0,
                left: Box::new(left),
                right: Box::new(right),
            }, *index))
        }
    }

    fn deserialize_huffman_tree(data: &[u8]) -> Result<HuffmanNode, JsValue> {
        let mut index = 0;
        let (tree, _) = deserialize_node(data, &mut index)?;
        Ok(tree)
    }

    #[wasm_bindgen(js_name = "compressHuffman")]
    pub fn compress_huffman(data: &[u8]) -> Object {
        if data.is_empty() {
            let empty_result = Object::new();
            Reflect::set(&empty_result, &JsValue::from_str("data"), &Uint8Array::new_with_length(0)).unwrap();
            Reflect::set(&empty_result, &JsValue::from_str("tree"), &Uint8Array::new_with_length(0)).unwrap();
            return empty_result;
        }
        
        let frequencies = calculate_frequencies(data);
        let tree = build_huffman_tree(&frequencies);
        let codes = generate_huffman_codes(&tree);
        
        let serialized_tree = serialize_huffman_tree(&tree);
        let compressed = encode_data(data, &codes);
        
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
        
        let tree = deserialize_huffman_tree(tree_data)?;
        let decompressed = decode_data(compressed_data, &tree)?;
        
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
