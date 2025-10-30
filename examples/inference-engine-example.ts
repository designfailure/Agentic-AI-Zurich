/**
 * Semantic Inference Engine Implementation Example
 *
 * This example demonstrates how to implement a basic semantic inference engine
 * using the MCP ontology specification.
 */

import {
  MCPComponent,
  InferenceRequest,
  InferenceResponse,
  InferenceRule,
  SemanticMatch,
  Dataset
} from '../types/mcp-types';

/**
 * Simple implementation of a semantic inference engine
 */
class MCPSemanticInferenceEngine {
  private components: Map<string, MCPComponent>;
  private rules: InferenceRule[];
  private cache: Map<string, InferenceResponse>;

  constructor() {
    this.components = new Map();
    this.rules = [];
    this.cache = new Map();
  }

  /**
   * Register a new component
   */
  registerComponent(component: MCPComponent): void {
    this.components.set(component.id, component);
    console.log(`Registered component: ${component.id}`);
  }

  /**
   * Load inference rules
   */
  loadRules(rules: InferenceRule[]): void {
    this.rules = rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    console.log(`Loaded ${rules.length} inference rules`);
  }

  /**
   * Main inference method
   */
  async infer(request: InferenceRequest): Promise<InferenceResponse> {
    console.log(`\n=== Inference Request ===`);
    console.log(`Intent: ${request.intent}`);
    console.log(`Context:`, request.context);

    // Check cache
    const cacheKey = this.getCacheKey(request);
    if (this.cache.has(cacheKey)) {
      console.log('Cache hit!');
      return this.cache.get(cacheKey)!;
    }

    // Step 1: Extract semantic features
    const features = this.extractFeatures(request);
    console.log(`\nExtracted features:`, features);

    // Step 2: Find matching components
    const matches = await this.findMatchingComponents(features);
    console.log(`\nFound ${matches.length} matching components`);

    // Step 3: Select best component
    const bestMatch = this.selectBestComponent(matches);
    console.log(`\nSelected component: ${bestMatch.component.id}`);
    console.log(`Confidence: ${bestMatch.score}`);

    // Step 4: Select dataset if applicable
    const dataset = await this.selectDataset(bestMatch.component, request);
    if (dataset) {
      console.log(`Selected dataset: ${dataset.id}`);
    }

    // Step 5: Build response
    const response: InferenceResponse = {
      selectedComponent: bestMatch.component,
      confidence: bestMatch.score,
      reasoning: bestMatch.reasoning,
      alternativeComponents: matches.slice(1, 4).map(m => ({
        component: m.component,
        confidence: m.score
      })),
      dataset
    };

    // Cache the response
    this.cache.set(cacheKey, response);

    return response;
  }

  /**
   * Extract semantic features from request
   */
  private extractFeatures(request: InferenceRequest): SemanticFeatures {
    const intent = request.intent.toLowerCase();
    const keywords = this.extractKeywords(intent);
    const domain = request.preferredDomain || this.classifyDomain(keywords);

    return {
      intent,
      keywords,
      domain,
      context: request.context || {}
    };
  }

  /**
   * Extract keywords from intent string
   */
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (in production, use NLP library)
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  /**
   * Classify domain based on keywords
   */
  private classifyDomain(keywords: string[]): string {
    const domainKeywords: Record<string, string[]> = {
      'database': ['query', 'sql', 'database', 'table', 'select', 'data'],
      'nlp': ['text', 'analyze', 'sentiment', 'entities', 'language'],
      'analytics': ['report', 'analytics', 'metrics', 'dashboard'],
      'search': ['search', 'find', 'lookup', 'retrieve']
    };

    let maxScore = 0;
    let bestDomain = 'general';

    for (const [domain, domainWords] of Object.entries(domainKeywords)) {
      const score = keywords.filter(kw => domainWords.includes(kw)).length;
      if (score > maxScore) {
        maxScore = score;
        bestDomain = domain;
      }
    }

    return bestDomain;
  }

  /**
   * Find components that match the request
   */
  private async findMatchingComponents(features: SemanticFeatures): Promise<SemanticMatch[]> {
    const matches: SemanticMatch[] = [];

    for (const [id, component] of this.components) {
      const score = this.calculateMatchScore(component, features);

      if (score > 0.5) { // Minimum threshold
        matches.push({
          component,
          score,
          matchedIntents: this.getMatchedIntents(component, features),
          matchedKeywords: this.getMatchedKeywords(component, features),
          reasoning: this.generateReasoning(component, features, score)
        });
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate match score between component and features
   */
  private calculateMatchScore(component: MCPComponent, features: SemanticFeatures): number {
    const weights = {
      intent: 0.4,
      keyword: 0.3,
      domain: 0.3
    };

    // Intent matching
    const intentScore = this.calculateIntentScore(component, features.intent);

    // Keyword matching
    const keywordScore = this.calculateKeywordScore(component, features.keywords);

    // Domain matching
    const domainScore = component.semanticContext.domain === features.domain ? 1.0 : 0.3;

    const totalScore =
      intentScore * weights.intent +
      keywordScore * weights.keyword +
      domainScore * weights.domain;

    return Math.min(1.0, totalScore);
  }

  /**
   * Calculate intent matching score
   */
  private calculateIntentScore(component: MCPComponent, intent: string): number {
    const intents = component.semanticContext.intents || [];

    // Exact match
    if (intents.some(i => intent.includes(i) || i.includes(intent))) {
      return 1.0;
    }

    // Partial match
    const intentWords = intent.split(/[-_\s]+/);
    const matchCount = intents.filter(i =>
      intentWords.some(word => i.includes(word))
    ).length;

    return matchCount > 0 ? 0.7 : 0.0;
  }

  /**
   * Calculate keyword matching score
   */
  private calculateKeywordScore(component: MCPComponent, keywords: string[]): number {
    const componentKeywords = component.semanticContext.keywords || [];

    if (componentKeywords.length === 0 || keywords.length === 0) {
      return 0.5;
    }

    const matchCount = keywords.filter(kw =>
      componentKeywords.some(ck => ck.includes(kw) || kw.includes(ck))
    ).length;

    return matchCount / Math.max(keywords.length, componentKeywords.length);
  }

  /**
   * Get matched intents
   */
  private getMatchedIntents(component: MCPComponent, features: SemanticFeatures): string[] {
    return (component.semanticContext.intents || []).filter(i =>
      features.intent.includes(i) || i.includes(features.intent)
    );
  }

  /**
   * Get matched keywords
   */
  private getMatchedKeywords(component: MCPComponent, features: SemanticFeatures): string[] {
    const componentKeywords = component.semanticContext.keywords || [];
    return features.keywords.filter(kw =>
      componentKeywords.some(ck => ck.includes(kw) || kw.includes(ck))
    );
  }

  /**
   * Generate reasoning explanation
   */
  private generateReasoning(component: MCPComponent, features: SemanticFeatures, score: number): string {
    const reasons: string[] = [];

    if (component.semanticContext.domain === features.domain) {
      reasons.push(`domain match (${features.domain})`);
    }

    const matchedIntents = this.getMatchedIntents(component, features);
    if (matchedIntents.length > 0) {
      reasons.push(`intent match (${matchedIntents.join(', ')})`);
    }

    const matchedKeywords = this.getMatchedKeywords(component, features);
    if (matchedKeywords.length > 0) {
      reasons.push(`keyword overlap (${matchedKeywords.length} matches)`);
    }

    return reasons.length > 0
      ? `Component selected due to: ${reasons.join('; ')} (confidence: ${(score * 100).toFixed(1)}%)`
      : `Low confidence match (${(score * 100).toFixed(1)}%)`;
  }

  /**
   * Select best matching component
   */
  private selectBestComponent(matches: SemanticMatch[]): SemanticMatch {
    if (matches.length === 0) {
      throw new Error('No matching components found');
    }

    return matches[0];
  }

  /**
   * Select appropriate dataset based on inference rules
   */
  private async selectDataset(component: MCPComponent, request: InferenceRequest): Promise<Dataset | undefined> {
    if (!component.datasetInference || !component.datasetInference.datasets) {
      return undefined;
    }

    const rules = component.datasetInference.inferenceRules || [];
    const features = this.extractFeatures(request);

    // Apply rules in priority order
    for (const rule of rules.sort((a, b) => (b.priority || 0) - (a.priority || 0))) {
      if (this.evaluateRule(rule, features, request)) {
        const datasetId = rule.action.target;
        const dataset = component.datasetInference.datasets.find(d => d.id === datasetId);
        if (dataset) {
          return dataset;
        }
      }
    }

    // Return first dataset as fallback
    return component.datasetInference.datasets[0];
  }

  /**
   * Evaluate an inference rule
   */
  private evaluateRule(rule: InferenceRule, features: SemanticFeatures, request: InferenceRequest): boolean {
    const condition = rule.condition;

    switch (condition.type) {
      case 'intent-match':
        const intents = condition.parameters?.intents || [];
        return intents.some((i: string) => features.intent.includes(i));

      case 'keyword-match':
        const keywords = condition.parameters?.keywords || [];
        return features.keywords.some(kw => keywords.includes(kw));

      case 'semantic-similarity':
        // Simplified: in production, use actual embeddings
        return true;

      default:
        return false;
    }
  }

  /**
   * Generate cache key for request
   */
  private getCacheKey(request: InferenceRequest): string {
    return JSON.stringify({
      intent: request.intent,
      context: request.context,
      requiredCapabilities: request.requiredCapabilities
    });
  }

  /**
   * Get component by ID
   */
  getComponent(id: string): MCPComponent | undefined {
    return this.components.get(id);
  }

  /**
   * List all registered components
   */
  listComponents(): MCPComponent[] {
    return Array.from(this.components.values());
  }
}

// ============================================================================
// Helper Types
// ============================================================================

interface SemanticFeatures {
  intent: string;
  keywords: string[];
  domain: string;
  context: Record<string, any>;
}

// ============================================================================
// Example Usage
// ============================================================================

async function main() {
  console.log('=== MCP Semantic Inference Engine Example ===\n');

  // Initialize engine
  const engine = new MCPSemanticInferenceEngine();

  // Create example components
  const databaseComponent: MCPComponent = {
    id: 'database-query-component',
    type: 'source-module',
    name: 'Database Query Component',
    apiStructure: {
      protocol: 'jsonrpc',
      endpoints: []
    },
    semanticContext: {
      domain: 'database',
      intents: ['query-database', 'retrieve-data', 'search-records'],
      keywords: ['database', 'query', 'sql', 'select', 'data', 'table']
    }
  };

  const nlpComponent: MCPComponent = {
    id: 'nlp-processing-component',
    type: 'source-module',
    name: 'NLP Processing Component',
    apiStructure: {
      protocol: 'rest',
      endpoints: []
    },
    semanticContext: {
      domain: 'nlp',
      intents: ['analyze-text', 'extract-information', 'semantic-search'],
      keywords: ['text', 'analyze', 'sentiment', 'entities', 'nlp']
    }
  };

  // Register components
  engine.registerComponent(databaseComponent);
  engine.registerComponent(nlpComponent);

  // Test inference with different requests
  const requests: InferenceRequest[] = [
    {
      intent: 'query database for customer records',
      context: { user: 'analyst' }
    },
    {
      intent: 'analyze sentiment of product reviews',
      context: { language: 'en' }
    },
    {
      intent: 'find all orders from last month',
      context: {}
    }
  ];

  for (const request of requests) {
    try {
      const result = await engine.infer(request);
      console.log(`\n=== Result ===`);
      console.log(`Selected: ${result.selectedComponent.name}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`Reasoning: ${result.reasoning}`);
      console.log('\n' + '='.repeat(60) + '\n');
    } catch (error) {
      console.error(`Error:`, error);
    }
  }
}

// Run example
if (require.main === module) {
  main().catch(console.error);
}

export { MCPSemanticInferenceEngine, SemanticFeatures };
