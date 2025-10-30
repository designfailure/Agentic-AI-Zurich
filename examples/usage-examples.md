# MCP Ontology Usage Examples

This document provides practical examples of using the MCP Semantic Inference system.

## Example 1: Simple Query Routing

### Request
```json
{
  "intent": "Find all orders for customer John Doe",
  "context": {
    "user": "analyst@company.com",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

### Inference Process

1. **Intent Detection**
   - Detected intent: `query-database`
   - Confidence: 0.95

2. **Keyword Extraction**
   - Keywords: ["find", "orders", "customer"]
   - Domain classification: `customer-relationship-management`

3. **Component Matching**
   - Matched component: `database-query-component`
   - Match score: 0.92
   - Reasoning: Keywords match semantic context, domain alignment

4. **Dataset Selection**
   - Applied rule: `customer-intent-rule`
   - Selected dataset: `customer-database`
   - Confidence: 0.85

5. **Tool Selection**
   - Selected tool: `sql-generator` (Natural Language to SQL)
   - Reason: Query is in natural language, needs translation

### Response
```json
{
  "selectedComponent": {
    "id": "database-query-component",
    "endpoint": "http://localhost:3000/rpc"
  },
  "confidence": 0.92,
  "reasoning": "Query intent matches customer database domain with high keyword overlap",
  "executionPlan": {
    "dataset": "customer-database",
    "toolChain": ["sql-generator", "query-optimizer", "result-formatter"],
    "estimatedLatency": 250
  },
  "alternativeComponents": []
}
```

---

## Example 2: Semantic Text Analysis

### Request
```json
{
  "intent": "Analyze the sentiment of customer reviews",
  "context": {
    "dataSource": "reviews-corpus",
    "language": "en"
  },
  "parameters": {
    "text": "The product is amazing! Best purchase ever.",
    "analysisType": "sentiment"
  }
}
```

### Inference Process

1. **Intent Detection**
   - Detected intent: `analyze-text`
   - Sub-intent: `sentiment-analysis`
   - Confidence: 0.88

2. **Component Matching**
   - Matched component: `nlp-processing-component`
   - Match score: 0.91
   - Reasoning: Intent "analyze" and keywords "sentiment", "reviews" match NLP domain

3. **Tool Selection**
   - Applied rule: `sentiment-intent-rule`
   - Selected tool: `sentiment-analyzer`
   - Confidence: 0.85

### Response
```json
{
  "selectedComponent": {
    "id": "nlp-processing-component",
    "endpoint": "http://localhost:8000/api/v1"
  },
  "confidence": 0.91,
  "reasoning": "Sentiment analysis intent with text input matches NLP component capabilities",
  "executionPlan": {
    "tool": "sentiment-analyzer",
    "parameters": {
      "text": "The product is amazing! Best purchase ever.",
      "language": "en"
    }
  }
}
```

---

## Example 3: Multi-Stage Pipeline

### Request
```json
{
  "intent": "Extract entities from documents and store in database",
  "context": {
    "documentIds": ["doc-001", "doc-002", "doc-003"]
  }
}
```

### Inference Process

1. **Intent Detection**
   - Primary intent: `extract-information`
   - Secondary intent: `store-data`
   - Confidence: 0.82

2. **Component Matching**
   - Primary component: `nlp-processing-component` (for extraction)
   - Secondary component: `database-query-component` (for storage)

3. **Pipeline Construction**
   - Stage 1: Retrieve documents → `document-store`
   - Stage 2: Extract entities → `entity-extractor`
   - Stage 3: Store results → `customer-database`

### Response
```json
{
  "selectedComponent": {
    "id": "pipeline-orchestrator"
  },
  "confidence": 0.82,
  "reasoning": "Multi-stage operation requires NLP extraction followed by database storage",
  "executionPlan": {
    "stages": [
      {
        "component": "nlp-processing-component",
        "tool": "entity-extractor",
        "input": "documents from document-store"
      },
      {
        "component": "database-query-component",
        "endpoint": "query.execute",
        "input": "extracted entities"
      }
    ],
    "executionMode": "sequential"
  }
}
```

---

## Example 4: Semantic Search

### Request
```json
{
  "intent": "Find similar documents about artificial intelligence",
  "context": {
    "query": "machine learning applications in healthcare",
    "maxResults": 10
  }
}
```

### Inference Process

1. **Intent Detection**
   - Detected intent: `semantic-search`
   - Confidence: 0.94

2. **Embedding Generation**
   - Generated embedding for query
   - Model: `text-embedding-3-large`
   - Dimensions: 3072

3. **Component Matching**
   - Matched component: `nlp-processing-component`
   - Match score: 0.89

4. **Dataset Selection**
   - Applied rule: `semantic-search-rule`
   - Selected dataset: `document-store` (vector database)
   - Confidence: 0.91

5. **Tool Pipeline**
   - Tool 1: `embedding-generator` → Generate query embedding
   - Tool 2: `semantic-search` → Search vector database

### Response
```json
{
  "selectedComponent": {
    "id": "nlp-processing-component"
  },
  "confidence": 0.89,
  "reasoning": "Semantic search requires vector embeddings, matched to NLP component with vector search capability",
  "dataset": {
    "id": "document-store",
    "type": "vector",
    "searchMode": "vector-similarity"
  },
  "toolChain": [
    {
      "id": "embedding-generator",
      "parameters": {
        "text": "machine learning applications in healthcare",
        "model": "text-embedding-3-large"
      }
    },
    {
      "id": "semantic-search",
      "parameters": {
        "corpus": "document-store",
        "topK": 10
      }
    }
  ]
}
```

---

## Example 5: Composite Rule Matching

### Request
```json
{
  "intent": "Analyze financial market trends",
  "context": {
    "domain": "finance",
    "keywords": ["stock", "market", "analysis"]
  },
  "parameters": {
    "ticker": "AAPL",
    "timeRange": "1Y"
  }
}
```

### Inference Process

1. **Multi-Condition Evaluation**
   - Intent match: `analyze` (confidence: 0.85)
   - Keyword match: ["financial", "stock", "market"] (score: 0.90)
   - Domain match: `finance` (score: 0.95)

2. **Composite Rule Application**
   - Rule: `rule-composite-001` (Multi-condition Dataset Selection)
   - All conditions met
   - Overall confidence: 0.88

3. **Pipeline Selection**
   - Selected pipeline: `financial-query-pipeline`
   - Stages: data-retrieval → analysis → reporting

### Response
```json
{
  "selectedComponent": {
    "id": "financial-query-pipeline"
  },
  "confidence": 0.88,
  "reasoning": "Composite rule matched: financial domain + analysis intent + market keywords",
  "executionPlan": {
    "stages": [
      {
        "action": "select-dataset",
        "target": "financial-dataset",
        "parameters": {
          "ticker": "AAPL",
          "timeRange": "1Y"
        }
      },
      {
        "action": "invoke-tool",
        "target": "financial-analyzer",
        "parameters": {
          "analysisType": "trend-analysis"
        }
      },
      {
        "action": "transform",
        "target": "result-formatter",
        "parameters": {
          "format": "financial-report"
        }
      }
    ]
  },
  "matchedRules": [
    {
      "id": "rule-composite-001",
      "score": 0.88,
      "conditions": ["intent-match", "keyword-match", "domain-match"]
    }
  ]
}
```

---

## Example 6: Fallback Behavior

### Request
```json
{
  "intent": "Do something completely unknown",
  "context": {}
}
```

### Inference Process

1. **Intent Detection**
   - No clear intent detected
   - Confidence: 0.15 (below threshold)

2. **Rule Matching**
   - No rules matched with sufficient confidence
   - All scores < 0.50

3. **Fallback Activation**
   - Fallback strategy: `default`
   - Selected component: `general-purpose-component`

### Response
```json
{
  "selectedComponent": {
    "id": "general-purpose-component"
  },
  "confidence": 0.15,
  "reasoning": "No high-confidence matches found, using fallback component",
  "executionPlan": {
    "mode": "best-effort",
    "recommendation": "Please provide more specific intent or context"
  },
  "warning": "Low confidence match - consider refining your request"
}
```

---

## Example 7: Structured Query Detection

### Request
```json
{
  "intent": "Execute query",
  "parameters": {
    "query": "SELECT * FROM customers WHERE country = 'USA'"
  }
}
```

### Inference Process

1. **Pattern Detection**
   - Applied rule: `rule-pattern-001` (Structured Query Pattern)
   - Pattern matched: SQL query detected
   - Confidence: 1.0 (exact match)

2. **Component Selection**
   - Selected component: `database-query-component`
   - Tool: `sql-executor`

### Response
```json
{
  "selectedComponent": {
    "id": "database-query-component"
  },
  "confidence": 1.0,
  "reasoning": "Exact pattern match: SQL query detected",
  "executionPlan": {
    "tool": "sql-executor",
    "parameters": {
      "sql": "SELECT * FROM customers WHERE country = 'USA'",
      "validationEnabled": true,
      "safeMode": true
    }
  },
  "matchedRules": [
    {
      "id": "rule-pattern-001",
      "type": "pattern-match",
      "score": 1.0
    }
  ]
}
```

---

## Example 8: Parallel Tool Execution

### Request
```json
{
  "intent": "Comprehensive text analysis",
  "parameters": {
    "text": "This is a sample document for analysis."
  },
  "requiredCapabilities": ["sentiment", "entities", "keywords"]
}
```

### Inference Process

1. **Capability Matching**
   - Required capabilities: 3
   - Matched component: `nlp-processing-component`
   - All capabilities available

2. **Parallel Tool Selection**
   - Tool 1: `sentiment-analyzer`
   - Tool 2: `entity-extractor`
   - Tool 3: `keyword-extractor`
   - Execution mode: `parallel`

### Response
```json
{
  "selectedComponent": {
    "id": "nlp-processing-component"
  },
  "confidence": 0.95,
  "reasoning": "Component provides all required capabilities for parallel execution",
  "executionPlan": {
    "executionMode": "parallel",
    "tools": [
      {
        "id": "sentiment-analyzer",
        "parameters": {
          "text": "This is a sample document for analysis."
        }
      },
      {
        "id": "entity-extractor",
        "parameters": {
          "text": "This is a sample document for analysis."
        }
      },
      {
        "id": "keyword-extractor",
        "parameters": {
          "text": "This is a sample document for analysis."
        }
      }
    ],
    "aggregationStrategy": "merge-results"
  }
}
```

---

## Integration Example

### Using the Inference Engine in Code

```typescript
import { SemanticInferenceEngine, InferenceRequest } from './types/mcp-types';

// Initialize the engine
const engine = new SemanticInferenceEngine({
  configPath: './ontology/semantic-inference-engine.json',
  componentsPath: './components',
  rulesPath: './inference-rules'
});

// Make an inference request
const request: InferenceRequest = {
  intent: "Find customer orders",
  context: {
    user: "analyst@company.com"
  },
  parameters: {
    customerName: "John Doe"
  }
};

// Get inference result
const result = await engine.infer(request);

console.log('Selected Component:', result.selectedComponent.id);
console.log('Confidence:', result.confidence);
console.log('Execution Plan:', result.executionPlan);

// Execute the plan
const response = await engine.execute(result.executionPlan);
console.log('Result:', response);
```

---

## Testing Inference Rules

### Rule Evaluation Endpoint

```bash
curl -X POST http://localhost:3000/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "query-database",
    "context": {
      "keywords": ["customer", "orders"]
    }
  }'
```

### Response
```json
{
  "matchedRules": [
    {
      "id": "customer-intent-rule",
      "score": 0.85,
      "reasoning": "Keywords match customer database domain"
    },
    {
      "id": "rule-intent-001",
      "score": 0.70,
      "reasoning": "Query intent detected"
    }
  ],
  "recommendation": {
    "component": "database-query-component",
    "dataset": "customer-database",
    "confidence": 0.85
  }
}
```

---

## Summary

These examples demonstrate:

1. **Simple routing** based on intent and keywords
2. **Semantic matching** using embeddings
3. **Multi-stage pipelines** for complex workflows
4. **Vector search** for semantic similarity
5. **Composite rules** combining multiple conditions
6. **Fallback handling** for unknown requests
7. **Pattern matching** for structured queries
8. **Parallel execution** for efficiency

The MCP ontology provides a flexible, powerful framework for building intelligent routing systems that understand context and intent.
