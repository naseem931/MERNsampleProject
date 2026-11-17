import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Activity,
  Layers,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 space-y-6 max-w-7xl 2xl:max-w-[1800px] mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-2/3 sm:w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8">
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const {
    totalProjects = 0,
    totalTasks = 0,
    todoTasks = 0,
    inProgressTasks = 0,
    reviewTasks = 0,
    doneTasks = 0,
    urgentTasks = 0,
    completionRate = 0,
    recentActivities = [],
    upcomingTasks = [],
  } = stats || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 space-y-6 sm:space-y-8 max-w-7xl 2xl:max-w-[1800px] mx-auto transition-colors">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Good day, {user?.name}</span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is what's happening across your active Tasks90 workspaces today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/10 active:scale-95"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid: 1 col on mobile, 2 col on tablet, 4 col on desktop/TV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
        {/* Total Projects */}
        <div className="p-5 2xl:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl 2xl:text-4xl font-black text-slate-900 dark:text-slate-100">{totalProjects}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across all team domains</p>
        </div>

        {/* Total Tasks */}
        <div className="p-5 2xl:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl 2xl:text-4xl font-black text-slate-900 dark:text-slate-100">{totalTasks}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {inProgressTasks} currently in progress
          </p>
        </div>

        {/* Overall Completion */}
        <div className="p-5 2xl:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl 2xl:text-4xl font-black text-emerald-600 dark:text-emerald-400">{completionRate}%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Urgent Attention */}
        <div className="p-5 2xl:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Urgent Priority
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl 2xl:text-4xl font-black text-rose-600 dark:text-rose-400">{urgentTasks}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requires immediate attention</p>
        </div>
      </div>

      {/* Task Status Overview Bars */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
          Pipeline Status Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">To Do</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">{todoTasks}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">In Progress</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">{inProgressTasks}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 dark:text-purple-400">In Review</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">{reviewTasks}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Done</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">{doneTasks}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Tasks & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8">
        {/* Upcoming Tasks */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Upcoming Milestones & Due Dates</span>
              </h3>
            </div>

            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                No pending tasks with scheduled deadlines.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                          style={{ backgroundColor: task.project?.color || '#10b981' }}
                        >
                          {task.project?.key}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span>
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/projects/${task.project?._id}`}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline p-1 flex-shrink-0"
                    >
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Activity Feed */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Workspace Activity Feed</span>
            </h3>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">
              No recent activity recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act._id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 flex items-start gap-3"
                >
                  <img
                    src={
                      act.user?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.name || 'user'}`
                    }
                    alt={act.user?.name}
                    className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 text-xs min-w-0">
                    <p className="text-slate-600 dark:text-slate-300 leading-snug">
                      <strong className="text-slate-900 dark:text-slate-100">{act.user?.name || 'Someone'}</strong>{' '}
                      {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {new Date(act.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
