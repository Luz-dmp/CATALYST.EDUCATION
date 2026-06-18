// Interactividad para la página de planes
document.addEventListener('DOMContentLoaded', function() {
    // Animación de entrada para las tarjetas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar tarjetas de planes
    document.querySelectorAll('.plan-card').forEach(card => {
        observer.observe(card);
    });

    // Observar tarjetas de beneficios
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Efecto ripple en botones
    document.querySelectorAll('.btn-accent, .btn-outline').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Tooltip en tabla de comparación
    document.querySelectorAll('.plan-feature').forEach(feature => {
        if (feature.textContent.trim()) {
            feature.setAttribute('title', feature.textContent.trim());
        }
    });

    // Animación de FAQ
    document.querySelectorAll('.faq-item summary').forEach(summary => {
        summary.addEventListener('click', function() {
            const item = this.parentElement;
            const isOpen = item.hasAttribute('open');

            // Cerrar otros FAQ abiertos
            document.querySelectorAll('.faq-item[open]').forEach(openItem => {
                if (openItem !== item) {
                    openItem.removeAttribute('open');
                }
            });
        });
    });
});