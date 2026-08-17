const backToTopBtn = document.querySelector('.back-to-top');
const contactSection = document.querySelector('#Contact');

const toggleBackToTop = () => {
    if (!backToTopBtn || !contactSection) return;
    const reachedLastArea = window.scrollY + window.innerHeight >= contactSection.offsetTop + 120;
    backToTopBtn.classList.toggle('show-back-to-top', reachedLastArea);
};

window.addEventListener('scroll', toggleBackToTop);
window.addEventListener('resize', toggleBackToTop);
toggleBackToTop();