export interface BlueprintPreset {
  id: string;
  name: string;
  tagline: string;
  goals: string;
  architectureStyle: string;
  targetScale: string;
  databasePreference: string;
}

export const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    id: 'fintech',
    name: 'AetherPay Financial Engine',
    tagline: 'High-throughput payment orchestration and fraud detection mesh',
    goals: 'Build a secure, PCI-DSS compliant financial engine that processes payments, validates cardholder identity, detects anomalies with ML scoring in sub-15ms, and dispatches webhooks to merchant endpoints.',
    architectureStyle: 'Event-Driven Asynchronous Microservices',
    targetScale: '50,000 tx/sec with 99.999% SLA availability',
    databasePreference: 'PostgreSQL (ACID Ledger) + Redis (Idempotency Cache)',
  },
  {
    id: 'healthcare',
    name: 'PulseSphere Health Telemetry',
    tagline: 'Real-time patient vital sign ingestion and alert coordinator',
    goals: 'Ingest continuous telemetry from connected medical IoT devices, trigger immediate physician escalation when critical vital thresholds are breached, and sync HIPAA-compliant diagnostic logs.',
    architectureStyle: 'CQRS & Event Sourcing Microservices',
    targetScale: '100,000 devices streaming at 10Hz frequency',
    databasePreference: 'TimescaleDB (Time-series) + PostgreSQL (EHR Records)',
  },
  {
    id: 'canvas',
    name: 'CollabMatrix Real-Time Workspace',
    tagline: 'Multi-tenant multiplayer document and visual whiteboard engine',
    goals: 'Power low-latency collaborative document editing with conflict-free replicated data types (CRDTs), presence indicators, vector graphics sync, and export rendering workers.',
    architectureStyle: 'Distributed WebSocket & Actor Mesh',
    targetScale: '10,000 simultaneous active collaborative rooms',
    databasePreference: 'Redis Pub/Sub + MongoDB (Document Store) + S3 (Assets)',
  },
  {
    id: 'ecommerce',
    name: 'OmniTrade Global Logistics',
    tagline: 'Multi-vendor marketplace inventory & route optimization hub',
    goals: 'Coordinate global inventory levels across regional fulfillment centers, calculate dynamic parcel routing, enforce flash-sale concurrency safety, and trigger carrier API dispatches.',
    architectureStyle: 'Saga Pattern & Distributed Microservices',
    targetScale: '20,000 checkout orders/min during peak sales',
    databasePreference: 'PostgreSQL + Kafka Event Mesh + Redis Cluster',
  },
];
