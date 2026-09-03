const backToTopBtn = document.querySelector('.back-to-top');
const educationSection = document.querySelector('#Education');

const toggleBackToTop = () => {
    if (!backToTopBtn || !educationSection) return;
    const reachedLastArea = window.scrollY + window.innerHeight >= educationSection.offsetTop + 120;
    backToTopBtn.classList.toggle('show-back-to-top', reachedLastArea);
};

window.addEventListener('scroll', toggleBackToTop);
window.addEventListener('resize', toggleBackToTop);
toggleBackToTop();