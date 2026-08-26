#!/bin/bash
# ==============================================================================
# VikasDrishti - Red Light Termux Environment Setup Script
# iQOO Hackathon 2026 - Pune City Battle
# Optimized for iQOO 15 (Snapdragon 8 Gen 3, Android OS)
# ==============================================================================

echo "🚀 Initializing VikasDrishti Phone-First Environment on iQOO 15..."

# 1. Update Termux repositories and packages
pkg update -y && pkg upgrade -y

# 2. Install essential build tools & runtime environment
pkg install -y nodejs-lts git python clang make openssh

# 3. Verify Node.js and npm version
echo "📦 Node Version:"
node -v
echo "📦 NPM Version:"
npm -v

# 4. Clone or navigate to VikasDrishti Repository
if [ ! -d "VikasDrishti" ]; then
    echo "📥 Repository not found. Setting up local directory structure..."
    mkdir -p VikasDrishti/frontend
fi

# 5. Configure environment variables for phone-first host binding
export HOST=0.0.0.0
export PORT=3000
export REACT_APP_OFFLINE_MODE=true

echo "✅ Environment configured!"
echo "💡 To launch local development server on iQOO 15:"
echo "   cd frontend && npm start"
echo "🌐 Access app on phone browser at: http://localhost:3000"
