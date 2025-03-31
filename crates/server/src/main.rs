// crates/server/src/main.rs
mod server;

#[tokio::main]
async fn main() {
    // Get command-line arguments
    let args: Vec<String> = std::env::args().collect();
    
    // By default, run the server
    // Only skip server if a specific no-serve flag is provided
    if args.len() > 1 && args[1] == "no-serve" {
        // Your normal application logic
        println!("Skipping server, running normal application logic");
        // Call your existing application code here
    } else {
        println!("Starting server...");
        server::run_server().await;
    }
}