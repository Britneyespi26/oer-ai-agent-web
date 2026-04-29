import { useMemo, useState } from 'react';
import { extractTopics, generateRecommendations, RUBRIC_VERSION } from './analysis';
import { REQUIRED_COURSES } from './data';
import type { SearchResponse, UsageLog } from './types';

const INITIAL_INSTRUCTOR = 'Faculty User';
const MIN_SYLLABUS_LENGTH = 25;
const USAGE_LOG_STORAGE_KEY = 'oerUsageLogs';
const MAX_USAGE_LOGS = 100;

function getStoredLogs(): UsageLog[] {
  try {
    return JSON.parse(localStorage.getItem(USAGE_LOG_STORAGE_KEY) ?? '[]') as UsageLog[];
  } catch {
    return [];
  }
}

function buildLogEntry(
  courseName: string,
  instructor: string,
  extractedTopics: string[],
  resultCount: number,
  topResult: string,
): UsageLog {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    courseName,
    instructor,
    queryTopics: extractedTopics,
    resultCount,
    topResult,
  };
}

function App() {
  const defaultCourse = REQUIRED_COURSES[1];
  const [selectedCourseCode, setSelectedCourseCode] = useState(defaultCourse.code);
  const [courseName, setCourseName] = useState(`${defaultCourse.code} - ${defaultCourse.title}`);
  const [instructor, setInstructor] = useState(INITIAL_INSTRUCTOR);
  const [syllabusText, setSyllabusText] = useState(defaultCourse.sampleSyllabus);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>(getStoredLogs);
  const selectedCourse = useMemo(
    () => REQUIRED_COURSES.find((course) => course.code === selectedCourseCode) ?? defaultCourse,
    [selectedCourseCode, defaultCourse],
  );

  function storeLogs(nextLogs: UsageLog[]) {
    setLogs(nextLogs);
    localStorage.setItem(USAGE_LOG_STORAGE_KEY, JSON.stringify(nextLogs));
  }

  function onSelectCourse(courseCode: string) {
    setSelectedCourseCode(courseCode);
    const selected = REQUIRED_COURSES.find((course) => course.code === courseCode);
    if (!selected) {
      return;
    }
    setCourseName(`${selected.code} - ${selected.title}`);
    setSyllabusText(selected.sampleSyllabus);
  }

  function runAnalysis() {
    setError('');
    try {
      if (!syllabusText || syllabusText.trim().length < MIN_SYLLABUS_LENGTH) {
        throw new Error('Please provide more syllabus detail before running analysis.');
      }

      const extractedTopics = extractTopics(syllabusText);
      const recommendations = generateRecommendations(extractedTopics);

      const responseData: SearchResponse = {
        courseName,
        extractedTopics,
        recommendations,
        rubricVersion: RUBRIC_VERSION,
      };
      setResult(responseData);

      const nextLogs: UsageLog[] = [
        buildLogEntry(
          courseName,
          instructor,
          extractedTopics,
          recommendations.length,
          recommendations[0]?.title ?? 'No matches',
        ),
        ...logs,
      ].slice(0, MAX_USAGE_LOGS);
      storeLogs(nextLogs);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unexpected error while generating recommendations.',
      );
    }
  }

  const topScore = useMemo(() => result?.recommendations[0]?.rubric.overall ?? 0, [result]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">GGC AI in Curriculum and Pedagogy</p>
        <h1>OER Discovery Assistant</h1>
        <p className="subtitle">
          Select a GGC course, analyze syllabus context, and get rubric-scored OER recommendations
          with licensing and classroom integration guidance.
        </p>
      </header>

      <section className="card form-card">
        <h2>Course Analysis</h2>
        <div className="form-grid">
          <label>
            Course
            <select value={selectedCourseCode} onChange={(event) => onSelectCourse(event.target.value)}>
              {REQUIRED_COURSES.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.title} ({course.term})
                </option>
              ))}
            </select>
          </label>
          <label>
            Instructor
            <input value={instructor} onChange={(event) => setInstructor(event.target.value)} />
          </label>
          <label className="full-width">
            Course Name
            <input value={courseName} onChange={(event) => setCourseName(event.target.value)} />
          </label>
          <label className="full-width">
            Syllabus Context
            <textarea
              value={syllabusText}
              rows={8}
              onChange={(event) => setSyllabusText(event.target.value)}
            />
          </label>
          <div className="actions full-width">
            <button type="button" onClick={runAnalysis}>
              Generate Recommendations
            </button>
            <button type="button" onClick={() => onSelectCourse(selectedCourseCode)}>
              Reload Course Context
            </button>
          </div>
        </div>
        <div className="sources-box">
          <p>
            <strong>Source links</strong>
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
