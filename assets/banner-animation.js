class AnimatedComponent extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.slides = [...this.querySelectorAll('[data-animate="effect_1"]')];
        this.section = this.closest('.shopify-section');

        if (this.matches('[data-init-slideshow]')) {
            return this.initObserverForSlick();
        }

        this.initObserverForOrdinary();
        
    }

    initSlideshowChangeEvent() {
        const firstSlide = this.slides[0];

        firstSlide.classList.add('shouldShow')
    
        firstSlide.querySelectorAll('.button').forEach(button => {
            AnimatedComponent.addAndRemoveButtonTransitionListeners(button);
        })

        $(this).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            const nextSlideElement = this.slides[nextSlide]

            this.slides.forEach(slide => {
                slide.classList.remove('shouldShow');
                const buttons = slide.querySelectorAll('.button');
                buttons.forEach(button => {
                    button.classList.remove('shouldShow');
                    AnimatedComponent.addAndRemoveButtonTransitionListeners(button);
                });
            }); 

            nextSlideElement.classList.add('shouldShow');
        })  
    }

    initObserverForSlick() {
        if (AnimatedComponent.slickInitialized(this)) {
            this.initSlideshowChangeEvent();
        } else {
            const options = { attributes: true };

            this.mutationObserver = new MutationObserver((mutationList, observer) => {
                const ref = mutationList[0];

                if (ref.type === 'attributes' && AnimatedComponent.slickInitialized(ref.target)) {
                    this.initSlideshowChangeEvent();
                    observer.disconnect();
                } 
            });
            this.mutationObserver.observe(this, options);
        }
    }

    initObserverForOrdinary() {
        const options = {
            threshold: 0.25,
        }

        const handler = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('shouldShow');

                    entry.target.querySelectorAll('.button').forEach(button => {
                        AnimatedComponent.addAndRemoveButtonTransitionListeners(button);
                    })

                    observer.unobserve(entry.target);
                    if (entries.length === 0) {
                        observer.disconnect();
                    }
                }
            })
        }

        this.observer = new IntersectionObserver(handler, options);
        this.slides.forEach(slide => {
            this.observer.observe(slide);
        });
    }

    static slickInitialized(slideshow) {
        return slideshow.classList.contains('slick-initialized');
    }

    static addAndRemoveButtonTransitionListeners(button) {
        if (button.closest('.enable_border_color') != null) {
            button.classList.add('banner-button-animated')
        } else {        
            button.removeEventListener('transitionend', AnimatedComponent.bannerButtonTransitionEnd);
            button.addEventListener('transitionend', AnimatedComponent.bannerButtonTransitionEnd);
        }
    }   

    static bannerButtonTransitionEnd(e) {
        const button = e.currentTarget;
        const slide = button.closest('[data-animate="effect_1"]');

        if (!slide || !button) return;

        if (slide.classList.contains('shouldShow')) {
            button.classList.add('banner-button-animated');
            button.removeEventListener('transitionend', AnimatedComponent.bannerButtonTransitionEnd);
        } else {    
            button.classList.remove('banner-button-animated');
        }
    }
}   

customElements.define('animated-component', AnimatedComponent);