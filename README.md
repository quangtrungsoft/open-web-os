# My Desktop

A personal, interactive web-based desktop environment that showcases my skills and creativity. This is my digital workspace - a unique blend of portfolio, personal website, and interactive experience.

## ✨ Features

- **Interactive Desktop Environment**: Complete with windows, taskbar, start menu, and desktop icons
- **Themeable Interface**: Multiple beautiful themes (Dark Night, Ocean, Sunset, Professional, Night)
- **Modular Architecture**: Clean, maintainable code structure
- **Personal Apps**: Calculator, Settings, About Me with interactive elements
- **Modern UI/UX**: Smooth animations, drag & drop, responsive design
- **Custom Scrollbars**: Beautiful, themeable scrollbars throughout the interface
- **Personal Branding**: My own digital space to showcase projects and skills

## 🚀 Live Demo

**My Desktop** is now ready for deployment! Here are some deployment options:

### Option 1: GitHub Pages (Recommended)
1. Push your code to GitHub
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Set folder to `/src/html`
5. Your site will be available at `https://yourusername.github.io/my-desktop`

### Option 2: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `none`
3. Set publish directory: `src/html`
4. Deploy!

### Option 3: Vercel
1. Import your GitHub repository to Vercel
2. Set root directory to `src/html`
3. Deploy with one click!

### Option 4: Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve src/html

# Using PHP
php -S localhost:8000 -t src/html
```

Then visit `http://localhost:8000`

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: Modular design with Event Bus pattern
- **Styling**: CSS Custom Properties for theming
- **Animations**: CSS transitions and transforms
- **Responsive**: Mobile-friendly design

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-desktop.git
cd my-desktop
```

2. Open `src/html/index.html` in your browser

3. Or serve locally with a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve src/html
```

## 🎨 Themes

- **Dark Night**: Super dark theme with green accents
- **Ocean**: Deep ocean blues and teals
- **Sunset**: Warm, sunset-inspired colors
- **Professional**: Clean, business-like appearance
- **Night**: Dark theme with blue accents

## 🏗️ Project Structure

```
src/
├── html/
│   ├── index.html          # Main entry point
│   ├── js/
│   │   └── app.js          # Main application logic
│   ├── modules/
│   │   ├── apps/           # Desktop applications
│   │   ├── core/           # Core system modules
│   │   ├── features/       # Additional features
│   │   └── ui/             # UI components
│   ├── styles/             # Global styles
│   └── templates/          # HTML templates
```

## 🎯 Personal Touch

This isn't just another website template - it's my personal digital environment. Every element has been crafted to reflect my approach to development: clean, modular, and user-focused.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal project, I welcome feedback and suggestions! Feel free to open issues or discussions.

---

**Built with ❤️ by Vu Quang Trung**

*Creating something new in a world of templates*