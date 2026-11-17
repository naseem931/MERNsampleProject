import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  FolderKanban,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Projects = ({ onOpenNewProject }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects', {
        params: {
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      if (res.data?.data) {
        setProjects(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleDeleteProject = async (e, projectId, projectTitle) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}" and all its tasks?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('Project deleted');
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 2xl:p-12 space-y-6 max-w-7xl 2xl:max-w-[1800px] mx-auto transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Projects Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, track and collaborate across all workspaces
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'active', 'planning', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors flex-shrink-0 ${
                statusFilter === tab
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop, 4 col on TV/wide */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/30">
          <FolderKanban className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No projects found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Get started by creating your first workspace or adjust your search filter.
          </p>
          <button
            onClick={onOpenNewProject}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => navigate(`/projects/${proj._id}`)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-5 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-sm"
                      style={{ backgroundColor: proj.color || '#10b981' }}
                    >
                      {proj.key}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-medium">
                      {proj.status}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteProject(e, proj._id, proj.title)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              {/* Progress & Team */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {proj.progress}% ({proj.doneTasks}/{proj.totalTasks} tasks)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                {/* Member avatars */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center -space-x-1.5">
                    {proj.members && proj.members.length > 0 ? (
                      proj.members.slice(0, 4).map((m) => (
                        <img
                          key={m._id}
                          src={
                            m.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`
                          }
                          alt={m.name}
                          title={m.name}
                          className="w-6 h-6 rounded-full border border-white dark:border-slate-900 object-cover"
                        />
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Sole owner</span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Lead: {proj.owner?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
