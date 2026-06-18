document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Catalyst Platform Loaded");

    /* =====================================================
       NAVBAR HAMBURGUESA
    ===================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* =====================================================
       FADE IN AL HACER SCROLL
    ===================================================== */
    const faders = document.querySelectorAll(".fade-in");

    if (faders.length) {
        const appearOnScroll = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("appear");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
        );

        faders.forEach(el => appearOnScroll.observe(el));
    }

    /* =====================================================
       TYPEWRITER (HERO)
    ===================================================== */
    document.querySelectorAll(".typewriter").forEach(element => {
        const words = element.dataset.words
            ? element.dataset.words.split(",").map(w => w.trim())
            : [];

        if (!words.length) return;

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const type = () => {
            const word = words[wordIndex];
            element.textContent = word.slice(0, charIndex);

            if (!deleting) {
                if (charIndex < word.length) {
                    charIndex++;
                    setTimeout(type, 90);
                } else {
                    deleting = true;
                    setTimeout(type, 1400);
                }
            } else {
                if (charIndex > 0) {
                    charIndex--;
                    setTimeout(type, 50);
                } else {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(type, 500);
                }
            }
        };

        type();
    });

    /* =====================================================
       BOTONES: HOVER
    ===================================================== */
    document.querySelectorAll(".btn-accent, .btn-outline").forEach(btn => {
        btn.addEventListener("mouseenter", () => btn.classList.add("hovered"));
        btn.addEventListener("mouseleave", () => btn.classList.remove("hovered"));
    });

    /* =====================================================
       SCROLL SPY (SECCIONES DEL INDEX)
    ===================================================== */
    const sections = document.querySelectorAll("section[id]");
    const navSectionLinks = document.querySelectorAll('nav a[href^="#"]');

    if (sections.length && navSectionLinks.length) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;
                    const link = document.querySelector(`nav a[href="#${id}"]`);
                    if (!link) return;

                    navSectionLinks.forEach(a => a.classList.remove("active"));
                    link.classList.add("active");
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* =====================================================
       DASHBOARD / PORTAL (SI EXISTE)
    ===================================================== */
    const portalPanels = document.querySelectorAll(".portal-panel");
    const sidebarItems = document.querySelectorAll(".sidebar-menu .menu-item");

    if (portalPanels.length && sidebarItems.length) {
        const STORAGE_KEY = "catalyst-portal-panel";

        const showPanel = id => {
            portalPanels.forEach(panel =>
                panel.classList.toggle("active", panel.id === id)
            );
            if (id) localStorage.setItem(STORAGE_KEY, id);
        };

        const savedPanel = localStorage.getItem(STORAGE_KEY);
        const defaultPanel =
            sidebarItems[0]?.getAttribute("href")?.replace("#", "") || null;

        showPanel(savedPanel || defaultPanel);

        sidebarItems.forEach(item => {
            item.addEventListener("click", e => {
                e.preventDefault();
                sidebarItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");

                const target = item.getAttribute("href")?.replace("#", "");
                if (target) showPanel(target);
            });
        });
    }

});