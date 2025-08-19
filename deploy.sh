#!/bin/bash

echo "🚀 Starting Vercel Deployment Process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to Vercel - $(date)"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote repository found!"
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo "Then visit https://vercel.com to deploy!"
else
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "✅ Code pushed to GitHub!"
    echo "🌐 Now visit https://vercel.com to deploy your project:"
    echo "   1. Sign up/Login with GitHub"
    echo "   2. Click 'New Project'"
    echo "   3. Import your repository"
    echo "   4. Deploy!"
fi

echo ""
echo "🎉 Deployment process completed!"
