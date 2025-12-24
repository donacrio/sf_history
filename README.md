# 🌌 Fresque des Courants de la Science-Fiction 🚀

An interactive timeline visualization of science fiction literary movements, from Proto-SF to Solarpunk.

[**View Live Demo**](https://username.github.io/sf_history/) <!-- Update with your GitHub username -->

## ✨ Features

- **Interactive Timeline**: Click on any movement to expand and explore details
- **Visual Connections**: See how movements influence, react to, or evolve from each other
- **Author Highlighting**: Female authors are specially highlighted, with favorite authors starred
- **Responsive Design**: Works beautifully on desktop and mobile
- **Easy Configuration**: All data in a single JSON file - no code changes needed

## 📁 Project Structure

```
sf_history/
├── index.html              # Main HTML page
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── app.js              # Application entry point
│   ├── config.js           # Configuration loader
│   ├── validation.js       # Data validation
│   ├── timeline.js         # Timeline rendering
│   └── interactions.js     # User interactions
├── config/
│   └── movements.json      # Timeline configuration data ⭐
├── docs/
│   └── STRATEGY_01_refactor_timeline_app.md
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Test Locally First

**Prerequisites**: Python 3 or Node.js installed

1. **Navigate to the project directory**:
   ```bash
   cd /Users/dona/workspace/sf_history
   ```

2. **Start a local web server** (required for ES6 modules to work):

   **Using Python 3** (easiest if you have Python):
   ```bash
   python3 -m http.server 8000
   ```

   **Or using Node.js**:
   ```bash
   npx serve
   ```

   **Or using PHP** (if you have it):
   ```bash
   php -S localhost:8000
   ```

3. **Open in your browser**:
   - Navigate to: `http://localhost:8000`
   - You should see the interactive timeline
   - Check browser console (F12) for any errors

4. **Verify it works**:
   - ✅ Timeline loads with all movements
   - ✅ Clicking a card expands details
   - ✅ Hovering highlights connections
   - ✅ Console shows "✅ Configuration validation passed"

### Option 2: Deploy to GitHub Pages (Free Hosting)

**Step-by-step deployment guide:**

#### A. Initialize Git Repository (if not already done)

```bash
# Navigate to your project
cd /Users/dona/workspace/sf_history

# Check if git is initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "Initial commit: SF Timeline refactored

- Separated HTML, CSS, JS, and configuration
- Added data validation
- Configured GitHub Pages deployment
- Added comprehensive documentation

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

#### B. Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `sf_history` (or any name you prefer)
3. **Visibility**: Public (required for free GitHub Pages)
4. **Don't initialize** with README, .gitignore, or license (we already have these)
5. **Click**: "Create repository"

#### C. Push Your Code

```bash
# Add GitHub as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/sf_history.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

#### D. Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click**: Settings (top right)
3. **Scroll to**: "Pages" in the left sidebar
4. **Under "Source"**:
   - Branch: Select `main`
   - Folder: Select `/ (root)`
   - Click: "Save"
5. **Wait 1-2 minutes** for deployment

#### E. Access Your Live Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/sf_history/
```

**Note**: Replace `YOUR-USERNAME` with your actual GitHub username

#### F. Future Updates

After initial setup, updating is easy:

```bash
# Make changes to config/movements.json or any files
# Then:

git add .
git commit -m "Update timeline data"
git push

# GitHub Pages will automatically redeploy in 1-2 minutes
```

### Option 3: Deploy to Netlify (Alternative Free Hosting)

1. **Go to**: https://app.netlify.com/drop
2. **Drag and drop** the entire `sf_history` folder
3. **Done!** Your site is live instantly
4. **To update**: Just drag and drop the folder again

### 🎯 Troubleshooting Deployment

**Problem**: Page shows blank or "Loading..." forever

**Solutions**:
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Ensure `config/movements.json` is valid JSON
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

**Problem**: GitHub Actions fails

**Solutions**:
- Go to Settings → Actions → General
- Under "Workflow permissions", select "Read and write permissions"
- Save and re-run the deployment

**Problem**: 404 error on GitHub Pages

**Solutions**:
- Verify Pages is enabled in Settings
- Check that branch is set to `main` and folder to `/` (root)
- Wait 2-3 minutes after enabling Pages

## 📝 How to Edit the Timeline

All timeline data is in [`config/movements.json`](config/movements.json). No coding required!

### Adding a New Movement

Add a new object to the `movements` array:

```json
{
  "id": "new-movement",
  "title": "New Movement Name",
  "period": "2020-2030",
  "year": 2025,
  "description": "Brief description of the movement",
  "context": {
    "historical": "What was happening in the world?",
    "philosophical": "What questions did it explore?",
    "literary": "What were its narrative innovations?",
    "scientific": "What scientific concepts did it use?",
    "themes": "What were its recurring themes?"
  },
  "authors": [
    { "name": "Author Name", "gender": "F", "favorite": true }
  ],
  "works": [
    "Book Title (Author, Year)"
  ],
  "connections": {
    "influence": [
      { "to": "other-movement-id", "desc": "How it influenced" }
    ]
  }
}
```

### Editing Existing Movements

1. Open [`config/movements.json`](config/movements.json)
2. Find the movement by its `id`
3. Edit any field (title, description, authors, works, etc.)
4. Save the file
5. Commit and push (auto-deploys to GitHub Pages)

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (lowercase, hyphens) |
| `title` | string | ✅ | Display name of the movement |
| `period` | string | ✅ | Date range (e.g., "1920-1960") |
| `year` | number | ✅ | Center year for timeline positioning |
| `description` | string | ✅ | Brief summary (1-2 sentences) |
| `context` | object | ✅ | Historical, philosophical, literary, scientific, themes |
| `authors` | array | ✅ | List of author objects |
| `authors[].name` | string | ✅ | Author's full name |
| `authors[].gender` | "M"/"F" | ✅ | For statistics and highlighting |
| `authors[].favorite` | boolean | ❌ | Star this author |
| `works` | array | ✅ | List of major works |
| `connections` | object | ❌ | Relationships to other movements |

### Connection Types

- **`influence`**: Direct influence on another movement
- **`reaction`**: Counter-reaction or rejection
- **`evolution`**: Natural evolution from another movement
- **`related`**: Parallel or complementary movement

### Tips

- **IDs must be unique** - Use lowercase with hyphens (e.g., `proto-sf`)
- **Connection targets must exist** - Reference valid movement IDs
- **Gender is required** - Use "M" or "F" for statistics
- **Use quotes** - All strings must be in double quotes in JSON
- **Validate** - Open browser console to see validation errors

## 🎨 Customization

### Changing Colors

Edit [`css/styles.css`](css/styles.css) to change the color scheme:

```css
/* Primary colors */
--color-primary: #00d4ff;     /* Cyan */
--color-secondary: #ff00ff;   /* Magenta */
--color-accent: #00ff88;      /* Green */
--color-reaction: #ff6b00;    /* Orange */
```

### Changing Metadata

Edit [`config/movements.json`](config/movements.json) metadata section:

```json
{
  "metadata": {
    "title": "Your Custom Title",
    "subtitle": "Your custom subtitle",
    "version": "1.0.0"
  },
  "movements": [...]
}
```

## 🐛 Troubleshooting

### Page shows "Loading..." forever

- **Check browser console** for errors
- **Verify JSON syntax** - Use a JSON validator
- **Check file paths** - Files must be served via HTTP (not `file://`)

### Connections not showing

- **Verify movement IDs** - Connection `to` field must match existing movement `id`
- **Check console** for validation errors
- **Try expanding a card** - Connections redraw on expand

### Changes not appearing after git push

- **Wait 1-2 minutes** for GitHub Pages to rebuild
- **Hard refresh** browser (Ctrl+F5 or Cmd+Shift+R)
- **Check Actions tab** on GitHub for deployment status

## 🛠️ Technical Stack

- **No frameworks** - Pure vanilla JavaScript (ES6 modules)
- **No build process** - Direct deployment
- **Modern CSS** - Flexbox, Grid, Custom Properties
- **SVG** - For connection lines
- **JSON** - For configuration data

## 📄 License

This project is open source. Feel free to use, modify, and distribute as needed.

## 🤝 Contributing

Contributions are welcome! To add or modify movements:

1. Fork the repository
2. Edit `config/movements.json`
3. Test locally
4. Submit a pull request

## 📚 Resources

- [Technical Strategy Document](docs/STRATEGY_01_refactor_timeline_app.md)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

Made with ❤️ for science fiction enthusiasts