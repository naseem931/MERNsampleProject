import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: CircleDashed, color: 'text-slate-500 dark:text-slate-400' },
  { id: 'in-progress', label: 'In Progress', icon: PlayCircle, color: 'text-blue-600 dark:text-blue-400' },
  { id: 'review', label: 'In Review', icon: Eye, color: 'text-purple-600 dark:text-purple-400' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
];

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Task creation modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState('todo');

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      if (res.data?.data) {
        setProject(res.data.data);
        setTasks(res.data.data.tasks || []);
      }
    } catch (err) {
      toast.error('Failed to load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
      fetchProjectData();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
      fetchProjectData();
    }
  };

  const handleOpenAddTask = (columnId = 'todo') => {
    setTargetColumn(columnId);
    setIsTaskModalOpen(true);
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority =
      priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 space-y-6 max-w-7xl 2xl:max-w-[1800px] mx-auto animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 space-y-6 max-w-7xl 2xl:max-w-[1800px] mx-auto flex flex-col min-h-[calc(100vh-4rem)] transition-colors">
      {/* Back button & Action Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: project?.color || '#10b981' }}
              >
                {project?.key}
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {project?.title}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-medium">
                {project?.status}
              </span>
            </div>
            {project?.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Progress: <strong className="text-emerald-600 dark:text-emerald-400">{progressPercent}%</strong> ({doneCount}/{tasks.length})
              </div>
              <div className="w-28 sm:w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleOpenAddTask('todo')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800/70 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search board tasks..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns: Horizontal snap scroll on Mobile (<sm), 2 cols on tablet, 4 cols on desktop & TV */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6 flex-1 items-start overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              className="w-[82vw] sm:w-auto flex-shrink-0 snap-center bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 sm:p-3.5 flex flex-col min-h-[480px] transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800/80 px-1">
                <div className="flex items-center gap-2">
                  <ColIcon className={`w-4 h-4 ${col.color}`} />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {col.label}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAddTask(col.id)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-22rem)] pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
                    <p className="text-[11px] text-slate-400 dark:text-slate-600">No tasks in this lane</p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={id}
        defaultStatus={targetColumn}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};
