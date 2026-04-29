import { OER_CATALOG } from './data';
import type { OerResource, Recommendation, RubricScore } from './types';

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'from',
  'this',
  'will',
  'have',
  'into',
  'about',
  'after',
  'before',
  'their',
  'there',
  'which',
  'where',
  'your',
  'using',
  'used',
  'students',
  'student',
  'course',
  'courses',
  'learn',
  'learning',
  'an',
  'a',
  'to',
  'in',
  'on',
  'of',
  'by',
  'is',
  'are',
  'or',
  'be',
  'as',
  'it',
  'at',
]);

export const RUBRIC_VERSION = 'GGC OER Working Group v1 (AI-assisted scoring)';

export function extractTopics(syllabusText: string): string[] {
  const words = syllabusText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 3 && !STOP_WORDS.has(token));

  const frequency = new Map<string, number>();
  for (const token of words) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic]) => topic);
}

export function calculateRubricScore(resource: OerResource, topics: string[]): RubricScore {
  const overlap = resource.tags.filter((tag) => topics.includes(tag)).length;
  const relevance = Math.min(5, 2 + overlap);
  const license = resource.openLicense ? 5 : 1;
  const accessibility = resource.accessibilityScore;
  const adaptability = resource.adaptabilityScore;
  const qualityEvidence = resource.peerReviewed ? 5 : 3;

  const overall = Number(
    (
      relevance * 0.35 +
      license * 0.2 +
      accessibility * 0.15 +
      adaptability * 0.15 +
      qualityEvidence * 0.15
    ).toFixed(2),
  );

  return { relevance, license, accessibility, adaptability, qualityEvidence, overall };
}

export function buildRubricSummary(score: number): string {
  if (score >= 4.2) {
    return 'High-quality and highly aligned with syllabus outcomes.';
  }
  if (score >= 3.5) {
    return 'Solid candidate with good alignment; review integration notes.';
  }
  return 'Moderate fit; consider using selected sections or supplements.';
}

export function generateRecommendations(topics: string[]): Recommendation[] {
  return OER_CATALOG.map((resource) => {
    const rubric = calculateRubricScore(resource, topics);
    const matchedTopics = resource.tags.filter((tag) => topics.includes(tag));

    return {
      ...resource,
      matchedTopics,
      rubric,
      rubricSummary: buildRubricSummary(rubric.overall),
    };
  })
    .filter((item) => item.rubric.relevance >= 3 && item.openLicense)
    .sort((a, b) => b.rubric.overall - a.rubric.overall)
    .slice(0, 10);
}
