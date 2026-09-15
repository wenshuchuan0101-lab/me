const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const revealItems = document.querySelectorAll('.reveal:not(.is-visible)');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = href; }, 220);
  });
});

const videoNames = { 'fengyu.html': 'fengyu.mp4', 'gift.html': 'gift.mp4', 'cangfeng.html': 'cangfeng.mp4' };
const pageVideo = videoNames[window.location.pathname.split('/').pop()];
const videoPlaceholder = document.querySelector('.media-placeholder');
if (pageVideo && videoPlaceholder) {
  const slot = document.createElement('div');
  slot.className = 'video-slot';
  slot.innerHTML = `<video controls preload="metadata" playsinline aria-label="作品视频"><source src="../assets/videos/${pageVideo}" type="video/mp4">当前浏览器不支持视频播放。</video><p class="video-note">将视频放入 assets/videos/${pageVideo}</p>`;
  videoPlaceholder.replaceWith(slot);
  const video = slot.querySelector('video');
  const note = slot.querySelector('.video-note');
  video.addEventListener('play', () => { note.textContent = '正在播放 · ' + pageVideo; });
  video.addEventListener('pause', () => { note.textContent = '已暂停 · ' + pageVideo; });
}
