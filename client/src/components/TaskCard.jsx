import React from 'react';
import { Calendar, Trash2, Tag } from 'lucide-react';

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  medium: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  high: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  urgent: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
};

export const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const isDone = task.status === 'done';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group relative rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
      {/* Top row: Priority & Delete */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
            priorityColors[task.priority] || priorityColors.medium
          }`}
        >
          {task.priority}
        </span>

        <button
          onClick={() => onDelete(task._id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition-all"
          title="Delete Task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <h4
        className={`font-semibold text-sm leading-snug mb-1.5 ${
          isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
        }`}
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Due Date & Assignee & Quick Status */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              {formatDate(task.dueDate)}
            </span>
          )}

          {task.assignedTo ? (
            <img
              src={
                task.assignedTo.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo.name}`
              }
              alt={task.assignedTo.name}
              title={`Assigned to ${task.assignedTo.name}`}
              className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
            />
          ) : (
            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
          )}
        </div>

        {/* Status Dropdown */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 rounded px-1.5 py-0.5 outline-none cursor-pointer transition-colors"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};
