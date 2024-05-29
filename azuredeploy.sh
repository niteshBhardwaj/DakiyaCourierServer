#!/bin/bash

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Export bun to PATH
export BUN_INSTALL="/root/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Navigate to site directory
cd /home/site/wwwroot

# Install dependencies
bun install

# Generate the application
bun generate

# Start the application
bun run start
