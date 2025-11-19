# XPath Workflow Extension for SearchVolume.com

A modern, interactive XPath builder with a beautiful sidebar UI that allows users to create, test, and validate XPath selectors step by step.

## Features

### Core Functionality
- **Step-by-Step XPath Building**: Add XPath components incrementally with visual feedback
- **Interactive Element Selection**: Click-to-select elements directly from the page
- **Real-time Validation**: See match counts and highlighted elements as you build
- **Visual Feedback**: Highlighted matches and hover effects for better UX

### XPath Builder Options
1. **Tag Name**: Add HTML tag selectors (div, span, a, etc.)
2. **Attribute**: Filter by attributes (class, id, data-*, etc.)
3. **Text Contains**: Search for elements containing specific text
4. **Position**: Specify element position ([1], [2], last(), etc.)
5. **Custom**: Add custom XPath expressions

### Additional Features
- **Quick Templates**: Pre-built XPath queries for common use cases
  - All Links (`//a[@href]`)
  - All Images (`//img[@src]`)
  - All Buttons (`//button`)
  - Elements with Class (`//*[@class]`)
- **History & Undo**: Step back through your XPath building process
- **Copy to Clipboard**: One-click copy of generated XPath
- **Element Inspector**: View details of selected elements

## Project Structure

```
searchvolume/
├── src/
│   ├── components/
│   │   ├── XPathSidebar.tsx      # Main sidebar component
│   │   └── XPathSidebar.css      # Sidebar styles
│   ├── App.tsx                   # Main application
│   ├── App.css                   # App styles
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts               # Vite config
└── README.md                     # This file
```

## Technology Stack

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom animations and gradients

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage Guide

### Basic Workflow

1. **Open the Sidebar**: Click the gear icon (⚙️) in the top-right corner
2. **Build Your XPath**:
   - Use the "Select Element on Page" button to click and select elements
   - Or add steps manually using the step builder buttons
3. **View Results**: See real-time match counts and highlighted elements
4. **Copy XPath**: Click the clipboard icon to copy your XPath

### Step-by-Step Example

**Goal**: Select all result titles on the page

1. Click "+ Tag Name" → Enter "div"
2. Click "+ Attribute" → Enter "class='result-item'"
3. Click "+ Tag Name" → Enter "h3"
4. Result: `//div[@class='result-item']/h3`

### Interactive Selection

1. Click "🖱️ Select Element on Page"
2. Hover over page elements (they'll highlight in blue)
3. Click the desired element
4. The XPath is automatically generated

## Component Features

### XPathSidebar Component

**Props:**
- `isOpen: boolean` - Controls sidebar visibility

**State Management:**
- `steps`: Array of XPath building steps
- `currentXPath`: Generated XPath string
- `matchCount`: Number of matching elements
- `isSelectionMode`: Element selection mode toggle
- `history`: XPath history for undo functionality

**Key Methods:**
- `addStep()`: Add a new XPath step
- `removeStep()`: Remove a specific step
- `clearSteps()`: Clear all steps
- `undo()`: Revert last step
- `generateXPathForElement()`: Auto-generate XPath from element

## Styling & Theming

### Color Scheme
- Primary Gradient: `#667eea` → `#764ba2`
- Accent: `#ff9800` (Orange for highlights)
- Success: `#4caf50` (Green for matches)
- Interactive: `#2196f3` (Blue for hover)

### Responsive Design
- Desktop: 400px sidebar width
- Mobile: Full-width sidebar overlay
- Smooth animations and transitions

## Advanced Features

### XPath Validation
The extension uses `document.evaluate()` to test XPath expressions in real-time:
```typescript
const result = document.evaluate(
  currentXPath,
  document,
  null,
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  null
)
```

### Element Highlighting
Matched elements receive the `.xpath-highlight` class:
- 3px orange outline
- Semi-transparent background
- Smooth transitions

### Smart XPath Generation
For selected elements, the extension generates optimized XPath:
1. Checks for ID (most specific)
2. Builds path using tag names and positions
3. Optimizes for readability and maintainability

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Development Tips

### Adding New Step Types
Edit `XPathSidebar.tsx` and add to the step builder:
```typescript
<button
  onClick={() => {
    const value = prompt('Enter your value:')
    if (value) addStep('newtype', value, `Description: ${value}`)
  }}
  className="btn-step"
>
  + New Type
</button>
```

### Customizing Styles
Modify `XPathSidebar.css` for visual changes:
- Gradient backgrounds
- Border radius values
- Animation timings
- Color schemes

### Adding Templates
Extend the Quick Templates section:
```typescript
<button
  onClick={() => setCurrentXPath('//your/xpath')}
  className="btn-template"
>
  Template Name
</button>
```

## Performance Considerations

- XPath evaluation happens on every change (debouncing recommended for large DOMs)
- Element highlighting uses efficient class toggling
- Event listeners properly cleaned up on unmount

## Future Enhancements

- [ ] XPath history with save/load functionality
- [ ] Export XPath collections
- [ ] Advanced XPath functions (contains, starts-with, etc.)
- [ ] Keyboard shortcuts
- [ ] Dark mode toggle
- [ ] XPath syntax highlighting
- [ ] Drag-and-drop step reordering
- [ ] XPath performance metrics
- [ ] Integration with testing frameworks

## Troubleshooting

### XPath Not Matching
- Check syntax in the XPath display
- Verify element exists in DOM
- Use browser DevTools to test XPath

### Selection Mode Not Working
- Ensure you've clicked the "Select Element" button
- Check for JavaScript errors in console
- Verify event listeners are attached

### Styling Issues
- Clear browser cache
- Check for CSS conflicts
- Verify class names in DevTools

## License

MIT License - feel free to use and modify for your projects.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Open an issue in the repository

---

**Built with ❤️ for SearchVolume.com**
