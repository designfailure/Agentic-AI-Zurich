// ============================================
// Navigation
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });

                    // Close mobile menu
                    navMenu.classList.remove('active');

                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // Examples Tabs
    // ============================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.example-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${tabId}`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ============================================
    // Playground
    // ============================================
    const runInferenceBtn = document.getElementById('runInference');
    const playgroundInput = document.getElementById('playgroundInput');
    const playgroundResult = document.getElementById('playgroundResult');

    if (runInferenceBtn && playgroundInput && playgroundResult) {
        runInferenceBtn.addEventListener('click', function() {
            try {
                const inputText = playgroundInput.value;
                const request = JSON.parse(inputText);

                // Run the inference simulation
                const result = runSemanticInference(request);

                // Display result
                displayInferenceResult(result);
            } catch (error) {
                playgroundResult.innerHTML = `<div style="color: #ef4444;">
                    <strong>Error:</strong> ${error.message}
                    <br><br>
                    Please check your JSON syntax.
                </div>`;
            }
        });
    }
});

// ============================================
// Semantic Inference Engine (Simplified)
// ============================================

// Mock component registry
const components = {
    'database-query-component': {
        id: 'database-query-component',
        name: 'Database Query Component',
        domain: 'database',
        intents: ['query-database', 'retrieve-data', 'search-records'],
        keywords: ['database', 'query', 'sql', 'select', 'data', 'table', 'customer', 'order'],
        datasets: ['customer-database', 'analytics-warehouse']
    },
    'nlp-processing-component': {
        id: 'nlp-processing-component',
        name: 'NLP Processing Component',
        domain: 'nlp',
        intents: ['analyze-text', 'extract-information', 'semantic-search'],
        keywords: ['text', 'analyze', 'sentiment', 'entities', 'nlp', 'search', 'document'],
        datasets: ['text-corpus-general', 'document-store'],
        tools: ['sentiment-analyzer', 'entity-extractor', 'embedding-generator']
    }
};

function runSemanticInference(request) {
    const intent = request.intent.toLowerCase();
    const context = request.context || {};

    // Extract keywords from intent
    const keywords = extractKeywords(intent);

    // Find matching components
    const matches = findMatchingComponents(intent, keywords);

    if (matches.length === 0) {
        return {
            selectedComponent: 'general-purpose-component',
            confidence: 0.15,
            reasoning: 'No high-confidence matches found, using fallback component',
            warning: 'Low confidence match - consider refining your request'
        };
    }

    const bestMatch = matches[0];
    const component = components[bestMatch.componentId];

    // Select dataset
    const dataset = selectDataset(component, keywords);

    // Select tools
    const tools = selectTools(component, keywords);

    // Build result
    return {
        selectedComponent: {
            id: component.id,
            name: component.name,
            endpoint: `http://localhost:${component.id === 'database-query-component' ? '3000' : '8000'}/api`
        },
        confidence: bestMatch.score,
        reasoning: bestMatch.reasoning,
        dataset: dataset,
        tools: tools,
        matchedRules: bestMatch.matchedRules || [],
        alternativeComponents: matches.slice(1, 3).map(m => ({
            component: components[m.componentId].name,
            confidence: m.score
        }))
    };
}

function extractKeywords(text) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    return text
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word));
}

function findMatchingComponents(intent, keywords) {
    const matches = [];

    for (const [id, component] of Object.entries(components)) {
        let score = 0;
        const reasons = [];
        const matchedRules = [];

        // Intent matching (40% weight)
        const intentMatch = component.intents.some(i =>
            intent.includes(i) || i.includes(intent.split(' ')[0])
        );
        if (intentMatch) {
            score += 0.4;
            reasons.push('intent match');
            matchedRules.push({ type: 'intent-match', score: 0.4 });
        }

        // Keyword matching (30% weight)
        const keywordMatches = keywords.filter(kw =>
            component.keywords.some(ck => ck.includes(kw) || kw.includes(ck))
        );
        if (keywordMatches.length > 0) {
            const keywordScore = (keywordMatches.length / keywords.length) * 0.3;
            score += keywordScore;
            reasons.push(`${keywordMatches.length} keyword matches`);
            matchedRules.push({ type: 'keyword-match', score: keywordScore });
        }

        // Domain relevance (30% weight)
        const domainMatch = keywords.some(kw => component.domain.includes(kw));
        if (domainMatch) {
            score += 0.3;
            reasons.push('domain alignment');
            matchedRules.push({ type: 'domain-match', score: 0.3 });
        }

        if (score > 0.5) {
            matches.push({
                componentId: id,
                score: Math.min(score, 1.0),
                reasoning: `Component selected due to: ${reasons.join(', ')}`,
                matchedRules
            });
        }
    }

    return matches.sort((a, b) => b.score - a.score);
}

function selectDataset(component, keywords) {
    if (!component.datasets || component.datasets.length === 0) {
        return null;
    }

    // Simple heuristic: select based on keywords
    if (keywords.includes('customer') || keywords.includes('order')) {
        return { id: 'customer-database', type: 'structured' };
    }
    if (keywords.includes('analytics') || keywords.includes('report')) {
        return { id: 'analytics-warehouse', type: 'structured' };
    }
    if (keywords.includes('document') || keywords.includes('search')) {
        return { id: 'document-store', type: 'vector' };
    }

    return { id: component.datasets[0], type: 'structured' };
}

function selectTools(component, keywords) {
    if (!component.tools) {
        return [];
    }

    const selectedTools = [];

    if (keywords.includes('sentiment') || keywords.includes('feeling')) {
        selectedTools.push('sentiment-analyzer');
    }
    if (keywords.includes('entities') || keywords.includes('extract')) {
        selectedTools.push('entity-extractor');
    }
    if (keywords.includes('search') || keywords.includes('find')) {
        selectedTools.push('embedding-generator');
        selectedTools.push('semantic-search');
    }
    if (keywords.includes('sql') === false && (keywords.includes('query') || keywords.includes('find'))) {
        selectedTools.push('sql-generator');
        selectedTools.push('query-optimizer');
    }

    return selectedTools.length > 0 ? selectedTools : component.tools.slice(0, 1);
}

function displayInferenceResult(result) {
    const playgroundResult = document.getElementById('playgroundResult');

    let html = '<div style="font-family: monospace; font-size: 14px;">';

    // Component
    html += '<div style="margin-bottom: 20px;">';
    html += '<div style="color: #6b7280; margin-bottom: 5px;">Selected Component:</div>';
    html += `<div style="color: #1f2937; font-weight: 600;">${result.selectedComponent.name || result.selectedComponent}</div>`;
    if (result.selectedComponent.endpoint) {
        html += `<div style="color: #6b7280; font-size: 12px;">${result.selectedComponent.endpoint}</div>`;
    }
    html += '</div>';

    // Confidence
    html += '<div style="margin-bottom: 20px;">';
    html += '<div style="color: #6b7280; margin-bottom: 5px;">Confidence:</div>';
    const confidencePercent = (result.confidence * 100).toFixed(1);
    const confidenceColor = result.confidence >= 0.8 ? '#10b981' : result.confidence >= 0.5 ? '#f59e0b' : '#ef4444';
    html += `<div style="color: ${confidenceColor}; font-weight: 600; font-size: 24px;">${confidencePercent}%</div>`;
    html += '</div>';

    // Dataset
    if (result.dataset) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<div style="color: #6b7280; margin-bottom: 5px;">Selected Dataset:</div>';
        html += `<div style="color: #1f2937; font-weight: 600;">${result.dataset.id}</div>`;
        html += `<div style="color: #6b7280; font-size: 12px;">Type: ${result.dataset.type}</div>`;
        html += '</div>';
    }

    // Tools
    if (result.tools && result.tools.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<div style="color: #6b7280; margin-bottom: 5px;">Tool Chain:</div>';
        html += '<div style="color: #1f2937; font-weight: 600;">';
        html += result.tools.join(' → ');
        html += '</div></div>';
    }

    // Matched Rules
    if (result.matchedRules && result.matchedRules.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += '<div style="color: #6b7280; margin-bottom: 5px;">Matched Rules:</div>';
        result.matchedRules.forEach(rule => {
            html += `<div style="padding: 5px 10px; background: #f3f4f6; margin: 5px 0; border-radius: 4px;">`;
            html += `<span style="color: #1f2937;">${rule.type}</span> `;
            html += `<span style="color: #10b981; float: right;">${(rule.score * 100).toFixed(0)}%</span>`;
            html += `</div>`;
        });
        html += '</div>';
    }

    // Reasoning
    html += '<div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-left: 4px solid #6366f1; border-radius: 4px;">';
    html += '<div style="color: #1f2937; font-weight: 600; margin-bottom: 5px;">Reasoning:</div>';
    html += `<div style="color: #4b5563;">${result.reasoning}</div>`;
    html += '</div>';

    // Warning
    if (result.warning) {
        html += '<div style="margin-top: 15px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">';
        html += `<div style="color: #92400e;">${result.warning}</div>`;
        html += '</div>';
    }

    // Alternative Components
    if (result.alternativeComponents && result.alternativeComponents.length > 0) {
        html += '<div style="margin-top: 20px;">';
        html += '<div style="color: #6b7280; margin-bottom: 10px; font-size: 12px;">Alternative Components:</div>';
        result.alternativeComponents.forEach(alt => {
            html += `<div style="padding: 8px; background: #f9fafb; margin: 5px 0; border-radius: 4px; font-size: 12px;">`;
            html += `<span style="color: #1f2937;">${alt.component}</span> `;
            html += `<span style="color: #6b7280; float: right;">${(alt.confidence * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        });
        html += '</div>';
    }

    html += '</div>';

    playgroundResult.innerHTML = html;
}

// ============================================
// Scroll Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.feature-card, .layer, .doc-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
