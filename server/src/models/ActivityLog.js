import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATED_PROJECT',
        'UPDATED_PROJECT',
        'DELETED_PROJECT',
        'CREATED_TASK',
        'UPDATED_TASK_STATUS',
        'UPDATED_TASK',
        'DELETED_TASK',
        'ADDED_MEMBER',
      ],
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
