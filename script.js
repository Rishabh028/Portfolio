document.addEventListener('DOMContentLoaded', () => {

    // --- CORE UI & NAVIGATION ---
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');
    const scrollTop = document.querySelector('.scroll-top');
    const sections = document.querySelectorAll('section');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => navList.classList.toggle('active'));
        navLinks.forEach(link => link.addEventListener('click', () => navList.classList.remove('active')));
    }

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scroll-header', window.scrollY > 50);
        if (scrollTop) scrollTop.classList.toggle('active', window.scrollY > 300);

        let currentSectionId = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 200) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    if (scrollTop) {
        scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- DARK/LIGHT THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const lightThemeClass = 'light-theme';
    const moonIcon = 'fa-moon';
    const sunIcon = 'fa-sun';

    // Function to apply the saved theme on page load
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('selected-theme');
        const savedIcon = localStorage.getItem('selected-icon');

        if (savedTheme === 'light') {
            body.classList.add(lightThemeClass);
            themeToggle.classList.remove(moonIcon);
            themeToggle.classList.add(sunIcon);
        } else {
            body.classList.remove(lightThemeClass);
            themeToggle.classList.remove(sunIcon);
            themeToggle.classList.add(moonIcon);
        }
    };

    // Event listener for the theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle(lightThemeClass);
            
            // Check current theme, update icon, and save to localStorage
            if (body.classList.contains(lightThemeClass)) {
                themeToggle.classList.remove(moonIcon);
                themeToggle.classList.add(sunIcon);
                themeToggle.style.transform = 'rotate(360deg)';
                localStorage.setItem('selected-theme', 'light');
                localStorage.setItem('selected-icon', sunIcon);
            } else {
                themeToggle.classList.remove(sunIcon);
                themeToggle.classList.add(moonIcon);
                themeToggle.style.transform = 'rotate(0deg)';
                localStorage.setItem('selected-theme', 'dark');
                localStorage.setItem('selected-icon', moonIcon);
            }
        });
    }

    // Apply the theme when the DOM is loaded
    applySavedTheme();

    // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // --- PROJECT MODAL FUNCTIONS ---
    window.openProjectModal = (id) => {
        const modal = document.getElementById(`${id}-modal`);
        if(modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    };
    window.closeModal = (id) => {
        const modal = document.getElementById(`${id}-modal`);
        if(modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };
    document.querySelectorAll('.project-modal').forEach(modal => {
        modal.addEventListener('click', (e) => (e.target === modal) && closeModal(modal.id.replace('-modal', '')));
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll('.project-modal').forEach(modal => {
                if (modal.style.display === "block") closeModal(modal.id.replace('-modal', ''));
            });
        }
    });

    // --- SKILLS SECTION HOVER-TO-CENTER ANIMATION ---
    const skillIcons = document.querySelectorAll('.skill-icon');
    const centerDisplay = document.getElementById('center-skill-display');
    const orbits = document.querySelectorAll('.skills-orbit');
    const core = document.querySelector('.skills-sphere-core');

    if (skillIcons.length > 0 && centerDisplay && orbits.length > 0 && core) {
        skillIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                const imgSrc = icon.querySelector('img').src;
                const imgAlt = icon.querySelector('img').alt;
                // MODIFICATION: Get the skill name from the icon's title attribute
                const skillName = icon.getAttribute('title');

                // MODIFICATION: Update innerHTML to include the image AND the name
                centerDisplay.innerHTML = `
                    <img src="${imgSrc}" alt="${imgAlt}" />
                    <span class="center-skill-name">${skillName}</span>
                `;

                centerDisplay.classList.add('active');
                icon.classList.add('hovered-skill');
            });
            icon.addEventListener('mouseleave', () => {
                centerDisplay.classList.remove('active');
                setTimeout(() => {
                    icon.classList.remove('hovered-skill');
                }, 300);
            });
        });
    }

    // --- AUTO POSITIONING FOR ORBIT ICONS ---
    document.querySelectorAll('.skills-orbit').forEach(orbit => {
        const icons = orbit.querySelectorAll('.skill-icon');
        const count = icons.length;
        const radius = orbit.offsetWidth / 2;

        icons.forEach((icon, i) => {
            const angle = (2 * Math.PI / count) * i;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            icon.style.left = `calc(50% + ${x}px)`;
            icon.style.top  = `calc(50% - ${y}px)`;
            icon.style.transform = "translate(-50%, -50%)";
        });
    });
});
