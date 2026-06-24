const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.nav a');
const glow = document.querySelector('.cursor-glow');

menuButton?.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
  menuButton.textContent = document.body.classList.contains('menu-open') ? 'Fechar' : 'Menu';
});

navLinks.forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  if (menuButton) menuButton.textContent = 'Menu';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-reveal').forEach(section => revealObserver.observe(section));

window.addEventListener('pointermove', (event) => {
  if (!glow || window.innerWidth < 900) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const board = document.querySelector('.hero-board');
window.addEventListener('mousemove', event => {
  if (!board || window.innerWidth < 1000) return;
  const x = (event.clientX / window.innerWidth - .5) * 12;
  const y = (event.clientY / window.innerHeight - .5) * 12;
  board.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});
