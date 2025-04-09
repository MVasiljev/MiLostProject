use wasm_bindgen::prelude::*;
use js_sys::{Array, Float64Array, Uint32Array, Object, Reflect, Math};
use std::collections::{HashMap, HashSet};

#[wasm_bindgen]
pub struct MachineLearning;

#[wasm_bindgen]
impl MachineLearning {
    #[wasm_bindgen(js_name = "kMeans")]
    pub fn k_means(data: &Float64Array, n_clusters: usize, n_features: usize, max_iterations: Option<usize>) -> Object {
        let max_iter = max_iterations.unwrap_or(100);
        
        let n_samples = data.length() as usize / n_features;
        if n_samples < n_clusters {
            let error = Object::new();
            Reflect::set(&error, &JsValue::from_str("error"), &JsValue::from_str("Number of samples must be greater than number of clusters")).unwrap();
            return error;
        }
        
        let mut points: Vec<Vec<f64>> = Vec::with_capacity(n_samples);
        for i in 0..n_samples {
            let mut point = Vec::with_capacity(n_features);
            for j in 0..n_features {
                point.push(data.get_index((i * n_features + j) as u32));
            }
            points.push(point);
        }
        
        let mut centroids = Self::initialize_centroids(&points, n_clusters);
        let mut cluster_assignments = vec![0; n_samples];
        
        for _ in 0..max_iter {
            let mut changed = false;
            
            for (i, point) in points.iter().enumerate() {
                let mut min_distance = f64::MAX;
                let mut closest_cluster = 0;
                
                for (j, centroid) in centroids.iter().enumerate() {
                    let distance = Self::euclidean_distance(point, centroid);
                    if distance < min_distance {
                        min_distance = distance;
                        closest_cluster = j;
                    }
                }
                
                if cluster_assignments[i] != closest_cluster {
                    cluster_assignments[i] = closest_cluster;
                    changed = true;
                }
            }
            
            if !changed {
                break;
            }
            
            let new_centroids = Self::update_centroids(&points, &cluster_assignments, n_clusters, n_features);
            centroids = new_centroids;
        }
        
        let result = Object::new();
        
        let labels = Uint32Array::new_with_length(n_samples as u32);
        for (i, &cluster) in cluster_assignments.iter().enumerate() {
            labels.set_index(i as u32, cluster as u32);
        }
        
        let centroids_array = Float64Array::new_with_length((n_clusters * n_features) as u32);
        for i in 0..n_clusters {
            for j in 0..n_features {
                centroids_array.set_index((i * n_features + j) as u32, centroids[i][j]);
            }
        }
        
        Reflect::set(&result, &JsValue::from_str("labels"), &labels).unwrap();
        Reflect::set(&result, &JsValue::from_str("centroids"), &centroids_array).unwrap();
        Reflect::set(&result, &JsValue::from_str("n_clusters"), &JsValue::from_f64(n_clusters as f64)).unwrap();
        Reflect::set(&result, &JsValue::from_str("n_features"), &JsValue::from_f64(n_features as f64)).unwrap();
        
        result
    }
    
    fn initialize_centroids(points: &[Vec<f64>], n_clusters: usize) -> Vec<Vec<f64>> {
        let n_samples = points.len();
        let n_features = points[0].len();
        
        let mut centroids = Vec::with_capacity(n_clusters);
        let mut used_indices = HashSet::new();
        
        for _ in 0..n_clusters {
            loop {
                let index = (js_sys::Math::random() * n_samples as f64) as usize % n_samples;
                if used_indices.insert(index) {
                    centroids.push(points[index].clone());
                    break;
                }
            }
        }
        
        centroids
    }
    
    fn euclidean_distance(a: &[f64], b: &[f64]) -> f64 {
        let mut sum_sq = 0.0;
        for i in 0..a.len() {
            let diff = a[i] - b[i];
            sum_sq += diff * diff;
        }
        sum_sq.sqrt()
    }
    
    fn update_centroids(points: &[Vec<f64>], cluster_assignments: &[usize], n_clusters: usize, n_features: usize) -> Vec<Vec<f64>> {
        let mut centroids = vec![vec![0.0; n_features]; n_clusters];
        let mut counts = vec![0; n_clusters];
        
        for (i, point) in points.iter().enumerate() {
            let cluster = cluster_assignments[i];
            counts[cluster] += 1;
            
            for j in 0..n_features {
                centroids[cluster][j] += point[j];
            }
        }
        
        for i in 0..n_clusters {
            if counts[i] > 0 {
                for j in 0..n_features {
                    centroids[i][j] /= counts[i] as f64;
                }
            }
        }
        
        centroids
    }

    #[wasm_bindgen(js_name = "decisionTreeClassifier")]
    pub fn decision_tree_classifier(
        x_train: &Float64Array, 
        y_train: &Uint32Array, 
        n_features: usize,
        max_depth: Option<usize>,
        min_samples_split: Option<usize>
    ) -> Object {
        let max_tree_depth = max_depth.unwrap_or(10);
        let min_split = min_samples_split.unwrap_or(2);
        
        let n_samples = x_train.length() as usize / n_features;
        
        if y_train.length() as usize != n_samples {
            let error = Object::new();
            Reflect::set(&error, &JsValue::from_str("error"), &JsValue::from_str("Length of y_train must match number of samples in x_train")).unwrap();
            return error;
        }
        
        let mut x_values: Vec<Vec<f64>> = Vec::with_capacity(n_samples);
        for i in 0..n_samples {
            let mut features = Vec::with_capacity(n_features);
            for j in 0..n_features {
                features.push(x_train.get_index((i * n_features + j) as u32));
            }
            x_values.push(features);
        }
        
        let mut y_values: Vec<u32> = Vec::with_capacity(n_samples);
        for i in 0..n_samples {
            y_values.push(y_train.get_index(i as u32));
        }
        
        let tree_root = Self::build_tree(&x_values, &y_values, 0, max_tree_depth, min_split);
        
        Self::serialize_tree(&tree_root)
    }
    
    #[wasm_bindgen(js_name = "predictDecisionTree")]
    pub fn predict_decision_tree(tree: &Object, x_test: &Float64Array, n_features: usize) -> Uint32Array {
        let n_samples = x_test.length() as usize / n_features;
        let result = Uint32Array::new_with_length(n_samples as u32);
        
        let root_node = Reflect::get(tree, &JsValue::from_str("root")).unwrap();
        
        for i in 0..n_samples {
            let mut features = Vec::with_capacity(n_features);
            for j in 0..n_features {
                features.push(x_test.get_index((i * n_features + j) as u32));
            }
            
            let prediction = Self::predict_single_sample(&root_node, &features);
            result.set_index(i as u32, prediction);
        }
        
        result
    }
    
    fn predict_single_sample(node: &JsValue, features: &[f64]) -> u32 {
        if Reflect::has(node, &JsValue::from_str("prediction")).unwrap_or(false) {
            return Reflect::get(node, &JsValue::from_str("prediction"))
                .unwrap_or(JsValue::from_f64(0.0))
                .as_f64()
                .unwrap_or(0.0) as u32;
        }
        
        let feature_idx = Reflect::get(node, &JsValue::from_str("featureIndex"))
            .unwrap_or(JsValue::from_f64(0.0))
            .as_f64()
            .unwrap_or(0.0) as usize;
            
        let threshold = Reflect::get(node, &JsValue::from_str("threshold"))
            .unwrap_or(JsValue::from_f64(0.0))
            .as_f64()
            .unwrap_or(0.0);
            
        let feature_value = features[feature_idx];
        
        if feature_value <= threshold {
            let left_child = Reflect::get(node, &JsValue::from_str("left")).unwrap();
            Self::predict_single_sample(&left_child, features)
        } else {
            let right_child = Reflect::get(node, &JsValue::from_str("right")).unwrap();
            Self::predict_single_sample(&right_child, features)
        }
    }
    
    enum TreeNode {
        Internal {
            feature_index: usize,
            threshold: f64,
            left: Box<TreeNode>,
            right: Box<TreeNode>,
        },
        Leaf {
            prediction: u32,
        },
    }
    
    fn build_tree(
        x: &[Vec<f64>], 
        y: &[u32], 
        depth: usize, 
        max_depth: usize, 
        min_samples_split: usize
    ) -> TreeNode {
        if depth >= max_depth || x.len() < min_samples_split || Self::is_pure(y) {
            return TreeNode::Leaf {
                prediction: Self::majority_vote(y),
            };
        }
        
        let (feature_idx, threshold, left_indices, right_indices) = Self::find_best_split(x, y);
        
        if left_indices.is_empty() || right_indices.is_empty() {
            return TreeNode::Leaf {
                prediction: Self::majority_vote(y),
            };
        }
        
        let mut x_left = Vec::with_capacity(left_indices.len());
        let mut y_left = Vec::with_capacity(left_indices.len());
        
        for &idx in &left_indices {
            x_left.push(x[idx].clone());
            y_left.push(y[idx]);
        }
        
        let mut x_right = Vec::with_capacity(right_indices.len());
        let mut y_right = Vec::with_capacity(right_indices.len());
        
        for &idx in &right_indices {
            x_right.push(x[idx].clone());
            y_right.push(y[idx]);
        }
        
        let left_branch = Self::build_tree(&x_left, &y_left, depth + 1, max_depth, min_samples_split);
        let right_branch = Self::build_tree(&x_right, &y_right, depth + 1, max_depth, min_samples_split);
        
        TreeNode::Internal {
            feature_index: feature_idx,
            threshold,
            left: Box::new(left_branch),
            right: Box::new(right_branch),
        }
    }
    
    fn is_pure(y: &[u32]) -> bool {
        if y.is_empty() {
            return true;
        }
        
        let first_label = y[0];
        y.iter().all(|&label| label == first_label)
    }
    
    fn majority_vote(y: &[u32]) -> u32 {
        let mut counts = HashMap::new();
        
        for &label in y {
            *counts.entry(label).or_insert(0) += 1;
        }
        
        let mut max_count = 0;
        let mut majority_label = 0;
        
        for (label, &count) in &counts {
            if count > max_count {
                max_count = count;
                majority_label = *label;
            }
        }
        
        majority_label
    }
    
    fn find_best_split(x: &[Vec<f64>], y: &[u32]) -> (usize, f64, Vec<usize>, Vec<usize>) {
        let n_samples = x.len();
        let n_features = x[0].len();
        
        let mut best_gini = f64::MAX;
        let mut best_feature = 0;
        let mut best_threshold = 0.0;
        let mut best_left_indices = Vec::new();
        let mut best_right_indices = Vec::new();
        
        for feature_idx in 0..n_features {
            let unique_values: Vec<f64> = x.iter()
                .map(|row| row[feature_idx])
                .collect::<HashSet<f64>>()
                .into_iter()
                .collect();
                
            if unique_values.len() <= 1 {
                continue;
            }
            
            for &value in &unique_values {
                let mut left_indices = Vec::new();
                let mut right_indices = Vec::new();
                
                for i in 0..n_samples {
                    if x[i][feature_idx] <= value {
                        left_indices.push(i);
                    } else {
                        right_indices.push(i);
                    }
                }
                
                if left_indices.is_empty() || right_indices.is_empty() {
                    continue;
                }
                
                let mut y_left = Vec::with_capacity(left_indices.len());
                for &idx in &left_indices {
                    y_left.push(y[idx]);
                }
                
                let mut y_right = Vec::with_capacity(right_indices.len());
                for &idx in &right_indices {
                    y_right.push(y[idx]);
                }
                
                let gini = Self::gini_impurity(&y_left, &y_right);
                
                if gini < best_gini {
                    best_gini = gini;
                    best_feature = feature_idx;
                    best_threshold = value;
                    best_left_indices = left_indices;
                    best_right_indices = right_indices;
                }
            }
        }
        
        (best_feature, best_threshold, best_left_indices, best_right_indices)
    }
    
    fn gini_impurity(left: &[u32], right: &[u32]) -> f64 {
        let gini_left = Self::calculate_gini(left);
        let gini_right = Self::calculate_gini(right);
        
        let total_samples = left.len() + right.len();
        let weighted_gini = (left.len() as f64 / total_samples as f64) * gini_left
            + (right.len() as f64 / total_samples as f64) * gini_right;
            
        weighted_gini
    }
    
    fn calculate_gini(y: &[u32]) -> f64 {
        if y.is_empty() {
            return 0.0;
        }
        
        let mut counts = HashMap::new();
        let total = y.len() as f64;
        
        for &label in y {
            *counts.entry(label).or_insert(0.0) += 1.0;
        }
        
        let mut gini = 1.0;
        for &count in counts.values() {
            let p = count / total;
            gini -= p * p;
        }
        
        gini
    }
    
    fn serialize_tree(node: &TreeNode) -> Object {
        let result = Object::new();
        
        match node {
            TreeNode::Leaf { prediction } => {
                Reflect::set(&result, &JsValue::from_str("prediction"), &JsValue::from_f64(*prediction as f64)).unwrap();
            },
            TreeNode::Internal { feature_index, threshold, left, right } => {
                Reflect::set(&result, &JsValue::from_str("featureIndex"), &JsValue::from_f64(*feature_index as f64)).unwrap();
                Reflect::set(&result, &JsValue::from_str("threshold"), &JsValue::from_f64(*threshold)).unwrap();
                Reflect::set(&result, &JsValue::from_str("left"), &Self::serialize_tree(left)).unwrap();
                Reflect::set(&result, &JsValue::from_str("right"), &Self::serialize_tree(right)).unwrap();
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "linearRegression")]
    pub fn linear_regression(x_train: &Float64Array, y_train: &Float64Array, n_features: usize) -> Object {
        let n_samples = x_train.length() as usize / n_features;
        
        if y_train.length() as usize != n_samples {
            let error = Object::new();
            Reflect::set(&error, &JsValue::from_str("error"), &JsValue::from_str("Length of y_train must match number of samples in x_train")).unwrap();
            return error;
        }
        
        let mut x = Vec::with_capacity(n_samples);
        for i in 0..n_samples {
            let mut row = Vec::with_capacity(n_features + 1);
            row.push(1.0);
            for j in 0..n_features {
                row.push(x_train.get_index((i * n_features + j) as u32));
            }
            x.push(row);
        }
        
        let mut y = Vec::with_capacity(n_samples);
        for i in 0..n_samples {
            y.push(y_train.get_index(i as u32));
        }
        
        let coefficients = Self::compute_coefficients(&x, &y, n_features + 1);
        
        let result = Object::new();
        let coef_array = Float64Array::new_with_length((n_features + 1) as u32);
        
        for (i, &coef) in coefficients.iter().enumerate() {
            coef_array.set_index(i as u32, coef);
        }
        
        Reflect::set(&result, &JsValue::from_str("coefficients"), &coef_array).unwrap();
        Reflect::set(&result, &JsValue::from_str("intercept"), &JsValue::from_f64(coefficients[0])).unwrap();
        
        result
    }
    
    #[wasm_bindgen(js_name = "predictLinearRegression")]
    pub fn predict_linear_regression(model: &Object, x_test: &Float64Array, n_features: usize) -> Float64Array {
        let n_samples = x_test.length() as usize / n_features;
        let coefficients = Reflect::get(model, &JsValue::from_str("coefficients")).unwrap();
        let coef_array = coefficients.dyn_into::<Float64Array>().unwrap();
        
        let result = Float64Array::new_with_length(n_samples as u32);
        
        for i in 0..n_samples {
            let mut prediction = coef_array.get_index(0);
            
            for j in 0..n_features {
                prediction += x_test.get_index((i * n_features + j) as u32) * coef_array.get_index(j as u32 + 1);
            }
            
            result.set_index(i as u32, prediction);
        }
        
        result
    }
    
    fn compute_coefficients(x: &[Vec<f64>], y: &[f64], n_features: usize) -> Vec<f64> {
        let n_samples = x.len();
        
        let mut x_transpose = vec![vec![0.0; n_samples]; n_features];
        for i in 0..n_samples {
            for j in 0..n_features {
                x_transpose[j][i] = x[i][j];
            }
        }
        
        let mut xt_x = vec![vec![0.0; n_features]; n_features];
        for i in 0..n_features {
            for j in 0..n_features {
                let mut sum = 0.0;
                for k in 0..n_samples {
                    sum += x_transpose[i][k] * x[k][j];
                }
                xt_x[i][j] = sum;
            }
        }
        
        let xt_x_inv = Self::matrix_inverse(&xt_x);
        
        let mut xt_y = vec![0.0; n_features];
        for i in 0..n_features {
            let mut sum = 0.0;
            for j in 0..n_samples {
                sum += x_transpose[i][j] * y[j];
            }
            xt_y[i] = sum;
        }
        
        let mut coefficients = vec![0.0; n_features];
        for i in 0..n_features {
            let mut sum = 0.0;
            for j in 0..n_features {
                sum += xt_x_inv[i][j] * xt_y[j];
            }
            coefficients[i] = sum;
        }
        
        coefficients
    }
    
    fn matrix_inverse(matrix: &[Vec<f64>]) -> Vec<Vec<f64>> {
        let n = matrix.len();
        
        let mut augmented = vec![vec![0.0; 2 * n]; n];
        for i in 0..n {
            for j in 0..n {
                augmented[i][j] = matrix[i][j];
            }
            augmented[i][i + n] = 1.0;
        }
        
        for i in 0..n {
            let mut max_val = augmented[i][i].abs();
            let mut max_row = i;
            
            for j in i+1..n {
                let abs_val = augmented[j][i].abs();
                if abs_val > max_val {
                    max_val = abs_val;
                    max_row = j;
                }
            }
            
            if max_row != i {
                augmented.swap(i, max_row);
            }
            
            let pivot = augmented[i][i];
            for j in 0..2*n {
                augmented[i][j] /= pivot;
            }
            
            for j in 0..n {
                if j != i {
                    let factor = augmented[j][i];
                    for k in 0..2*n {
                        augmented[j][k] -= factor * augmented[i][k];
                    }
                }
            }
        }
        
        let mut inverse = vec![vec![0.0; n]; n];
        for i in 0..n {
            for j in 0..n {
                inverse[i][j] = augmented[i][j + n];
            }
        }
        
        inverse
    }
}