document.addEventListener('DOMContentLoaded', () => {
    /**
     * ------------------------------------------------------------------------
     * Comibyte Animate on Scroll (CAOS) Library
     * Author: Comibyte Team
     * Version: 2.0
     * ------------------------------------------------------------------------
     */
    const CAOS = {
        settings: {
            threshold: 0,
            once: false,
        },

        observer: null,

        parallaxElements: [],

        /**
         * Initializes the library
         * @param {object} options - User-defined settings to override defaults
         */

        init(options = {}) {
            this.settings = { ...this.settings, ...options };

            const elementsToAnimate = document.querySelectorAll('[data-caos]');

            if (!elementsToAnimate.length) {
                console.warn("CAOS: No elements to animate found. Add 'data-caos' attribute to your HTML elements.");
                return;
            }

            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerAnimation(entry.target);
                        if (this.settings.once || entry.target.dataset.caosOnce === 'true') {
                            observer.unobserve(entry.target);
                        }
                    } else {
                        if (!this.settings.once && entry.target.dataset.caosOnce !== 'true') {
                            this.resetAnimation(entry.target);
                        }
                    }
                });
            }, { threshold: this.settings.threshold });


            elementsToAnimate.forEach(el => this.prepareElement(el));

            this.initParallax();
        },

        /**
         * Prepares an element for animation and observes it.
         * @param {HTMLElement} el - The element to prepare.
         */
        prepareElement(el) {
            const duration = el.dataset.caosDuration;
            const delay = el.dataset.caosDelay;

            if (duration) el.style.transitionDuration = `${duration}ms`;
            if (delay) el.style.transitionDelay = `${delay}ms`;


            if (el.dataset.caos.includes('overlay')) {
                const overlayColor = el.dataset.caosOverlayColor || 'var(--primary-color)';
                const overlay = el.querySelector('.caos-overlay');
                if (overlay) {
                    overlay.style.backgroundColor = overlayColor;
                } else {
                    console.warn("CAOS: Overlay element not found inside container:", el);
                }
            }

            if (el.dataset.caos === 'parallax') {
                const bg = el.querySelector('.caos-parallax-bg');
                if (bg) {
                    this.parallaxElements.push({ container: el, bg: bg });
                } else {
                    console.warn("CAOS: Parallax background element not found inside container:", el);
                }
                return;
            }

            this.observer.observe(el);
        },

        /**
         * Triggers the animation by adding the 'caos-animate' class.
         * @param {HTMLElement} el - The element to animate.
         */
        triggerAnimation(el) {
            el.classList.add('caos-animate');
        },

        /**
         * Resets the animation by removing the 'caos-animate' class.
         * @param {HTMLElement} el - The element to reset.
         */
        resetAnimation(el) {
            el.classList.remove('caos-animate');
        },

        /**
         * Initializes the parallax effect by adding a scroll event listener.
         */
        initParallax() {
            if (!this.parallaxElements.length) return;

            window.addEventListener('scroll', () => {
                window.requestAnimationFrame(() => this.updateParallax());
            }, { passive: true });
        },

        /**
         * Updates the transform of parallax backgrounds based on scroll position.
         */
        updateParallax() {
            const windowHeight = window.innerHeight;

            this.parallaxElements.forEach(item => {
                const rect = item.container.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > windowHeight) {
                    return;
                }

                const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                const parallaxFactor = 0.3;
                const transformY = (scrollPercent - 0.5) * (item.bg.offsetHeight - item.container.offsetHeight) * parallaxFactor;

                item.bg.style.transform = `translate3d(0, ${-transformY}px, 0)`;
            });
        }
    };

    // Initialize the CAOS library
    CAOS.init({
        // You can override the default threshold here if needed for a specific page
        // threshold: 0.7 
    });

});