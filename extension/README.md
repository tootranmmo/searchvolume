# XPath Selection Workflow - Browser Extension

A powerful Chrome/Edge extension that provides a step-by-step XPath builder with an interactive sidebar for building, testing, and validating XPath selectors on any website.

## Features

✅ **Step-by-Step XPath Building**
- Build XPath expressions incrementally
- 5 types of steps: Tag, Attribute, Text, Position, Custom

✅ **Interactive Element Selection**
- Click-to-select elements directly from the page
- Auto-generate XPath from selected elements
- Visual hover effects

✅ **Real-Time Validation**
- See match counts instantly
- Highlighted matching elements with orange outlines
- Syntax error detection

✅ **Quick Templates**
- Pre-built XPath queries for common use cases
- All Links, Images, Buttons, and more

✅ **Professional UI**
- Beautiful gradient sidebar design
- Smooth animations
- Responsive and mobile-friendly

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download/Clone this repository**

2. **Generate Extension Icons** (Required)
   - Open `extension/icons/create-icons.html` in your browser
   - Click "Generate 16x16" → Right-click canvas → Save as `icon16.png`
   - Click "Generate 48x48" → Right-click canvas → Save as `icon48.png`
   - Click "Generate 128x128" → Right-click canvas → Save as `icon128.png`
   - Save all three PNG files in the `extension/icons/` folder

3. **Load Extension in Chrome/Edge**
   - Open Chrome/Edge browser
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `/extension` folder from this repository

4. **Done!** The extension icon should appear in your browser toolbar

### Method 2: Quick Start (Skip Icon Generation)

If you get a manifest error about icons:

1. Create three simple PNG files (16x16, 48x48, 128x128) using any image editor
2. Name them `icon16.png`, `icon48.png`, `icon128.png`
3. Place them in `extension/icons/` folder
4. Load the extension as described above

## Usage

### Opening the Sidebar

**Option 1:** Click the extension icon in your browser toolbar, then click "Toggle Sidebar"

**Option 2:** The sidebar can be toggled via the extension popup

### Building XPath

1. **Add Steps Manually**
   - Click "+ Tag Name" to add HTML tags (div, span, a, etc.)
   - Click "+ Attribute" to filter by attributes (class="example")
   - Click "+ Text Contains" to search by text content
   - Click "+ Position" to specify element position ([1], [2], last())
   - Click "+ Custom" to add custom XPath expressions

2. **Select Elements Interactively**
   - Click "🖱️ Select Element on Page"
   - Hover over page elements (they'll highlight in blue)
   - Click the desired element
   - XPath is automatically generated

3. **Use Quick Templates**
   - Click template buttons for common XPath patterns
   - Templates: All Links, All Images, All Buttons, Elements with Class

4. **View Results**
   - Match count shows in green when elements are found
   - Matched elements are highlighted with orange outlines
   - View selected element details in the info panel

5. **Copy XPath**
   - Click the 📋 clipboard icon to copy XPath to clipboard

### Example Workflows

**Example 1: Select all article titles**
```
1. Add Tag: "article"
2. Add Tag: "h2"
3. Result: //article/h2
```

**Example 2: Find specific button**
```
1. Add Tag: "button"
2. Add Attribute: class="primary"
3. Add Text: "Submit"
4. Result: //button[@class="primary"][contains(text(), 'Submit')]
```

**Example 3: Get third item in a list**
```
1. Add Tag: "ul"
2. Add Tag: "li"
3. Add Position: "3"
4. Result: //ul/li[3]
```

## Features in Detail

### Step Management
- **Add Steps:** Build XPath incrementally
- **Remove Steps:** Click ✕ on any step to remove it
- **Undo:** Revert the last step
- **Clear All:** Remove all steps and start fresh

### Element Highlighting
- **Orange Outline:** Matched elements
- **Blue Dashed Outline:** Hover state during selection mode
- **Smooth Transitions:** All highlights animate smoothly

### XPath Types Supported

| Type | Description | Example |
|------|-------------|---------|
| Tag | HTML element tag | `div`, `span`, `a` |
| Attribute | Element attributes | `class="example"`, `id="main"` |
| Text | Text content search | `Submit`, `Click here` |
| Position | Element index | `1`, `2`, `last()` |
| Custom | Any XPath syntax | `parent::div`, `following-sibling::*` |

## Browser Compatibility

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Any Chromium-based browser

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── content.js            # Main content script
├── content.css           # Sidebar styles
├── icons/
│   ├── create-icons.html # Icon generator tool
│   ├── icon16.png        # 16x16 icon (generate this)
│   ├── icon48.png        # 48x48 icon (generate this)
│   └── icon128.png       # 128x128 icon (generate this)
└── README.md            # This file
```

## Troubleshooting

### Extension won't load
- **Error: "Manifest file is missing"**
  - Make sure you're selecting the `/extension` folder, not the root folder

- **Error: "Could not load icon"**
  - Generate icons using `icons/create-icons.html`
  - Or create placeholder PNG files with the correct names

### Sidebar not appearing
- Click the extension icon and then "Toggle Sidebar"
- Check browser console for JavaScript errors
- Try refreshing the page

### XPath not matching elements
- Verify XPath syntax in the sidebar display
- Use browser DevTools Console to test: `$x("//your/xpath")`
- Check if elements are in iframes (XPath doesn't cross iframe boundaries)

### Selection mode not working
- Make sure you clicked "Select Element on Page" button
- The button should turn orange when active
- Try clicking again to toggle it off and on

## Development

### Modifying the Extension

1. **Edit Files:**
   - `content.js` - Main sidebar logic
   - `content.css` - Styling
   - `popup.html` - Extension popup

2. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card
   - Refresh any open web pages

### Adding New Features

To add new XPath step types, edit `content.js`:

```javascript
// Add button in step-options
<button class="btn-step" data-type="newtype">+ New Type</button>

// Add handler in handleAddStep()
case 'newtype':
  value = prompt('Enter value:');
  if (value) description = `New: ${value}`;
  break;

// Add builder logic in buildXPath()
case 'newtype':
  xpath += `/your-xpath-${step.value}`;
  break;
```

## Privacy & Permissions

### Permissions Explained
- **activeTab:** Access current tab to inject sidebar
- **scripting:** Execute content scripts
- **host_permissions:** Work on all websites

### Data Privacy
- ✅ No data is collected or transmitted
- ✅ All processing happens locally in your browser
- ✅ No external API calls
- ✅ No tracking or analytics

## Tips & Best Practices

1. **Start Simple:** Begin with basic tag names, then add filters
2. **Use ID When Possible:** IDs are the most specific selectors
3. **Test Incrementally:** Check match count after each step
4. **Avoid Over-Specification:** Keep XPath as simple as possible
5. **Use Templates:** Start with templates and customize

## Keyboard Shortcuts

Currently, the extension uses click-based interaction. Keyboard shortcuts coming in future updates!

## Known Limitations

- XPath doesn't work across iframe boundaries
- Some websites with Shadow DOM may have limited support
- Dynamic content loaded after page load may need re-evaluation

## Future Enhancements

- [ ] Keyboard shortcuts
- [ ] Save/load XPath collections
- [ ] Export to various formats (Selenium, Playwright, etc.)
- [ ] Advanced XPath functions builder
- [ ] XPath performance metrics
- [ ] Dark mode
- [ ] Multi-language support

## Support

For issues, questions, or feature requests:
1. Check the Troubleshooting section above
2. Review the code comments in the source files
3. Open an issue in the repository

## License

MIT License - Free to use and modify

## Credits

Built for searchvolume.com and web scraping enthusiasts worldwide.

---

**Happy XPath Building! 🎯**
