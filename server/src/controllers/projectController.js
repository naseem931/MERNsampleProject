import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;

    const query = {
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let projectQuery = Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (sort === 'oldest') {
      projectQuery = projectQuery.sort({ createdAt: 1 });
    } else {
      projectQuery = projectQuery.sort({ createdAt: -1 });
    }

    const projects = await projectQuery;

    // Attach task metrics to each project
    const projectsWithMetrics = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const doneTasks = await Task.countDocuments({
          project: project._id,
          status: 'done',
        });
        const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        return {
          ...project.toObject(),
          totalTasks,
          doneTasks,
          progress,
        };
      })
    );

    return sendSuccess(res, projectsWithMetrics, 'Projects retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID with tasks
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return sendSuccess(
      res,
      {
        ...project.toObject(),
        tasks,
        totalTasks,
        doneTasks,
        progress,
      },
      'Project details retrieved'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { title, description, key, status, members, color } = req.body;

    if (!title) {
      return sendError(res, 'Project title is required', 400);
    }

    // Auto-generate key if empty (first 3-4 letters of title)
    const generatedKey = (
      key || title.replace(/[^a-zA-Z]/g, '').substring(0, 4) || 'DEV'
    ).toUpperCase();

    const project = await Project.create({
      title,
      description: description || '',
      key: generatedKey,
      status: status || 'active',
      owner: req.user._id,
      members: members || [],
      color: color || '#10B981',
    });

    await ActivityLog.create({
      user: req.user._id,
      project: project._id,
      action: 'CREATED_PROJECT',
      details: `Created project "${project.title}" (${project.key})`,
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    return sendSuccess(res, populated, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Check ownership or admin
    if (
      project.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return sendError(res, 'Not authorized to update this project', 403);
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    await ActivityLog.create({
      user: req.user._id,
      project: project._id,
      action: 'UPDATED_PROJECT',
      details: `Updated project "${project.title}"`,
    });

    return sendSuccess(res, project, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    if (
      project.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return sendError(res, 'Not authorized to delete this project', 403);
    }

    // Delete tasks inside project
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'DELETED_PROJECT',
      details: `Deleted project "${project.title}"`,
    });

    return sendSuccess(res, { id: req.params.id }, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};
