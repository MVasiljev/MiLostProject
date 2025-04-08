use wasm_bindgen::prelude::*;
use js_sys::{Array, Float64Array, Uint32Array, Object, Reflect, Math};
use num_complex::{Complex64, ComplexFloat};
use std::f64::consts::{PI, E};

#[wasm_bindgen]
pub struct MathLib;

#[wasm_bindgen]
impl MathLib {
    #[wasm_bindgen(js_name = "isPrime")]
    pub fn is_prime(n: u32) -> bool {
        if n <= 1 {
            return false;
        }
        if n <= 3 {
            return true;
        }
        if n % 2 == 0 || n % 3 == 0 {
            return false;
        }
        
        let mut i = 5;
        while i * i <= n {
            if n % i == 0 || n % (i + 2) == 0 {
                return false;
            }
            i += 6;
        }
        
        true
    }

    #[wasm_bindgen(js_name = "nextPrime")]
    pub fn next_prime(n: u32) -> u32 {
        let mut next = n + 1;
        
        while !Self::is_prime(next) && next < u32::MAX {
            next += 1;
        }
        
        next
    }

    #[wasm_bindgen(js_name = "sieveOfEratosthenes")]
    pub fn sieve_of_eratosthenes(limit: u32) -> Uint32Array {
        if limit <= 1 {
            return Uint32Array::new_with_length(0);
        }
        
        let mut is_prime = vec![true; limit as usize + 1];
        is_prime[0] = false;
        is_prime[1] = false;
        
        let mut p = 2;
        while p * p <= limit {
            if is_prime[p as usize] {
                let mut i = p * p;
                while i <= limit {
                    is_prime[i as usize] = false;
                    i += p;
                }
            }
            p += 1;
        }
        
        let primes: Vec<u32> = (2..=limit)
            .filter(|&i| is_prime[i as usize])
            .collect();
        
        let result = Uint32Array::new_with_length(primes.len() as u32);
        for (i, &prime) in primes.iter().enumerate() {
            result.set_index(i as u32, prime);
        }
        
        result
    }

    #[wasm_bindgen(js_name = "gcd")]
    pub fn gcd(a: i32, b: i32) -> i32 {
        if b == 0 {
            a.abs()
        } else {
            Self::gcd(b, a % b)
        }
    }

    #[wasm_bindgen(js_name = "lcm")]
    pub fn lcm(a: i32, b: i32) -> i32 {
        if a == 0 || b == 0 {
            0
        } else {
            (a.abs() / Self::gcd(a, b)) * b.abs()
        }
    }

    #[wasm_bindgen(js_name = "factorial")]
    pub fn factorial(n: u32) -> f64 {
        if n <= 1 {
            return 1.0;
        }
        
        let mut result = 1.0;
        for i in 2..=n {
            result *= i as f64;
        }
        
        result
    }

    #[wasm_bindgen(js_name = "fibonacci")]
    pub fn fibonacci(n: u32) -> f64 {
        if n <= 1 {
            return n as f64;
        }
        
        let mut a = 0.0;
        let mut b = 1.0;
        
        for _ in 2..=n {
            let temp = a + b;
            a = b;
            b = temp;
        }
        
        b
    }

    #[wasm_bindgen(js_name = "binomialCoefficient")]
    pub fn binomial_coefficient(n: u32, k: u32) -> f64 {
        if k > n {
            return 0.0;
        }
        
        if k == 0 || k == n {
            return 1.0;
        }
        
        if k > n - k {
            return Self::binomial_coefficient(n, n - k);
        }
        
        let mut c = 1.0;
        for i in 0..k {
            c = c * (n - i) as f64 / (i + 1) as f64;
        }
        
        c
    }

    #[wasm_bindgen(js_name = "linearSolve")]
    pub fn linear_solve(a: &Float64Array, b: &Float64Array, n: usize) -> Result<Float64Array, JsValue> {
        if a.length() != (n * n) as u32 || b.length() != n as u32 {
            return Err(JsValue::from_str("Invalid matrix dimensions"));
        }
        
        let mut a_mat = vec![vec![0.0; n]; n];
        let mut b_vec = vec![0.0; n];
        
        for i in 0..n {
            for j in 0..n {
                a_mat[i][j] = a.get_index((i * n + j) as u32);
            }
            b_vec[i] = b.get_index(i as u32);
        }
        
        for k in 0..n-1 {
            let mut pivot_idx = k;
            let mut pivot_val = a_mat[k][k].abs();
            
            for i in k+1..n {
                if a_mat[i][k].abs() > pivot_val {
                    pivot_idx = i;
                    pivot_val = a_mat[i][k].abs();
                }
            }
            
            if pivot_val < 1e-10 {
                return Err(JsValue::from_str("Matrix is singular or nearly singular"));
            }
            
            if pivot_idx != k {
                a_mat.swap(k, pivot_idx);
                b_vec.swap(k, pivot_idx);
            }
            
            for i in k+1..n {
                let factor = a_mat[i][k] / a_mat[k][k];
                b_vec[i] -= factor * b_vec[k];
                
                for j in k..n {
                    a_mat[i][j] -= factor * a_mat[k][j];
                }
            }
        }
        
        let mut x = vec![0.0; n];
        for i in (0..n).rev() {
            let mut sum = 0.0;
            for j in i+1..n {
                sum += a_mat[i][j] * x[j];
            }
            
            if a_mat[i][i].abs() < 1e-10 {
                return Err(JsValue::from_str("Matrix is singular"));
            }
            
            x[i] = (b_vec[i] - sum) / a_mat[i][i];
        }
        
        let result = Float64Array::new_with_length(n as u32);
        for i in 0..n {
            result.set_index(i as u32, x[i]);
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "matrixMultiply")]
    pub fn matrix_multiply(a: &Float64Array, b: &Float64Array, rows_a: usize, cols_a: usize, cols_b: usize) -> Result<Float64Array, JsValue> {
        if a.length() != (rows_a * cols_a) as u32 || b.length() != (cols_a * cols_b) as u32 {
            return Err(JsValue::from_str("Invalid matrix dimensions"));
        }
        
        let mut result = Float64Array::new_with_length((rows_a * cols_b) as u32);
        
        for i in 0..rows_a {
            for j in 0..cols_b {
                let mut sum = 0.0;
                for k in 0..cols_a {
                    sum += a.get_index((i * cols_a + k) as u32) * b.get_index((k * cols_b + j) as u32);
                }
                result.set_index((i * cols_b + j) as u32, sum);
            }
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "matrixInverse")]
    pub fn matrix_inverse(a: &Float64Array, n: usize) -> Result<Float64Array, JsValue> {
        if a.length() != (n * n) as u32 {
            return Err(JsValue::from_str("Invalid matrix dimensions"));
        }
        
        let mut a_augmented = vec![vec![0.0; 2 * n]; n];
        
        for i in 0..n {
            for j in 0..n {
                a_augmented[i][j] = a.get_index((i * n + j) as u32);
            }
            a_augmented[i][i + n] = 1.0;
        }
        
        for k in 0..n {
            let mut pivot_idx = k;
            let mut pivot_val = a_augmented[k][k].abs();
            
            for i in k+1..n {
                if a_augmented[i][k].abs() > pivot_val {
                    pivot_idx = i;
                    pivot_val = a_augmented[i][k].abs();
                }
            }
            
            if pivot_val < 1e-10 {
                return Err(JsValue::from_str("Matrix is singular or nearly singular"));
            }
            
            if pivot_idx != k {
                a_augmented.swap(k, pivot_idx);
            }
            
            let pivot = a_augmented[k][k];
            for j in 0..2*n {
                a_augmented[k][j] /= pivot;
            }
            
            for i in 0..n {
                if i != k {
                    let factor = a_augmented[i][k];
                    for j in 0..2*n {
                        a_augmented[i][j] -= factor * a_augmented[k][j];
                    }
                }
            }
        }
        
        let result = Float64Array::new_with_length((n * n) as u32);
        for i in 0..n {
            for j in 0..n {
                result.set_index((i * n + j) as u32, a_augmented[i][j + n]);
            }
        }
        
        Ok(result)
    }

    #[wasm_bindgen(js_name = "eigenvalues")]
    pub fn eigenvalues(matrix: &Float64Array, n: usize, max_iterations: Option<usize>) -> Result<Float64Array, JsValue> {
        if matrix.length() != (n * n) as u32 {
            return Err(JsValue::from_str("Invalid matrix dimensions"));
        }
        
        let max_iter = max_iterations.unwrap_or(100);
        let mut a = vec![vec![0.0; n]; n];
        
        for i in 0..n {
            for j in 0..n {
                a[i][j] = matrix.get_index((i * n + j) as u32);
            }
        }
        
        let mut q = vec![vec![0.0; n]; n];
        let mut r = vec![vec![0.0; n]; n];
        
        for iter in 0..max_iter {
            if iter > 0 && Self::is_upper_triangular(&a, n, 1e-10) {
                break;
            }
            
            Self::qr_decomposition(&a, &mut q, &mut r, n);
            
            for i in 0..n {
                for j in 0..n {
                    a[i][j] = 0.0;
                    for k in 0..n {
                        a[i][j] += r[i][k] * q[k][j];
                    }
                }
            }
        }
        
        let result = Float64Array::new_with_length(n as u32);
        for i in 0..n {
            result.set_index(i as u32, a[i][i]);
        }
        
        Ok(result)
    }
    
    fn is_upper_triangular(a: &[Vec<f64>], n: usize, tolerance: f64) -> bool {
        for i in 1..n {
            for j in 0..i {
                if a[i][j].abs() > tolerance {
                    return false;
                }
            }
        }
        true
    }
    
    fn qr_decomposition(a: &[Vec<f64>], q: &mut [Vec<f64>], r: &mut [Vec<f64>], n: usize) {
        let mut v = vec![vec![0.0; n]; n];
        
        for j in 0..n {
            for i in 0..n {
                v[i][j] = a[i][j];
            }
            
            for k in 0..j {
                let dot_product = (0..n).map(|i| v[i][j] * v[i][k]).sum::<f64>();
                for i in 0..n {
                    v[i][j] -= dot_product * v[i][k];
                }
            }
            
            let norm = (0..n).map(|i| v[i][j] * v[i][j]).sum::<f64>().sqrt();
            
            if norm > 1e-10 {
                for i in 0..n {
                    v[i][j] /= norm;
                }
            }
        }
        
        for i in 0..n {
            for j in 0..n {
                q[i][j] = v[i][j];
            }
        }
        
        for i in 0..n {
            for j in 0..n {
                r[i][j] = 0.0;
                if i <= j {
                    for k in 0..n {
                        r[i][j] += v[k][i] * a[k][j];
                    }
                }
            }
        }
    }

    #[wasm_bindgen(js_name = "fft")]
    pub fn fast_fourier_transform(real: &Float64Array, imag: &Float64Array) -> Result<Object, JsValue> {
        let n = real.length() as usize;
        
        if n == 0 || (n & (n - 1)) != 0 {
            return Err(JsValue::from_str("Input length must be a power of 2"));
        }
        
        if imag.length() as usize != n {
            return Err(JsValue::from_str("Real and imaginary arrays must have the same length"));
        }
        
        let mut data: Vec<Complex64> = Vec::with_capacity(n);
        for i in 0..n {
            data.push(Complex64::new(
                real.get_index(i as u32), 
                imag.get_index(i as u32)
            ));
        }
        
        Self::fft_recursive(&mut data, n, false);
        
        let real_output = Float64Array::new_with_length(n as u32);
        let imag_output = Float64Array::new_with_length(n as u32);
        
        for i in 0..n {
            real_output.set_index(i as u32, data[i].re);
            imag_output.set_index(i as u32, data[i].im);
        }
        
        let result = Object::new();
        Reflect::set(&result, &JsValue::from_str("real"), &real_output).unwrap();
        Reflect::set(&result, &JsValue::from_str("imag"), &imag_output).unwrap();
        
        Ok(result)
    }
    
    #[wasm_bindgen(js_name = "ifft")]
    pub fn inverse_fast_fourier_transform(real: &Float64Array, imag: &Float64Array) -> Result<Object, JsValue> {
        let n = real.length() as usize;
        
        if n == 0 || (n & (n - 1)) != 0 {
            return Err(JsValue::from_str("Input length must be a power of 2"));
        }
        
        if imag.length() as usize != n {
            return Err(JsValue::from_str("Real and imaginary arrays must have the same length"));
        }
        
        let mut data: Vec<Complex64> = Vec::with_capacity(n);
        for i in 0..n {
            data.push(Complex64::new(
                real.get_index(i as u32), 
                imag.get_index(i as u32)
            ));
        }
        
        Self::fft_recursive(&mut data, n, true);
        
        let real_output = Float64Array::new_with_length(n as u32);
        let imag_output = Float64Array::new_with_length(n as u32);
        
        for i in 0..n {
            real_output.set_index(i as u32, data[i].re / n as f64);
            imag_output.set_index(i as u32, data[i].im / n as f64);
        }
        
        let result = Object::new();
        Reflect::set(&result, &JsValue::from_str("real"), &real_output).unwrap();
        Reflect::set(&result, &JsValue::from_str("imag"), &imag_output).unwrap();
        
        Ok(result)
    }
    
    fn fft_recursive(data: &mut [Complex64], n: usize, inverse: bool) {
        if n <= 1 {
            return;
        }
        
        let mut even = Vec::with_capacity(n / 2);
        let mut odd = Vec::with_capacity(n / 2);
        
        for i in (0..n).step_by(2) {
            even.push(data[i]);
            odd.push(data[i + 1]);
        }
        
        Self::fft_recursive(&mut even, n / 2, inverse);
        Self::fft_recursive(&mut odd, n / 2, inverse);
        
        let sign = if inverse { 1.0 } else { -1.0 };
        
        for k in 0..n/2 {
            let t = (-sign * 2.0 * PI * (k as f64) / (n as f64)).exp() * odd[k];
            data[k] = even[k] + t;
            data[k + n/2] = even[k] - t;
        }
    }

    #[wasm_bindgen(js_name = "integrateSimpson")]
    pub fn integrate_simpson(f: &js_sys::Function, a: f64, b: f64, n: u32) -> Result<f64, JsValue> {
        if n % 2 != 0 {
            return Err(JsValue::from_str("Number of intervals must be even"));
        }
        
        let h = (b - a) / n as f64;
        let mut sum = f.call1(&JsValue::NULL, &JsValue::from_f64(a)).unwrap_or(JsValue::from_f64(0.0)).as_f64().unwrap_or(0.0) + 
                      f.call1(&JsValue::NULL, &JsValue::from_f64(b)).unwrap_or(JsValue::from_f64(0.0)).as_f64().unwrap_or(0.0);
        
        for i in 1..n {
            let x = a + i as f64 * h;
            let coefficient = if i % 2 == 0 { 2.0 } else { 4.0 };
            
            sum += coefficient * f.call1(&JsValue::NULL, &JsValue::from_f64(x))
                .unwrap_or(JsValue::from_f64(0.0))
                .as_f64()
                .unwrap_or(0.0);
        }
        
        Ok(sum * h / 3.0)
    }

    #[wasm_bindgen(js_name = "laplaceTransform")]
    pub fn laplace_transform(f: &js_sys::Function, s: f64, t_max: f64, n: u32) -> Result<f64, JsValue> {
        let h = t_max / n as f64;
        let mut sum = 0.0;
        
        for i in 0..=n {
            let t = i as f64 * h;
            if t == 0.0 {
                continue;
            }
            
            let ft = f.call1(&JsValue::NULL, &JsValue::from_f64(t))
                .unwrap_or(JsValue::from_f64(0.0))
                .as_f64()
                .unwrap_or(0.0);
            
            let weight = if i == 0 || i == n { 1.0 } else { 2.0 };
            sum += weight * ft * (-s * t).exp();
        }
        
        Ok(sum * h / 2.0)
    }

    #[wasm_bindgen(js_name = "newtonRaphson")]
    pub fn newton_raphson(f: &js_sys::Function, df: &js_sys::Function, x0: f64, 
                          epsilon: Option<f64>, max_iterations: Option<u32>) -> Result<f64, JsValue> {
        let eps = epsilon.unwrap_or(1e-10);
        let max_iter = max_iterations.unwrap_or(100);
        
        let mut x = x0;
        
        for _ in 0..max_iter {
            let f_x = f.call1(&JsValue::NULL, &JsValue::from_f64(x))
                .unwrap_or(JsValue::from_f64(0.0))
                .as_f64()
                .unwrap_or(0.0);
            
            if f_x.abs() < eps {
                return Ok(x);
            }
            
            let df_x = df.call1(&JsValue::NULL, &JsValue::from_f64(x))
                .unwrap_or(JsValue::from_f64(1.0))
                .as_f64()
                .unwrap_or(1.0);
            
            if df_x.abs() < eps {
                return Err(JsValue::from_str("Derivative is too close to zero"));
            }
            
            let x_new = x - f_x / df_x;
            
            if (x_new - x).abs() < eps {
                return Ok(x_new);
            }
            
            x = x_new;
        }
        
        Err(JsValue::from_str("Method did not converge within the maximum number of iterations"))
    }

    #[wasm_bindgen(js_name = "besselJ")]
    pub fn bessel_j(n: i32, x: f64) -> f64 {
        let mut j_prev = 0.0;
        let mut j_curr = 0.0;
        
        if n < 0 && n % 2 != 0 {
            return -Self::bessel_j(-n, x);
        } else if n < 0 {
            return Self::bessel_j(-n, x);
        }
        
        if x == 0.0 {
            return if n == 0 { 1.0 } else { 0.0 };
        }
        
        let accuracy = 1e-10;
        let max_iterations = 1000;
        
        let mut m = n as usize + (x.abs() as usize).max(20);
        let mut bs = vec![0.0; m + 1];
        
        bs[m] = 0.0;
        bs[m - 1] = 1.0;
        
        for i in (1..=m-1).rev() {
            bs[i-1] = (2.0 * (i as f64)) / x * bs[i] - bs[i+1];
        }
        
        let scale = bs[0];
        for val in bs.iter_mut() {
            *val /= scale;
        }
        
        bs[n as usize]
    }

    #[wasm_bindgen(js_name = "legendrePolynomial")]
    pub fn legendre_polynomial(n: u32, x: f64) -> f64 {
        if n == 0 {
            return 1.0;
        }
        if n == 1 {
            return x;
        }
        
        let mut p0 = 1.0;
        let mut p1 = x;
        let mut p = 0.0;
        
        for k in 2..=n {
            p = ((2.0 * k as f64 - 1.0) * x * p1 - (k as f64 - 1.0) * p0) / k as f64;
            p0 = p1;
            p1 = p;
        }
        
        p
    }

    #[wasm_bindgen(js_name = "hyperbolicFunctions")]
    pub fn hyperbolic_functions(x: f64) -> Object {
        let result = Object::new();
        Reflect::set(&result, &JsValue::from_str("sinh"), &JsValue::from_f64(x.sinh())).unwrap();
        Reflect::set(&result, &JsValue::from_str("cosh"), &JsValue::from_f64(x.cosh())).unwrap();
        Reflect::set(&result, &JsValue::from_str("tanh"), &JsValue::from_f64(x.tanh())).unwrap();
        
        let cosh = x.cosh();
        let sinh = x.sinh();
        
        Reflect::set(&result, &JsValue::from_str("coth"), &JsValue::from_f64(if sinh != 0.0 { cosh / sinh } else { f64::INFINITY })).unwrap();
        Reflect::set(&result, &JsValue::from_str("sech"), &JsValue::from_f64(if cosh != 0.0 { 1.0 / cosh } else { 0.0 })).unwrap();
        Reflect::set(&result, &JsValue::from_str("csch"), &JsValue::from_f64(if sinh != 0.0 { 1.0 / sinh } else { f64::INFINITY })).unwrap();
        
        result
    }

    #[wasm_bindgen(js_name = "complexOperations")]
    pub fn complex_operations(re1: f64, im1: f64, re2: f64, im2: f64, operation: &str) -> Object {
        let z1 = Complex64::new(re1, im1);
        let z2 = Complex64::new(re2, im2);
        
        let result = match operation {
            "add" => z1 + z2,
            "subtract" => z1 - z2,
            "multiply" => z1 * z2,
            "divide" => z1 / z2,
            "pow" => z1.powc(z2),
            "ln" => z1.ln(),
            "exp" => z1.exp(),
            "sin" => z1.sin(),
            "cos" => z1.cos(),
            "tan" => z1.tan(),
            _ => Complex64::new(0.0, 0.0)
        };
        
        let output = Object::new();
        Reflect::set(&output, &JsValue::from_str("re"), &JsValue::from_f64(result.re)).unwrap();
        Reflect::set(&output, &JsValue::from_str("im"), &JsValue::from_f64(result.im)).unwrap();
        
        output
    }

    #[wasm_bindgen(js_name = "statisticalFunctions")]
    pub fn statistical_functions(data: &Float64Array) -> Object {
        let n = data.length() as usize;
        if n == 0 {
            let empty = Object::new();
            Reflect::set(&empty, &JsValue::from_str("error"), &JsValue::from_str("Empty dataset")).unwrap();
            return empty;
        }
        
        let mut values = Vec::with_capacity(n);
        
        for i in 0..n {
            values.push(data.get_index(i as u32));
        }
        
        values.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
        
        let sum: f64 = values.iter().sum();
        let mean = sum / n as f64;
        
        let variance: f64 = values.iter().map(|&x| (x - mean).powi(2)).sum::<f64>() / n as f64;
        let std_dev = variance.sqrt();
        
        let median = if n % 2 == 0 {
            (values[n/2 - 1] + values[n/2]) / 2.0
        } else {
            values[n/2]
        };
        
        let min = values[0];
        let max = values[n - 1];
        
        let q1_idx = n / 4;
        let q3_idx = 3 * n / 4;
        
        let q1 = if n >= 4 {
            if q1_idx * 4 == n {
                (values[q1_idx - 1] + values[q1_idx]) / 2.0
            } else {
                values[q1_idx]
            }
        } else {
            min
        };
        
        let q3 = if n >= 4 {
            if q3_idx * 4 == 3 * n {
                (values[q3_idx - 1] + values[q3_idx]) / 2.0
            } else {
                values[q3_idx]
            }
        } else {
            max
        };
        
        let result = Object::new();
        Reflect::set(&result, &JsValue::from_str("mean"), &JsValue::from_f64(mean)).unwrap();
        Reflect::set(&result, &JsValue::from_str("median"), &JsValue::from_f64(median)).unwrap();
        Reflect::set(&result, &JsValue::from_str("variance"), &JsValue::from_f64(variance)).unwrap();
        Reflect::set(&result, &JsValue::from_str("stdDev"), &JsValue::from_f64(std_dev)).unwrap();
        Reflect::set(&result, &JsValue::from_str("min"), &JsValue::from_f64(min)).unwrap();
        Reflect::set(&result, &JsValue::from_str("max"), &JsValue::from_f64(max)).unwrap();
        Reflect::set(&result, &JsValue::from_str("q1"), &JsValue::from_f64(q1)).unwrap();
        Reflect::set(&result, &JsValue::from_str("q3"), &JsValue::from_f64(q3)).unwrap();
        Reflect::set(&result, &JsValue::from_str("iqr"), &JsValue::from_f64(q3 - q1)).unwrap();
        Reflect::set(&result, &JsValue::from_str("range"), &JsValue::from_f64(max - min)).unwrap();
        Reflect::set(&result, &JsValue::from_str("count"), &JsValue::from_f64(n as f64)).unwrap();
        
        result
    }
}