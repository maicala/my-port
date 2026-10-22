const projects = window.portfolioVideos;
const sections = { ads: 'ads-grid', short: 'shorts-grid', long: 'long-grid' };
document.querySelector('#year').textContent = new Date().getFullYear();

function renderHomeProjects() {
  Object.entries(sections).forEach(([group, gridId]) => {
    const items = projects.filter(project => project.group === group).slice(0, 2);
    document.querySelector(`#${gridId}`).innerHTML = items
      .map((project, index) => window.portfolioCardMarkup(project, index))
      .join('');
  });
}
renderHomeProjects();
document.addEventListener('languagechange', renderHomeProjects);
document.querySelector('#language-toggle')?.addEventListener('click', () => {
  window.setSiteLanguage(window.siteLanguage === 'en' ? 'ar' : 'en');
});

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
progress.innerHTML = '<span></span>';
document.body.prepend(progress);

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const amount = available > 0 ? window.scrollY / available : 0;
    progress.firstElementChild.style.transform = `scaleX(${amount})`;
    scrollFrame = 0;
  });
}, { passive: true });

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = document.querySelectorAll('.shortcut-window-inner, .portfolio-heading, .project-card, .more-button, .approach-lead, .approach-roles, .approach-toolkit, .contact-top, .contact h2, .contact-bottom');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });

  revealTargets.forEach((element, index) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    revealObserver.observe(element);
  });
}
