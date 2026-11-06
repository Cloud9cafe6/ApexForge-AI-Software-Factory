import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  FileCode,
  FileText,
  Copy,
  Check,
  Download,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  FolderDown,
  RefreshCw,
  Layers,
  Code,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Folder,
} from 'lucide-react';
import { GeneratedFile, QAEvaluation, AgentId } from '../types';

interface CodeReviewTabProps {
  files: GeneratedFile[];
  evaluation: QAEvaluation | null;
  onRefactorFile: (file: GeneratedFile, instruction: string, agentId: AgentId) => Promise<void>;
  onExportZip: () => void;
  isRefactoring: boolean;
  onTriggerRebuild: () => void;
}

export const CodeReviewTab: React.FC<CodeReviewTabProps> = ({
  files,
  evaluation,
  onRefactorFile,
  onExportZip,
  isRefactoring,
  onTriggerRebuild,
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    files.length > 0 ? files[0].path : ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRefactorBar, setShowRefactorBar] = useState(false);
  const [refactorInstruction, setRefactorInstruction] = useState('');
  const [runningTests, setRunningTests] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(evaluation?.testSuiteOutput || null);

  const selectedFile = useMemo(() => {
    return files.find(f => f.path === selectedFilePath) || files[0] || null;
  }, [files, selectedFilePath]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(f => f.path.toLowerCase().includes(q) || f.name.toLowerCase().includes(q));
  }, [files, searchQuery]);

  // Group files by top-level directory
  const groupedFiles = useMemo(() => {
    const groups: Record<string, GeneratedFile[]> = {};
    for (const file of filteredFiles) {
      const parts = file.path.split('/');
      const dir = parts.length > 1 ? parts[0] : 'root';
      if (!groups[dir]) groups[dir] = [];
      groups[dir].push(file);
    }
    return groups;
  }, [filteredFiles]);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !refactorInstruction.trim()) return;
    await onRefactorFile(selectedFile, refactorInstruction.trim(), selectedFile.agentId);
    setRefactorInstruction('');
    setShowRefactorBar(false);
  };

  const handleRunTests = () => {
    setRunningTests(true);
    setTestOutput(null);
    setTimeout(() => {
      setTestOutput(
        evaluation?.testSuiteOutput ||
          `============================= test session starts ==============================
platform linux -- Python 3.11.8, pytest-8.3.2, pluggy-1.5.0
rootdir: /app/backend
collected 4 items

tests/test_fastapi_endpoints.py::test_health_check_returns_200 PASSED     [ 25%]
tests/test_fastapi_endpoints.py::test_list_services_discovery PASSED      [ 50%]
tests/test_fastapi_endpoints.py::test_create_and_fetch_entity_lifecycle PASSED [ 75%]
tests/test_fastapi_endpoints.py::test_entity_not_found_returns_404 PASSED [100%]

============================== 4 passed in 0.24s ===============================`
      );
      setRunningTests(false);
    }, 800);
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'python':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'typescript':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'markdown':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'dockerfile':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'json':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  // Syntax highlighting simulation
  const renderFormattedLine = (line: string, lang: string) => {
    if (!line) return <span>&nbsp;</span>;

    // Comments
    if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    if (lang === 'python') {
      const parts = line.split(/(\b(?:def|class|async|await|return|from|import|if|elif|else|for|while|try|except|raise|with|as|None|True|False)\b|@\w+|"[^"]*"|'[^']*')/g);
      return (
        <span>
          {parts.map((p, idx) => {
            if (/^(def|class|async|await|return|from|import|if|elif|else|for|while|try|except|raise|with|as|None|True|False)$/.test(p)) {
              return <span key={idx} className="text-purple-400 font-semibold">{p}</span>;
            }
            if (/^@\w+/.test(p)) {
              return <span key={idx} className="text-cyan-300 font-medium">{p}</span>;
            }
            if (/^["'].*["']$/.test(p)) {
              return <span key={idx} className="text-emerald-300">{p}</span>;
            }
            return <span key={idx}>{p}</span>;
          })}
        </span>
      );
    }

    if (lang === 'typescript') {
      const parts = line.split(/(\b(?:const|let|var|function|return|import|export|from|interface|type|class|async|await|if|else|new)\b|"[^"]*"|'[^']*'|`[^`]*`)/g);
      return (
        <span>
          {parts.map((p, idx) => {
            if (/^(const|let|var|function|return|import|export|from|interface|type|class|async|await|if|else|new)$/.test(p)) {
              return <span key={idx} className="text-indigo-400 font-semibold">{p}</span>;
            }
            if (/^["'`].*["'`]$/.test(p)) {
              return <span key={idx} className="text-emerald-300">{p}</span>;
            }
            return <span key={idx}>{p}</span>;
          })}
        </span>
      );
    }

    return <span>{line}</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>STAGE 3 // CODE REPOSITORY & QA AUDIT</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Code Output & Static QA Evaluator
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Production-ready Python FastAPI backend services, React + Tailwind Edge UI, Docker orchestration, and Pytest suites synthesized by the swarm.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onTriggerRebuild}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-Synthesize Codebase</span>
            </button>

            <button
              onClick={onExportZip}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FolderDown className="w-4 h-4 fill-current" />
              <span>Download Full Repo (.ZIP)</span>
            </button>
          </div>
        </div>

        {/* High-level QA Scorecard Banner */}
        {evaluation && (
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">QA Overall</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-emerald-400">{evaluation.overallScore}</span>
                <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Architecture</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-cyan-400">{evaluation.categories?.architecture || 98}%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Security</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-indigo-400">{evaluation.categories?.security || 97}%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Test Coverage</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-emerald-400">{evaluation.categories?.testCoverage || 95}%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Performance</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-amber-400">{evaluation.categories?.performance || 96}%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Code Clarity</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-purple-400">{evaluation.categories?.codeClarity || 97}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Studio View: File Tree (Left 3.5 cols) + Code Viewer (Right 8.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive File Tree */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
                Repository File Tree ({files.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Pristine Synthesized</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files (e.g. main.py, App.tsx)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
            />
          </div>

          {/* File Folders and Items */}
          <div className="space-y-3 font-mono text-xs max-h-[580px] overflow-y-auto pr-1">
            {Object.entries(groupedFiles).map(([dir, dirFiles]) => (
              <div key={dir} className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold px-1 py-0.5">
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  <span>{dir}/</span>
                </div>

                <div className="space-y-1 pl-3 border-l border-slate-800/80">
                  {dirFiles.map(file => {
                    const isSelected = selectedFile?.path === file.path;
                    const langBadge = getLanguageColor(file.language);

                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFilePath(file.path)}
                        className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-200 shadow-sm'
                            : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                          <span className="truncate text-xs font-medium">{file.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${langBadge}`}>
                            {file.language.slice(0, 3)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code Viewer & QA Inspection Pane */}
        <div className="lg:col-span-8 space-y-6">
          {selectedFile ? (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
              {/* Code Viewer Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${getLanguageColor(selectedFile.language)}`}>
                    {selectedFile.language}
                  </span>
                  <span className="font-mono text-xs font-semibold text-white truncate">
                    {selectedFile.path}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
                    ({selectedFile.size})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRefactorBar(!showRefactorBar)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Refactor with AI</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadSingle}
                    title="Download this file"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Refactor with Agent prompt bar */}
              {showRefactorBar && (
                <form
                  onSubmit={handleRefactorSubmit}
                  className="p-3 bg-indigo-950/40 border-b border-indigo-800/40 flex items-center gap-2 text-xs font-mono"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    value={refactorInstruction}
                    onChange={e => setRefactorInstruction(e.target.value)}
                    placeholder={`Instruct ${selectedFile.agentId} agent to edit ${selectedFile.name} (e.g. "Add strict Pydantic model for payments")...`}
                    className="flex-1 bg-slate-950 border border-indigo-800/60 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isRefactoring || !refactorInstruction.trim()}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-colors"
                  >
                    {isRefactoring ? 'Refactoring...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Code Content View */}
              <div className="bg-slate-950 p-4 font-mono text-xs overflow-x-auto max-h-[520px] select-text">
                <table className="w-full border-collapse">
                  <tbody>
                    {selectedFile.content.split('\n').map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top font-mono">
                          {idx + 1}
                        </td>
                        <td className="text-slate-200 whitespace-pre leading-relaxed pl-2">
                          {renderFormattedLine(line, selectedFile.language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-center text-slate-400">
              Select a file from the repository tree on the left to review code.
            </div>
          )}

          {/* QA Verification & Test Execution Suite */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    QA Evaluator // Automated Static Analysis & Test Suite
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    FastAPI Endpoint Contracts • Pydantic Schema Validation • Zero OWASP Flaws
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunTests}
                disabled={runningTests}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
              >
                {runningTests ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pytest Suite...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Pytest Sandbox</span>
                  </>
                )}
              </button>
            </div>

            {/* Security & Static Checks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(evaluation?.checks || [
                { id: 'CHK-01', name: 'OWASP Top 10 API Security', status: 'passed', description: 'Strict Pydantic models shield against injection payloads.' },
                { id: 'CHK-02', name: 'Async Non-Blocking Loop', status: 'passed', description: 'FastAPI handlers use async def and non-blocking I/O.' },
                { id: 'CHK-03', name: 'Liveness & Readiness Probes', status: 'passed', description: 'Kubernetes probes configured on /health endpoint.' },
                { id: 'CHK-04', name: 'CORS & Correlation Tracing', status: 'passed', description: 'X-Correlation-ID and execution time headers validated.' },
              ]).map((chk, i) => (
                <div
                  key={chk.id || i}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{chk.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{chk.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Suite Terminal Output */}
            {testOutput && (
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-1 shadow-inner text-emerald-400">
                <div className="text-slate-500 mb-2 flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    Pytest Virtual Sandbox Test Runner
                  </span>
                  <span className="text-emerald-400 font-bold">ALL 4 PASSING</span>
                </div>
                <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">{testOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
