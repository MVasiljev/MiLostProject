use anyhow::{Context, Result};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use walkdir::WalkDir;
use serde_json::{json, Value};
use log::{info, warn, error};

/// Represents different project templates
#[derive(Debug, Clone)]
pub enum ProjectTemplate {
    Basic,
    React,
    Vue,
    Standalone,
}

impl From<&str> for ProjectTemplate {
    fn from(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "react" => ProjectTemplate::React,
            "vue" => ProjectTemplate::Vue,
            "standalone" => ProjectTemplate::Standalone,
            _ => ProjectTemplate::Basic,
        }
    }
}

/// Creates a new MiLost project
pub fn create_project(project_path: &str, template: &str) -> Result<()> {
    let template = ProjectTemplate::from(template);
    let project_dir = Path::new(project_path);

    // Create project directory
    fs::create_dir_all(project_dir)
        .context("Failed to create project directory")?;

    // Generate project files
    generate_package_json(project_dir, project_path, &template)?;
    generate_typescript_config(project_dir)?;
    create_source_files(project_dir, &template)?;
    create_gitignore(project_dir)?;
    create_project_structure(project_dir)?;

    // Attempt to install local MiLost dependency
    if let Err(e) = install_local_dependency(project_dir) {
        warn!("Could not install local MiLost dependency: {}", e);
    }

    info!("Project created successfully at {}", project_path);
    Ok(())
}

/// Generates package.json for the project
fn generate_package_json(
    project_dir: &Path, 
    project_path: &str, 
    template: &ProjectTemplate
) -> Result<()> {
    let project_name = Path::new(project_path)
        .file_name()
        .and_then(|f| f.to_str())
        .unwrap_or("milost-project");

    let package_json = json!({
        "name": project_name,
        "version": "0.1.0",
        "description": format!("MiLost {} Project", template_description(template)),
        "type": "module",
        "scripts": {
            "start": "node dist/index.js",
            "build": "tsc",
            "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
        },
        "dependencies": {
            "milost": "file:./lib"
        },
        "devDependencies": {
            "typescript": "^5.0.0",
            "jest": "^29.0.0",
            "@types/jest": "^29.0.0",
            "ts-jest": "^29.0.0"
        }
    });

    let json_str = serde_json::to_string_pretty(&package_json)?;
    fs::write(project_dir.join("package.json"), json_str)?;

    Ok(())
}

/// Helper function to get template description
fn template_description(template: &ProjectTemplate) -> &'static str {
    match template {
        ProjectTemplate::React => "React",
        ProjectTemplate::Vue => "Vue",
        ProjectTemplate::Standalone => "Standalone",
        ProjectTemplate::Basic => "Basic",
    }
}

/// Generates TypeScript configuration
fn generate_typescript_config(project_dir: &Path) -> Result<()> {
    let tsconfig = json!({
        "compilerOptions": {
            "target": "ES2022",
            "module": "NodeNext",
            "moduleResolution": "NodeNext",
            "outDir": "./dist",
            "rootDir": "./src",
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true
        },
        "include": ["src/**/*"],
        "exclude": ["node_modules", "dist"]
    });

    let json_str = serde_json::to_string_pretty(&tsconfig)?;
    fs::write(project_dir.join("tsconfig.json"), json_str)?;

    Ok(())
}

/// Creates source files based on template
fn create_source_files(project_dir: &Path, template: &ProjectTemplate) -> Result<()> {
    let src_dir = project_dir.join("src");
    fs::create_dir_all(&src_dir)?;

    let index_content = match template {
        ProjectTemplate::React => r#"
import { Str } from 'milost';

async function main() {
    try {
        const greeting = await Str.create('Hello, React MiLost!');
        console.log(greeting.toUpperCase().unwrap());
    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error);
"#,
        ProjectTemplate::Vue => r#"
import { Str } from 'milost';

async function main() {
    try {
        const greeting = await Str.create('Hello, Vue MiLost!');
        console.log(greeting.toUpperCase().unwrap());
    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error);
"#,
        _ => r#"
import { Str } from 'milost';

async function main() {
    try {
        const greeting = await Str.create('Hello, MiLost!');
        console.log(greeting.toUpperCase().unwrap());
    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error);
"#
    };

    fs::write(src_dir.join("index.ts"), index_content)?;

    // Create test file
    let test_content = r#"
import { Str } from 'milost';

describe('MiLost Str', () => {
    it('creates a string successfully', async () => {
        const str = await Str.create('Test');
        expect(str.unwrap()).toBe('Test');
    });

    it('converts to uppercase', async () => {
        const str = await Str.create('test');
        expect(str.toUpperCase().unwrap()).toBe('TEST');
    });
});
"#;

    fs::write(src_dir.join("index.test.ts"), test_content)?;

    Ok(())
}

/// Creates .gitignore file
fn create_gitignore(project_dir: &Path) -> Result<()> {
    let gitignore_content = r#"
node_modules/
dist/
*.log
.DS_Store
"#;

    fs::write(project_dir.join(".gitignore"), gitignore_content)?;

    Ok(())
}

/// Creates basic project structure
fn create_project_structure(project_dir: &Path) -> Result<()> {
    fs::create_dir_all(project_dir.join("dist"))?;
    Ok(())
}

/// Attempts to install local MiLost dependency
fn install_local_dependency(project_dir: &Path) -> Result<()> {
    // Search for MiLost library in parent directory
    let milost_paths = vec![
        project_dir.parent().unwrap().join("milost"),
        project_dir.parent().unwrap().join("..").join("milost"),
    ];

    let milost_path = milost_paths
        .iter()
        .find(|path| path.exists())
        .context("Could not find MiLost library")?;

    // Copy library files
    let dest_lib = project_dir.join("lib");
    let dest_pkg = project_dir.join("pkg");

    fs::create_dir_all(&dest_lib)?;
    fs::create_dir_all(&dest_pkg)?;

    // Copy library files
    copy_directory(&milost_path.join("lib"), &dest_lib)?;
    
    // Copy WASM package files if they exist
    if milost_path.join("pkg").exists() {
        copy_directory(&milost_path.join("pkg"), &dest_pkg)?;
    }

    info!("Successfully copied MiLost library files");
    Ok(())
}

/// Recursively copies a directory
fn copy_directory(src: &Path, dest: &Path) -> Result<()> {
    for entry in WalkDir::new(src).min_depth(1) {
        let entry = entry.context("Failed to read directory entry")?;
        let relative_path = entry.path().strip_prefix(src)?;
        let dest_path = dest.join(relative_path);

        if entry.file_type().is_dir() {
            fs::create_dir_all(&dest_path)?;
        } else if entry.file_type().is_file() {
            if let Some(parent) = dest_path.parent() {
                fs::create_dir_all(parent)?;
            }
            fs::copy(entry.path(), &dest_path)?;
        }
    }
    Ok(())
}

/// Builds the TypeScript project
pub fn build_project(path: &str) -> Result<()> {
    let project_dir = Path::new(path);

    let status = Command::new("npx")
        .args(["tsc", "--project", path])
        .current_dir(project_dir)
        .status()
        .context("Failed to run TypeScript compiler")?;

    if !status.success() {
        error!("TypeScript compilation failed");
        anyhow::bail!("TypeScript compilation failed");
    }

    info!("Project build completed successfully");
    Ok(())
}

/// Runs the compiled project
pub fn run_project(path: &str) -> Result<()> {
    build_project(path)?;

    let project_dir = Path::new(path);
    let entry_point = project_dir.join("dist/index.js");

    let status = Command::new("node")
        .arg(entry_point)
        .current_dir(project_dir)
        .status()
        .context("Failed to run the application")?;

    if !status.success() {
        error!("Application exited with error");
        anyhow::bail!("Application exited with error");
    }

    info!("Project ran successfully");
    Ok(())
}

/// Runs project tests
pub fn test_project(path: &str) -> Result<()> {
    let project_dir = Path::new(path);

    let status = Command::new("npx")
        .args(["jest"])
        .current_dir(project_dir)
        .status()
        .context("Failed to run tests")?;

    if !status.success() {
        error!("Tests failed");
        anyhow::bail!("Tests failed");
    }

    info!("All tests passed successfully");
    Ok(())
}