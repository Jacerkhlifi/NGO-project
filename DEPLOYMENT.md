# Netlify Deployment Guide for Ragoge El Kanz

## Prerequisites
1. A Netlify account (free at netlify.com)
2. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository
Make sure all your files are committed to your Git repository:
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Deploy to Netlify

#### Option A: Connect via Netlify Dashboard
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 3. Configure Environment Variables
In your Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add the following variables:
   - `EMAIL_USER`: Your email address for sending emails
   - `EMAIL_PASS`: Your email app password (not your regular password)

### 4. Email Configuration
For Gmail:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password as `EMAIL_PASS`

For other email services, update the transporter configuration in `netlify/functions/contact.js`

### 5. Custom Domain (Optional)
1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS settings as instructed

## File Structure
```
├── src/
├── public/
├── netlify/
│   └── functions/
│       ├── contact.js
│       └── package.json
├── netlify.toml
└── DEPLOYMENT.md
```

## Features Included
- ✅ Responsive React frontend
- ✅ Contact form with email functionality
- ✅ PayPal donation integration
- ✅ Interactive maps
- ✅ Mobile-optimized design
- ✅ SEO-friendly structure

## Troubleshooting
- If build fails, check Node version (should be 18)
- If contact form doesn't work, verify environment variables
- If images don't load, check file paths in public folder
