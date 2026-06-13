import { animate, inView, stagger, scroll, prefersReducedMotion } from 'motion';

const EASE_OUT = [0.2, 0, 0, 1] as [number, number, number, number];

function shouldReduceMotion(): boolean {
  return prefersReducedMotion.current === true;
}

function initAnimations() {
  if (shouldReduceMotion()) return;

  inView('[data-motion="fade-up"]', (el) => {
    animate(el, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6, ease: EASE_OUT });
  }, { margin: '-60px' });

  inView('[data-motion="fade-up-children"]', (el) => {
    const children = el.querySelectorAll(':scope > *');
    if (!children.length) {
      animate(el, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6, ease: EASE_OUT });
      return;
    }
    animate(children, { opacity: [0, 1], y: [40, 0] }, { duration: 0.5, delay: stagger(0.08), ease: EASE_OUT });
  }, { margin: '-40px' });

  inView('[data-motion="scale-up"]', (el) => {
    animate(el, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5, ease: EASE_OUT });
  }, { margin: '-40px' });

  inView('[data-motion="scale-up-children"]', (el) => {
    const children = el.querySelectorAll(':scope > *');
    if (!children.length) {
      animate(el, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5, ease: EASE_OUT });
      return;
    }
    animate(children, { opacity: [0, 1], scale: [0.92, 1] }, { duration: 0.45, delay: stagger(0.06), ease: EASE_OUT });
  }, { margin: '-30px' });

  inView('[data-motion="slide-in-left"]', (el) => {
    animate(el, { opacity: [0, 1], x: [-60, 0] }, { duration: 0.6, ease: EASE_OUT });
  }, { margin: '-40px' });

  inView('[data-motion="slide-in-right"]', (el) => {
    animate(el, { opacity: [0, 1], x: [60, 0] }, { duration: 0.6, ease: EASE_OUT });
  }, { margin: '-40px' });

  inView('.akari-sponsor-wall', (el) => {
    animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6, ease: EASE_OUT });
  }, { margin: '-40px' });

  const heroBanner = document.querySelector('.akari-hero-banner');
  if (heroBanner) {
    animate(heroBanner, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, ease: EASE_OUT });
  }

  const heroContent = document.querySelector('.akari-hero-content__inner');
  if (heroContent) {
    const els = Array.from(heroContent.children);
    if (els.length) {
      animate(els, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: stagger(0.1, { startDelay: 0.2 }), ease: EASE_OUT });
    }
  }

  const articleHero = document.querySelector('.article-hero');
  if (articleHero) {
    animate(articleHero, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, ease: EASE_OUT });
  }

  const articleProse = document.querySelector('.article-prose') as HTMLElement | null;
  if (articleProse) {
    animate(articleProse, { opacity: [0, 1] }, { duration: 0.5, delay: 0.3, ease: 'ease-out' as any });
  }

  const readProgress = document.querySelector('[data-motion="read-progress"]');
  if (readProgress) {
    scroll(animate(readProgress, { scaleX: [0, 1] }, { ease: 'linear' }));
  }

  const searchModal = document.getElementById('akari-search-modal');
  if (searchModal) {
    const observer = new MutationObserver(() => {
      const isOpen = searchModal.getAttribute('aria-hidden') === 'false';
      const content = searchModal.querySelector('.akari-search-modal__content');
      if (content && isOpen) {
        animate(content, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.25, ease: EASE_OUT });
      }
    });
    observer.observe(searchModal, { attributes: true, attributeFilter: ['aria-hidden'] });
  }
}

function init() {
  initAnimations();
}

document.addEventListener('astro:page-load', init);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
