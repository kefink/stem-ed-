#!/bin/bash

# Start STEM-ED Architects - Frontend & Backend
# Usage: ./start-dev.sh

echo "🚀 Starting STEM-ED Architects Development Servers..."

echo "▶️  Starting combined dev servers (API + Web)..."
npm run dev:all
EXIT_CODE=$?
echo "✅ Combined dev exited ($EXIT_CODE)."
