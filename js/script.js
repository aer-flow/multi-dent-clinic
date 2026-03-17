document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lenis Smooth Scroll (Snappier)
    const lenis = new Lenis({
        duration: 0.8, // Reduced from 1.2
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Connect GSAP with Lenis
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    if(window.matchMedia("(pointer: fine)").matches && cursor) {
        const cursorLabel = document.createElement('div');
        cursorLabel.className = 'cursor-label';
        cursorLabel.innerText = 'Află mai multe';
        document.body.appendChild(cursorLabel);

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorLabel.style.left = e.clientX + 'px';
            cursorLabel.style.top = e.clientY + 'px';
        });
        const hoverables = document.querySelectorAll('a, button, input, select, .ba-slider-input, .bento-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                if(el.classList.contains('bento-item')) {
                    cursorLabel.style.opacity = '1';
                    gsap.to(cursor, { width: 80, height: 80, duration: 0.4, ease: "liquid" });
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorLabel.style.opacity = '0';
                gsap.to(cursor, { width: 12, height: 12, duration: 0.4, ease: "liquid" });
            });
        });

        // Magnetic Buttons
        const magneticElements = document.querySelectorAll('.btn-gold, .nav-item, .wa-float');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: "power2.out" });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // 3. GSAP Animations Setup
    const heroTl = gsap.timeline();
    heroTl.fromTo(".gsap-nav", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
          .fromTo(".hero-img-container", 
            { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", opacity: 0 }, 
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, duration: 1.2, ease: "power4.inOut" }, "-=0.5")
          .fromTo(".hero-img-container img", 
            { scale: 1.2 }, 
            { scale: 1, duration: 1.8, ease: "power2.out" }, "-=1.2")
          .fromTo(".hero-title .word", { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: "power4.out" }, "-=0.8")
          .fromTo(".gsap-fade-up", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out" }, "-=0.4");

    gsap.to(".hero-img-container img", {
        yPercent: 10, ease: "none", // Reduced from 20
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Journey Steps (Faster)
    gsap.fromTo(".step-card", 
        { y: 20, opacity: 0, scale: 0.99 },
        { 
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
            scrollTrigger: {
                trigger: ".journey-grid",
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Generic Fade Up (Faster)
    gsap.utils.toArray('.gs-fade-up:not(.step-card)').forEach(element => {
        gsap.fromTo(element, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 95%", toggleActions: "play none none reverse" }
            }
        );
    });

    // 5. Testimonial Autoscroll
    const testimonialGrid = document.querySelector('.testimonials-grid');
    if(testimonialGrid) {
        gsap.to(testimonialGrid, {
            xPercent: -50,
            ease: "none",
            duration: 120, // Significantly slowed down for readability
            repeat: -1
        });
    }

    gsap.utils.toArray('.gs-reveal-img').forEach(container => {
        let img = container.querySelector('img');
        gsap.fromTo(container,
            { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.7, ease: "power2.out",
              scrollTrigger: { 
                  trigger: container, 
                  start: "top 95%",
                  toggleActions: "play none none none"
              }
            }
        );
        if(img) {
            gsap.fromTo(img,
                { scale: 1.1, yPercent: -5 },
                { scale: 1, yPercent: 5, duration: 1, ease: "power2.out",
                  scrollTrigger: { trigger: container, start: "top 100%", end: "bottom 0%", scrub: 1 }
                }
            );
        }
    });

    // 4. Before/After Slider Engine
    const sliderInput = document.querySelector('.ba-slider-input');
    const beforeWrapper = document.querySelector('.ba-image-before-wrapper');
    const sliderButton = document.querySelector('.ba-slider-button');
    if(sliderInput) {
        sliderInput.addEventListener('input', (e) => {
            const val = e.target.value;
            beforeWrapper.style.width = `${val}%`;
            sliderButton.style.left = `${val}%`;
        });
    }

    // 5. Floating Light Particles (Boutique Dust)
    const particleContainer = document.querySelector('.hero-particles');
    if(particleContainer) {
        for(let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.opacity = Math.random() * 0.4;
            particleContainer.appendChild(p);
            
            gsap.to(p, {
                x: `random(-100, 100)`,
                y: `random(-100, 100)`,
                opacity: `random(0, 0.5)`,
                duration: `random(4, 10)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 5
            });
        }
    }
});
