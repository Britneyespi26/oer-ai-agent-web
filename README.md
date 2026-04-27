# OER Discovery Agent (GGC Faculty Assistant)

AI-powered web application that helps faculty identify open educational resources (OER) that match course topics and learning outcomes.

## What this app does

- Accepts syllabus text and course metadata from instructors.
- Extracts key topics using lightweight NLP-style keyword/entity extraction.
- Matches topics against an OER catalog (including Open ALG links).
- Scores each resource with a rubric-aligned model:
  - relevance
  - open license confirmation
  - accessibility
  - adaptability
  - quality evidence
- Returns recommendations with integration guidance.
- Publishes usage logs (query topics, timestamps, result counts) for review by instructors and working groups.

## Tech stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Storage: JSON files (`server/data`) for catalog + usage logs

## Local development

```bash
npm install
npm run dev
```

This runs:
- Frontend at `http://localhost:5173`
- API server at `http://localhost:8787`

## Production run

```bash
npm run build
npm start
```

In production, Express serves the built frontend from `dist`.

## Deploy online (Render example)

1. Push this project to GitHub.
2. Create a new Render **Web Service** connected to your repo.
3. Use:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
4. Deploy and use the generated public URL.

## Push to GitHub

```bash
git init
git add .
git commit -m "Build OER discovery agent web app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
