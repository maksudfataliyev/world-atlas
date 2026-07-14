import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Info,
  Layers,
  Cpu,
  Mail,
  Send,
  Github,
  Award,
  Globe2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function About() {
  const { getAccentClass } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('All contact fields are mandatory', {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
        },
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API contact transmit
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Your feedback has been received. Thank you!', {
        icon: '✉️',
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
        },
      });
    }, 1000);
  };

  const stackLibraries = [
    { name: 'React 19', role: 'Component Engine', version: 'v19.0.1' },
    { name: 'TypeScript', role: 'Type Integrity', version: 'v5.8.2' },
    { name: 'Vite 6', role: 'Bundling Compiler', version: 'v6.2.3' },
    { name: 'Tailwind CSS v4', role: 'Design Tokens', version: 'v4.1.14' },
    { name: 'Framer Motion', role: 'Micro-interactions', version: 'v12.23' },
    { name: 'TanStack Query v5', role: 'API Caching Engine', version: 'v5.101' },
    { name: 'Recharts', role: 'Vector Demographic Graphs', version: 'v3.9.2' },
    { name: 'Lucide React', role: 'Iconography system', version: 'v0.546' },
  ];

  return (
    <div className="space-y-10 pb-12 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <Info className={`h-7 w-7 ${getAccentClass('text')}`} />
          Sovereign Registry Intel
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Behind the scenes of the WorldAtlas web infrastructure, API caches, and geometric design systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Double-Column Stack Specs & Details */}
        <div className="md:col-span-2 space-y-8">
          
          {/* A. System Overview */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-indigo-500" />
              Platform Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              WorldAtlas compiles 250 global nations and dependencies into an immersive single-screen dashboard. It features resilient REST integrations (with full offline-ready fallbacks), precise population distribution charts, and fully responsive navigation rails designed to look majestic across desktops, mobile viewports, or landscape tablets.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every country card, statistics sheet, or settings control undergoes optimal local memory caching via TanStack Query. This ensures subsequent navigation is instantaneous and 100% latency-free, matching standard elite tech startups.
            </p>
          </div>

          {/* B. Stacks specification table */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-emerald-500" />
              Certified Dependency Matrix
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stackLibraries.map((lib, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/20"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 block">
                      {lib.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wide">
                      {lib.role}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    {lib.version}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Single-Column Developer & Feedback form card */}
        <div className="space-y-8">
          
          {/* A. Developer Profile */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/60 backdrop-blur-xl shadow-xl space-y-4 text-white">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center`}>
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm tracking-tight text-slate-100">Senior UI Engineer</h4>
                <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
                  Lead Cartographer
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Engineered with extreme aesthetic focus in San Francisco, California. Adhering to Apple design patterns, elegant negative space layouts, and responsive typography guidelines.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Index</span>
              </a>
              <div className="h-3.5 w-[1px] bg-slate-700" />
              <a
                href="https://restcountries.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Globe2 className="h-4 w-4" />
                <span>REST Countries</span>
              </a>
            </div>
          </div>

          {/* B. Contact Form */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-rose-500" />
              Developer Transmit
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 text-xs font-semibold border border-slate-200/40 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Coordinates"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 text-xs font-semibold border border-slate-200/40 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1">
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Transmit feedback, inquiries, or cartographic suggestions..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 text-xs font-semibold border border-slate-200/40 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-transform hover:scale-102 active:scale-95 cursor-pointer disabled:opacity-50 ${getAccentClass('bg')}`}
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send className="h-3 w-3" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
