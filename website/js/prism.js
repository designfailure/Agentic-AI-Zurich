/* PrismJS - Simplified JSON Highlighter */
(function() {
    if (typeof window === 'undefined') {
        return;
    }

    // JSON syntax highlighter
    function highlightJSON(code) {
        return code
            .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="token property">$1</span>:')
            .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="token string">$1</span>')
            .replace(/:\s*(\d+\.?\d*)/g, ': <span class="token number">$1</span>')
            .replace(/:\s*(true|false|null)/g, ': <span class="token boolean">$1</span>')
            .replace(/([{}[\],])/g, '<span class="token punctuation">$1</span>');
    }

    // Auto-highlight on page load
    document.addEventListener('DOMContentLoaded', function() {
        const codeBlocks = document.querySelectorAll('code.language-json');

        codeBlocks.forEach(function(block) {
            const code = block.textContent;
            block.innerHTML = highlightJSON(code);
        });
    });

    // Expose global Prism object for compatibility
    window.Prism = {
        highlightAll: function() {
            const codeBlocks = document.querySelectorAll('code[class*="language-"]');
            codeBlocks.forEach(function(block) {
                if (block.classList.contains('language-json')) {
                    const code = block.textContent;
                    block.innerHTML = highlightJSON(code);
                }
            });
        }
    };
})();
