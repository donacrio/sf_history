# 🚀 Quick Start Guide

## Test Locally (5 minutes)

1. **Open Terminal** and navigate to the project:
   ```bash
   cd /Users/dona/workspace/sf_history
   ```

2. **Start a web server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open browser**: http://localhost:8000

4. **Verify**: You should see the interactive timeline!

---

## Deploy to GitHub Pages (10 minutes)

### First Time Setup

1. **Create GitHub account** if you don't have one: https://github.com/signup

2. **Create new repository**:
   - Go to: https://github.com/new
   - Name: `sf_history`
   - Visibility: **Public**
   - Don't check any boxes
   - Click "Create repository"

3. **Push your code** (in Terminal):
   ```bash
   cd /Users/dona/workspace/sf_history

   # Replace YOUR-USERNAME with your GitHub username
   git remote add origin https://github.com/YOUR-USERNAME/sf_history.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click: **Settings** → **Pages** (left sidebar)
   - Under "Source": Select **main** branch and **/ (root)** folder
   - Click **Save**
   - Wait 1-2 minutes

5. **Access your site**:
   ```
   https://YOUR-USERNAME.github.io/sf_history/
   ```

### Future Updates

Edit files → Save → Push:

```bash
git add .
git commit -m "Updated timeline"
git push
```

Site updates automatically in 1-2 minutes!

---

## Edit the Timeline

1. **Open**: `config/movements.json`

2. **Edit** any field (see examples in README.md)

3. **Save**

4. **Test locally** or **push to GitHub**

That's it! No coding needed. 🎉

---

## Common Issues

**Page blank?**
- Check browser console (F12) for errors
- Verify you're using a web server (not opening file:// directly)

**Changes not showing?**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

**GitHub Pages not working?**
- Wait 2-3 minutes after enabling
- Check Settings → Actions → Workflow permissions are "Read and write"

---

Need more help? See [README.md](README.md) for detailed instructions!
