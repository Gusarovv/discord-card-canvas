#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Check clean working directory
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working directory is not clean. Commit changes first."
  exit 1
fi

# Read version
VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

# Check tag doesn't exist
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "❌ Tag $TAG already exists."
  exit 1
fi

# Check npm auth
NPM_USER=$(npm whoami 2>/dev/null) || { echo "❌ Not logged in to npm. Run: npm login"; exit 1; }

# Check gh auth
gh auth status >/dev/null 2>&1 || { echo "❌ Not logged in to GitHub. Run: gh auth login"; exit 1; }

echo "📦 Version: $VERSION"
echo "👤 npm user: $NPM_USER"
echo ""

# Show latest CHANGELOG entry
echo "📋 CHANGELOG:"
awk '/^## /{if(n++)exit}1' CHANGELOG.md
echo ""

# Test
echo "🧪 Testing..."
npm test --silent
echo "✅ Tests OK"
echo ""

# Build
echo "🔨 Building..."
npm run build --silent
echo "✅ Build OK"
echo ""

# Confirm
read -p "Publish v$VERSION? [y/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

# Publish (pass OTP via first argument if needed)
if [ -n "$1" ]; then
  npm publish --otp="$1"
else
  npm publish
fi
echo "📦 Published to npm"

# Tag
git tag "$TAG"
echo "🏷️  Tagged $TAG"

# Push
git push
git push origin "$TAG"
echo "🚀 Pushed to remote"

# Create GitHub release
awk '/^## /{if(n++)exit;next}1' CHANGELOG.md | gh release create "$TAG" --title "$TAG" --notes-file - --verify-tag
echo "📝 GitHub release $TAG created"
echo ""
echo "✅ Done: discord-card-canvas@$VERSION"
