/**
 * MCP Type Definitions
 * TypeScript types for Model Context Protocol components
 */

// ============================================================================
// Core Component Types
// ============================================================================

export type ComponentType = 'source-module' | 'tool' | 'dataset' | 'composite';

export interface MCPComponent {
  id: string;
  type: ComponentType;
  name: string;
  description?: string;
  apiStructure: APIStructure;
  datasetInference?: DatasetInference;
  toolCalling?: ToolCalling;
  semanticContext: SemanticContext;
  capabilities?: Capability[];
  metadata?: ComponentMetadata;
}

export interface ComponentMetadata {
  version: string;
  author?: string;
  created?: string;
  updated?: string;
}

// ============================================================================
// API Structure Types
// ============================================================================

export type Protocol = 'jsonrpc' | 'rest' | 'graphql' | 'grpc';
export type AuthenticationType = 'none' | 'apiKey' | 'bearer' | 'oauth2' | 'basic';

export interface APIStructure {
  protocol: Protocol;
  baseUrl?: string;
  endpoints: Endpoint[];
  authentication?: Authentication;
}

export interface Endpoint {
  name: string;
  method: string;
  path?: string;
  parameters?: Parameter[];
  returns?: ReturnType;
  semanticTags?: string[];
}

export interface Parameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  semanticRole?: string;
}

export interface ReturnType {
  type?: string;
  schema?: Record<string, any>;
  semanticType?: string;
}

export interface Authentication {
  type: AuthenticationType;
  configuration?: Record<string, any>;
}

// ============================================================================
// Dataset Inference Types
// ============================================================================

export type InferenceType = 'semantic-matching' | 'keyword-based' | 'intent-based' | 'hybrid';
export type DatasetType = 'structured' | 'unstructured' | 'semi-structured' | 'vector';

export interface DatasetInference {
  inferenceType?: InferenceType;
  datasets?: Dataset[];
  inferenceRules?: InferenceRule[];
}

export interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  schema?: Record<string, any>;
  semanticTags?: string[];
  contentDomain?: string;
  accessMethod?: AccessMethod;
}

export interface AccessMethod {
  type?: string;
  endpoint?: string;
}

// ============================================================================
// Inference Rule Types
// ============================================================================

export type ConditionType =
  | 'intent-match'
  | 'keyword-match'
  | 'semantic-similarity'
  | 'pattern-match'
  | 'composite';

export type ActionType =
  | 'select-dataset'
  | 'invoke-tool'
  | 'transform'
  | 'route'
  | 'composite';

export interface InferenceRule {
  id?: string;
  name?: string;
  condition: Condition;
  action: Action;
  priority?: number;
  confidenceThreshold?: number;
}

export interface Condition {
  type?: ConditionType;
  parameters?: Record<string, any>;
  expression?: string;
}

export interface Action {
  type: ActionType;
  target?: string;
  parameters?: Record<string, any>;
}

// ============================================================================
// Tool Calling Types
// ============================================================================

export type InvocationStrategy = 'direct' | 'semantic-routing' | 'pipeline' | 'parallel';

export interface ToolCalling {
  tools?: Tool[];
  invocationStrategy?: InvocationStrategy;
  toolSelectionRules?: InferenceRule[];
}

export interface Tool {
  id: string;
  name: string;
  description?: string;
  function: string;
  parameters?: Parameter[];
  semanticPurpose?: string;
  requiredContext?: string[];
}

// ============================================================================
// Semantic Context Types
// ============================================================================

export interface SemanticContext {
  domain?: string;
  intents?: string[];
  keywords?: string[];
  concepts?: string[];
  embedding?: Embedding;
}

export interface Embedding {
  model?: string;
  vector?: number[];
}

// ============================================================================
// Capability Types
// ============================================================================

export type CapabilityType =
  | 'query'
  | 'transform'
  | 'generate'
  | 'analyze'
  | 'store'
  | 'retrieve';

export interface Capability {
  name: string;
  type: CapabilityType;
  description?: string;
  semanticSignature?: string;
}

// ============================================================================
// Semantic Inference Engine Types
// ============================================================================

export interface SemanticInferenceEngine {
  id: string;
  name: string;
  version: string;
  components: MCPComponent[];
  inferenceStrategy: InferenceStrategy;
  configuration?: InferenceConfiguration;
}

export interface InferenceStrategy {
  type: 'rule-based' | 'ml-based' | 'hybrid';
  matchingAlgorithm: MatchingAlgorithm;
  fallbackBehavior?: FallbackBehavior;
}

export interface MatchingAlgorithm {
  type: 'exact' | 'fuzzy' | 'semantic-embedding' | 'combined';
  parameters?: {
    similarityThreshold?: number;
    embeddingModel?: string;
    maxResults?: number;
  };
}

export interface FallbackBehavior {
  strategy: 'default' | 'prompt-user' | 'reject';
  defaultComponent?: string;
}

export interface InferenceConfiguration {
  enableCaching?: boolean;
  cacheTTL?: number;
  enableLogging?: boolean;
  maxInferenceDepth?: number;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface InferenceRequest {
  intent: string;
  context?: Record<string, any>;
  parameters?: Record<string, any>;
  requiredCapabilities?: CapabilityType[];
  preferredDomain?: string;
}

export interface InferenceResponse {
  selectedComponent: MCPComponent;
  confidence: number;
  reasoning?: string;
  alternativeComponents?: Array<{
    component: MCPComponent;
    confidence: number;
  }>;
  dataset?: Dataset;
  toolChain?: Tool[];
}

// ============================================================================
// Utility Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  code?: string;
}

export interface SemanticMatch {
  component: MCPComponent;
  score: number;
  matchedIntents: string[];
  matchedKeywords: string[];
  reasoning: string;
}
