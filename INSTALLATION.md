# Quick Installation Guide - XPath Workflow Extension

## 🚀 Fast Setup (2 minutes)

### Step 1: Navigate to Extension Folder
The extension files are ready to use in the `/extension` folder.

### Step 2: Load in Chrome/Edge

1. **Open Extensions Page:**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Extension:**
   - Click "Load unpacked" button
   - Navigate to and select the `/extension` folder from this repository
   - Click "Select Folder"

4. **Done! ✅**
   - The extension icon should appear in your browser toolbar
   - You may need to pin it for easy access

### Step 3: Use the Extension

1. **Open Any Website:**
   - Navigate to any webpage (e.g., searchvolume.com)

2. **Toggle Sidebar:**
   - Click the extension icon in toolbar
   - Click "Toggle Sidebar" button
   - Or use the extension popup

3. **Start Building XPath:**
   - Use the sidebar to build XPath selectors
   - Click elements on the page to auto-generate XPath
   - Copy and use your XPath expressions!

## 📁 File Structure

```
extension/
├── manifest.json          ✅ Extension config
├── content.js            ✅ Main functionality
├── content.css           ✅ Styles
├── popup.html            ✅ Extension popup
├── popup.js              ✅ Popup logic
├── icons/
│   ├── icon16.png        ✅ Generated
│   ├── icon48.png        ✅ Generated
│   └── icon128.png       ✅ Generated
└── README.md             ✅ Full documentation
```

## ⚠️ Troubleshooting

### "Manifest file is missing or unreadable"
- Make sure you selected the `/extension` folder, NOT the root folder
- The extension folder must contain `manifest.json`

### Extension icon not showing
- Refresh the extensions page
- Check if extension is enabled
- Try reloading the extension

### Sidebar not appearing
- Click the extension icon first
- Click "Toggle Sidebar" in the popup
- Refresh the webpage you're on

## 🎯 Next Steps

- Read the full [Extension README](extension/README.md) for detailed features
- Try the Quick Templates for common XPath patterns
- Use the click-to-select feature for easy XPath generation

## 🔄 Updating the Extension

After making code changes:

1. Go to `chrome://extensions/`
2. Click the refresh icon on the extension card
3. Reload any open webpages

## 💡 Tips

- Start with simple XPath expressions and add complexity
- Use the match counter to verify your selectors
- The orange highlights show which elements match your XPath
- Copy XPath to clipboard with one click

---

**Ready to build XPath selectors like a pro! 🎯**
