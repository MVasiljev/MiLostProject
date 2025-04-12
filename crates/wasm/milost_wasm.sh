#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}MiLost WASM Build Diagnostics${NC}"

if ! command -v wasm-pack &> /dev/null; then
    echo -e "${RED}wasm-pack is not installed. Please install it with:${NC}"
    echo "cargo install wasm-pack"
    exit 1
fi

WASM_CRATES=$(find . -name "Cargo.toml" -exec grep -l '\[lib\]' {} \; | xargs grep -l 'crate-type.*"cdylib"')

if [ -z "$WASM_CRATES" ]; then
    echo -e "${RED}No WASM crates found. Ensure your Cargo.toml has:${NC}"
    echo "[lib]"
    echo 'crate-type = ["cdylib"]'
    exit 1
fi

echo -e "${GREEN}Found WASM crate(s):${NC}"
echo "$WASM_CRATES"

for CRATE in $WASM_CRATES; do
    CRATE_DIR=$(dirname "$CRATE")
    echo -e "\n${YELLOW}Building WASM crate in $CRATE_DIR${NC}"
    cd "$CRATE_DIR"
    wasm-pack build --target web
    echo -e "\n${GREEN}Generated files:${NC}"
    find pkg -type f 2>/dev/null || echo -e "${RED}No 'pkg' directory found${NC}"
    cd - > /dev/null
done

echo -e "\n${YELLOW}All WASM-related files:${NC}"
find . -name "*.wasm" -o -name "*.js" | grep -E "pkg|wasm"