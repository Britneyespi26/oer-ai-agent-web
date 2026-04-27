import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

type Recommendation = {
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
  rubric: {
    relevance: number;
    license: number;
    accessibility: number;
    adaptability: number;
    qualityEvidence: number;
    overall: number;
  };
  rubricSummary: string;
};

type SearchResponse = {
  courseName: string;
  extractedTopics: string[];
  recommendations: Recommendation[];
  rubricVersion: string;
};

type UsageLog = {
  id: string;
  timestamp: string;
  courseName: string;
  instructor: string;
  queryTopics: string[];
  resultCount: number;
  topResult: string;
};

type CourseOption = {
  code: string;
  title: string;
  area: string;
  term: string;
  sampleSyllabus: string;
  sourceLinks: Array<{ label: string; url: string }>;
};

const requiredCourses: CourseOption[] = [
  {
    code: 'ARTS 1100',
    title: 'Art Appreciation',
    area: 'Arts & English',
    term: 'Fall 2025',
    sampleSyllabus:
      'Survey and theory of art throughout world history focused on analysis of art forms, technical procedures, subject matter, composition, theory, art philosophy, and cultural/social influences. Learning goals include visual literacy, cross-cultural comparison, and oral/written analysis of works of art.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ARTS 1100)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=45&coid=11685&print=',
      },
    ],
  },
  {
    code: 'ENGL 1101',
    title: 'First Semester Composition',
    area: 'Arts & English',
    term: 'Spring 2026',
    sampleSyllabus:
      'Composition course focused on effective writing across contexts with emphasis on exposition, analysis, argumentation, and introductory research skills. Typical modules include writing academically, audience awareness, source integration, MLA, revision, and argumentative writing.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ENGL 1101)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=33&coid=5677&print=',
      },
    ],
  },
  {
    code: 'ENGL 1102',
    title: 'Secondary Semester Composition',
    area: 'Arts & English',
    term: 'Fall 2025',
    sampleSyllabus:
      'Composition course advancing beyond ENGL 1101 with stronger emphasis on interpretation, evaluation, and advanced research methods. Typical units include literary analysis, evidence-based argument development, and iterative revision.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ENGL 1102)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=45&coid=11866&print=',
      },
    ],
  },
  {
    code: 'HIST 2111',
    title: 'American History 1',
    area: 'History',
    term: 'Fall 2025',
    sampleSyllabus:
      'Survey of United States History to the post-Civil War period, including colonial development, revolution, constitutional formation, early republic change, sectional conflict, and historical source interpretation.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search HIST 2111)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=49&coid=18179&print=',
      },
    ],
  },
  {
    code: 'HIST 2112',
    title: 'American History 2',
    area: 'History',
    term: 'Spring 2026',
    sampleSyllabus:
      'Survey of United States History from the post-Civil War era to the present, including reconstruction, industrialization, world wars, civil rights, modern politics, and analysis of historical narratives.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search HIST 2112)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=49&coid=18181&print=',
      },
    ],
  },
  {
    code: 'ITEC 1001',
    title: 'Introduction to Computing',
    area: 'Information Technology',
    term: 'Fall 2025',
    sampleSyllabus:
      'Introduction to computers and applications software. Outcomes include computing evolution, digital ethics, productivity tools, hardware fundamentals, security/privacy, collaboration tools, networking principles, and software system types.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ITEC 1001)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=37&coid=7777',
      },
    ],
  },
  {
    code: 'BIOL 1101K',
    title: 'Intro to Biology 1 with Lab',
    area: 'Biology',
    term: 'Fall 2025',
    sampleSyllabus:
      'Part of a two-semester biology sequence for non-science majors with laboratory. Outcomes include cellular-to-organism organization, scientific process, data collection/analysis, and communication of scientific topics with evidence-based reasoning.',
    sourceLinks: [
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=45&coid=11699',
      },
      {
        label: 'GGC Simple Syllabus Portal (search BIOL 1101K)',
        url: 'https://ggc.simplesyllabus.com',
      },
    ],
  },
  {
    code: 'BIOL 1102',
    title: 'Introduction to Biology 2',
    area: 'Biology',
    term: 'Spring 2026',
    sampleSyllabus:
      'Second course in the two-semester biology sequence for non-science majors. Outcomes emphasize organism-to-biosphere systems, scientific thinking, data interpretation, global biological issues, and oral/written scientific communication.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search BIOL 1102)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=20&coid=3623',
      },
    ],
  },
];

const catalog = [
  {
    id: 'oer-1',
    title: 'Open Writing Practices',
    source: 'Open ALG',
    url: 'https://alg.manifoldapp.org/projects/open-writing-practices',
    resourceType: 'Textbook',
    summary:
      'An open textbook covering rhetorical awareness, drafting, revision, and source integration.',
    tags: ['writing', 'research', 'rhetoric', 'revision', 'academic'],
    openLicense: true,
    licenseName: 'CC BY 4.0',
    suggestedUse:
      'Use chapters as weekly readings and adapt revision activities into low-stakes assignments.',
    accessibilityScore: 4,
    adaptabilityScore: 5,
    peerReviewed: true,
  },
  {
    id: 'oer-2',
    title: 'Introduction to Research Methods',
    source: 'Open ALG',
    url: 'https://alg.manifoldapp.org/projects/introduction-to-research-methods',
    resourceType: 'Textbook',
    summary: 'Foundational methods text focused on qualitative and quantitative research design.',
    tags: ['research', 'methods', 'statistics', 'analysis', 'ethics'],
    openLicense: true,
    licenseName: 'CC BY-SA 4.0',
    suggestedUse: 'Map each unit to syllabus methods outcomes and pair with local data examples.',
    accessibilityScore: 5,
    adaptabilityScore: 4,
    peerReviewed: true,
  },
  {
    id: 'oer-3',
    title: 'Critical Thinking Toolkit',
    source: 'OER Commons',
    url: 'https://www.oercommons.org/',
    resourceType: 'Assignment Bank',
    summary: 'Reusable classroom activities for evaluating arguments, evidence, and claims.',
    tags: ['critical', 'thinking', 'arguments', 'analysis', 'evaluation'],
    openLicense: true,
    licenseName: 'CC BY-NC 4.0',
    suggestedUse: 'Assign activities as formative checks before major projects.',
    accessibilityScore: 4,
    adaptabilityScore: 5,
    peerReviewed: false,
  },
  {
    id: 'oer-4',
    title: 'Biology 2e',
    source: 'OpenStax',
    url: 'https://openstax.org/details/books/biology-2e',
    resourceType: 'Textbook',
    summary: 'Comprehensive biology OER for intro biology lecture and lab integration.',
    tags: ['biology', 'genetics', 'ecology', 'evolution', 'lab'],
    openLicense: true,
    licenseName: 'CC BY 4.0',
    suggestedUse: 'Replace paid biology text and map chapters to lab and lecture sequence.',
    accessibilityScore: 5,
    adaptabilityScore: 4,
    peerReviewed: true,
  },
  {
    id: 'oer-5',
    title: 'U.S. History',
    source: 'OpenStax',
    url: 'https://openstax.org/details/books/us-history',
    resourceType: 'Textbook',
    summary: 'Open U.S. history text for survey courses with primary source coverage.',
    tags: ['history', 'american', 'primary', 'constitution', 'civic'],
    openLicense: true,
    licenseName: 'CC BY 4.0',
    suggestedUse: 'Use chapter modules and source analysis prompts for discussion boards.',
    accessibilityScore: 5,
    adaptabilityScore: 4,
    peerReviewed: true,
  },
  {
    id: 'oer-6',
    title: 'Introduction to Computer Science',
    source: 'Open Textbook Library',
    url: 'https://open.umn.edu/opentextbooks',
    resourceType: 'Textbook',
    summary: 'Computing fundamentals, digital systems, and problem-solving workflows.',
    tags: ['computing', 'digital', 'software', 'systems', 'problem'],
    openLicense: true,
    licenseName: 'CC BY-NC-SA 4.0',
    suggestedUse: 'Adopt selected modules to support ITEC 1001 foundational learning outcomes.',
    accessibilityScore: 4,
    adaptabilityScore: 4,
    peerReviewed: false,
  },
];

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'from', 'this', 'will', 'have', 'into', 'about', 'after',
  'before', 'their', 'there', 'which', 'where', 'your', 'using', 'used', 'students', 'student',
  'course', 'courses', 'learn', 'learning', 'an', 'a', 'to', 'in', 'on', 'of', 'by', 'is', 'are',
  'or', 'be', 'as', 'it', 'at',
]);

function extractTopics(syllabusText: string): string[] {
  const words = syllabusText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 3 && !stopWords.has(token));
  const frequency = new Map<string, number>();
  words.forEach((token) => {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  });
  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic]) => topic);
}

function App() {
  const defaultCourse = requiredCourses[1];
  const [selectedCourseCode, setSelectedCourseCode] = useState(defaultCourse.code);
  const [courseName, setCourseName] = useState(`${defaultCourse.code} - ${defaultCourse.title}`);
  const [instructor, setInstructor] = useState('Faculty User');
  const [syllabusText, setSyllabusText] = useState(defaultCourse.sampleSyllabus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>(
    JSON.parse(localStorage.getItem('oerUsageLogs') ?? '[]') as UsageLog[],
  );
  const selectedCourse = useMemo(
    () => requiredCourses.find((course) => course.code === selectedCourseCode) ?? defaultCourse,
    [selectedCourseCode, defaultCourse],
  );

  function storeLogs(nextLogs: UsageLog[]) {
    setLogs(nextLogs);
    localStorage.setItem('oerUsageLogs', JSON.stringify(nextLogs));
  }

  function calculateRubricScore(resource: (typeof catalog)[number], topics: string[]) {
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

  function buildRubricSummary(score: number) {
    if (score >= 4.2) {
      return 'High-quality and highly aligned with syllabus outcomes.';
    }
    if (score >= 3.5) {
      return 'Solid candidate with good alignment; review integration notes.';
    }
    return 'Moderate fit; consider using selected sections or supplements.';
  }

  function onSelectCourse(courseCode: string) {
    setSelectedCourseCode(courseCode);
    const selected = requiredCourses.find((course) => course.code === courseCode);
    if (!selected) {
      return;
    }
    setCourseName(`${selected.code} - ${selected.title}`);
    setSyllabusText(selected.sampleSyllabus);
  }

  async function onAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!syllabusText || syllabusText.trim().length < 25) {
        throw new Error('Please provide more syllabus detail before running analysis.');
      }
      const extractedTopics = extractTopics(syllabusText);
      const recommendations = catalog
        .map((resource) => {
          const rubric = calculateRubricScore(resource, extractedTopics);
          const matchedTopics = resource.tags.filter((tag) => extractedTopics.includes(tag));
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

      const responseData: SearchResponse = {
        courseName,
        extractedTopics,
        recommendations,
        rubricVersion: 'GGC OER Working Group v1 (AI-assisted scoring)',
      };
      setResult(responseData);

      const nextLogs: UsageLog[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          courseName,
          instructor,
          queryTopics: extractedTopics,
          resultCount: recommendations.length,
          topResult: recommendations[0]?.title ?? 'No matches',
        },
        ...logs,
      ].slice(0, 100);
      storeLogs(nextLogs);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unexpected error while generating recommendations.',
      );
    } finally {
      setLoading(false);
    }
  }

  const topScore = useMemo(() => result?.recommendations[0]?.rubric.overall ?? 0, [result]);

  return (
    <main className="page">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-dot" />
          <span>GGC OER AI Agent</span>
        </div>
        <div className="nav-links">
          <a href="#analyze">Analyze</a>
          <a href="#results">Results</a>
          <a href="#logs">Usage Log</a>
        </div>
      </nav>

      <header className="hero">
        <p className="eyebrow">GGC AI in Curriculum and Pedagogy</p>
        <h1>Find Affordable, High-Quality OER Faster</h1>
        <p className="subtitle">
          Analyze syllabi, extract key topics, and return open-licensed resources from Open ALG and
          partner libraries scored with the GGC OER quality rubric.
        </p>
        <div className="hero-actions">
          <a className="hero-cta" href="#analyze">
            Start Course Analysis
          </a>
          <a className="hero-link" href="https://alg.manifoldapp.org" target="_blank" rel="noreferrer">
            Browse Open ALG
          </a>
        </div>
      </header>

      <section className="highlights">
        <article className="highlight-card">
          <h3>Syllabus-to-Topics AI</h3>
          <p>Extracts teaching-relevant concepts from course descriptions and objectives.</p>
        </article>
        <article className="highlight-card">
          <h3>Rubric-Based Evaluation</h3>
          <p>Scores relevance, licensing, accessibility, adaptability, and quality evidence.</p>
        </article>
        <article className="highlight-card">
          <h3>Transparent Tracking</h3>
          <p>Publishes searchable usage logs for faculty teams and the OER Working Group.</p>
        </article>
      </section>

      <section id="analyze" className="card form-card">
        <h2>Analyze Syllabus</h2>
        <form onSubmit={onAnalyze} className="form-grid">
          <label>
            Course Selector (Required Test Courses)
            <select value={selectedCourseCode} onChange={(e) => onSelectCourse(e.target.value)}>
              {requiredCourses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.title} ({course.area}, {course.term})
                </option>
              ))}
            </select>
          </label>
          <label>
            Course Name
            <input value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
          </label>
          <label>
            Instructor
            <input value={instructor} onChange={(e) => setInstructor(e.target.value)} required />
          </label>
          <label className="full-width">
            Syllabus Text
            <textarea
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
              rows={10}
              required
            />
          </label>
          <div className="actions full-width">
            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Find OER Recommendations'}
            </button>
            <button type="button" onClick={() => onSelectCourse(selectedCourseCode)}>
              Reload Selected Course Syllabus
            </button>
          </div>
        </form>
        <div className="sources-box">
          <p>
            <strong>Course data sources for {selectedCourse.code}:</strong>
          </p>
          <p className="source-note">
            Some institution-hosted syllabus pages require a GGC session login. If a direct page
            fails, open the portal link and search by course code + term.
          </p>
          <ul>
            {selectedCourse.sourceLinks.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>

      {result ? (
        <section id="results" className="results">
          <div className="card metrics">
            <div>
              <p className="metric-label">Extracted Topics</p>
              <p className="metric-value">{result.extractedTopics.length}</p>
            </div>
            <div>
              <p className="metric-label">Recommendations</p>
              <p className="metric-value">{result.recommendations.length}</p>
            </div>
            <div>
              <p className="metric-label">Top Rubric Score</p>
              <p className="metric-value">{topScore.toFixed(2)} / 5</p>
            </div>
          </div>

          <div className="card topics">
            <h2>Detected Topics</h2>
            <div className="chip-wrap">
              {result.extractedTopics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
            <p className="rubric-note">Rubric basis: {result.rubricVersion}</p>
          </div>

          <div className="recommendations">
            {result.recommendations.map((item) => (
              <article key={item.id} className="card recommendation">
                <div className="recommendation-header">
                  <h3>{item.title}</h3>
                  <span className="score">Score {item.rubric.overall.toFixed(2)}</span>
                </div>
                <p>{item.summary}</p>
                <p>
                  <strong>Use in class:</strong> {item.suggestedUse}
                </p>
                <p>
                  <strong>Open license:</strong>{' '}
                  {item.openLicense ? `Yes (${item.licenseName})` : 'Not confirmed'}
                </p>
                <p>
                  <strong>Matched topics:</strong> {item.matchedTopics.join(', ') || 'None'}
                </p>
                <div className="rubric-grid">
                  <span>Relevance: {item.rubric.relevance}/5</span>
                  <span>License: {item.rubric.license}/5</span>
                  <span>Accessibility: {item.rubric.accessibility}/5</span>
                  <span>Adaptability: {item.rubric.adaptability}/5</span>
                  <span>Evidence: {item.rubric.qualityEvidence}/5</span>
                </div>
                <p className="rubric-summary">{item.rubricSummary}</p>
                <a href={item.url} target="_blank" rel="noreferrer">
                  Open Resource ({item.source})
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="logs" className="card logs">
        <h2>Published Usage Log</h2>
        <p>
          Tracks query topics, timestamp, and returned results to help instructors and the Working
          Group improve recommendations.
        </p>
        <p>
          Testing data sources: <a href="https://ggc.simplesyllabus.com">ggc.simplesyllabus.com</a>{' '}
          and <a href="https://alg.manifoldapp.org">alg.manifoldapp.org</a>.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Course</th>
                <th>Topics</th>
                <th>Results</th>
                <th>Top Match</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5}>No usage logs yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.courseName || '-'}</td>
                    <td>{log.queryTopics.slice(0, 4).join(', ')}</td>
                    <td>{log.resultCount}</td>
                    <td>{log.topResult}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;
