import React from 'react';
import {
  Layers,
  Cpu,
  Code2,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  FolderDown,
  Shield,
} from 'lucide-react';
import { AgentWorker, GeneratedFile } from '../types';

interface HeaderProps {
  activeTab: 'blueprint' | 'agents' | 'code';
  setActiveTab: (tab: 'blueprint' | 'agents' | 'code') => void;
  hasApiKey: boolean;
  agents: AgentWorker[];
  files: GeneratedFile[];
  onRunSwarm: () => void;
  isRunningSwarm: boolean;
  onExportZip: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasApiKey,
  agents,
  files,
  onRunSwarm,
  isRunningSwarm,
  onExportZip,
  onReset,
}) => {
  const activeCount = agents.filter(a => a.enabled).length;
  const runningCount = agents.filter(a => a.status === 'generating' || a.status === 'thinking').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Model info */}
        <div className="flex items-center gap-3.5 self-start md:self-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 shadow-lg shadow-cyan-500/20 text-white font-black tracking-wider">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ApexForge
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI SOFTWARE FACTORY
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                gemini-3.8-flash
              </span>
              <span>•</span>
              <span className={`inline-flex items-center gap-1 ${hasApiKey ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                {hasApiKey ? 'API Key Active' : 'Fallback Engine Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Tab Switcher */}
        <nav className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-inner w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'blueprint'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Project Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'agents'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Agent Monitor</span>
            {runningCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-400 text-slate-950 animate-pulse font-bold">
                {runningCount} ACTIVE
              </span>
            ) : (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                {activeCount}/4
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>3. Code Output & Review</span>
            {files.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {files.length}
              </span>
            )}
          </button>
        </nav>

        {/* Global Swarm Control Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {files.length > 0 && (
            <button
              onClick={onExportZip}
              title="Download entire generated repository as ZIP"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors shadow-sm"
            >
              <FolderDown className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Export ZIP</span>
            </button>
          )}

          <button
            onClick={onRunSwarm}
            disabled={isRunningSwarm}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${
              isRunningSwarm
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-95'
            }`}
          >
            {isRunningSwarm ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-amber-400" />
                <span>Swarm Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Dispatch Swarm</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            title="Reset Workspace"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
