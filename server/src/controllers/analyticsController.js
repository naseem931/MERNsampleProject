import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { sendSuccess } from '../utils/apiResponse.js';

// @desc    Get dashboard metrics & activity feed
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select('_id');

    const projectIds = userProjects.map((p) => p._id);

    const [
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      doneTasks,
      urgentTasks,
      recentActivities,
      upcomingTasks,
    ] = await Promise.all([
      Project.countDocuments({ _id: { $in: projectIds } }),
      Task.countDocuments({ project: { $in: projectIds } }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'todo' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'in-progress' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'review' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'done' }),
      Task.countDocuments({
        project: { $in: projectIds },
        priority: 'urgent',
        status: { $ne: 'done' },
      }),
      ActivityLog.find({
        $or: [{ project: { $in: projectIds } }, { user: req.user._id }],
      })
        .populate('user', 'name email avatar')
        .populate('project', 'title key')
        .sort({ createdAt: -1 })
        .limit(10),
      Task.find({
        project: { $in: projectIds },
        status: { $ne: 'done' },
        dueDate: { $ne: null },
      })
        .populate('project', 'title key color')
        .populate('assignedTo', 'name email avatar')
        .sort({ dueDate: 1 })
        .limit(5),
    ]);

    const completionRate =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return sendSuccess(
      res,
      {
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        reviewTasks,
        doneTasks,
        urgentTasks,
        completionRate,
        recentActivities,
        upcomingTasks,
      },
      'Dashboard stats retrieved'
    );
  } catch (error) {
    next(error);
  }
};
