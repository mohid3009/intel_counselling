import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { School, Users, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState } from '../../components/ui';
import SeverityBadge from '../../components/charts/SeverityBadge';
import api from '../../lib/axios';
import { formatRelative, formatDate } from '../../utils/formatters';

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-surface-900">{value ?? '—'}</p>
          {trend && <p className="text-xs text-green-600 mt-1 font-medium">↑ {trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data),
  });

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="xl" /></div>;

  const { stats, recentAlerts, testStats, severeNoAppointmentResults } = data || {};

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Admin Dashboard</h2>
        <p className="text-surface-500 mt-1">Platform overview and activity</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Total Schools" value={stats?.totalSchools} icon={School} color="bg-primary-600" />
        <StatCard title="Total Students" value={stats?.totalStudents} icon={Users} color="bg-accent-500" />
        <StatCard title="Total Parents" value={stats?.totalParents} icon={Users} color="bg-green-600" />
        <StatCard title="Alerts This Month" value={stats?.alertsThisMonth} icon={AlertTriangle} color="bg-red-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Add New School', to: '/admin/schools', icon: Plus, color: 'from-primary-600 to-primary-700' },
          { label: 'Manage Users', to: '/admin/users', icon: Users, color: 'from-accent-500 to-accent-700' },
          { label: 'View All Schools', to: '/admin/schools', icon: School, color: 'from-surface-700 to-surface-900' },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className={`bg-gradient-to-br ${a.color} text-white rounded-2xl p-5 flex items-center gap-4 hover:opacity-90 transition-opacity shadow-glass`}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <a.icon className="w-5 h-5" />
            </div>
            <span className="font-semibold">{a.label}</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        ))}
      </div>

      {/* Test Attendance Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Test Attendance Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testStats?.map(test => (
            <Card key={test.id} className="relative overflow-hidden group hover:border-primary-200 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full">
                    {test.category}
                  </span>
                  <h4 className="font-bold text-surface-950 text-lg mt-3 group-hover:text-primary-600 transition-colors">
                    {test.name}
                  </h4>
                  <p className="text-xs text-surface-400 mt-1">Mental Health Screener</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-surface-900 block leading-none">
                    {test._count?.results ?? 0}
                  </span>
                  <span className="text-xs text-surface-400">submissions</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Severe Results Checklist */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 bg-red-50/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-semibold text-surface-900">Severe Results Checklist (No Appointment Booked)</h3>
          </div>
          <Badge variant="danger" size="sm">{severeNoAppointmentResults?.length || 0} pending</Badge>
        </div>
        {!severeNoAppointmentResults?.length ? (
          <EmptyState icon="✅" title="Checklist clear" description="No severe results require immediate follow-up." />
        ) : (
          <div className="divide-y divide-surface-100">
            {severeNoAppointmentResults.map(result => {
              const name = result.takenByName || `${result.student?.firstName} ${result.student?.lastName}`;
              const username = result.takenByUsername || result.student?.email;
              const phone = result.takenByPhone || result.student?.phone || '—';

              return (
                <div key={result.id} className="flex items-start gap-4 px-6 py-4 hover:bg-surface-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={result.checklistChecked}
                    onChange={async (e) => {
                      try {
                        await api.put(`/admin/results/${result.id}/toggle-checklist`, { checked: e.target.checked });
                        queryClient.invalidateQueries(['admin-dashboard']);
                      } catch (err) {
                        console.error('Failed to toggle checklist checked', err);
                      }
                    }}
                    className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500 mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className={`text-sm font-semibold text-surface-900 ${result.checklistChecked ? 'line-through text-surface-400' : ''}`}>
                        {name}
                      </p>
                      <p className="text-xs text-surface-500">{username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-700">Phone: <strong className="text-surface-900">{phone}</strong></p>
                      <p className="text-xs text-surface-500">Taken {formatDate(result.takenAt)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-surface-500">{result.test?.name}:</span>
                        <SeverityBadge severity={result.severity} size="xs" />
                      </div>
                      <p className="text-xs text-surface-400 mt-0.5">Score: {result.score}/{result.maxScore}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent Alerts */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h3 className="font-semibold text-surface-900">Recent Alerts</h3>
          <Link to="/admin/users" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {!recentAlerts?.length ? (
          <EmptyState icon="🎉" title="No alerts" description="All students are doing well!" />
        ) : (
          <div className="divide-y divide-surface-50">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`flex items-center gap-4 px-6 py-4 alert-card-${alert.severity.toLowerCase()}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">
                    {alert.student.firstName} {alert.student.lastName}
                  </p>
                  <p className="text-xs text-surface-500">{alert.student.school?.name}</p>
                </div>
                <SeverityBadge severity={alert.severity} />
                <span className="text-xs text-surface-400 flex-shrink-0">{formatRelative(alert.firedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
