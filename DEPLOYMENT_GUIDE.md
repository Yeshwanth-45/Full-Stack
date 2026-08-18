# 🚀 FoodieHub Deployment Guide

This guide walks you through deploying **FoodieHub** to cloud platforms (**Vercel** for Frontend + **Render/Railway** for Backend & MySQL) or running it locally with **Docker Compose**.

---

## Option 1: Cloud Deployment (Vercel + Render / Railway)

### 1. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Import your GitHub repository: `Yeshwanth-45/Full-Stack`.
3. Configure Project Settings:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add **Environment Variable**:
   - `REACT_APP_API_URL`: Set to your deployed backend URL (e.g., `https://foodiehub-backend.onrender.com/api` or Railway URL).
5. Click **Deploy**. Vercel will automatically build and deploy your frontend with SPA routing enabled via `vercel.json`.

---

### 2. Deploy Backend & MySQL to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New > Blueprint**.
2. Connect your GitHub repository `Yeshwanth-45/Full-Stack`.
3. Render will detect `render.yaml` automatically and prompt to create:
   - **MySQL Database**: `foodiehub-db`
   - **Web Service**: `foodiehub-backend` (builds using `backend/Dockerfile`)
4. Click **Apply**.
5. Once deployed, copy your backend URL (e.g. `https://foodiehub-backend.onrender.com`).
6. Update `cors.allowed-origins` in your Render Web Service Environment Variables to point to your Vercel URL (e.g. `https://foodiehub.vercel.app`).

---

### 3. Deploy Backend & MySQL to Railway (Alternative)

1. Go to [Railway.app](https://railway.app/).
2. Click **New Project > Provision MySQL**.
3. Click **New Service > GitHub Repo** and select `Yeshwanth-45/Full-Stack` (Set Root Directory to `/backend`).
4. Set Environment Variables in Railway:
   - `SPRING_DATASOURCE_URL`: `${{MYSQL_URL}}`
   - `SPRING_DATASOURCE_USERNAME`: `${{MYSQLUSER}}`
   - `SPRING_DATASOURCE_PASSWORD`: `${{MYSQLPASSWORD}}`
   - `JWT_SECRET`: `your-production-jwt-secret`
   - `CORS_ALLOWED_ORIGINS`: `https://your-vercel-domain.vercel.app`

---

## Option 2: Containerized Deployment (Docker Compose)

To run the entire stack (MySQL + Backend API) using Docker on any VPS or machine:

```bash
docker-compose up -d --build
```

### Verify Running Services:
- Backend REST API: http://localhost:8080/api/test
- Database: `localhost:3306` (Database: `foodiehub`)

---

## 📊 Summary of Deployment Files Created

- [vercel.json](file:///c:/Users/HP/2ndyearevensem/fullstackproject/frontend/vercel.json): Vercel SPA routing configuration.
- [Dockerfile](file:///c:/Users/HP/2ndyearevensem/fullstackproject/backend/Dockerfile): Multi-stage Spring Boot Java 17 container definition.
- [render.yaml](file:///c:/Users/HP/2ndyearevensem/fullstackproject/render.yaml): Render infrastructure blueprint spec.
- [docker-compose.yml](file:///c:/Users/HP/2ndyearevensem/fullstackproject/docker-compose.yml): Local/VPS container orchestration.
