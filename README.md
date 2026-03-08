# Guidex: Operational Excellence Platform

Guidex is a premium SaaS solution for BPO (Business Process Outsourcing) operational management. It allows companies to design, execute, and monitor decision-tree workflows with precision and high-density corporate decorum.

## 🚀 Features

- **Dynamic Flow Builder**: Drag-and-drop interface for designing complex decision trees.
- **Agent Execution Engine**: Interactive guided steps for operational personnel.
- **RBAC (Role-Based Access Control)**: Granular permissions and user management.
- **BPO Professional Standard**: Corporate-grade terminology and ergonomics.
- **Multimedia Support**: Integration of visual aids for operational steps.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide-React, React Flow.
- **Backend**: Django, Django REST Framework, SQLite (Development).
- **Branding**: Unified "Cinematic Dark" theme.

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js (v18+)
- Python (3.12+)
- Git

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd guidex_backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. (Optional) Run the RBAC seeder:
   ```bash
   python seed_rbac.py
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd guidex_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Production Deployment

### 1. Backend (Django)
- **Static Files**: Run `python manage.py collectstatic`.
- **WSGI/ASGI Server**: Use **Gunicorn** or **Daphne**.
- **Database**: Switch from SQLite to **PostgreSQL**.
- **Reverse Proxy**: Use **Nginx** with SSL (Certbot).

### 2. Frontend (React/Vite)
1. Build the production bundle:
   ```bash
   cd guidex_frontend
   npm run build
   ```
2. Serve the static files from the `dist` folder using Nginx or a CDN.

---

## 📝 Authors & Maintenance
Developed by Guidex Operational Excellence Inc.
© 2026. All rights reserved.
