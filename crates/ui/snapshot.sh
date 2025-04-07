#!/bin/bash

# Set default values
PROJECT_ROOT=$(pwd)
START_DIR=$PROJECT_ROOT
MAX_WORDS_PER_FILE=6000
SNAPSHOT_INDEX=1
OUTPUT_FILE="project_snapshot_${SNAPSHOT_INDEX}.txt"

# Default ignore directories
IGNORE_DIRS=(
    "node_modules"
    "dist"
    "build"
    "target"
    ".git"
)

# Function to display usage
usage() {
    echo "Usage: $0 [--directory <dirname>]"
    exit 1
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --*)
            DIRNAME="${1#--}"
            POTENTIAL_DIR="${PROJECT_ROOT}/${DIRNAME}"
            if [[ -d "$POTENTIAL_DIR" ]]; then
                START_DIR="$POTENTIAL_DIR"
                echo "Starting snapshot from directory: $DIRNAME"
            else
                echo "Warning: Directory '$DIRNAME' not found, using project root instead."
            fi
            shift
            ;;
        *)
            usage
            ;;
    esac
done

# Check for .gitignore and add additional ignore patterns
IGNORE_FILE="${PROJECT_ROOT}/.gitignore"
if [[ -f "$IGNORE_FILE" ]]; then
    while IFS= read -r line; do
        # Skip empty lines and comments
        [[ -z "$line" || "$line" == \#* ]] && continue
        IGNORE_DIRS+=("$line")
    done < "$IGNORE_FILE"
fi

# Create ignore pattern for find and tree commands
create_ignore_pattern() {
    local IFS='|'
    echo "${IGNORE_DIRS[*]}"
}

# Function to count words
count_words() {
    echo "$1" | wc -w
}

# Function to write to snapshot file
write_to_file() {
    local content="$1"
    local word_count=$(count_words "$content")
    
    # Check if we need to start a new file
    if [[ $((CURRENT_WORDS + word_count)) -gt $MAX_WORDS_PER_FILE ]]; then
        ((SNAPSHOT_INDEX++))
        OUTPUT_FILE="project_snapshot_${SNAPSHOT_INDEX}.txt"
        CURRENT_WORDS=0
    fi
    
    echo "$content" >> "$OUTPUT_FILE"
    CURRENT_WORDS=$((CURRENT_WORDS + word_count))
}

# Initialize word count
CURRENT_WORDS=0

# Write project structure header
write_to_file "# Project Structure"

# Try to generate directory tree
IGNORE_PATTERN=$(create_ignore_pattern)
RELATIVE_START_DIR=$(realpath --relative-to="$PROJECT_ROOT" "$START_DIR")
TREE_START_DIR=${RELATIVE_START_DIR:-.}

# Attempt to use tree command
if command -v tree &> /dev/null; then
    tree_output=$(tree -L 3 -I "$IGNORE_PATTERN" "$TREE_START_DIR")
    write_to_file "$tree_output"
else
    # Fallback to find if tree is not available
    find_output=$(find "$START_DIR" -maxdepth 3 | grep -vE "($(create_ignore_pattern | tr '|' '|'))")
    write_to_file "$find_output"
fi

write_to_file "" # Add a newline
write_to_file "# Project Snapshot"
write_to_file "" # Add another newline

# Function to recursively scan directory
scan_directory() {
    local dir="$1"
    
    # Use find to list files, excluding ignored directories
    find "$dir" -type f | while read -r file; do
        # Skip files in ignored directories
        for ignore in "${IGNORE_DIRS[@]}"; do
            [[ "$file" == *"$ignore"* ]] && continue 2
        done
        
        # Get relative path
        rel_path=$(realpath --relative-to="$PROJECT_ROOT" "$file")
        
        # Get file extension
        ext="${file##*.}"
        
        # Write file header
        write_to_file "📄 $rel_path"
        write_to_file ""
        
        # Try to read and write file contents
        if [[ -r "$file" ]]; then
            # Use code block with extension for syntax highlighting
            write_to_file "\`\`\`$ext"
            cat "$file" | write_to_file
            write_to_file "\`\`\`"
        else
            write_to_file "(Error reading file)"
        fi
        
        write_to_file "" # Add newline between files
    done
}

# Start scanning from the specified directory
scan_directory "$START_DIR"

echo "Project snapshot saved to project_snapshot_*.txt (started from ${START_DIR})"