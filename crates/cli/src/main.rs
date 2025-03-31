use anyhow::{Context, Result};
use clap::{Parser, Subcommand};
use log::{error, info, LevelFilter};
use simple_logger::SimpleLogger;

#[derive(Parser)]
#[command(
    name = "milost",
    version = "0.1.0",
    about = "MiLost CLI: Rust-inspired TypeScript Development Tool",
    long_about = "Create, build, run, and test TypeScript projects with MiLost"
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a new MiLost project
    Create {
        /// Name of the project to create
        project_name: String,
        
        /// Template to use (basic, react, vue, standalone)
        #[arg(short, long, default_value = "basic")]
        template: String,
        
        /// Output directory
        #[arg(short, long)]
        out_dir: Option<String>,
        
        /// Path to MiLost library (optional)
        #[arg(long)]
        milost_path: Option<String>,
    },
    
    /// Build a MiLost project
    Build {
        /// Path to project
        #[arg(default_value = ".")]
        path: String,
    },
    
    /// Run a MiLost project
    Run {
        /// Path to project
        #[arg(default_value = ".")]
        path: String,
    },
    
    /// Test a MiLost project
    Test {
        /// Path to project
        #[arg(default_value = ".")]
        path: String,
    },
}

fn main() -> Result<()> {
    // Initialize logging
    SimpleLogger::new()
        .with_level(LevelFilter::Info)
        .env()
        .init()
        .expect("Failed to initialize logger");

    // Parse CLI arguments
    let cli = Cli::parse();

    // Execute the appropriate command
    match &cli.command {
        Commands::Create { 
            project_name, 
            template, 
            out_dir, 
            milost_path 
        } => {
            // Determine project path
            let project_path = match out_dir {
                Some(dir) => format!("{}/{}", dir, project_name),
                None => project_name.clone(),
            };
            
            info!("Creating MiLost project: {} with template: {}", project_name, template);
            
            // Create project
            milost_cli::create_project(&project_path, template)
                .context("Failed to create project")?;
            
            // Project creation success message
            info!("✨ Project created successfully!");
            println!("\nNext steps:");
            println!("   cd {}", project_name);
            println!("   npm install");
            println!("   npm start");
        },
        
        Commands::Build { path } => {
            info!("🔨 Building project at: {}", path);
            milost_cli::build_project(path)
                .context("Failed to build project")?;
        },
        
        Commands::Run { path } => {
            info!("🏃 Running project at: {}", path);
            milost_cli::run_project(path)
                .context("Failed to run project")?;
        },
        
        Commands::Test { path } => {
            info!("🧪 Testing project at: {}", path);
            milost_cli::test_project(path)
                .context("Failed to run tests")?;
        },
    }
    
    Ok(())
}