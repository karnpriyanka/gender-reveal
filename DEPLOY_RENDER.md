# Deploying to Render - Step by Step Guide

## Prerequisites
1. A GitHub account
2. Your code pushed to a GitHub repository
3. A Render account (sign up at https://render.com)

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Gender Reveal website"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Important:** Make sure your images, music, and video files are committed to GitHub. Check that:
- `public/images/hero/` contains your hero images
- `public/images/couple/` contains your couple images
- `public/music/` contains your background music file
- `public/video/` contains your reveal video

## Step 2: Sign Up / Log In to Render

1. Go to https://render.com
2. Sign up with your GitHub account (recommended for easier integration)
3. Log in to your Render dashboard

## Step 3: Create a New Web Service

1. Click the **"New +"** button in the top right
2. Select **"Web Service"**
3. If you connected GitHub, select your repository
   - OR click **"Public Git repository"** and paste your GitHub repository URL

## Step 4: Configure Your Service

Fill in the following settings:

### Basic Settings
- **Name:** `gender-reveal` (or any name you prefer)
- **Region:** Choose the closest region to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (unless your Next.js app is in a subdirectory)
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Instance Type:** Free tier is fine for testing (512 MB RAM). Upgrade if you need more resources.

### Environment Variables
You typically don't need environment variables for this project, but if you add any in the future, add them here.

### Advanced Settings (Optional)
- **Auto-Deploy:** `Yes` (automatically deploys on every push to main branch)

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. You can watch the build logs in real-time
4. Once deployment is complete, you'll get a URL like: `https://gender-reveal.onrender.com`

## Step 6: Verify Deployment

1. Visit your Render URL
2. Check that:
   - Hero images are loading
   - Countdown works
   - Images from couple folder are displayed
   - Background music plays
   - Video plays when countdown reaches zero

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Make sure `package.json` has correct scripts
- Verify Node.js version compatibility (Render uses Node 18+ by default)

### Images Not Loading
- Ensure images are in the `public/` folder
- Check file paths in your code match the public folder structure
- Verify images are committed to Git (not in .gitignore)

### 404 Errors
- Make sure your API routes are correct
- Check that `app/api/images/route.ts` is properly set up
- Verify file extensions are correct (case-sensitive in some cases)

### Slow Initial Load
- Free tier services "spin down" after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for better performance

## Updating Your Site

Every time you push to your GitHub repository, Render will automatically:
1. Pull the latest code
2. Run `npm install`
3. Run `npm run build`
4. Restart the service with `npm start`

## Custom Domain (Optional)

1. Go to your service settings in Render
2. Click **"Custom Domains"**
3. Add your domain name
4. Follow the DNS configuration instructions
5. Render will provide SSL certificates automatically

## Cost

- **Free Tier:** 
  - 750 hours/month free
  - Service spins down after 15 min inactivity
  - 512 MB RAM
- **Paid Plans:** Start at $7/month for always-on service

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

