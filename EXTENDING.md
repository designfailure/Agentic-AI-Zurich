# Extending the MCP Ontology

This guide explains how to extend the MCP Semantic Inference Ontology with new components, rules, and capabilities.

## Table of Contents

1. [Adding New Components](#adding-new-components)
2. [Creating Inference Rules](#creating-inference-rules)
3. [Defining Custom Datasets](#defining-custom-datasets)
4. [Adding Tools](#adding-tools)
5. [Extending the Type System](#extending-the-type-system)
6. [Best Practices](#best-practices)

---

## Adding New Components

### Step 1: Define Component Structure

Create a new JSON file in the `components/` directory following the schema:

```json
{
  "$schema": "../schemas/mcp-component-schema.json",
  "id": "your-component-id",
  "type": "source-module",
  "name": "Your Component Name",
  "description": "What your component does",
  "apiStructure": { ... },
  "datasetInference": { ... },
  "toolCalling": { ... },
  "semanticContext": { ... },
  "capabilities": [ ... ],
  "metadata": { ... }
}
```

### Step 2: Define API Structure

Specify how your component can be accessed:

```json
{
  "apiStructure": {
    "protocol": "rest",
    "baseUrl": "http://localhost:8080/api",
    "endpoints": [
      {
        "name": "processRequest",
        "method": "POST",
        "path": "/process",
        "parameters": [
          {
            "name": "input",
            "type": "string",
            "required": true,
            "semanticRole": "input"
          }
        ],
        "returns": {
          "type": "object",
          "semanticType": "processed-result"
        },
        "semanticTags": ["process", "transform"]
      }
    ]
  }
}
```

### Step 3: Add Semantic Context

This is crucial for inference - the richer the context, the better the matching:

```json
{
  "semanticContext": {
    "domain": "your-domain",
    "intents": [
      "primary-intent",
      "secondary-intent",
      "tertiary-intent"
    ],
    "keywords": [
      "keyword1",
      "keyword2",
      "keyword3"
    ],
    "concepts": [
      "concept1",
      "concept2"
    ]
  }
}
```

**Tips:**
- Include synonyms in keywords
- Cover various ways users might express intent
- Use lowercase for consistency
- Include domain-specific terminology

### Step 4: Validate Your Component

```bash
npm run validate-schema
```

This will check your component against the JSON schema.

---

## Creating Inference Rules

### Rule Structure

Rules determine when and how components are selected:

```json
{
  "id": "rule-unique-id",
  "name": "Descriptive Rule Name",
  "condition": {
    "type": "intent-match | keyword-match | semantic-similarity | pattern-match | composite",
    "parameters": { ... },
    "expression": "logical expression"
  },
  "action": {
    "type": "select-dataset | invoke-tool | transform | route | composite",
    "target": "target-id",
    "parameters": { ... }
  },
  "priority": 10,
  "confidenceThreshold": 0.75
}
```

### Rule Types

#### 1. Intent-Match Rule

```json
{
  "id": "my-intent-rule",
  "name": "Route Analysis Intent",
  "condition": {
    "type": "intent-match",
    "parameters": {
      "intents": ["analyze", "evaluate", "assess"],
      "minConfidence": 0.7
    }
  },
  "action": {
    "type": "invoke-tool",
    "target": "analyzer-tool"
  },
  "priority": 10,
  "confidenceThreshold": 0.7
}
```

#### 2. Keyword-Match Rule

```json
{
  "id": "my-keyword-rule",
  "name": "Database Keywords Detection",
  "condition": {
    "type": "keyword-match",
    "parameters": {
      "keywords": ["database", "table", "sql"],
      "matchType": "any",
      "caseSensitive": false
    }
  },
  "action": {
    "type": "select-dataset",
    "target": "primary-database"
  },
  "priority": 8,
  "confidenceThreshold": 0.65
}
```

#### 3. Semantic-Similarity Rule

```json
{
  "id": "my-semantic-rule",
  "name": "Semantic Domain Match",
  "condition": {
    "type": "semantic-similarity",
    "parameters": {
      "embeddingModel": "text-embedding-3-large",
      "similarityThreshold": 0.85,
      "fields": ["domain", "concepts"]
    }
  },
  "action": {
    "type": "route",
    "target": "best-match-component"
  },
  "priority": 15,
  "confidenceThreshold": 0.85
}
```

#### 4. Pattern-Match Rule

```json
{
  "id": "my-pattern-rule",
  "name": "SQL Query Detection",
  "condition": {
    "type": "pattern-match",
    "parameters": {
      "pattern": "^(SELECT|INSERT|UPDATE|DELETE)\\s+",
      "field": "query",
      "flags": "i"
    }
  },
  "action": {
    "type": "invoke-tool",
    "target": "sql-executor"
  },
  "priority": 20,
  "confidenceThreshold": 1.0
}
```

#### 5. Composite Rule

```json
{
  "id": "my-composite-rule",
  "name": "Multi-Condition Rule",
  "condition": {
    "type": "composite",
    "parameters": {
      "operator": "AND",
      "conditions": [
        {
          "type": "intent-match",
          "parameters": { "intents": ["query"] }
        },
        {
          "type": "keyword-match",
          "parameters": { "keywords": ["financial"] }
        }
      ]
    }
  },
  "action": {
    "type": "select-dataset",
    "target": "financial-dataset"
  },
  "priority": 12,
  "confidenceThreshold": 0.8
}
```

### Rule Priority Guidelines

- **90-100**: Exact pattern matches
- **70-89**: High-confidence semantic matches
- **50-69**: Intent and keyword matches
- **30-49**: Fuzzy or partial matches
- **0-29**: Low-confidence fallbacks

---

## Defining Custom Datasets

### Dataset Definition

```json
{
  "id": "my-custom-dataset",
  "name": "My Custom Dataset",
  "type": "structured | unstructured | semi-structured | vector",
  "schema": {
    "fields": ["field1", "field2"],
    "types": ["string", "number"]
  },
  "semanticTags": ["domain-tag", "type-tag"],
  "contentDomain": "specific-domain",
  "accessMethod": {
    "type": "database-type",
    "endpoint": "connection-string"
  }
}
```

### Dataset Types

#### Structured Dataset (SQL)

```json
{
  "id": "structured-db",
  "type": "structured",
  "schema": {
    "tables": ["users", "orders"],
    "primaryKeys": {
      "users": "user_id",
      "orders": "order_id"
    }
  },
  "accessMethod": {
    "type": "postgres",
    "endpoint": "postgresql://localhost:5432/mydb"
  }
}
```

#### Vector Dataset (Semantic Search)

```json
{
  "id": "vector-store",
  "type": "vector",
  "schema": {
    "embeddingDimension": 1536,
    "indexType": "hnsw",
    "distanceMetric": "cosine"
  },
  "accessMethod": {
    "type": "vector-db",
    "endpoint": "http://localhost:6333/collections/docs"
  }
}
```

---

## Adding Tools

### Tool Definition

```json
{
  "id": "my-tool",
  "name": "My Processing Tool",
  "description": "What the tool does",
  "function": "processingFunction",
  "parameters": [
    {
      "name": "input",
      "type": "string",
      "required": true,
      "semanticRole": "input"
    }
  ],
  "semanticPurpose": "data-transformation",
  "requiredContext": ["contextKey1", "contextKey2"]
}
```

### Tool Selection Rules

Define when a tool should be invoked:

```json
{
  "id": "tool-selection-rule",
  "name": "Select Transformation Tool",
  "condition": {
    "type": "intent-match",
    "parameters": {
      "intents": ["transform", "convert"]
    }
  },
  "action": {
    "type": "invoke-tool",
    "target": "my-tool",
    "parameters": {
      "pipelineNext": "next-tool-id"
    }
  },
  "priority": 10,
  "confidenceThreshold": 0.75
}
```

### Tool Invocation Strategies

1. **Direct**: Single tool execution
   ```json
   {
     "invocationStrategy": "direct",
     "tools": [{ "id": "single-tool" }]
   }
   ```

2. **Pipeline**: Sequential execution
   ```json
   {
     "invocationStrategy": "pipeline",
     "tools": [
       { "id": "tool-1" },
       { "id": "tool-2" },
       { "id": "tool-3" }
     ]
   }
   ```

3. **Parallel**: Concurrent execution
   ```json
   {
     "invocationStrategy": "parallel",
     "tools": [
       { "id": "analysis-1" },
       { "id": "analysis-2" },
       { "id": "analysis-3" }
     ]
   }
   ```

---

## Extending the Type System

### Adding New Types

Edit `types/mcp-types.ts`:

```typescript
// Add new component type
export type ComponentType =
  | 'source-module'
  | 'tool'
  | 'dataset'
  | 'composite'
  | 'my-new-type';  // Add here

// Add new interface
export interface MyNewFeature {
  id: string;
  name: string;
  customProperty: string;
}

// Extend existing interface
export interface MCPComponent {
  // ... existing properties
  myNewFeature?: MyNewFeature;  // Add optional feature
}
```

### Update JSON Schema

Edit `schemas/mcp-component-schema.json`:

```json
{
  "properties": {
    "type": {
      "type": "string",
      "enum": ["source-module", "tool", "dataset", "composite", "my-new-type"]
    },
    "myNewFeature": {
      "$ref": "#/definitions/MyNewFeature"
    }
  },
  "definitions": {
    "MyNewFeature": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "customProperty": { "type": "string" }
      },
      "required": ["id", "name"]
    }
  }
}
```

---

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Rich Metadata**: Provide comprehensive semantic context
3. **Clear API**: Well-documented endpoints and parameters
4. **Versioning**: Include version in metadata

### Rule Design

1. **Specificity**: More specific rules should have higher priority
2. **Testing**: Test rules with diverse inputs
3. **Documentation**: Comment complex rule logic
4. **Confidence Thresholds**: Set appropriate thresholds

### Dataset Design

1. **Schema Definition**: Clearly define data structure
2. **Access Patterns**: Optimize for common queries
3. **Semantic Tags**: Use descriptive, searchable tags
4. **Documentation**: Document data sources and update frequency

### Performance

1. **Caching**: Enable caching for frequently accessed data
2. **Indexing**: Maintain semantic indexes
3. **Parallelization**: Use parallel execution where possible
4. **Monitoring**: Track performance metrics

### Testing

```bash
# Validate schemas
npm run validate-schema

# Test component
curl -X POST http://localhost:3000/evaluate \
  -d '{"intent": "test-intent"}'

# Run examples
npm run example
```

### Version Control

```bash
# Component version in metadata
{
  "metadata": {
    "version": "1.2.0",
    "created": "2025-01-15T00:00:00Z",
    "updated": "2025-01-20T00:00:00Z"
  }
}
```

---

## Example: Complete Extension

Here's a complete example of adding a new image processing component:

```json
{
  "$schema": "../schemas/mcp-component-schema.json",
  "id": "image-processing-component",
  "type": "source-module",
  "name": "Image Processing Component",
  "description": "Process and analyze images using computer vision",
  "apiStructure": {
    "protocol": "rest",
    "baseUrl": "http://localhost:9000/api",
    "endpoints": [
      {
        "name": "analyzeImage",
        "method": "POST",
        "path": "/analyze",
        "parameters": [
          {
            "name": "imageUrl",
            "type": "string",
            "required": true,
            "semanticRole": "input"
          },
          {
            "name": "analysisType",
            "type": "string",
            "required": false,
            "semanticRole": "configuration"
          }
        ],
        "returns": {
          "type": "object",
          "semanticType": "image-analysis-result"
        },
        "semanticTags": ["image", "vision", "analysis"]
      }
    ]
  },
  "toolCalling": {
    "invocationStrategy": "semantic-routing",
    "tools": [
      {
        "id": "object-detector",
        "name": "Object Detection",
        "function": "detectObjects",
        "semanticPurpose": "object-detection"
      }
    ]
  },
  "semanticContext": {
    "domain": "computer-vision",
    "intents": ["analyze-image", "detect-objects", "classify-image"],
    "keywords": ["image", "photo", "picture", "vision", "detection"],
    "concepts": ["computer-vision", "object-detection", "image-classification"]
  },
  "capabilities": [
    {
      "name": "Object Detection",
      "type": "analyze",
      "description": "Detect objects in images"
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "author": "CV Team",
    "created": "2025-01-15T00:00:00Z"
  }
}
```

---

## Support

For questions or issues:
- Check the [Architecture Documentation](./ARCHITECTURE.md)
- Review [Usage Examples](./examples/usage-examples.md)
- Open an issue in the repository

Happy extending!
