use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Object, Reflect};
use std::rc::Rc;

#[wasm_bindgen]
pub struct Sorting;

#[wasm_bindgen]
impl Sorting {
    
    #[wasm_bindgen(js_name = "quickSort")]
    pub fn quick_sort(arr: &js_sys::Array, comparator: Option<Function>) -> js_sys::Array {
        if arr.length() <= 1 {
            return arr.clone();
        }

        let length = arr.length() as usize;
        let mut vector: Vec<JsValue> = (0..length).map(|i| arr.get(i as u32)).collect();
        
        let compare_fn = Rc::new(move |a: &JsValue, b: &JsValue| -> i32 {
            if let Some(ref cmp) = &comparator {
                let result = cmp.call2(&JsValue::NULL, a, b)
                    .unwrap_or(JsValue::from(0));
                return result.as_f64().unwrap_or(0.0) as i32;
            } else {
                let a_val = a.as_f64().unwrap_or(f64::NAN);
                let b_val = b.as_f64().unwrap_or(f64::NAN);
                
                if a_val.is_nan() && b_val.is_nan() {
                    return 0;
                }
                if a_val.is_nan() {
                    return 1;
                }
                if b_val.is_nan() {
                    return -1;
                }
                
                if a_val < b_val {
                    return -1;
                } else if a_val > b_val {
                    return 1;
                }
                return 0;
            }
        });

        Self::quick_sort_internal(&mut vector, 0, length - 1, compare_fn);
        
        let result = Array::new_with_length(length as u32);
        for (i, item) in vector.iter().enumerate() {
            result.set(i as u32, item.clone());
        }
        
        result
    }

    #[wasm_bindgen(js_name = "mergeSort")]
    pub fn merge_sort(arr: &js_sys::Array, comparator: Option<Function>) -> js_sys::Array {
        if arr.length() <= 1 {
            return arr.clone();
        }
        
        let length = arr.length() as usize;
        let mut vector: Vec<JsValue> = (0..length).map(|i| arr.get(i as u32)).collect();
        
        let compare_fn = Rc::new(move |a: &JsValue, b: &JsValue| -> i32 {
            if let Some(ref cmp) = &comparator {
                let result = cmp.call2(&JsValue::NULL, a, b)
                    .unwrap_or(JsValue::from(0));
                return result.as_f64().unwrap_or(0.0) as i32;
            } else {
                let a_val = a.as_f64().unwrap_or(f64::NAN);
                let b_val = b.as_f64().unwrap_or(f64::NAN);
                
                if a_val.is_nan() && b_val.is_nan() {
                    return 0;
                }
                if a_val.is_nan() {
                    return 1;
                }
                if b_val.is_nan() {
                    return -1;
                }
                
                if a_val < b_val {
                    return -1;
                } else if a_val > b_val {
                    return 1;
                }
                return 0;
            }
        });

        Self::merge_sort_internal(&mut vector, 0, length - 1, compare_fn);
        
        let result = Array::new_with_length(length as u32);
        for (i, item) in vector.iter().enumerate() {
            result.set(i as u32, item.clone());
        }
        
        result
    }

    #[wasm_bindgen(js_name = "heapSort")]
    pub fn heap_sort(arr: &js_sys::Array, comparator: Option<Function>) -> js_sys::Array {
        if arr.length() <= 1 {
            return arr.clone();
        }
        
        let length = arr.length() as usize;
        let mut vector: Vec<JsValue> = (0..length).map(|i| arr.get(i as u32)).collect();
        
        let compare_fn = Rc::new(move |a: &JsValue, b: &JsValue| -> i32 {
            if let Some(ref cmp) = &comparator {
                let result = cmp.call2(&JsValue::NULL, a, b)
                    .unwrap_or(JsValue::from(0));
                return result.as_f64().unwrap_or(0.0) as i32;
            } else {
                let a_val = a.as_f64().unwrap_or(f64::NAN);
                let b_val = b.as_f64().unwrap_or(f64::NAN);
                
                if a_val.is_nan() && b_val.is_nan() {
                    return 0;
                }
                if a_val.is_nan() {
                    return 1;
                }
                if b_val.is_nan() {
                    return -1;
                }
                
                if a_val < b_val {
                    return -1;
                } else if a_val > b_val {
                    return 1;
                }
                return 0;
            }
        });

        Self::heap_sort_internal(&mut vector, compare_fn);
        
        let result = Array::new_with_length(length as u32);
        for (i, item) in vector.iter().enumerate() {
            result.set(i as u32, item.clone());
        }
        
        result
    }

    fn quick_sort_internal<F>(arr: &mut [JsValue], low: usize, high: usize, compare: Rc<F>) 
    where F: Fn(&JsValue, &JsValue) -> i32 {
        if low < high {
            let pivot = Self::partition(arr, low, high, Rc::clone(&compare));
            
            if pivot > 0 {
                Self::quick_sort_internal(arr, low, pivot - 1, Rc::clone(&compare));
            }
            Self::quick_sort_internal(arr, pivot + 1, high, compare);
        }
    }

    fn partition<F>(arr: &mut [JsValue], low: usize, high: usize, compare: Rc<F>) -> usize 
    where F: Fn(&JsValue, &JsValue) -> i32 {
        let pivot = arr[high].clone();
        let mut i = low;
        
        for j in low..high {
            if compare(&arr[j], &pivot) <= 0 {
                arr.swap(i, j);
                i += 1;
            }
        }
        
        arr.swap(i, high);
        i
    }

    fn merge_sort_internal<F>(arr: &mut [JsValue], left: usize, right: usize, compare: Rc<F>)
    where F: Fn(&JsValue, &JsValue) -> i32 {
        if left < right {
            let mid = left + (right - left) / 2;
            
            Self::merge_sort_internal(arr, left, mid, Rc::clone(&compare));
            Self::merge_sort_internal(arr, mid + 1, right, Rc::clone(&compare));
            
            Self::merge(arr, left, mid, right, compare);
        }
    }

    fn merge<F>(arr: &mut [JsValue], left: usize, mid: usize, right: usize, compare: Rc<F>)
        where F: Fn(&JsValue, &JsValue) -> i32 {
        let n1 = mid - left + 1;
        let n2 = right - mid;
        
        let mut left_arr = Vec::with_capacity(n1);
        let mut right_arr = Vec::with_capacity(n2);
        
        for i in 0..n1 {
            left_arr.push(arr[left + i].clone());
        }
        
        for i in 0..n2 {
            right_arr.push(arr[mid + 1 + i].clone());
        }
        
        let mut i = 0;
        let mut j = 0;
        let mut k = left;
        
        while i < n1 && j < n2 {
            if compare(&left_arr[i], &right_arr[j]) <= 0 {
                arr[k] = left_arr[i].clone();
                i += 1;
            } else {
                arr[k] = right_arr[j].clone();
                j += 1;
            }
            k += 1;
        }
        
        while i < n1 {
            arr[k] = left_arr[i].clone();
            i += 1;
            k += 1;
        }
        
        while j < n2 {
            arr[k] = right_arr[j].clone();
            j += 1;
            k += 1;
        }
    }

    fn heap_sort_internal<F>(arr: &mut [JsValue], compare: Rc<F>)
    where F: Fn(&JsValue, &JsValue) -> i32 {
        let n = arr.len();
        
        for i in (0..n/2).rev() {
            Self::heapify(arr, n, i, Rc::clone(&compare));
        }
        
        for i in (1..n).rev() {
            arr.swap(0, i);
            Self::heapify(arr, i, 0, Rc::clone(&compare));
        }
    }

    fn heapify<F>(arr: &mut [JsValue], n: usize, i: usize, compare: Rc<F>)
    where F: Fn(&JsValue, &JsValue) -> i32 {
        let mut largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if left < n && compare(&arr[left], &arr[largest]) > 0 {
            largest = left;
        }
        
        if right < n && compare(&arr[right], &arr[largest]) > 0 {
            largest = right;
        }
        
        if largest != i {
            arr.swap(i, largest);
            Self::heapify(arr, n, largest, compare);
        }
    }

    #[wasm_bindgen(js_name = "isSorted")]
    pub fn is_sorted(arr: &js_sys::Array, comparator: Option<Function>) -> bool {
        if arr.length() <= 1 {
            return true;
        }
        
        let length = arr.length() as usize;
        
        for i in 0..length-1 {
            let a = arr.get(i as u32);
            let b = arr.get((i + 1) as u32);
            
            let result = if let Some(ref cmp) = comparator {
                cmp.call2(&JsValue::NULL, &a, &b)
                    .unwrap_or(JsValue::from(0))
                    .as_f64()
                    .unwrap_or(0.0) as i32
            } else {
                let a_val = a.as_f64().unwrap_or(f64::NAN);
                let b_val = b.as_f64().unwrap_or(f64::NAN);
                
                if a_val.is_nan() && b_val.is_nan() {
                    0
                } else if a_val.is_nan() {
                    1
                } else if b_val.is_nan() {
                    -1
                } else if a_val < b_val {
                    -1
                } else if a_val > b_val {
                    1
                } else {
                    0
                }
            };
            
            if result > 0 {
                return false;
            }
        }
        
        true
    }
}