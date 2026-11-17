// In-browser mock store for static deployment (e.g. GitHub Pages)

const INITIAL_USERS = [
  {
    _id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex@devflow.com',
    role: 'admin',
    title: 'Lead Architect & Founder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    _id: 'u-2',
    name: 'Sarah Connor',
    email: 'sarah@devflow.com',
    role: 'member',
    title: 'Senior Frontend Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    _id: 'u-3',
    name: 'David Kim',
    email: 'david@devflow.com',
    role: 'member',
    title: 'Backend & Cloud Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
];

const INITIAL_PROJECTS = [
  {
    _id: 'p-1',
    title: 'Tasks90 Core Platform',
    description: 'Next-generation collaborative workspace with real-time Kanban workflow.',
    key: 'T90',
    status: 'active',
    owner: INITIAL_USERS[0],
    members: [INITIAL_USERS[1], INITIAL_USERS[2]],
    color: '#10b981',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p-2',
    title: 'Mobile Companion App',
    description: 'Responsive mobile & tablet client for on-the-go task updates.',
    key: 'MAPP',
    status: 'active',
    owner: INITIAL_USERS[1],
    members: [INITIAL_USERS[0], INITIAL_USERS[2]],
    color: '#6366f1',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p-3',
    title: 'Cloud Infrastructure & DevOps',
    description: 'Automated CI/CD pipeline, monitoring, and scaling architecture.',
    key: 'INFRA',
    status: 'planning',
    owner: INITIAL_USERS[2],
    members: [INITIAL_USERS[0]],
    color: '#f59e0b',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_TASKS = [
  {
    _id: 't-1',
    title: 'Refactor Responsive Layout for Mobile & TV',
    description: 'Ensure touch targets, drawer menus, and 4K viewport scaling work flawlessly.',
    project: 'p-1',
    assignedTo: INITIAL_USERS[1],
    status: 'done',
    priority: 'high',
    dueDate: new Date().toISOString(),
    tags: ['ui', 'responsive'],
    order: 0,
  },
  {
    _id: 't-2',
    title: 'Implement Dark & Light Theme Storage',
    description: 'Store user theme preference in localStorage and prevent FOUC.',
    project: 'p-1',
    assignedTo: INITIAL_USERS[0],
    status: 'done',
    priority: 'medium',
    dueDate: new Date().toISOString(),
    tags: ['theme', 'ux'],
    order: 1,
  },
  {
    _id: 't-3',
    title: 'Kanban Column Drag and Drop UX',
    description: 'Allow smooth reordering and column-to-column task cards transfer.',
    project: 'p-1',
    assignedTo: INITIAL_USERS[1],
    status: 'in-progress',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    tags: ['frontend', 'feature'],
    order: 2,
  },
  {
    _id: 't-4',
    title: 'Draft Terms of Service & Privacy Policy',
    description: 'Ensure legal clarity, disclaimer notices, and user data governance.',
    project: 'p-1',
    assignedTo: INITIAL_USERS[2],
    status: 'review',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    tags: ['legal'],
    order: 3,
  },
  {
    _id: 't-5',
    title: 'Export Workspace Summary to CSV / PDF',
    description: 'Create an export feature for milestone reports and task metrics.',
    project: 'p-1',
    assignedTo: INITIAL_USERS[0],
    status: 'todo',
    priority: 'low',
    dueDate: null,
    tags: ['export'],
    order: 4,
  },
  {
    _id: 't-6',
    title: 'Mobile Navigation Drawer & Touch Gestures',
    description: 'Optimize slide-in drawer for iOS Safari and Android Chrome.',
    project: 'p-2',
    assignedTo: INITIAL_USERS[1],
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    tags: ['mobile'],
    order: 0,
  },
];

const INITIAL_ACTIVITIES = [
  {
    _id: 'a-1',
    user: INITIAL_USERS[0],
    action: 'CREATED_PROJECT',
    details: 'Created workspace "Tasks90 Core Platform"',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'a-2',
    user: INITIAL_USERS[1],
    action: 'UPDATED_TASK_STATUS',
    details: 'Moved "Refactor Responsive Layout" to DONE',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Helper to get or init localStorage data
const getStore = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(`tasks90_${key}`) || localStorage.getItem(`tasks_${key}`);
    if (val) return JSON.parse(val);
  } catch (e) {}
  localStorage.setItem(`tasks90_${key}`, JSON.stringify(defaultVal));
  return defaultVal;
};

const setStore = (key, val) => {
  try {
    localStorage.setItem(`tasks90_${key}`, JSON.stringify(val));
  } catch (e) {}
};

export const demoStore = {
  getUsers: () => getStore('users', INITIAL_USERS),
  getProjects: () => {
    const projects = getStore('projects', INITIAL_PROJECTS);
    const tasks = getStore('tasks', INITIAL_TASKS);
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => t.project === p._id);
      const doneTasks = pTasks.filter((t) => t.status === 'done').length;
      const progress = pTasks.length > 0 ? Math.round((doneTasks / pTasks.length) * 100) : 0;
      return {
        ...p,
        totalTasks: pTasks.length,
        doneTasks,
        progress,
      };
    });
  },
  getProjectById: (id) => {
    const projects = demoStore.getProjects();
    const proj = projects.find((p) => p._id === id);
    if (!proj) return null;
    const tasks = getStore('tasks', INITIAL_TASKS).filter((t) => t.project === id);
    return { ...proj, tasks };
  },
  createProject: (data, currentUser) => {
    const projects = getStore('projects', INITIAL_PROJECTS);
    const newProj = {
      _id: `p-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      key: data.key || 'PROJ',
      status: data.status || 'active',
      color: data.color || '#10b981',
      owner: currentUser || INITIAL_USERS[0],
      members: [INITIAL_USERS[1]],
      createdAt: new Date().toISOString(),
    };
    projects.unshift(newProj);
    setStore('projects', projects);
    return newProj;
  },
  deleteProject: (id) => {
    let projects = getStore('projects', INITIAL_PROJECTS);
    projects = projects.filter((p) => p._id !== id);
    setStore('projects', projects);
  },
  getTasks: (projectId) => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    if (projectId) return tasks.filter((t) => t.project === projectId);
    return tasks;
  },
  createTask: (data) => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    const users = demoStore.getUsers();
    const assignedUser = users.find((u) => u._id === data.assignedTo) || null;
    const newTask = {
      _id: `t-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      project: data.projectId,
      assignedTo: assignedUser,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      tags: data.tags || [],
      order: tasks.length,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    setStore('tasks', tasks);
    return newTask;
  },
  updateTaskStatus: (taskId, newStatus) => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      task.status = newStatus;
      setStore('tasks', tasks);
    }
    return task;
  },
  deleteTask: (taskId) => {
    let tasks = getStore('tasks', INITIAL_TASKS);
    tasks = tasks.filter((t) => t._id !== taskId);
    setStore('tasks', tasks);
  },
  getDashboardStats: () => {
    const projects = demoStore.getProjects();
    const tasks = getStore('tasks', INITIAL_TASKS);
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const completionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      todoTasks: tasks.filter((t) => t.status === 'todo').length,
      inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
      reviewTasks: tasks.filter((t) => t.status === 'review').length,
      doneTasks,
      urgentTasks: tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length,
      completionRate,
      recentActivities: getStore('activities', INITIAL_ACTIVITIES),
      upcomingTasks: tasks.filter((t) => t.dueDate && t.status !== 'done').slice(0, 5),
    };
  },
};
