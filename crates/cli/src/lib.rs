use anyhow::{Context, Result};
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

pub fn create_project(project_path: &str, template: &str) -> Result<()> {
    // 1. Create project directory
    let project_dir = Path::new(project_path);
    fs::create_dir_all(project_dir)
        .context("Failed to create project directory")?;
    
    // 2. Copy template files
    copy_template_files(project_dir, template)?;
    
    // 3. Generate package.json
    generate_package_json(project_dir, project_path)?;
    
    // 4. Install dependencies (to be implemented)
    
    Ok(())
}

fn copy_template_files(project_dir: &Path, template_name: &str) -> Result<()> {
    // Copy template files
    let template_dir = find_template_dir(template_name)?;
    
    for entry in WalkDir::new(&template_dir) {
        let entry = entry.context("Failed to read template directory")?;
        if entry.file_type().is_file() {
            let rel_path = entry.path().strip_prefix(&template_dir)?;
            let dest_path = project_dir.join(rel_path);
            
            if let Some(parent) = dest_path.parent() {
                fs::create_dir_all(parent)?;
            }
            
            fs::copy(entry.path(), &dest_path)
                .context(format!("Failed to copy file to {:?}", dest_path))?;
        }
    }
    
    // Copy library files
    copy_library_files(project_dir)?;
    
    Ok(())
}

fn copy_library_files(project_dir: &Path) -> Result<()> {
    let lib_src_dir = "lib";
    let lib_dest_dir = project_dir.join("src/milost");
    
    // Clean and create directories
    fs::create_dir_all(&lib_dest_dir).context("Failed to create milost directory")?;
    
    // Copy all TypeScript files with their directory structure
    for entry in WalkDir::new(lib_src_dir) {
        let entry = entry.context("Failed to read library file")?;
        if entry.file_type().is_file() && entry.path().extension().map_or(false, |ext| ext == "ts") {
            let rel_path = entry.path().strip_prefix(lib_src_dir)?;
            let dest_path = lib_dest_dir.join(rel_path);
            
            if let Some(parent) = dest_path.parent() {
                fs::create_dir_all(parent)?;
            }
            
            // Read the file content
            let content = fs::read_to_string(entry.path())?;
            
            // Fix imports
            let fixed_content = fix_imports(&content);
            
            // Write the fixed content
            fs::write(&dest_path, fixed_content)?;
        }
    }
    
    Ok(())
}

fn fix_imports(content: &str) -> String {
    // Replace "lib/types" with "./types" and similar paths
    let content = content.replace("from \"lib/types\"", "from \"../types\"")
                         .replace("from \"lib/core\"", "from \"../core\"")
                         .replace("from \"lib/async\"", "from \"../async\"")
                         .replace("from \"lib/atom\"", "from \"../atom\"")
                         .replace("from \"lib/borrow\"", "from \"../borrow\"")
                         .replace("from \"lib/concurrency\"", "from \"../concurrency\"")
                         .replace("from \"lib/contract\"", "from \"../contract\"")
                         .replace("from \"lib/memory\"", "from \"../memory\"")
                         .replace("from \"lib/patterns\"", "from \"../patterns\"")
                         .replace("from \"lib/resource\"", "from \"../resource\"");
    
    // Also handle: import { Vec, i32, Str, u32 } from "lib/types";
    let content = content.replace("from 'lib/types'", "from '../types'")
                         .replace("from 'lib/core'", "from '../core'")
                         .replace("from 'lib/async'", "from '../async'")
                         .replace("from 'lib/atom'", "from '../atom'")
                         .replace("from 'lib/borrow'", "from '../borrow'")
                         .replace("from 'lib/concurrency'", "from '../concurrency'")
                         .replace("from 'lib/contract'", "from '../contract'")
                         .replace("from 'lib/memory'", "from '../memory'")
                         .replace("from 'lib/patterns'", "from '../patterns'")
                         .replace("from 'lib/resource'", "from '../resource'");
    
    content
}

fn find_template_dir(template_name: &str) -> Result<String> {
    // In a real implementation, you'd handle both development and packaged environments
    // For now, just use a relative path to templates
    Ok(format!("templates/{}", template_name))
}

fn generate_package_json(project_dir: &Path, project_name: &str) -> Result<()> {
    let project_name = Path::new(project_name)
        .file_name()
        .and_then(|f| f.to_str())
        .unwrap_or(project_name);
    
    let package_json = serde_json::json!({
        "name": project_name,
        "version": "0.1.0",
        "private": true,
        "dependencies": {
            // We'll directly copy the library files to the src directory
            // instead of using npm dependencies
        },
        "devDependencies": {
            "typescript": "^5.0.0"
        },
        "scripts": {
            "build": "tsc",
            "start": "node dist/index.js"
        }
    });
    
    let json_str = serde_json::to_string_pretty(&package_json)?;
    fs::write(project_dir.join("package.json"), json_str)?;
    
    Ok(())
}