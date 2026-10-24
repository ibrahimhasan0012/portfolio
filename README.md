# Ibrahim Hasan — Personal Portfolio & Research Engineering Showcase

A personal portfolio and scholarly showcase for **Ibrahim Hasan** — Health Economist, Quantitative Researcher, and Software Developer based in Dhaka, Bangladesh.

Built with an **Anti-Slop, High-Taste Editorial Design System** (crafted with guidance from `taste-skill`), prioritizing typography, deliberate negative space, micro-interactions, and instant performance without bulky JavaScript framework bloat.

---

## 🌟 Live Demo & Local Hosting

### Running Locally with Python 3 (Zero PHP / Zero Attacks)
The project comes with a modern, secure Python 3 server (`serve.py`) equipped with security headers (CSP, X-Content-Type-Options, etc.):

```bash
# Navigate to portfolio directory
cd /Users/ibrahimhasan/Developer/portfolio

# Start the local server
python3 serve.py 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

---

## 🚀 GitHub Pages & Custom `.me` Domain Deployment

This entire project is built using semantic HTML5, Vanilla CSS3, and Vanilla JavaScript, meaning it requires **zero build steps** and runs natively on **GitHub Pages** with extreme speed and 100/100 Lighthouse performance.

### Quick Deployment Steps:

1. **Initialize Git in this directory (if not already done):**
   ```bash
   cd /Users/ibrahimhasan/Developer/portfolio
   git init
   git add .
   git commit -m "feat: initial release of Ibrahim Hasan portfolio website"
   ```

2. **Add your custom domain in `CNAME`:**
   Edit the file `CNAME` to match your purchased `.me` domain:
   ```
   yourname.me
   ```

3. **Link your GitHub repository and push:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/ibrahimhasan0012/<repo-name>.git
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - In your GitHub repository settings, navigate to **Pages**.
   - Under **Build and deployment > Source**, select `Deploy from a branch` (`main`, `/ (root)`).
   - Under **Custom domain**, ensure your `.me` domain is entered with HTTPS enforced.

---

## 🛠️ Project Structure
```
portfolio/
├── index.html            # Semantic HTML5 structure & accessibility tags
├── css/
│   └── style.css         # Modern design tokens, dark/light themes, animations
├── js/
│   └── main.js           # Client logic: theme toggle, filter tabs, modal dialogs, copy toast
├── assets/
│   ├── bd_epaper_preview.png  # Authentic mobile app preview
│   └── bd_epaper_logo.png     # Application logo
├── serve.py              # Secure Python 3 local development server
├── CNAME                 # Custom domain configuration for GitHub Pages
└── README.md             # Documentation and deployment guide
```

---

## 📬 Contact
- **Email:** [ibrahimhasanzafar@gmail.com](mailto:ibrahimhasanzafar@gmail.com)
- **GitHub:** [@ibrahimhasan0012](https://github.com/ibrahimhasan0012)
- **Location:** Dhaka, Bangladesh
