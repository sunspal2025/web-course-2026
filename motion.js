/* Portfolio-only enhancement. The page stays visible if JS or these APIs are unavailable. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const running = new Set();
  let observer;

  function stop() {
    observer?.disconnect();
    running.forEach((animation) => animation.cancel());
    running.clear();
  }

  function observe() {
    stop();
    if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate)
      return;
    observer = new IntersectionObserver(
      (entries) => {
        if (preference.matches) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          observer.unobserve(entry.target);
          if (entry.target.contains(document.activeElement)) return;
          const animation = entry.target.animate(
            [
              { opacity: 0, transform: 'translateY(18px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'none' },
          );
          running.add(animation);
          animation.onfinish = animation.oncancel = () => running.delete(animation);
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll('.work, .focus-strip article, .collection-header, .contact-card > *')
      .forEach((element) => {
        if (!seen.has(element)) observer.observe(element);
      });
  }

  preference.addEventListener('change', observe);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) observe();
  });
  observe();
})();
