document.addEventListener('DOMContentLoaded', () => {
    console.log("Catalyst Platform Loaded");

    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.3, rootMargin: '0px 0px -100px 0px' };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    const typewriters = document.querySelectorAll('.typewriter');

    typewriters.forEach(element => {
        const words = element.dataset.words?.split(',').map(word => word.trim()) || [];
        let currentWord = 0;
        let currentChar = 0;
        let deleting = false;

        const type = () => {
            const word = words[currentWord];
            element.textContent = word.slice(0, currentChar);

            if (!deleting) {
                if (currentChar < word.length) {
                    currentChar++;
                    setTimeout(type, 90);
                } else {
                    deleting = true;
                    setTimeout(type, 1400);
                }
            } else {
                if (currentChar > 0) {
                    currentChar--;
                    setTimeout(type, 50);
                } else {
                    deleting = false;
                    currentWord = (currentWord + 1) % words.length;
                    setTimeout(type, 500);
                }
            }
        };

        if (words.length) {
            type();
        }
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const link = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (!link) return;
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    }, { threshold: 0.5 });

    sections.forEach(section => navObserver.observe(section));

    document.querySelectorAll('.btn-accent, .btn-outline').forEach(button => {
        button.addEventListener('mouseenter', () => button.classList.add('hovered'));
        button.addEventListener('mouseleave', () => button.classList.remove('hovered'));
    });
    const STORAGE_KEYS = {
        portalPanel: 'catalyst-portal-panel',
        courseTab: 'catalyst-course-tab'
    };

    const currentPath = window.location.pathname;
    const isCoursePage = currentPath.includes('curso.html');
    const isPortalPage = !!document.querySelector('.portal-panel');

    const courseTabs = document.querySelectorAll('.course-tabs .tab');
    const coursePanels = document.querySelectorAll('.course-panel');

    const activateTab = (tab) => {
        courseTabs.forEach(item => item.classList.remove('active'));
        coursePanels.forEach(panel => panel.classList.remove('active'));

        tab.classList.add('active');
        const target = document.querySelector(tab.getAttribute('href'));
        if (target) target.classList.add('active');

        if (isCoursePage) {
            const savedTab = tab.getAttribute('href');
            localStorage.setItem(STORAGE_KEYS.courseTab, savedTab);
        }
    };

    courseTabs.forEach(tab => {
        tab.addEventListener('click', event => {
            event.preventDefault();
            activateTab(tab);
        });
    });

    const activeTab = document.querySelector('.course-tabs .tab.active');
    if (isCoursePage) {
        const savedTab = localStorage.getItem(STORAGE_KEYS.courseTab);
        const storedTab = savedTab && document.querySelector(`.course-tabs .tab[href="${savedTab}"]`);
        if (storedTab) {
            activateTab(storedTab);
        } else if (activeTab) {
            activateTab(activeTab);
        }
    } else if (activeTab) {
        activateTab(activeTab);
    }

    const portalPanels = document.querySelectorAll('.portal-panel');
    const showPortalPanel = (panelId) => {
        portalPanels.forEach(panel => panel.classList.toggle('active', panel.id === panelId));
        if (panelId) {
            localStorage.setItem(STORAGE_KEYS.portalPanel, panelId);
        }
    };

    const activeSidebarItem = document.querySelector('.sidebar-menu .menu-item.active');
    if (isPortalPage) {
        const storedPanel = localStorage.getItem(STORAGE_KEYS.portalPanel);
        const defaultPanel = activeSidebarItem?.getAttribute('href')?.replace('#', '') || 'dashboard';
        showPortalPanel(storedPanel || defaultPanel);
    }

    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            document.querySelectorAll('.sidebar-menu .menu-item').forEach(link => link.classList.remove('active'));
            item.classList.add('active');
            const targetPanel = item.getAttribute('href')?.replace('#', '');
            if (targetPanel) showPortalPanel(targetPanel);
        });
    });

    const LOCAL_STORAGE_TUTORS_KEY = 'catalyst-tutor-data';
    const LOCAL_STORAGE_SELECTED_TUTOR = 'catalyst-selected-tutor';

    const defaultTutorData = {
        olivia: {
            name: 'Olivia Miller',
            course: 'Matemáticas Avanzadas',
            description: 'Funciones, derivadas y análisis en un solo curso práctico.',
            resources: [
                { type: 'PDF', title: 'Guía de funciones', url: '#' },
                { type: 'Video', title: 'Clase: Límites y continuidad', url: '#' }
            ]
        },
        liam: {
            name: 'Liam García',
            course: 'Inglés Comunicativo',
            description: 'Conversación, lectura y práctica de expresiones reales.',
            resources: [
                { type: 'PDF', title: 'Ejercicios de comprensión', url: '#' },
                { type: 'Video', title: 'Sesión de pronunciación', url: '#' }
            ]
        },
        jackson: {
            name: 'Jackson López',
            course: 'Ciencias y física',
            description: 'Experimentos, fórmulas y conceptos clave con apoyo visual.',
            resources: [
                { type: 'PDF', title: 'Resumen de fuerzas', url: '#' },
                { type: 'Enlace', title: 'Simulador de aparatos', url: '#' }
            ]
        }
    };

    const getTutorData = () => {
        const saved = localStorage.getItem(LOCAL_STORAGE_TUTORS_KEY);
        if (!saved) {
            localStorage.setItem(LOCAL_STORAGE_TUTORS_KEY, JSON.stringify(defaultTutorData));
            return defaultTutorData;
        }
        try {
            const parsed = JSON.parse(saved);
            return { ...defaultTutorData, ...parsed };
        } catch {
            return defaultTutorData;
        }
    };

    const setTutorData = (data) => localStorage.setItem(LOCAL_STORAGE_TUTORS_KEY, JSON.stringify(data));

    const renderStudentResources = () => {
        const container = document.getElementById('student-resources');
        if (!container) return;
        const tutors = getTutorData();
        const resources = Object.values(tutors).flatMap(tutor => tutor.resources.map(resource => ({ ...resource, tutor: tutor.name, course: tutor.course })));
        if (!resources.length) {
            container.innerHTML = '<p>No hay recursos publicados aún.</p>';
            return;
        }
        container.innerHTML = resources.map(resource => `
            <article class="resource-card">
                <div>
                    <strong>${resource.title}</strong>
                    <p>${resource.course} · ${resource.type} · ${resource.tutor}</p>
                </div>
                <a href="${resource.url}" class="link-secondary">Ver</a>
            </article>
        `).join('');
    };

    const renderCourseResources = () => {
        const container = document.getElementById('course-resources');
        if (!container) return;
        const tutors = getTutorData();
        const courseTutor = Object.values(tutors).find(tutor => tutor.course.toLowerCase().includes('matemáticas')) || Object.values(tutors)[0];
        if (!courseTutor || !courseTutor.resources.length) {
            container.innerHTML = '<p>No hay recursos disponibles para este curso.</p>';
            return;
        }
        container.innerHTML = courseTutor.resources.map(resource => `
            <article class="resource-card">
                <div>
                    <strong>${resource.title}</strong>
                    <p>${resource.type} · ${courseTutor.name}</p>
                </div>
                <a href="${resource.url}" class="btn-outline">Abrir</a>
            </article>
        `).join('');
    };

    const tutorListContainer = document.getElementById('tutor-list');
    if (tutorListContainer) {
        let tutorData = getTutorData();
        let activeTutor = localStorage.getItem(LOCAL_STORAGE_SELECTED_TUTOR) || 'olivia';

        const renderTutorList = () => {
            tutorListContainer.innerHTML = Object.entries(tutorData).map(([key, tutor]) => `
                <button class="tutor-card ${key === activeTutor ? 'active' : ''}" type="button" data-key="${key}">
                    <div class="tutor-avatar">${tutor.name.split(' ').map(name => name[0]).join('')}</div>
                    <div>
                        <strong>${tutor.name}</strong>
                        <span>${tutor.course}</span>
                    </div>
                </button>
            `).join('');
            tutorListContainer.querySelectorAll('.tutor-card').forEach(button => {
                button.addEventListener('click', () => {
                    activeTutor = button.dataset.key;
                    localStorage.setItem(LOCAL_STORAGE_SELECTED_TUTOR, activeTutor);
                    updateTutorEditor();
                });
            });
        };

        const renderTutorResourceRows = () => {
            const editor = document.getElementById('resource-list');
            const tutor = tutorData[activeTutor];
            if (!editor || !tutor) return;
            editor.innerHTML = tutor.resources.map((resource, index) => `
                <div class="resource-row saved">
                    <div>
                        <strong>${resource.title}</strong>
                        <p>${resource.type} · <a href="${resource.url}" target="_blank">Abrir</a></p>
                    </div>
                    <button class="btn-secondary resource-remove" type="button" data-index="${index}">Eliminar</button>
                </div>
            `).join('');
            editor.querySelectorAll('.resource-remove').forEach(button => {
                button.addEventListener('click', () => {
                    tutorData[activeTutor].resources.splice(Number(button.dataset.index), 1);
                    setTutorData(tutorData);
                    renderTutorResourceRows();
                    renderTutorStudentPreview();
                    renderStudentResources();
                    renderCourseResources();
                });
            });
        };

        const renderTutorStudentPreview = () => {
            const preview = document.getElementById('student-preview');
            const tutor = tutorData[activeTutor];
            if (!preview || !tutor) return;
            preview.innerHTML = `
                <div class="resource-card highlight">
                    <div>
                        <strong>${tutor.course}</strong>
                        <p>${tutor.description}</p>
                    </div>
                </div>
                ${tutor.resources.map(resource => `
                    <article class="resource-card">
                        <div>
                            <strong>${resource.title}</strong>
                            <p>${resource.type} · ${tutor.name}</p>
                        </div>
                        <a href="${resource.url}" class="btn-outline">Ver recurso</a>
                    </article>
                `).join('')}
            `;
        };

        const updateTutorEditor = () => {
            const tutor = tutorData[activeTutor];
            if (!tutor) return;
            document.getElementById('selected-tutor-label').textContent = `${tutor.name} - ${tutor.course}`;
            document.getElementById('tutor-course-title').value = tutor.course;
            document.getElementById('tutor-course-desc').value = tutor.description;
            renderTutorList();
            renderTutorResourceRows();
            renderTutorStudentPreview();
        };

        document.getElementById('add-resource')?.addEventListener('click', event => {
            event.preventDefault();
            const titleInput = document.getElementById('resource-title');
            const typeSelect = document.getElementById('resource-type');
            const urlInput = document.getElementById('resource-url');
            const title = titleInput.value.trim();
            const type = typeSelect.value;
            const url = urlInput.value.trim() || '#';
            if (!title) return;
            tutorData[activeTutor].resources.push({ title, type, url });
            setTutorData(tutorData);
            titleInput.value = '';
            urlInput.value = '';
            renderTutorResourceRows();
            renderTutorStudentPreview();
            renderStudentResources();
            renderCourseResources();
        });

        document.getElementById('save-tutor')?.addEventListener('click', event => {
            event.preventDefault();
            const courseTitle = document.getElementById('tutor-course-title').value.trim();
            const courseDesc = document.getElementById('tutor-course-desc').value.trim();
            const tutor = tutorData[activeTutor];
            tutor.course = courseTitle || tutor.course;
            tutor.description = courseDesc || tutor.description;
            setTutorData(tutorData);
            renderTutorList();
            renderTutorStudentPreview();
            renderStudentResources();
            renderCourseResources();
            const status = document.getElementById('save-status');
            if (status) {
                status.textContent = 'Guardado correctamente.';
                setTimeout(() => { status.textContent = 'Los cambios se guardan en el navegador.'; }, 2800);
            }
        });

        updateTutorEditor();
    }

    renderStudentResources();
    renderCourseResources();

    const searchInput = document.querySelector('.search-wrapper input');
    const searchButton = document.querySelector('.search-wrapper button');

    const filterDashboard = () => {
        const query = searchInput.value.trim().toLowerCase();
        const teacherItems = document.querySelectorAll('.teacher-item');
        const adminItems = document.querySelectorAll('.course-panel .admin-list li');

        teacherItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'grid' : 'none';
        });

        adminItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'flex' : 'none';
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterDashboard);
    }
    if (searchButton) {
        searchButton.addEventListener('click', event => {
            event.preventDefault();
            filterDashboard();
        });
    }

    document.querySelectorAll('.teacher-item button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const teacherName = button.closest('.teacher-item').querySelector('strong')?.textContent || 'Tutor';
            alert(`Iniciando chat con ${teacherName}. Esta funcionalidad se puede conectar a un chat real en la próxima fase.`);
        });
    });
});
