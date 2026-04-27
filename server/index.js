import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'server', 'data');
const LOG_PATH = path.join(DATA_DIR, 'usage-log.json');
const CATALOG_PATH = path.join(DATA_DIR, 'oer-catalog.json');

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'from', 'this', 'will', 'have', 'into',
  'about', 'after', 'before', 'their', 'there', 'which', 'where', 'your', 'using',
  'used', 'students', 'student', 'course', 'courses', 'learn', 'learning', 'an',
  'a', 'to', 'in', 'on', 'of', 'by', 'is', 'are', 'or', 'be', 'as', 'it', 'at',
]);

function extractTopics(syllabusText) {
  const words = syllabusText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 3 && !stopWords.has(token));

  const frequency = new Map();
  for (const token of words) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic]) => topic);
}

function calculateRubricScore(resource, topics) {
  const topicOverlap = resource.tags.filter((tag) => topics.includes(tag)).length;
  const relevance = Math.min(5, 2 + topicOverlap);
  const license = resource.openLicense ? 5 : 1;
  const accessibility = resource.accessibilityScore;
  const adaptability = resource.adaptabilityScore;
  const qualityEvidence = resource.peerReviewed ? 5 : 3;

  const overall = (
    relevance * 0.35 +
    license * 0.2 +
    accessibility * 0.15 +
    adaptability * 0.15 +
    qualityEvidence * 0.15
  );

  return {
    relevance,
    license,
    accessibility,
    adaptability,
    qualityEvidence,
    overall: Number(overall.toFixed(2)),
  };
}

function buildRecommendation(resource, rubric, topics) {
  const matchedTags = resource.tags.filter((tag) => topics.includes(tag));
  return {
    id: resource.id,
    title: resource.title,
    source: resource.source,
    url: resource.url,
    resourceType: resource.resourceType,
    summary: resource.summary,
    openLicense: resource.openLicense,
    licenseName: resource.licenseName,
    suggestedUse: resource.suggestedUse,
    matchedTopics: matchedTags,
    rubric,
    rubricSummary:
      rubric.overall >= 4.2
        ? 'High-quality and highly aligned with syllabus outcomes.'
        : rubric.overall >= 3.5
          ? 'Solid candidate with good alignment; review integration notes.'
          : 'Moderate fit; consider using selected sections or supplements.',
  };
}

app.post('/api/recommendations', (req, res) => {
  const { syllabusText, courseName = '', instructor = '' } = req.body ?? {};

  if (!syllabusText || syllabusText.trim().length < 50) {
    return res.status(400).json({
      error: 'Please provide syllabus text with at least 50 characters.',
    });
  }

  const catalog = readJson(CATALOG_PATH, []);
  const topics = extractTopics(syllabusText);

  const recommendations = catalog
    .map((resource) => {
      const rubric = calculateRubricScore(resource, topics);
      return buildRecommendation(resource, rubric, topics);
    })
    .filter((item) => item.rubric.relevance >= 3 && item.openLicense)
    .sort((a, b) => b.rubric.overall - a.rubric.overall)
    .slice(0, 10);

  const log = readJson(LOG_PATH, []);
  const entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    courseName,
    instructor,
    queryTopics: topics,
    resultCount: recommendations.length,
    topResult: recommendations[0]?.title ?? 'No matches',
  };
  log.unshift(entry);
  writeJson(LOG_PATH, log.slice(0, 300));

  return res.json({
    courseName,
    extractedTopics: topics,
    recommendations,
    rubricVersion: 'GGC OER Working Group v1 (AI-assisted scoring)',
  });
});

app.get('/api/logs', (_, res) => {
  const log = readJson(LOG_PATH, []);
  res.json(log.slice(0, 100));
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(ROOT_DIR, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

app.listen(PORT, () => {
  console.log(`OER AI server running on http://localhost:${PORT}`);
});
