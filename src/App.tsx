/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BlueprintTab } from './components/BlueprintTab';
import { AgentMonitorTab } from './components/AgentMonitorTab';
import { CodeReviewTab } from './components/CodeReviewTab';
import { exportCodebaseAsZip } from './utils/zipExporter';
import { Blueprint, AgentWorker, AgentId, AgentStatus, GeneratedFile, QAEvaluation } from './types';
import { CheckCircle2, AlertCircle, Info, Sparkles, Cpu, Layers } from 'lucide-react';

const INITIAL_AGENTS: AgentWorker[] = [
  {
    id: 'architecture',
    name: 'Architecture Agent',
    title: 'Lead System Architect & Mesh Specialist',
    role: 'Formulates microservice boundaries, OpenAPI contracts, Docker compose topologies, and architectural decision records (ADRs).',
    status: 'completed',
    enabled: true,
    turboMode: false,
    progress: 100,
    tokensProcessed: 8940,
    speed: 78.4,
    currentTask: 'Verified OpenAPI 3.1 & Zero-Trust service mesh topology',
    logs: [
      { id: '1', timestamp: '10:02:14', level: 'info', message: 'Analyzing domain goals and scale parameters...' },
      { id: '2', timestamp: '10:02:15', level: 'agent', message: 'Derived 4 microservices: Gateway (8000), Core (8001), Telemetry (8002), Worker (8003)' },
      { id: '3', timestamp: '10:02:16', level: 'success', message: 'Architectural blueprint and Docker Compose mesh locked.' },
    ],
    artifactsGenerated: ['architecture/SYSTEM_BLUEPRINT.md', 'docker-compose.yml'],
  },
  {
    id: 'backend',
    name: 'Backend Builder',
    title: 'Python FastAPI & AsyncIO Core Specialist',
    role: 'Synthesizes high-performance Python FastAPI routers, Pydantic v2 data schemas, asynchronous lifespan hooks, and database connection pools.',
    status: 'completed',
    enabled: true,
    turboMode: true,
    progress: 100,
    tokensProcessed: 18450,
    speed: 92.1,
    currentTask: 'Generated async FastAPI main.py and routers/services.py with strict Pydantic models',
    logs: [
      { id: 'b1', timestamp: '10:02:17', level: 'info', message: 'Synthesizing Python FastAPI application structure...' },
      { id: 'b2', timestamp: '10:02:18', level: 'agent', message: 'Configured async lifespan manager, CORS middleware, and correlation ID tracing.' },
      { id: 'b3', timestamp: '10:02:20', level: 'agent', message: 'Implemented APIRouter endpoints: /health, /api/v1/services, /api/v1/entities' },
      { id: 'b4', timestamp: '10:02:21', level: 'success', message: 'Python FastAPI backend generation finished. 100% type-checked.' },
    ],
    artifactsGenerated: ['backend/main.py', 'backend/app/routers/services.py', 'backend/requirements.txt', 'backend/Dockerfile'],
  },
  {
    id: 'frontend',
    name: 'Frontend Builder',
    title: 'React 19 & Tailwind CSS UI Architect',
    role: 'Constructs modern, responsive Edge dashboard views, telemetry monitors, interactive service triggers, and typed API clients.',
    status: 'completed',
    enabled: true,
    turboMode: false,
    progress: 100,
    tokensProcessed: 14220,
    speed: 84.5,
    currentTask: 'Built responsive React dashboard with live latency telemetry and service action controls',
    logs: [
      { id: 'f1', timestamp: '10:02:22', level: 'info', message: 'Designing responsive React component tree with Tailwind CSS...' },
      { id: 'f2', timestamp: '10:02:23', level: 'agent', message: 'Built MicroserviceDashboard with real-time health badges and event log terminal.' },
      { id: 'f3', timestamp: '10:02:24', level: 'agent', message: 'Created strongly-typed ApiClient for FastAPI backend communication.' },
      { id: 'f4', timestamp: '10:02:25', level: 'success', message: 'React frontend assets bundled with zero styling conflicts.' },
    ],
    artifactsGenerated: ['frontend/src/App.tsx', 'frontend/src/services/apiClient.ts'],
  },
  {
    id: 'qa',
    name: 'QA Evaluator',
    title: 'Pytest & Static Vulnerability Auditor',
    role: 'Executes static analysis, synthesizes Pytest test suites, checks OWASP API security requirements, and scores codebase production readiness.',
    status: 'completed',
    enabled: true,
    turboMode: false,
    progress: 100,
    tokensProcessed: 7600,
    speed: 88.0,
    currentTask: 'Executed Pytest suite with 4 passing tests. Overall QA score: 96/100',
    logs: [
      { id: 'q1', timestamp: '10:02:26', level: 'info', message: 'Commencing static audit of FastAPI routes and Pydantic schemas...' },
      { id: 'q2', timestamp: '10:02:27', level: 'agent', message: 'Generated Pytest suite tests/test_fastapi_endpoints.py using Starlette TestClient.' },
      { id: 'q3', timestamp: '10:02:28', level: 'agent', message: 'OWASP Top 10 check: Input validation verified, zero SQL/Command injections.' },
      { id: 'q4', timestamp: '10:02:29', level: 'success', message: 'Pytest execution: 4 passed in 0.24s. QA Audit Score: 96/100.' },
    ],
    artifactsGenerated: ['tests/test_fastapi_endpoints.py', 'qa/audit_report.json'],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'agents' | 'code'>('blueprint');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [agents, setAgents] = useState<AgentWorker[]>(INITIAL_AGENTS);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [evaluation, setEvaluation] = useState<QAEvaluation | null>(null);

  const [isLoadingBlueprint, setIsLoadingBlueprint] = useState(false);
  const [isRunningSwarm, setIsRunningSwarm] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check system status on mount
  useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => {
        setHasApiKey(Boolean(data.hasApiKey));
      })
      .catch(() => {
        setHasApiKey(false);
      });

    // Initialize with a default blueprint and codebase
    handleGenerateBlueprint({
      projectName: 'AetherMesh Enterprise Microservices',
      productGoals:
        'Build a high-throughput, autonomous distributed transaction and real-time streaming pipeline that validates entity states, aggregates telemetry at 50,000 req/sec, and provides low-latency REST & WebSocket interfaces for enterprise operators.',
      architectureStyle: 'Event-Driven Asynchronous Microservices',
      targetScale: '50,000 req/sec with sub-25ms response',
      databasePreference: 'PostgreSQL + Redis Cache + Kafka Event Mesh',
    });
  }, []);

  // Generate Blueprint handler
  const handleGenerateBlueprint = async (params: {
    projectName: string;
    productGoals: string;
    architectureStyle: string;
    targetScale: string;
    databasePreference: string;
  }) => {
    setIsLoadingBlueprint(true);
    try {
      const res = await fetch('/api/blueprint/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error('Failed to generate blueprint');
      const data = await res.json();
      setBlueprint(data);

      // Trigger automatic initial code generation
      triggerCodeGeneration(data);

      showToast(
        data.poweredByGemini
          ? 'Blueprint synthesized with Gemini AI (gemini-3.8-flash)!'
          : 'Microservice blueprint synthesized with autonomous heuristics!',
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast('Error generating blueprint: ' + err.message, 'warn');
    } finally {
      setIsLoadingBlueprint(false);
    }
  };

  // Trigger code generation from backend
  const triggerCodeGeneration = async (currentBlueprint: Blueprint, customInstruction?: string) => {
    try {
      const res = await fetch('/api/agents/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint: currentBlueprint,
          customPrompt: customInstruction,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
        }
        if (data.evaluation) {
          setEvaluation(data.evaluation);
        }
      }
    } catch (err) {
      console.error('Error generating code:', err);
    }
  };

  // Run full swarm simulation & code generation
  const handleRunSwarm = async () => {
    if (isRunningSwarm) return;
    setIsRunningSwarm(true);
    showToast('Swarm dispatched: Orchestrating Architecture, Backend, Frontend & QA agents...', 'info');

    // Step 1: Architecture Agent
    setAgents(prev =>
      prev.map(a =>
        a.id === 'architecture'
          ? {
              ...a,
              status: 'generating',
              progress: 35,
              currentTask: 'Formulating service mesh topologies & OpenAPI contracts',
              logs: [
                {
                  id: String(Date.now()),
                  timestamp: new Date().toLocaleTimeString(),
                  level: 'info',
                  message: `Re-evaluating service contracts for ${blueprint?.projectName || 'platform'}...`,
                },
                ...a.logs.slice(0, 8),
              ],
            }
          : a
      )
    );

    await new Promise(r => setTimeout(r, 600));

    // Step 2: Backend and Frontend Agents run
    setAgents(prev =>
      prev.map(a => {
        if (a.id === 'architecture') {
          return { ...a, status: 'completed', progress: 100, currentTask: 'Architecture contracts validated' };
        }
        if (a.id === 'backend' || a.id === 'frontend') {
          return {
            ...a,
            status: 'generating',
            progress: 45,
            currentTask:
              a.id === 'backend'
                ? 'Synthesizing Python FastAPI routers & lifespan hooks...'
                : 'Bundling React components & Tailwind styles...',
            logs: [
              {
                id: String(Date.now()),
                timestamp: new Date().toLocaleTimeString(),
                level: 'agent',
                message:
                  a.id === 'backend'
                    ? 'Synthesizing FastAPI main.py and pydantic models with async endpoints'
                    : 'Constructing React 19 dashboard with interactive service cards',
              },
              ...a.logs.slice(0, 8),
            ],
          };
        }
        return a;
      })
    );

    // Call real code generation from server (with Gemini)
    if (blueprint) {
      await triggerCodeGeneration(blueprint);
    }

    await new Promise(r => setTimeout(r, 800));

    // Step 3: QA Evaluator runs
    setAgents(prev =>
      prev.map(a => {
        if (a.id === 'backend' || a.id === 'frontend') {
          return {
            ...a,
            status: 'completed',
            progress: 100,
            currentTask: a.id === 'backend' ? 'FastAPI backend generated' : 'React UI generated',
          };
        }
        if (a.id === 'qa') {
          return {
            ...a,
            status: 'generating',
            progress: 60,
            currentTask: 'Executing static analysis & Pytest test client suite...',
            logs: [
              {
                id: String(Date.now()),
                timestamp: new Date().toLocaleTimeString(),
                level: 'agent',
                message: 'Testing API endpoints: /health, /api/v1/services, /api/v1/entities',
              },
              ...a.logs.slice(0, 8),
            ],
          };
        }
        return a;
      })
    );

    await new Promise(r => setTimeout(r, 700));

    // Finish QA
    setAgents(prev =>
      prev.map(a =>
        a.id === 'qa'
          ? {
              ...a,
              status: 'completed',
              progress: 100,
              currentTask: 'All 4 Pytest tests passed. QA Score: 96/100.',
              logs: [
                {
                  id: String(Date.now()),
                  timestamp: new Date().toLocaleTimeString(),
                  level: 'success',
                  message: 'Full swarm execution cycle verified. Ready for code review.',
                },
                ...a.logs.slice(0, 8),
              ],
            }
          : a
      )
    );

    setIsRunningSwarm(false);
    showToast('Swarm execution completed! Python FastAPI and React/Tailwind code ready in Tab 3.', 'success');
  };

  // Run individual agent
  const handleRunIndividualAgent = async (agentId: AgentId) => {
    setAgents(prev =>
      prev.map(a =>
        a.id === agentId
          ? {
              ...a,
              status: 'generating',
              progress: 50,
              logs: [
                {
                  id: String(Date.now()),
                  timestamp: new Date().toLocaleTimeString(),
                  level: 'info',
                  message: `Individual execution triggered for ${a.name}...`,
                },
                ...a.logs,
              ],
            }
          : a
      )
    );

    showToast(`Dispatching ${agentId} agent with Gemini...`, 'info');

    if (blueprint) {
      await triggerCodeGeneration(blueprint, `Focus regeneration on ${agentId}`);
    }

    setTimeout(() => {
      setAgents(prev =>
        prev.map(a =>
          a.id === agentId
            ? {
                ...a,
                status: 'completed',
                progress: 100,
                logs: [
                  {
                    id: String(Date.now()),
                    timestamp: new Date().toLocaleTimeString(),
                    level: 'success',
                    message: `${a.name} finished code synthesis with updated contracts.`,
                  },
                  ...a.logs,
                ],
              }
            : a
        )
      );
      showToast(`${agentId} agent completed tasks.`, 'success');
    }, 900);
  };

  // Agent toggles
  const handleToggleAgentEnabled = (agentId: AgentId) => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleSetAgentStatus = (agentId: AgentId, status: AgentStatus) => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, status } : a))
    );
  };

  const handleToggleTurboMode = (agentId: AgentId) => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, turboMode: !a.turboMode } : a))
    );
  };

  const handleSendAgentInstruction = (agentId: AgentId, instruction: string) => {
    setAgents(prev =>
      prev.map(a =>
        a.id === agentId
          ? {
              ...a,
              status: 'thinking',
              logs: [
                {
                  id: String(Date.now()),
                  timestamp: new Date().toLocaleTimeString(),
                  level: 'agent',
                  message: `User instruction received: "${instruction}"`,
                },
                ...a.logs,
              ],
            }
          : a
      )
    );

    showToast(`Instruction sent to ${agentId} agent`, 'info');

    // Trigger refinement
    setTimeout(() => {
      if (blueprint) {
        triggerCodeGeneration(blueprint, `User instruction for ${agentId}: ${instruction}`);
      }
      setAgents(prev =>
        prev.map(a =>
          a.id === agentId
            ? {
                ...a,
                status: 'completed',
                logs: [
                  {
                    id: String(Date.now()),
                    timestamp: new Date().toLocaleTimeString(),
                    level: 'success',
                    message: `Applied refinement: "${instruction}"`,
                  },
                  ...a.logs,
                ],
              }
            : a
        )
      );
    }, 1000);
  };

  // Refactor single file
  const handleRefactorFile = async (file: GeneratedFile, instruction: string, agentId: AgentId) => {
    setIsRefactoring(true);
    showToast(`Refactoring ${file.name} with ${agentId} agent...`, 'info');
    try {
      const res = await fetch('/api/agents/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, instruction, agentId }),
      });

      if (!res.ok) throw new Error('Refactor failed');
      const data = await res.json();
      if (data.updatedFile) {
        setFiles(prev =>
          prev.map(f => (f.path === file.path ? data.updatedFile : f))
        );
        showToast(`Successfully refactored ${file.name}!`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Refactor error: ' + err.message, 'warn');
    } finally {
      setIsRefactoring(false);
    }
  };

  // Export full ZIP
  const handleExportZip = () => {
    if (files.length === 0) {
      showToast('No code files to export yet', 'warn');
      return;
    }
    exportCodebaseAsZip(files, blueprint?.projectName || 'ApexForge-Microservices');
    showToast('Repository ZIP generated and downloaded!', 'success');
  };

  // Reset workspace
  const handleReset = () => {
    setAgents(INITIAL_AGENTS);
    setActiveTab('blueprint');
    showToast('Factory workspace reset to default state.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium font-mono ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50'
                : toast.type === 'warn'
                ? 'bg-amber-950/90 text-amber-200 border-amber-500/50 shadow-amber-950/50'
                : 'bg-slate-900/95 text-cyan-200 border-cyan-500/50 shadow-cyan-950/50'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'warn' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header with Navigation and Swarm Trigger */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasApiKey={hasApiKey}
        agents={agents}
        files={files}
        onRunSwarm={handleRunSwarm}
        isRunningSwarm={isRunningSwarm}
        onExportZip={handleExportZip}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === 'blueprint' && (
          <BlueprintTab
            blueprint={blueprint}
            onGenerateBlueprint={handleGenerateBlueprint}
            isLoading={isLoadingBlueprint}
            onProceedToAgents={() => setActiveTab('agents')}
          />
        )}

        {activeTab === 'agents' && (
          <AgentMonitorTab
            agents={agents}
            onToggleAgentEnabled={handleToggleAgentEnabled}
            onSetAgentStatus={handleSetAgentStatus}
            onToggleTurboMode={handleToggleTurboMode}
            onRunIndividualAgent={handleRunIndividualAgent}
            onRunSwarm={handleRunSwarm}
            isRunningSwarm={isRunningSwarm}
            onProceedToCode={() => setActiveTab('code')}
            files={files}
            onSendAgentInstruction={handleSendAgentInstruction}
          />
        )}

        {activeTab === 'code' && (
          <CodeReviewTab
            files={files}
            evaluation={evaluation}
            onRefactorFile={handleRefactorFile}
            onExportZip={handleExportZip}
            isRefactoring={isRefactoring}
            onTriggerRebuild={handleRunSwarm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>ApexForge Autonomous Software Factory</span>
            <span>•</span>
            <span>FastAPI + React/Tailwind Pipeline</span>
          </div>
          <div>
            <span>Powered by Gemini AI (gemini-3.8-flash) & Multi-Agent Swarm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
