const topBtn = document.querySelector('.back-to-top');
const edu = document.querySelector('#Education');
const head = document.querySelector('.header');
const nav = document.querySelector('.navbar');
const form = document.querySelector('#contact-form');
const card = document.querySelector('#successCard');
const formBox = document.querySelector('.contact-form-section');
let showTimer;
let hideTimer;

// Show the back-to-top button near the education section.
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

// Open or close the mobile navigation.
function setNav(btn, open) {
    if (open) {
        head.classList.add('nav-open');
        nav.classList.add('mobile-open');
        btn.setAttribute('aria-expanded', 'true');
    } else {
        head.classList.remove('nav-open');
        nav.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
    }
}

// Hide the menu button on larger screens.
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

// Create and use the mobile menu button.
function menu() {
    if (!head || !nav) {
        return;
    }

    let btn = head.querySelector('.mobile-menu-btn');

    if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mobile-menu-btn';
        btn.setAttribute('aria-label', 'Toggle navigation menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';
        head.appendChild(btn);
    }

    btn.addEventListener('click', function () {
        const open = head.classList.contains('nav-open');
        setNav(btn, !open);
    });

    const links = nav.querySelectorAll('a');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                setNav(btn, false);
            }
        });
    }

    window.addEventListener('resize', function () {
        sizeNav(btn);
    });

    sizeNav(btn);
}

// Change the submit button text for a few seconds.
function setBtn(btn, text, type, oldText) {
    btn.textContent = text;
    btn.classList.add('submit-' + type);

    setTimeout(function () {
        btn.textContent = oldText;
        btn.classList.remove('submit-' + type);
    }, 3000);
}

// Show the message sent card.
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

// Hide the message sent card and show the form again.
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

// Send the contact form without leaving the page.
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

if (form) {
    form.addEventListener('submit', sendForm);
}

showTop();
