const backToTopBtn = document.querySelector('.back-to-top');
const educationSection = document.querySelector('#Education');
const header = document.querySelector('.header');
const navbar = document.querySelector('.navbar');
const contactForm = document.querySelector('#contact-form');

const toggleBackToTop = () => {
    if (!backToTopBtn || !educationSection) return;
    const reachedLastArea = window.scrollY + window.innerHeight >= educationSection.offsetTop + 120;
    backToTopBtn.classList.toggle('show-back-to-top', reachedLastArea);
};

const initMobileMenu = () => {
    if (!header || !navbar) return;

    let menuBtn = header.querySelector('.mobile-menu-btn');

    if (!menuBtn) {
        menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        menuBtn.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(menuBtn);
    }

    const syncMenuState = () => {
        if (window.innerWidth > 768) {
            header.classList.remove('nav-open');
            navbar.classList.remove('mobile-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.style.display = 'none';
            navbar.style.removeProperty('display');
            navbar.style.removeProperty('visibility');
            navbar.style.removeProperty('opacity');
            navbar.style.removeProperty('max-height');
            navbar.style.removeProperty('transform');
            navbar.style.removeProperty('pointer-events');
        } else {
            menuBtn.style.display = 'flex';
            navbar.style.removeProperty('display');
            navbar.style.removeProperty('visibility');
            navbar.style.removeProperty('opacity');
            navbar.style.removeProperty('max-height');
            navbar.style.removeProperty('transform');
            navbar.style.removeProperty('pointer-events');
            navbar.classList.toggle('mobile-open', header.classList.contains('nav-open'));
        }
    };

    const closeMenu = () => {
        header.classList.remove('nav-open');
        navbar.classList.remove('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        syncMenuState();
    };

    const openMenu = () => {
        header.classList.add('nav-open');
        navbar.classList.add('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        syncMenuState();
    };

    menuBtn.addEventListener('click', () => {
        const isOpen = header.classList.contains('nav-open');
        isOpen ? closeMenu() : openMenu();
    });

    navbar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', syncMenuState);
    syncMenuState();
};

const showButtonFeedback = (button, message, type, defaultText) => {
    const icon = document.createElement('i');
    icon.className = `bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}`;
    button.replaceChildren(icon, document.createTextNode(message));
    button.classList.add(`submit-${type}`);

    setTimeout(() => {
        button.textContent = defaultText;
        button.classList.remove(`submit-${type}`);
    }, 5000);
};

const initContactForm = () => {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const defaultButtonText = submitButton.textContent;
        submitButton.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) throw new Error('Message could not be sent');

            showButtonFeedback(submitButton, 'Message sent successfully', 'success', defaultButtonText);
            contactForm.reset();
        } catch (error) {
            showButtonFeedback(submitButton, 'Message could not be sent', 'error', defaultButtonText);
        } finally {
            submitButton.disabled = false;
        }
    });
};

window.addEventListener('scroll', toggleBackToTop);
window.addEventListener('resize', toggleBackToTop);
initMobileMenu();
initContactForm();
toggleBackToTop();