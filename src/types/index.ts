export type AgentId = 'architecture' | 'backend' | 'frontend' | 'qa';
export type AgentStatus = 'idle' | 'thinking' | 'generating' | 'completed' | 'paused' | 'error';

export interface ServiceEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired?: boolean;
}

export interface DataModel {
  name: string;
  fields: string[];
}

export interface Microservice {
  id: string;
  name: string;
  role: string;
  techStack: string;
  port: number;
  endpoints: ServiceEndpoint[];
  dataModels: DataModel[];
  dependencies: string[];
  events: string[];
}

export interface Blueprint {
  projectName: string;
  tagline: string;
  productGoals: string;
  architectureStyle: string;
  targetScale: string;
  databasePreference: string;
  microservices: Microservice[];
  systemOverview: string;
  securityProtocols: string[];
  createdAt: string;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'agent';
  message: string;
}

export interface AgentWorker {
  id: AgentId;
  name: string;
  title: string;
  role: string;
  status: AgentStatus;
  enabled: boolean;
  turboMode: boolean;
  progress: number;
  tokensProcessed: number;
  speed: number;
  currentTask: string;
  logs: AgentLogEntry[];
  artifactsGenerated: string[];
}

export interface GeneratedFile {
  path: string;
  name: string;
  language: 'python' | 'typescript' | 'json' | 'dockerfile' | 'markdown' | 'css' | 'plaintext';
  content: string;
  agentId: AgentId;
  size: string;
  status: 'generated' | 'reviewed' | 'warning';
  qaScore?: number;
}

export interface QACheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed';
  description: string;
  details?: string;
}

export interface QAEvaluation {
  overallScore: number;
  categories: {
    architecture: number;
    security: number;
    testCoverage: number;
    performance: number;
    codeClarity: number;
  };
  auditSummary: string;
  checks: QACheck[];
  testSuiteOutput: string;
}
