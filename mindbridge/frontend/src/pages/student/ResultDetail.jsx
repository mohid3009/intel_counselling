import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Spinner, EmptyState } from '../../components/ui';
import SeverityBadge from '../../components/charts/SeverityBadge';
import ScoreHistoryChart from '../../components/charts/ScoreHistoryChart';
import api from '../../lib/axios';
import { formatDate, formatScore } from '../../utils/formatters';

function ExpandableRow({ result }) {
  const [open, setOpen] = useState(false);
  const questions = result.test?.questions || [];
  const answers = result.answers;

  const getAnswerLabel = (questionId, value) => {
    const q = questions.find(q => q.id === questionId || q.id === parseInt(questionId));
    if (!q) return value;
    const opt = q.options?.find(o => o.value === value);
    return opt?.label || value;
  };

  return (
    <>
      <tr className="cursor-pointer hover:bg-surface-50" onClick={() => setOpen(v => !v)}>
        <td className="font-medium text-surface-900">{result.test?.name}</td>
        <td className="text-surface-500">{result.test?.category}</td>
        <td>{formatDate(result.takenAt)}</td>
        <td><span className="font-bold">{result.score}</span>/{result.maxScore}</td>
        <td><SeverityBadge severity={result.severity} /></td>
        <td>{result.sharedWithTherapist ? <span className="text-green-600 text-xs font-medium">✓ Shared</span> : <span className="text-surface-400 text-xs">—</span>}</td>
        <td>{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="bg-surface-50 p-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">Your Answers</p>
              {Object.entries(answers).map(([qId, val], i) => {
                const q = questions.find(q => q.id === parseInt(qId));
                return (
                  <div key={qId} className="flex items-start gap-3 text-sm">
                    <span className="text-surface-400 flex-shrink-0 w-5">{i + 1}.</span>
                    <span className="text-surface-700 flex-1">{q?.text || `Q${qId}`}</span>
                    <span className="font-medium text-primary-700 flex-shrink-0">{getAnswerLabel(qId, val)}</span>
                    <span className="text-surface-400 text-xs flex-shrink-0">({val} pts)</span>
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ResultDetail() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['student-results'],
    queryFn: () => api.get('/student/results', { params: { limit: 100 } }).then(r => r.data),
  });

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="xl" /></div>;

  const results = data?.results || [];
  const singleResult = id ? results.find(r => r.id === id) : null;

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">My Results</h2>
        <p className="text-surface-500">{results.length} assessments taken</p>
      </div>

      {results.length > 0 && (
        <Card>
          <h3 className="font-semibold mb-4">Score History</h3>
          <ScoreHistoryChart results={results} height={200} />
        </Card>
      )}

      <Card padding={false}>
        {!results.length ? (
          <EmptyState icon="📋" title="No results yet"
            description="Take your first assessment to see your results here."
            action={<Link to="/student/tests"><button className="bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-medium">Take a Test</button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test</th><th>Category</th><th>Date</th>
                  <th>Score</th><th>Severity</th><th>Shared</th><th></th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => <ExpandableRow key={r.id} result={r} />)}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
