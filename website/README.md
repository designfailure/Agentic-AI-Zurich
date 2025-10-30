# MCP Scheme Ontology Website

This directory contains the official website for the MCP Scheme Ontology project.

## 🌐 Overview

A modern, interactive website showcasing the MCP (Model Context Protocol) Scheme Ontology framework with comprehensive documentation, examples, and an interactive playground.

## 📁 Structure

```
website/
├── index.html              # Main landing page
├── css/
│   ├── styles.css         # Main stylesheet
│   └── prism.css          # Syntax highlighting styles
├── js/
│   ├── main.js            # Interactive features
│   └── prism.js           # Syntax highlighter
├── docs/
│   ├── getting-started.html    # Installation & quick start
│   ├── components.html         # Component creation guide
│   └── inference-rules.html    # Inference rules guide
└── README.md              # This file
```

## 🚀 Running Locally

### Option 1: Simple HTTP Server (Python)

```bash
cd website
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Simple HTTP Server (Node.js)

```bash
cd website
npx serve
```

### Option 3: VS Code Live Server

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## ✨ Features

### Main Sections

1. **Hero Section**
   - Compelling value proposition
   - Key statistics and features
   - Quick action buttons

2. **Features Section**
   - 6 core feature cards
   - Semantic inference capabilities
   - Component architecture benefits

3. **Architecture Section**
   - Visual 4-layer architecture diagram
   - Component breakdown
   - Interactive hover effects

4. **Examples Section**
   - 4 tabbed example scenarios
   - Live code examples with syntax highlighting
   - Confidence scores and reasoning

5. **Documentation Section**
   - Links to comprehensive guides
   - Getting started resources
   - Extension documentation

6. **Interactive Playground**
   - Live semantic inference simulation
   - Editable JSON input
   - Real-time result visualization

### Interactive Features

- **Responsive Navigation**: Mobile-friendly with hamburger menu
- **Smooth Scrolling**: Seamless section navigation
- **Active State Tracking**: Navigation highlights current section
- **Tab Switching**: Interactive example viewer
- **Live Playground**: Working inference engine demo
- **Syntax Highlighting**: Beautiful code examples
- **Scroll Animations**: Elements fade in on scroll

## 🎨 Customization

### Theming

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... more variables */
}
```

### Content Updates

- **Hero text**: Edit in `index.html` (search for `hero-title`)
- **Features**: Modify the `features-grid` section
- **Examples**: Update the `examples-tabs` and `example-tab` sections

### Adding Documentation Pages

1. Create new HTML file in `docs/`
2. Copy structure from existing doc pages
3. Link from main page or navigation

## 📱 Responsive Design

The website is fully responsive with breakpoints at:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies
- **Prism.js**: Syntax highlighting (simplified version)

### Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern CSS features)

### Performance

- No external dependencies (except GitHub link)
- Minimal JavaScript footprint
- Optimized CSS with custom properties
- Fast page load times
- Intersection Observer for efficient animations

## 🧪 Testing

### Manual Testing Checklist

- [ ] All navigation links work
- [ ] Mobile menu toggles correctly
- [ ] Example tabs switch properly
- [ ] Playground runs inference
- [ ] Smooth scrolling functions
- [ ] All links are valid
- [ ] Responsive on mobile
- [ ] Syntax highlighting works

### Automated Testing

Currently no automated tests. Consider adding:
- Lighthouse CI for performance
- Playwright for E2E testing
- Accessibility audits

## 🚀 Deployment

### GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select branch and `/website` folder
4. Access at `https://username.github.io/repo-name/`

### Netlify

1. Connect repository to Netlify
2. Set build directory to `website`
3. No build command needed (static site)
4. Deploy!

### Vercel

```bash
cd website
vercel
```

### Custom Server

Upload all files to web server root or subdirectory. No special configuration required.

## 📝 Content Management

### Adding Examples

1. Edit `index.html`
2. Find the `examples-tabs` section
3. Add new tab button
4. Add corresponding `example-tab` div
5. Include request JSON and expected result

### Updating Documentation

Documentation pages are in `docs/`. Each page is standalone HTML with shared CSS.

To update:
1. Edit the specific HTML file
2. Maintain consistent structure
3. Test navigation links

## 🎯 Future Enhancements

Potential improvements:

- [ ] Search functionality for documentation
- [ ] Dark mode toggle
- [ ] Code copy buttons
- [ ] API reference viewer
- [ ] Component visualizer
- [ ] Real API integration
- [ ] User authentication for playground
- [ ] Save/share playground examples

## 📄 License

MIT License - Same as the main project

## 🤝 Contributing

To contribute to the website:

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `website/` directory
4. Test thoroughly (all browsers, mobile)
5. Submit a pull request

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Check the main project documentation
- Review the architecture guide

## 🔗 Related Links

- [Main Project README](../README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [Extension Guide](../EXTENDING.md)
- [Usage Examples](../examples/usage-examples.md)
