const topBtn = document.querySelector('.back-to-top');
const edu = document.querySelector('#Education');
const head = document.querySelector('.header');
const nav = document.querySelector('.navbar');
const form = document.querySelector('#contact-form');
const card = document.querySelector('#successCard');
const formBox = document.querySelector('.contact-form-section');
const themeToggle = document.querySelector('.theme-toggle');
let showTimer;
let hideTimer;

function typeName() {
    const name = document.querySelector('.typing-name');

    if (!name) {
        return;
    }

    const fullName = name.textContent;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    name.textContent = '';
    let letterIndex = 0;
    let deleting = false;

    function updateName() {
        name.textContent = fullName.slice(0, letterIndex);

        if (!deleting && letterIndex === fullName.length) {
            deleting = true;
            setTimeout(updateName, 2000);
            return;
        }

        if (deleting && letterIndex === 0) {
            deleting = false;
            setTimeout(updateName, 850);
            return;
        }

        letterIndex += deleting ? -1 : 1;
        setTimeout(updateName, deleting ? 75 : 120);
    }

    updateName();
}

function setMobileTheme(isLight) {
    document.body.classList.toggle('mobile-light-mode', isLight);
    if (!themeToggle) {
        return;
    }

    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.querySelector('i').className = isLight ? 'bx bx-moon' : 'bx bx-sun';
    themeToggle.querySelector('span').textContent = isLight ? 'Dark mode' : 'Light mode';
}

function showTop() {
    if (!topBtn || !edu) {
        return;
    }

    const pageBottom = window.scrollY + window.innerHeight;
    const eduTop = edu.offsetTop + 120;

    if (pageBottom >= eduTop) {
        topBtn.classList.add('show-back-to-top');
    } else {
        topBtn.classList.remove('show-back-to-top');
    }
}


function setNav(btn, open) {
    if (open) {
        head.classList.add('nav-open');
        nav.classList.add('mobile-open');
        document.body.classList.add('mobile-nav-open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation menu');
    } else {
        head.classList.remove('nav-open');
        nav.classList.remove('mobile-open');
        document.body.classList.remove('mobile-nav-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
    }
}

function sizeNav(btn) {
    if (window.innerWidth > 768) {
        setNav(btn, false);
        btn.style.display = 'none';
    } else {
        btn.style.display = 'flex';

        if (head.classList.contains('nav-open')) {
            nav.classList.add('mobile-open');
        } else {
            nav.classList.remove('mobile-open');
        }
    }
}


function menu() {
    if (!head || !nav) {
        return;
    }

    let btn = head.querySelector('.mobile-menu-btn');

    if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mobile-menu-btn';
        btn.setAttribute('aria-label', 'Open navigation menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', nav.id);
        btn.innerHTML = '<span></span><span></span><span></span>';
        head.appendChild(btn);
    }

    btn.addEventListener('click', function () {
        const open = head.classList.contains('nav-open');
        setNav(btn, !open);
    });

    const links = nav.querySelectorAll(':scope > a');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            for (let j = 0; j < links.length; j++) {
                links[j].classList.toggle('active', links[j] === this);
            }

            if (window.innerWidth <= 768) {
                setNav(btn, false);
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            setMobileTheme(!document.body.classList.contains('mobile-light-mode'));
        });
    }

    document.addEventListener('pointerdown', function (event) {
        if (window.innerWidth <= 768 && head.classList.contains('nav-open') && !head.contains(event.target)) {
            setNav(btn, false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && head.classList.contains('nav-open')) {
            setNav(btn, false);
            btn.focus();
        }
    });

    window.addEventListener('resize', function () {
        sizeNav(btn);
    });

    sizeNav(btn);
}

function setBtn(btn, text, type, oldText) {
    btn.textContent = text;
    btn.classList.add('submit-' + type);

    setTimeout(function () {
        btn.textContent = oldText;
        btn.classList.remove('submit-' + type);
    }, 3000);
}


function showMsg() {
    if (!card) {
        return;
    }

    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    card.classList.remove('is-hiding');

    if (formBox) {
        formBox.style.display = 'none';
    }

    card.style.display = 'block';

    requestAnimationFrame(function () {
        card.classList.add('show');
    });

    showTimer = setTimeout(hideMsg, 4000);
}


function hideMsg() {
    if (!card) {
        return;
    }

    clearTimeout(showTimer);
    card.classList.remove('show');
    card.classList.add('is-hiding');

    hideTimer = setTimeout(function () {
        card.style.display = 'none';
        card.classList.remove('is-hiding');

        if (formBox) {
            formBox.style.display = 'block';
        }
    }, 300);
}


async function sendForm(event) {
    event.preventDefault();

    const btn = form.querySelector('button[type="submit"]');

    if (!btn) {
        return;
    }

    const oldText = btn.textContent;
    btn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                Accept: 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Message could not be sent');
        }

        setBtn(btn, 'Message sent successfully', 'success', oldText);
        form.reset();
        showMsg();
    } catch (error) {
        setBtn(btn, 'Message could not be sent', 'error', oldText);
    } finally {
        btn.disabled = false;
    }
}

window.showSuccessMessage = showMsg;
window.hideSuccessMessage = hideMsg;

window.addEventListener('scroll', showTop);
window.addEventListener('resize', showTop);

menu();
typeName();

if (form) {
    form.addEventListener('submit', sendForm);
}

showTop();
