import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import { Task } from './models/Task.js';
import { ActivityLog } from './models/ActivityLog.js';

export const seedData = async (exitOnComplete = true) => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('🧹 Cleaned existing data.');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Alex Rivera',
        email: 'alex@devflow.com',
        password: 'password123',
        role: 'admin',
        title: 'Lead Architect & Founder',
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@devflow.com',
        password: 'password123',
        role: 'member',
        title: 'Senior Frontend Engineer',
      },
      {
        name: 'David Kim',
        email: 'david@devflow.com',
        password: 'password123',
        role: 'member',
        title: 'Backend & Cloud Engineer',
      },
    ]);

    const [alex, sarah, david] = users;
    console.log(`👤 Created ${users.length} users.`);

    // 2. Create Projects
    const projects = await Project.create([
      {
        title: 'DevFlow SaaS Platform v2',
        description: 'Modern collaborative workspace with real-time updates and Kanban workflow.',
        key: 'DFLOW',
        status: 'active',
        owner: alex._id,
        members: [sarah._id, david._id],
        color: '#10b981', // emerald
      },
      {
        title: 'Mobile Companion App',
        description: 'React Native iOS & Android client for on-the-go task status and alerts.',
        key: 'MAPP',
        status: 'active',
        owner: sarah._id,
        members: [alex._id, david._id],
        color: '#6366f1', // indigo
      },
      {
        title: 'Cloud Infrastructure & CI/CD',
        description: 'Automated Kubernetes pipeline, multi-region database replication and monitoring.',
        key: 'INFRA',
        status: 'planning',
        owner: david._id,
        members: [alex._id],
        color: '#f59e0b', // amber
      },
    ]);

    const [dflow, mapp, infra] = projects;
    console.log(`📁 Created ${projects.length} projects.`);

    // 3. Create Tasks for DevFlow project
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.create([
      {
        title: 'Design Dark Mode UI tokens',
        description: 'Standardize Tailwind color palette and surface styles across all components.',
        project: dflow._id,
        assignedTo: sarah._id,
        status: 'done',
        priority: 'high',
        dueDate: now,
        tags: ['design', 'ui'],
        order: 0,
      },
      {
        title: 'Implement JWT Refresh Token rotation',
        description: 'Secure authentication endpoints and implement silent token renewal.',
        project: dflow._id,
        assignedTo: david._id,
        status: 'in-progress',
        priority: 'urgent',
        dueDate: tomorrow,
        tags: ['security', 'auth'],
        order: 1,
      },
      {
        title: 'Kanban Column Drag and Drop UX',
        description: 'Allow smooth reordering and column-to-column task cards transfer.',
        project: dflow._id,
        assignedTo: sarah._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: nextWeek,
        tags: ['frontend', 'feature'],
        order: 2,
      },
      {
        title: 'Automated API integration tests',
        description: 'Write Jest and Supertest suites for Auth, Project, and Task controllers.',
        project: dflow._id,
        assignedTo: alex._id,
        status: 'review',
        priority: 'medium',
        dueDate: nextWeek,
        tags: ['testing'],
        order: 3,
      },
      {
        title: 'Export Project Summary to CSV / PDF',
        description: 'Create an endpoint to export project milestone reports and task metrics.',
        project: dflow._id,
        assignedTo: david._id,
        status: 'todo',
        priority: 'low',
        dueDate: null,
        tags: ['feature'],
        order: 4,
      },
      // Mobile app tasks
      {
        title: 'Setup React Native Expo project template',
        description: 'Configure TypeScript, React Navigation, and Axios client with storage.',
        project: mapp._id,
        assignedTo: sarah._id,
        status: 'done',
        priority: 'high',
        dueDate: now,
        tags: ['mobile', 'setup'],
        order: 0,
      },
      {
        title: 'Push notification integration with Firebase',
        description: 'Handle background notifications when task is assigned or due date is approaching.',
        project: mapp._id,
        assignedTo: david._id,
        status: 'todo',
        priority: 'medium',
        dueDate: nextWeek,
        tags: ['notifications', 'firebase'],
        order: 1,
      },
    ]);

    console.log(`✅ Created ${tasks.length} tasks.`);

    // 4. Create Activity Logs
    await ActivityLog.create([
      {
        user: alex._id,
        project: dflow._id,
        action: 'CREATED_PROJECT',
        details: 'Created project "DevFlow SaaS Platform v2"',
      },
      {
        user: sarah._id,
        project: dflow._id,
        action: 'UPDATED_TASK_STATUS',
        details: 'Moved task "Design Dark Mode UI tokens" to DONE',
      },
      {
        user: david._id,
        project: dflow._id,
        action: 'CREATED_TASK',
        details: 'Created task "Implement JWT Refresh Token rotation"',
      },
    ]);

    console.log('✨ Seed complete! Default credentials:');
    console.log('   Email:    alex@devflow.com');
    console.log('   Password: password123');

    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during database seed:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

// Check if running as script directly
if (process.argv[1]?.endsWith('seed.js')) {
  await connectDB();
  await seedData(true);
}
