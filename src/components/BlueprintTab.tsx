import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Server,
  ArrowRight,
  ShieldCheck,
  Database,
  Radio,
  FileCode,
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  Globe,
  Zap,
  Activity,
  Workflow,
  Cpu,
} from 'lucide-react';
import { Blueprint, Microservice } from '../types';
import { BLUEPRINT_PRESETS } from '../utils/mockPresets';

interface BlueprintTabProps {
  blueprint: Blueprint | null;
  onGenerateBlueprint: (params: {
    projectName: string;
    productGoals: string;
    architectureStyle: string;
    targetScale: string;
    databasePreference: string;
  }) => Promise<void>;
  isLoading: boolean;
  onProceedToAgents: () => void;
}

export const BlueprintTab: React.FC<BlueprintTabProps> = ({
  blueprint,
  onGenerateBlueprint,
  isLoading,
  onProceedToAgents,
}) => {
  const [projectName, setProjectName] = useState(blueprint?.projectName || 'AetherMesh Enterprise Microservices');
  const [productGoals, setProductGoals] = useState(
    blueprint?.productGoals ||
      'Build a high-throughput, autonomous distributed transaction and real-time streaming pipeline that validates entity states, aggregates telemetry at 50,000 req/sec, and provides low-latency REST & WebSocket interfaces for enterprise operators.'
  );
  const [architectureStyle, setArchitectureStyle] = useState(
    blueprint?.architectureStyle || 'Event-Driven Asynchronous Microservices'
  );
  const [targetScale, setTargetScale] = useState(blueprint?.targetScale || '50,000 req/sec with sub-25ms response');
  const [databasePreference, setDatabasePreference] = useState(
    blueprint?.databasePreference || 'PostgreSQL + Redis Cache + Kafka Event Mesh'
  );

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    blueprint?.microservices?.[0]?.id || null
  );

  const handleApplyPreset = (presetId: string) => {
    const preset = BLUEPRINT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setProjectName(preset.name);
    setProductGoals(preset.goals);
    setArchitectureStyle(preset.architectureStyle);
    setTargetScale(preset.targetScale);
    setDatabasePreference(preset.databasePreference);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateBlueprint({
      projectName,
      productGoals,
      architectureStyle,
      targetScale,
      databasePreference,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Explanation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/50 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STAGE 1 // ARCHITECTURAL FORMULATION</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Project Blueprint & Microservice Synthesis
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Define your high-level product goals and scaling constraints. Our Lead Architecture Agent will analyze
              the domain, establish zero-trust service boundaries, map REST/WebSocket endpoints, and generate concrete
              microservice specifications ready for the developer swarm.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Load Domain Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BLUEPRINT_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/80 hover:text-cyan-300 border border-slate-700/60 text-slate-300 transition-colors"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Goals Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>Product Specifications</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Input Parameters</span>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. NexusFlow Core Engine"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              />
            </div>

            {/* Product Goals */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Core Goals & Requirements</span>
                <span className="text-[11px] font-normal text-slate-400">Domain details</span>
              </label>
              <textarea
                value={productGoals}
                onChange={e => setProductGoals(e.target.value)}
                rows={5}
                required
                placeholder="Describe what the system should do, key workflows, user types, and performance criteria..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Architecture Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Architecture Style
              </label>
              <select
                value={architectureStyle}
                onChange={e => setArchitectureStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                <option value="Event-Driven Asynchronous Microservices">Event-Driven Asynchronous Microservices</option>
                <option value="CQRS & Event Sourcing Microservices">CQRS & Event Sourcing Microservices</option>
                <option value="Clean Hexagonal Microservices Mesh">Clean Hexagonal Microservices Mesh</option>
                <option value="Modular Async FastAPI Microservices">Modular Async FastAPI Microservices</option>
              </select>
            </div>

            {/* Target Scale */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Scale & Throughput SLA
              </label>
              <input
                type="text"
                value={targetScale}
                onChange={e => setTargetScale(e.target.value)}
                placeholder="e.g. 100,000 req/sec with <10ms latency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>

            {/* Database & Storage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Database & Event Broker
              </label>
              <input
                type="text"
                value={databasePreference}
                onChange={e => setDatabasePreference(e.target.value)}
                placeholder="e.g. PostgreSQL + Redis Cache + Kafka"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Microservices with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Microservice Specs</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Microservices Blueprint (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {blueprint ? (
            <div className="space-y-6">
              {/* Summary Header Card */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      Synthesized Blueprint
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{blueprint.projectName}</h3>
                    <p className="text-xs text-slate-400 mt-1 italic">{blueprint.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      {blueprint.microservices.length} Microservices Planned
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                  <p className="font-semibold text-slate-200 mb-1">Architectural Flow & Topology:</p>
                  {blueprint.systemOverview}
                </div>

                {/* Security Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Security:
                  </span>
                  {blueprint.securityProtocols?.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Microservices Spec Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Microservice Catalog & Endpoints ({blueprint.microservices.length})
                  </h4>
                  <span className="text-xs text-slate-400">Click service card to inspect endpoints</span>
                </div>

                {blueprint.microservices.map((svc: Microservice) => {
                  const isExpanded = expandedServiceId === svc.id;
                  return (
                    <div
                      key={svc.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isExpanded
                          ? 'bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Service Header Row */}
                      <button
                        type="button"
                        onClick={() => setExpandedServiceId(isExpanded ? null : svc.id)}
                        className="w-full p-4 flex items-center justify-between text-left gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-cyan-400 font-mono text-xs font-bold">
                            :{svc.port}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-white text-sm truncate">{svc.name}</h5>
                              <span className="text-[11px] font-mono text-slate-400">({svc.id})</span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{svc.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60">
                            {svc.techStack}
                          </span>
                          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                            {svc.endpoints?.length || 0} APIs
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Details: Endpoints & Models */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-950/50 space-y-4 text-xs">
                          {/* Endpoints Table */}
                          <div>
                            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                              API Endpoints
                            </span>
                            <div className="space-y-1.5 font-mono">
                              {svc.endpoints?.map((ep, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start sm:items-center justify-between gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                                        ep.method === 'GET'
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          : ep.method === 'POST'
                                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                          : ep.method === 'PATCH' || ep.method === 'PUT'
                                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      }`}
                                    >
                                      {ep.method}
                                    </span>
                                    <span className="text-slate-200 font-semibold truncate">{ep.path}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-slate-400 hidden md:inline truncate max-w-xs">
                                      {ep.description}
                                    </span>
                                    {ep.authRequired !== false && (
                                      <span
                                        title="JWT Bearer Required"
                                        className="text-amber-400 p-0.5 bg-amber-400/10 rounded"
                                      >
                                        <Lock className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Data Models & Dependencies Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                                Pydantic Data Models
                              </span>
                              <div className="space-y-1 font-mono text-[11px]">
                                {svc.dataModels?.map((model, i) => (
                                  <div key={i} className="text-slate-300">
                                    <span className="text-cyan-400 font-medium">{model.name}</span>
                                    <div className="text-[10px] text-slate-400 pl-2">
                                      {model.fields?.join(' • ')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                                Events & Dependencies
                              </span>
                              <div className="space-y-2 text-[11px] font-mono">
                                <div>
                                  <span className="text-slate-400 text-[10px]">Depends On: </span>
                                  <span className="text-slate-200">{svc.dependencies?.join(', ') || 'None'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px]">Events: </span>
                                  <span className="text-emerald-400">{svc.events?.join(', ') || 'None'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA to Step 2 */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  onClick={onProceedToAgents}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Dispatch Blueprint to 4 Multi-Agent Workers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
                <Layers className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">No Blueprint Synthesized Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                Enter your product goals on the left and click "Generate Microservice Specs" to formulate your
                distributed architecture.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
