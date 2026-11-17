import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, Eye } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>

        {/* Title */}
        <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026 • Version 1.0</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us when creating an account, such as your
              name, email address, job role, and project tasks. We do not sell or monetize personal user
              records under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              2. How We Protect Your Data
            </h2>
            <p>
              We implement industry-standard cryptographic techniques including one-way bcrypt password
              hashing and stateless JSON Web Tokens (JWT). In offline or demo deployments, your
              workspace preferences remain purely in your local browser sandbox.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              3. Cookies and Local Storage
            </h2>
            <p>
              Tasks90 utilizes browser Local Storage exclusively for maintaining session persistence,
              storing UI theme preferences (Light/Dark mode), and managing client-side cache tokens.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Tasks90 Workspace.</span>
          <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
};
