(function () {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = reduceMotionQuery.matches;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    const revealTargets = document.querySelectorAll(".reveal, .process-step, .zoom-reveal");
    const reveal = (element) => {
        element.classList.add("is-visible");
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealTargets.forEach(reveal);
    } else {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    reveal(entry.target);
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -10% 0px"
            }
        );

        revealTargets.forEach((target) => observer.observe(target));
    }

    const hero = document.querySelector(".hero");
    if (hero && !reduceMotion) {
        const updateHeroProgress = () => {
            const rect = hero.getBoundingClientRect();
            const traveled = Math.max(0, -rect.top);
            const progress = Math.min(traveled / hero.offsetHeight, 1);

            hero.style.setProperty("--hero-progress", progress.toFixed(3));
            hero.style.setProperty("--glow-shift-x", `${Math.round(progress * -26)}px`);
            hero.style.setProperty("--glow-shift-y", `${Math.round(progress * 44)}px`);
        };

        let ticking = false;
        const queueUpdate = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(() => {
                updateHeroProgress();
                ticking = false;
            });
        };

        updateHeroProgress();
        window.addEventListener("scroll", queueUpdate, { passive: true });
        window.addEventListener("resize", queueUpdate);
    }

    window.addEventListener("load", () => {
        document.body.classList.add("is-ready");
    });

    if (document.readyState === "complete") {
        document.body.classList.add("is-ready");
    }
})();
