import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreateProjectModal } from './components/CreateProjectModal';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';

// Responsive App Layout for mobile, tablet, desktop, and large TV displays
const AppLayout = ({ onOpenNewProject }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpenNewProject={onOpenNewProject}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '13px',
                borderRadius: '12px',
              },
            }}
          />

          <Routes>
            {/* Public Auth & Legal Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected Workspace Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                element={
                  <AppLayout onOpenNewProject={() => setIsNewProjectOpen(true)} />
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/projects"
                  element={
                    <Projects
                      onOpenNewProject={() => setIsNewProjectOpen(true)}
                    />
                  }
                />
                <Route path="/projects/:id" element={<ProjectDetail />} />
              </Route>
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global Create Project Modal */}
          <CreateProjectModal
            isOpen={isNewProjectOpen}
            onClose={() => setIsNewProjectOpen(false)}
            onProjectCreated={() => {
              window.location.reload();
            }}
          />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
