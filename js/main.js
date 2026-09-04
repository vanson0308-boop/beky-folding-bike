/* 共用互動：語言切換、側滑選單、Topics 輪播 */
(function () {
  // 語言
  document.querySelectorAll('.lang__btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  applyLang(getLang());

  // 側滑選單
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  const setMenu = open => {
    drawer.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  document.getElementById('menuOpen')?.addEventListener('click', () => setMenu(true));
  document.getElementById('menuClose')?.addEventListener('click', () => setMenu(false));
  overlay?.addEventListener('click', () => setMenu(false));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // 生活照輪播：交叉淡入淡出，非顯示組別在切換時才載入
  const gallery = document.getElementById('lifeGallery');
  if (gallery) {
    const GALLERY_INTERVAL = 6000;
    const slides = [...gallery.querySelectorAll('.gallery__slide')];
    const nav = gallery.nextElementSibling;
    const dots = nav.querySelector('.dots');
    let index = 0, paused = false, timer;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => show(i));
      dots.appendChild(d);
    });
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!paused && !document.hidden) show(index + 1);
        else schedule();
      }, GALLERY_INTERVAL);
    };
    const show = i => {
      index = (i + slides.length) % slides.length;
      slides[index].querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        delete img.dataset.src;
      });
      slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
      dots.querySelectorAll('button').forEach((b, k) => b.classList.toggle('is-active', k === index));
      schedule();
    };
    nav.querySelectorAll('.arrow').forEach(b => b.addEventListener('click', () => show(index + Number(b.dataset.dir))));
    gallery.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
    gallery.addEventListener('mouseleave', () => { paused = false; schedule(); });
    document.addEventListener('visibilitychange', schedule);
    show(0);
  }

  // LINE QR 視窗：所有 [data-line] 連結開啟；X、遮罩、Esc 關閉
  const lineModal = document.getElementById('lineModal');
  if (lineModal) {
    const setLine = open => {
      lineModal.classList.toggle('is-open', open);
      lineModal.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    document.querySelectorAll('[data-line]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); setMenu(false); setLine(true); }));
    lineModal.querySelector('[data-line-close]').addEventListener('click', () => setLine(false));
    lineModal.addEventListener('click', e => { if (e.target === lineModal) setLine(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setLine(false); });
  }

  // 輪播（scroll-snap + 箭頭）
  const carousel = document.getElementById('topicsCarousel');
  if (carousel) {
    document.querySelectorAll('.carousel__nav .arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = carousel.firstElementChild;
        const step = card ? card.getBoundingClientRect().width + 28 : 400;
        carousel.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
      });
    });
  }
})();
