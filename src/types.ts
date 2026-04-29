export type RubricScore = {
  relevance: number;
  license: number;
  accessibility: number;
  adaptability: number;
  qualityEvidence: number;
  overall: number;
};

export type Recommendation = {
  id: string;
  title: string;
  source: string;
  url: string;
  resourceType: string;
  summary: string;
  openLicense: boolean;
  licenseName: string;
  suggestedUse: string;
  matchedTopics: string[];
  rubric: RubricScore;
  rubricSummary: string;
};

export type SearchResponse = {
  courseName: string;
  extractedTopics: string[];
  recommendations: Recommendation[];
  rubricVersion: string;
};

export type UsageLog = {
  id: string;
  timestamp: string;
  courseName: string;
  instructor: string;
  queryTopics: string[];
  resultCount: number;
  topResult: string;
};

export type CourseOption = {
  code: string;
  title: string;
  area: string;
  term: string;
  sampleSyllabus: string;
  sourceLinks: Array<{ label: string; url: string }>;
};

export type OerResource = {
  id: string;
  title: string;
  source: string;
  url: string;
  resourceType: string;
  summary: string;
  tags: string[];
  openLicense: boolean;
  licenseName: string;
  suggestedUse: string;
  accessibilityScore: number;
  adaptabilityScore: number;
  peerReviewed: boolean;
};
