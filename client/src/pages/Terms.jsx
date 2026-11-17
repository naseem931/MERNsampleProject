import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';

export const Terms = () => {
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
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026 • Version 1.0</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Tasks90, you agree to be bound by these Terms and Conditions
              and all applicable laws and regulations. If you disagree with any part of these terms,
              you may not access or use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              2. User Accounts & Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use or security breaches.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-500" />
              3. Intellectual Property & Brand Rights
            </h2>
            <p>
              Tasks90 and its original design, source code, logos, and features are protected under
              open-source licensing and copyright laws. "Tasks90" is our distinct moniker
              for this collaborative management suite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              4. Service Availability & Disclaimers
            </h2>
            <p>
              The platform is provided on an "as is" and "as available" basis without warranties of
              any kind, either express or implied. We do not warrant that service will be
              uninterrupted, secure, or free of errors.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Tasks90 Workspace. All rights reserved.</span>
          <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
