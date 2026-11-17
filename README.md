# Tasks90 — Collaborative Project & Task Management Suite

Tasks90 is a full-featured, responsive collaborative project management web application. Designed for teams and developers, it provides an interactive Kanban workflow, task tracking, metric analytics, and custom workspace creation.

---

## 🌟 Key Highlights

- **📱 Fully Responsive across All Screens**:
  - **Mobile (< 640px)**: Off-canvas navigation drawer with touch backdrop, horizontal snap-scrolling Kanban columns, and compact cards.
  - **Tablet (640px – 1024px)**: 2-column balanced grid view.
  - **Desktop (1024px – 1536px)**: Full 4-lane Kanban board with sidebar and live progress indicators.
  - **TV & Ultra-Wide (> 1536px / 4K)**: Expanded layouts (`2xl:` scaling) with widescreen dashboards.
- **🎨 Light & Dark Mode**: One-click segmented theme switcher in the Navbar with zero flicker and `localStorage` persistence.
- **📋 Kanban Board**: Move tasks between `To Do`, `In Progress`, `In Review`, and `Done` with priorities (`low`, `medium`, `high`, `urgent`).
- **⚖️ Legal Pages**: Built-in **Terms & Conditions** and **Privacy Policy** accessible across the app.
- **🚀 Dual Mode (MERN + GitHub Pages Static Demo)**:
  - Connects to an Express + MongoDB backend when running locally.
  - Automatically falls back to an interactive browser storage demo when hosted statically on GitHub Pages!

---

## 🌐 How to Publish to GitHub Pages

### Option 1: Automated Deployment via GitHub Actions (Recommended)
This repository includes a preconfigured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Initialize git and push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy Tasks90 Workspace"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. On GitHub, navigate to your repository **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. GitHub Actions will automatically build and publish your site to:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

### Option 2: Deploying the Build Folder Directly
You can build the static site locally with:
```bash
npm run build
```
The output files will be created in `client/dist/`, which can be served on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Both Frontend and Backend
```bash
npm run dev
```

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Endpoint:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin & Lead Architect** | `alex@devflow.com` | `password123` |
| **Senior Frontend Engineer** | `sarah@devflow.com` | `password123` |
| **Backend & Cloud Engineer** | `david@devflow.com` | `password123` |

*(Instant 1-click login buttons are also available on the Login screen).*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
