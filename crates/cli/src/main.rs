use anyhow::{Context, Result};
use clap::{Parser, Subcommand};
use std::process::Command;
use std::path::Path;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
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
        
        /// Template to use (basic, react, vue)
        #[arg(short, long, default_value = "basic")]
        template: String,
        
        /// Output directory
        #[arg(short, long)]
        out_dir: Option<String>,
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
    let cli = Cli::parse();
    
    match &cli.command {
        Commands::Create { project_name, template, out_dir } => {
            let project_path = match out_dir {
                Some(dir) => format!("{}/{}", dir, project_name),
                None => project_name.clone(),
            };
            
            println!("Creating MiLost project: {} with template: {}", project_name, template);
            println!("Project will be created at: {}", project_path);
            
            milost_cli::create_project(&project_path, template)
                .context("Failed to create project")?;
            
            println!("\nProject created successfully! Get started with:");
            println!("  cd {}", project_name);
            println!("  npm install");
            println!("  npm start");
        },
        Commands::Build { path } => {
            println!("Building project at: {}", path);
            build_project(path)?;
        },
        Commands::Run { path } => {
            println!("Running project at: {}", path);
            run_project(path)?;
        },
        Commands::Test { path } => {
            println!("Testing project at: {}", path);
            test_project(path)?;
        },
    }
    
    Ok(())
}

fn build_project(path: &str) -> Result<()> {
    // Basic implementation: compile TypeScript to JavaScript
    let project_dir = Path::new(path);
    
    // Run tsc to compile
    let status = Command::new("npx")
        .args(["tsc", "--project", path])
        .current_dir(project_dir)
        .status()
        .context("Failed to run TypeScript compiler")?;
    
    if !status.success() {
        anyhow::bail!("TypeScript compilation failed");
    }
    
    println!("Build completed successfully");
    Ok(())
}

fn run_project(path: &str) -> Result<()> {
    // First build the project
    build_project(path)?;
    
    // Then run the compiled JavaScript
    let project_dir = Path::new(path);
    let entry_point = project_dir.join("dist/index.js");
    
    println!("Starting application...");
    
    let status = Command::new("node")
        .arg(entry_point)
        .current_dir(project_dir)
        .status()
        .context("Failed to run the application")?;
    
    if !status.success() {
        anyhow::bail!("Application exited with error");
    }
    
    Ok(())
}

fn test_project(path: &str) -> Result<()> {
    // Basic implementation: run tests using a test runner
    let project_dir = Path::new(path);
    
    println!("Running tests...");
    
    // You can replace this with a more sophisticated test runner
    let status = Command::new("npx")
        .args(["jest"])
        .current_dir(project_dir)
        .status()
        .context("Failed to run tests")?;
    
    if !status.success() {
        anyhow::bail!("Tests failed");
    }
    
    println!("All tests passed");
    Ok(())
}