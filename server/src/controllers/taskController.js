import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get tasks by project
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, search } = req.query;

    const query = {};

    if (projectId) {
      query.project = projectId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title key color')
      .sort({ order: 1, createdAt: -1 });

    return sendSuccess(res, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, priority, dueDate, tags } = req.body;

    if (!title || !projectId) {
      return sendError(res, 'Task title and project ID are required', 400);
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    const task = await Task.create({
      title,
      description: description || '',
      project: projectId,
      assignedTo: assignedTo || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
    });

    await ActivityLog.create({
      user: req.user._id,
      project: project._id,
      action: 'CREATED_TASK',
      details: `Created task "${task.title}" in project "${project.title}"`,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title key color');

    return sendSuccess(res, populatedTask, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title key color');

    await ActivityLog.create({
      user: req.user._id,
      project: task.project._id || task.project,
      action: 'UPDATED_TASK',
      details: `Updated task "${task.title}"`,
    });

    return sendSuccess(res, task, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (Kanban move)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['todo', 'in-progress', 'review', 'done'].includes(status)) {
      return sendError(res, 'Invalid task status', 400);
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title key color');

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    await ActivityLog.create({
      user: req.user._id,
      project: task.project._id || task.project,
      action: 'UPDATED_TASK_STATUS',
      details: `Moved task "${task.title}" to ${status.toUpperCase()}`,
    });

    return sendSuccess(res, task, `Task moved to ${status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    const projectId = task.project;
    const taskTitle = task.title;

    await task.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      project: projectId,
      action: 'DELETED_TASK',
      details: `Deleted task "${taskTitle}"`,
    });

    return sendSuccess(res, { id: req.params.id }, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
