// Dark Mode Toggle
const toggle = document.getElementById('toggle');
toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Parallax Effect for Hero Section
document.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    heroBg.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    heroContent.style.transform = 'translateY(' + scrollPosition * -0.2 + 'px)';
});

// Custom Cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// Scroll-triggered Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        } else {
            entry.target.classList.remove('animate-in');
        }
    });
}, {
    threshold: 0.1  // Trigger animations when 10% of the element is visible
});

// Select elements to animate
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});
