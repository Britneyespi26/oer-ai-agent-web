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

## Deploy to GitHub Pages (`.github.io`)

This project is configured for:

`https://britneyespi26.github.io/oer-ai-agent-web/`

Run:

```bash
npm run deploy
```

That command builds and publishes `dist` to the `gh-pages` branch.

## Push to GitHub

```bash
git init
git add .
git commit -m "Build OER discovery agent web app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Required course searches included

- ARTS 1100 - Art Appreciation
- ENGL 1101 - First Semester Composition
- ENGL 1102 - Secondary Semester Composition
- HIST 2111 - American History 1
- HIST 2112 - American History 2
- ITEC 1001 - Introduction to Computing
- BIOL 1101K - Intro to Biology 1 with Lab
- BIOL 1102 - Introduction to Biology 2
