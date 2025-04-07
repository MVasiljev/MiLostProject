#!/bin/bash

# Comprehensive Project Snapshot Script

# Exit on any error
set -e

# Default configuration
PROJECT_ROOT=$(pwd)
START_DIR=$PROJECT_ROOT
MAX_LINES_PER_FILE=5000
CURRENT_FILE_LINES=0
SNAPSHOT_INDEX=1
OUTPUT_FILE="project_snapshot_${SNAPSHOT_INDEX}.txt"

# Portable relative path function
relative_path() {
    python3 -c "import os.path; print(os.path.relpath('$1', '$2'))"
}

# Function to write line with line count tracking
write_line() {
    local line="$1"
    
    # Write line to current file
    echo "$line" >> "$OUTPUT_FILE"
    ((CURRENT_FILE_LINES++))
    
    # Check if we need to start a new file
    if ((CURRENT_FILE_LINES >= MAX_LINES_PER_FILE)); then
        ((SNAPSHOT_INDEX++))
        OUTPUT_FILE="project_snapshot_${SNAPSHOT_INDEX}.txt"
        CURRENT_FILE_LINES=0
    fi
}

# Main snapshot function
create_project_snapshot() {
    local base_dir="$1"
    
    # Remove any existing snapshot files
    rm -f project_snapshot_*.txt
    
    # Initialize first output file
    > "$OUTPUT_FILE"
    CURRENT_FILE_LINES=0
    
    # Project File Structure section
    write_line "# Project File Structure"
    write_line ""
    
    # Collect and write file structure
    find "$base_dir" -print | while read -r item; do
        # Skip base directory itself
        [[ "$item" == "$base_dir" ]] && continue
        
        # Skip ignored directories and file types
        [[ "$item" == *"node_modules"* || 
           "$item" == *".git"* || 
           "$item" == *"dist"* || 
           "$item" == *"build"* || 
           "$item" == *"target"* || 
           "$item" == *.md ]] && continue
        
        # Get relative path
        rel_path=$(relative_path "$item" "$base_dir")
        
        if [[ -d "$item" ]]; then
            write_line "📁 $rel_path/"
        elif [[ -f "$item" ]]; then
            write_line "📄 $rel_path"
        fi
    done
    
    # Project File Contents section
    write_line ""
    write_line "# Project File Contents"
    write_line ""
    
    # Collect and write file contents
    find "$base_dir" -type f | while read -r file; do
        # Skip ignored files
        [[ "$file" == *"node_modules"* || 
           "$file" == *".git"* || 
           "$file" == *"dist"* || 
           "$file" == *"build"* || 
           "$file" == *"target"* || 
           "$file" == *.md ]] && continue
        
        # Get relative path
        rel_path=$(relative_path "$file" "$base_dir")
        
        # Determine file type
        file_type=$(file -b --mime-type "$file")
        
        # Only process text files or source code files
        if [[ "$file_type" == text/* || "$file_type" == application/x-* ]]; then
            # Get file extension
            ext="${file##*.}"
            
            # Write file header
            write_line ""
            write_line "## File: $rel_path"
            write_line ""
            
            # Write file contents with code block
            write_line "\`\`\`$ext"
            
            # Read file contents line by line
            while IFS= read -r line; do
                write_line "$line"
            done < "$file"
            
            write_line "\`\`\`"
        fi
    done
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --directory)
            shift
            if [[ -d "$1" ]]; then
                START_DIR="$1"
                echo "Starting snapshot from directory: $START_DIR"
            else
                echo "Error: Directory $1 does not exist"
                exit 1
            fi
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create project snapshot
create_project_snapshot "$START_DIR"

echo "Project snapshot saved to project_snapshot_*.txt files (started from $START_DIR)"