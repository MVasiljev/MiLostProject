use std::path::{Path, PathBuf};
use warp::reply::Reply;
use warp::Filter;
use warp::http::header::HeaderValue;
use std::fs;

pub async fn run_server() {
    // Construct the path to the dist directory relative to the current executable
    let dist_path = std::env::current_dir()
        .expect("Failed to get current directory")
        .parent() // crates/
        .expect("Failed to get parent directory")
        .parent() // project root
        .expect("Failed to get project root")
        .join("example/dist");

    // Detailed directory and file logging
    println!("Attempting to serve from directory: {}", dist_path.display());
    
    // List all files in the directory
    match fs::read_dir(&dist_path) {
        Ok(entries) => {
            println!("Files in dist directory:");
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    println!("- {}", path.display());
                }
            }
        }
        Err(e) => {
            eprintln!("Error reading directory: {}", e);
        }
    }

    // List files in pkg subdirectory
    let pkg_path = dist_path.join("pkg");
    if pkg_path.exists() {
        match fs::read_dir(&pkg_path) {
            Ok(entries) => {
                println!("Files in pkg directory:");
                for entry in entries {
                    if let Ok(entry) = entry {
                        let path = entry.path();
                        println!("- {}", path.display());
                    }
                }
            }
            Err(e) => {
                eprintln!("Error reading pkg directory: {}", e);
            }
        }
    } else {
        eprintln!("pkg directory does not exist at: {}", pkg_path.display());
    }

    if !dist_path.exists() {
        eprintln!("Error: 'dist' directory not found at: {}", dist_path.display());
        eprintln!("Make sure to build your project first and the dist directory exists.");
        std::process::exit(1);
    }

    println!("Serving files from: {}", dist_path.display());

    // Custom file handler with verbose logging
    let file_handler = warp::fs::dir(dist_path.clone())
        .map(|file: warp::fs::File| {
            let mut res = file.into_response();
            
            // Get the file path for logging
            if let Some(path) = res.headers().get("content-disposition") {
                if let Ok(disposition) = path.to_str() {
                    println!("Serving file: {}", disposition);

                    // Explicit MIME type handling with logging
                    if disposition.contains(".js") {
                        println!("Setting MIME type for JS file");
                        res.headers_mut().insert("content-type", HeaderValue::from_static("application/javascript"));
                    } else if disposition.contains(".wasm") {
                        println!("Setting MIME type for WASM file");
                        res.headers_mut().insert("content-type", HeaderValue::from_static("application/wasm"));
                    } else if disposition.contains(".html") {
                        println!("Setting MIME type for HTML file");
                        res.headers_mut().insert("content-type", HeaderValue::from_static("text/html"));
                    }
                }
            }
            
            res
        });

    // Serve specific routes with logging
    let index_html = warp::path::end()
        .and(warp::fs::file(dist_path.join("index.html")))
        .map(|reply| {
            println!("Serving index.html");
            reply
        });

    // Specific route for pkg files with detailed logging
    let pkg_files = warp::path("pkg")
        .and(warp::fs::dir(dist_path.join("pkg")))
        .map(|file: warp::fs::File| {
            let mut res = file.into_response();
            
            // Get the file path for logging
            if let Some(path) = res.headers().get("content-disposition") {
                if let Ok(disposition) = path.to_str() {
                    println!("Serving pkg file: {}", disposition);

                    // More specific MIME type for pkg directory
                    if disposition.contains(".js") {
                        println!("Setting MIME type for JS file in pkg");
                        res.headers_mut().insert("content-type", HeaderValue::from_static("application/javascript"));
                    } else if disposition.contains(".wasm") {
                        println!("Setting MIME type for WASM file in pkg");
                        res.headers_mut().insert("content-type", HeaderValue::from_static("application/wasm"));
                    }
                }
            }
            res
        });

    // CORS headers with liberal settings for debugging
    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST", "OPTIONS"])
        .allow_headers(vec!["Content-Type", "Accept"])
        .allow_credentials(true);

    // Combine all routes
    let routes = index_html
        .or(pkg_files)
        .or(file_handler)
        .with(cors)
        .with(warp::reply::with::header("Cache-Control", "no-cache, no-store, must-revalidate"))
        .with(warp::reply::with::header("Cross-Origin-Opener-Policy", "same-origin"))
        .with(warp::reply::with::header("Cross-Origin-Embedder-Policy", "require-corp"));

    println!("Starting server at http://localhost:8080");
    // Start the server
    warp::serve(routes).run(([0, 0, 0, 0], 8080)).await;
}