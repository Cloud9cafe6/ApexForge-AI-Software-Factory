import React, { useState } from 'react';
import {
  Cpu,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Terminal,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  Eye,
  Sliders,
  Flame,
  ShieldAlert,
  FolderGit2,
  Code,
  Activity,
  Layers,
} from 'lucide-react';
import { AgentWorker, AgentId, AgentStatus, GeneratedFile } from '../types';

interface AgentMonitorTabProps {
  agents: AgentWorker[];
  onToggleAgentEnabled: (agentId: AgentId) => void;
  onSetAgentStatus: (agentId: AgentId, status: AgentStatus) => void;
  onToggleTurboMode: (agentId: AgentId) => void;
  onRunIndividualAgent: (agentId: AgentId) => void;
  onRunSwarm: () => void;
  isRunningSwarm: boolean;
  onProceedToCode: () => void;
  files: GeneratedFile[];
  onSendAgentInstruction: (agentId: AgentId, instruction: string) => void;
}

export const AgentMonitorTab: React.FC<AgentMonitorTabProps> = ({
  agents,
  onToggleAgentEnabled,
  onSetAgentStatus,
  onToggleTurboMode,
  onRunIndividualAgent,
  onRunSwarm,
  isRunningSwarm,
  onProceedToCode,
  files,
  onSendAgentInstruction,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('backend');
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptModalAgent, setPromptModalAgent] = useState<AgentWorker | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const getAgentTheme = (id: AgentId) => {
    switch (id) {
      case 'architecture':
        return {
          border: 'border-indigo-500/40',
          bg: 'bg-indigo-950/20',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          glow: 'from-indigo-500 to-purple-600',
          text: 'text-indigo-400',
        };
      case 'backend':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          glow: 'from-emerald-500 to-teal-600',
          text: 'text-emerald-400',
        };
      case 'frontend':
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-950/20',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          glow: 'from-cyan-500 to-blue-600',
          text: 'text-cyan-400',
        };
      case 'qa':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          glow: 'from-amber-500 to-orange-600',
          text: 'text-amber-400',
        };
    }
  };

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'idle':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">STANDBY</span>;
      case 'thinking':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3" /> THINKING
          </span>
        );
      case 'generating':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 animate-pulse">
            <Zap className="w-3 h-3 text-cyan-400" /> GENERATING
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> READY
          </span>
        );
      case 'paused':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">PAUSED</span>;
      case 'error':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">ERROR</span>;
    }
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onSendAgentInstruction(selectedAgent.id, customPrompt.trim());
    setCustomPrompt('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Swarm Pipeline Flow */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>STAGE 2 // MULTI-AGENT ORCHESTRATION</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Autonomous Agent Swarm Cockpit
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Four specialized AI worker agents collaborate to produce full-stack code: Architecture contracts, Python FastAPI backend, React/Tailwind frontend, and Pytest QA verification.
            </p>
          </div>

          {/* Quick Swarm Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRunSwarm}
              disabled={isRunningSwarm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isRunningSwarm ? 'Swarm in Progress...' : 'Run All 4 Agents'}</span>
            </button>

            {files.length > 0 && (
              <button
                onClick={onProceedToCode}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <span>View Code Output ({files.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Pipeline Diagram */}
        <div className="pt-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Execution Pipeline Topology</span>
            <span className="text-emerald-400 font-mono">Sequential Handshake & Parallel Code Synthesis</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            {agents.map((agent, i) => {
              const theme = getAgentTheme(agent.id);
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedAgentId === agent.id
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-500 font-bold text-xs">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate text-xs">{agent.name}</p>
                      <p className={`text-[10px] truncate ${theme.text}`}>{agent.title}</p>
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(agent.status)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of the 4 Standard Multi-Agent Workers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {agents.map(agent => {
          const theme = getAgentTheme(agent.id);
          const isSelected = selectedAgentId === agent.id;

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? `bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500/30`
                  : `bg-slate-900/70 border-slate-800/90 hover:border-slate-700`
              }`}
            >
              {/* Active Glow Accent */}
              {agent.enabled && (
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.glow}`}
                />
              )}

              <div>
                {/* Agent Header & Status Toggle Switch */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br ${theme.glow} text-slate-950 shadow-md`}
                    >
                      <Bot className="w-5 h-5 text-slate-950" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                      <span className={`text-[11px] font-mono ${theme.text}`}>{agent.title}</span>
                    </div>
                  </div>

                  {/* Interactive Status Toggle (Enable / Disable) */}
                  <div className="flex flex-col items-end">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agent.enabled}
                        onChange={() => onToggleAgentEnabled(agent.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      {agent.enabled ? 'ACTIVE' : 'MUTED'}
                    </span>
                  </div>
                </div>

                {/* Role Description */}
                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {agent.role}
                </p>

                {/* Interactive Status Cycle & Turbo Toggle */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Current Status</span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(agent.status)}
                    </div>
                  </div>

                  {/* Manual Status Switcher Buttons */}
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] font-mono text-slate-400">Force State:</span>
                    <div className="flex items-center gap-1">
                      {(['idle', 'generating', 'completed', 'paused'] as AgentStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => onSetAgentStatus(agent.id, st)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase transition-colors ${
                            agent.status === st
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {st.slice(0, 4)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Turbo Mode Switch */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Turbo Speed
                    </span>
                    <button
                      onClick={() => onToggleTurboMode(agent.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        agent.turboMode
                          ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {agent.turboMode ? 'TURBO ON' : '1X NORM'}
                    </button>
                  </div>
                </div>

                {/* Telemetry Progress & Tokens */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-bold">{agent.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full bg-gradient-to-r ${theme.glow}`}
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>{agent.tokensProcessed.toLocaleString()} tok</span>
                    <span>{agent.speed} tok/s</span>
                  </div>
                </div>

                {/* Current Task */}
                <div className="mt-3 p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 text-[11px] text-slate-300 font-mono truncate">
                  <span className="text-slate-400">Task: </span>
                  {agent.currentTask || 'Idle on queue'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onRunIndividualAgent(agent.id)}
                  disabled={!agent.enabled}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run Agent</span>
                </button>

                <button
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="Inspect Agent Logs & Telemetry"
                >
                  <Terminal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Live Terminal & Interaction Console */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{selectedAgent.name} // Live Stream</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {selectedAgent.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Targeting: {selectedAgent.id === 'backend' ? 'Python FastAPI' : selectedAgent.id === 'frontend' ? 'React & Tailwind' : selectedAgent.id === 'architecture' ? 'Microservices Mesh' : 'Pytest & Static Audit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Reasoning Stream
            </span>
            <button
              onClick={() => onRunIndividualAgent(selectedAgent.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Synthesize with Gemini</span>
            </button>
          </div>
        </div>

        {/* Console Log Terminal Window */}
        <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs max-h-72 overflow-y-auto space-y-1.5 shadow-inner">
          {selectedAgent.logs && selectedAgent.logs.length > 0 ? (
            selectedAgent.logs.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-600 select-none text-[11px]">{log.timestamp}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-bold uppercase select-none ${
                    log.level === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : log.level === 'warn'
                      ? 'bg-amber-500/20 text-amber-400'
                      : log.level === 'agent'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.level}
                </span>
                <span
                  className={`${
                    log.level === 'success'
                      ? 'text-emerald-300'
                      : log.level === 'agent'
                      ? 'text-cyan-200'
                      : log.level === 'warn'
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic py-6 text-center">
              Agent is waiting on the execution queue. Click 'Run Agent' or 'Run All 4 Agents' to initialize thought logs.
            </div>
          )}
        </div>

        {/* Custom Instruction Prompt Input */}
        <form onSubmit={handleSendPrompt} className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder={`Send custom instruction to ${selectedAgent.name} (e.g. "Add strict Pydantic model for payment retry", "Add latency sparkline")...`}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!customPrompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch</span>
          </button>
        </form>
      </div>
    </div>
  );
};
