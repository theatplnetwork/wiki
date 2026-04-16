class TypingAnimation {
    constructor() {
        this.texts = ["The ATPL Wiki", "The ATPL Network"];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        this.element = null;
        this.commonPrefix = "";
        this.suffixes = [];
        this.currentSuffix = "";
        this.isAnimating = false;
        this.originalContent = null;
        this.animationTimer = null;

        this.calculateCommonPrefix();
        this.init();
    }

    calculateCommonPrefix() {
        // Find the common prefix between all texts
        let prefix = "";
        const minLength = Math.min(...this.texts.map(text => text.length));

        for (let i = 0; i < minLength; i++) {
            const char = this.texts[0][i];
            if (this.texts.every(text => text[i] === char)) {
                prefix += char;
            } else {
                break;
            }
        }

        this.commonPrefix = prefix;
        this.suffixes = this.texts.map(text => text.substring(prefix.length));
        this.currentSuffix = this.suffixes[0];
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.findAndReplace();
    }

    findAndReplace() {
        // Target the site title topic specifically
        const siteTitle = document.querySelector('.md-header__topic:first-child .md-ellipsis');

        if (siteTitle) {
            this.setupTypingAnimation(siteTitle);
            return;
        }

        // Fallback selectors
        const selectors = [
            '.md-header__title .md-ellipsis:first-child',
            '.md-header__title',
            '.md-header-nav__title'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                this.setupTypingAnimation(element);
                return;
            }
        }

        console.warn('Could not find site title element for typing animation');
    }

    setupTypingAnimation(element) {
        this.element = element;
        // Store original HTML content as backup
        this.originalContent = element.innerHTML;
        this.originalText = element.textContent.trim();

        // Replace with typing animation
        element.innerHTML = `<span class="typing-prefix">${this.commonPrefix}</span><span class="typing-text"></span><span class="typing-cursor">|</span>`;
        this.textElement = element.querySelector('.typing-text');

        // Start with the first suffix
        this.textElement.textContent = this.currentSuffix;
        this.currentCharIndex = this.currentSuffix.length;
        this.isAnimating = true;

        // Start the typing animation after a short delay
        this.animationTimer = setTimeout(() => this.type(), this.pauseTime);
    }

    type() {
        if (!this.textElement || !this.isAnimating) return;

        const targetSuffix = this.suffixes[this.currentTextIndex];

        if (!this.isDeleting) {
            // Check if we need to start deleting first
            if (this.currentCharIndex >= this.currentSuffix.length) {
                // We've finished typing the current suffix, start deleting
                this.isDeleting = true;
                this.animationTimer = setTimeout(() => this.type(), this.pauseTime);
                return;
            }

            // Continue typing the current suffix
            this.textElement.textContent = this.currentSuffix.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            this.animationTimer = setTimeout(() => this.type(), this.typeSpeed);
        } else {
            // Deleting phase
            this.textElement.textContent = this.currentSuffix.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;

            if (this.currentCharIndex === 0) {
                // Finished deleting, switch to next text
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                this.currentSuffix = this.suffixes[this.currentTextIndex];
                this.animationTimer = setTimeout(() => this.type(), this.typeSpeed);
                return;
            }

            this.animationTimer = setTimeout(() => this.type(), this.deleteSpeed);
        }
    }
}

// Initialize the typing animation
new TypingAnimation();
