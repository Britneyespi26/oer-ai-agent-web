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

const demoSyllabus = `Course: ENGL 1101 - Composition I
Learning objectives:
1) Develop academic writing and revision strategies.
2) Use credible sources and apply research methods for evidence-based arguments.
3) Analyze rhetoric, audience, and communication choices.
4) Practice critical thinking through argumentative essays and peer review.
Weekly topics include academic writing, research ethics, rhetorical analysis, revision, and communication.`;

function App() {
  const [courseName, setCourseName] = useState('ENGL 1101 - Composition I');
  const [instructor, setInstructor] = useState('Faculty User');
  const [syllabusText, setSyllabusText] = useState(demoSyllabus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>([]);

  async function loadLogs() {
    const response = await fetch('/api/logs');
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as UsageLog[];
    setLogs(data);
  }

  async function onAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName, instructor, syllabusText }),
      });
      const data = (await response.json()) as SearchResponse | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to analyze syllabus.');
      }

      setResult(data);
      await loadLogs();
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
      <header className="hero">
        <p className="eyebrow">GGC AI in Curriculum and Pedagogy</p>
        <h1>OER Discovery Agent</h1>
        <p className="subtitle">
          Analyze syllabi, extract key topics, and return open-licensed resources from Open ALG and
          partner libraries scored with the OER quality rubric.
        </p>
      </header>

      <section className="card form-card">
        <h2>Analyze Syllabus</h2>
        <form onSubmit={onAnalyze} className="form-grid">
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
            <button type="button" onClick={() => setSyllabusText(demoSyllabus)}>
              Load Sample Syllabus
            </button>
          </div>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      {result ? (
        <section className="results">
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

      <section className="card logs">
        <h2>Published Usage Log</h2>
        <p>
          Tracks query topics, timestamp, and returned results to help instructors and the Working
          Group improve recommendations.
        </p>
        <button type="button" onClick={() => void loadLogs()}>
          Refresh Log
        </button>
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
