use wasm_bindgen::prelude::*;
use js_sys::{Array, Uint8Array};
use sha2::{Sha256, Sha512, Digest};
use hmac::{Hmac, Mac};
use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce
};

#[wasm_bindgen]
pub struct Crypto;

#[wasm_bindgen]
impl Crypto {
    #[wasm_bindgen(js_name = "sha256")]
    pub fn sha256(data: &[u8]) -> Vec<u8> {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hasher.finalize().to_vec()
    }

    #[wasm_bindgen(js_name = "sha512")]
    pub fn sha512(data: &[u8]) -> Vec<u8> {
        let mut hasher = Sha512::new();
        hasher.update(data);
        hasher.finalize().to_vec()
    }

    #[wasm_bindgen(js_name = "hmac256")]
    pub fn hmac_sha256(key: &[u8], data: &[u8]) -> Result<Vec<u8>, JsValue> {
        let mut mac = Hmac::<Sha256>::new_from_slice(key)
            .map_err(|_| JsValue::from_str("Invalid key length"))?;
        mac.update(data);
        Ok(mac.finalize().into_bytes().to_vec())
    }

    #[wasm_bindgen(js_name = "hmac512")]
    pub fn hmac_sha512(key: &[u8], data: &[u8]) -> Result<Vec<u8>, JsValue> {
        let mut mac = Hmac::<Sha512>::new_from_slice(key)
            .map_err(|_| JsValue::from_str("Invalid key length"))?;
        mac.update(data);
        Ok(mac.finalize().into_bytes().to_vec())
    }

    #[wasm_bindgen(js_name = "aesGcmEncrypt")]
    pub fn aes_gcm_encrypt(key: &[u8], plaintext: &[u8]) -> Result<Uint8Array, JsValue> {
        if key.len() != 32 {
            return Err(JsValue::from_str("Key must be 32 bytes (256 bits)"));
        }

        let cipher = Aes256Gcm::new_from_slice(key)
            .map_err(|_| JsValue::from_str("Failed to create cipher"))?;

        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        let ciphertext = cipher.encrypt(&nonce, plaintext)
            .map_err(|_| JsValue::from_str("Encryption failed"))?;

        let mut result = Vec::with_capacity(nonce.len() + ciphertext.len());
        result.extend_from_slice(&nonce);
        result.extend_from_slice(&ciphertext);

        Ok(Uint8Array::from(&result[..]))
    }

    #[wasm_bindgen(js_name = "aesGcmDecrypt")]
    pub fn aes_gcm_decrypt(key: &[u8], ciphertext: &[u8]) -> Result<Uint8Array, JsValue> {
        if key.len() != 32 {
            return Err(JsValue::from_str("Key must be 32 bytes (256 bits)"));
        }

        if ciphertext.len() < 12 {
            return Err(JsValue::from_str("Invalid ciphertext length"));
        }

        let cipher = Aes256Gcm::new_from_slice(key)
            .map_err(|_| JsValue::from_str("Failed to create cipher"))?;

        let nonce = Nonce::from_slice(&ciphertext[..12]);
        let plaintext = cipher.decrypt(nonce, &ciphertext[12..])
            .map_err(|_| JsValue::from_str("Decryption failed"))?;

        Ok(Uint8Array::from(&plaintext[..]))
    }
    
    #[wasm_bindgen(js_name = "randomBytes")]
    pub fn random_bytes(length: usize) -> Uint8Array {
        let mut bytes = vec![0u8; length];
        getrandom::getrandom(&mut bytes).unwrap();
        Uint8Array::from(&bytes[..])
    }
}