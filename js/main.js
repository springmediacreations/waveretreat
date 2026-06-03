/* WaveRetreat — shared interactions */
(function () {
  "use strict";

  // Sticky header state
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        links.classList.remove("open");
      })
    );
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("in"));
  }

  // Count-up stats
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          let cur = 0;
          const step = Math.max(1, Math.round(target / 60));
          const tick = () => {
            cur += step;
            if (cur >= target) {
              el.textContent = target + suffix;
            } else {
              el.textContent = cur + suffix;
              requestAnimationFrame(tick);
            }
          };
          tick();
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  // Form handling (demo — no backend)
  document.querySelectorAll("form[data-enquiry]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const success = form.querySelector(".form-success");
      if (success) success.classList.add("show");
      form.querySelectorAll("input, textarea, select, button").forEach((f) => {
        if (f.type !== "button") f.setAttribute("disabled", "true");
      });
      if (success) success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // Gallery lightbox with navigation
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = document.getElementById("lightbox-img");
    const counter = document.getElementById("lightbox-counter");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");
    const items = Array.from(document.querySelectorAll(".gallery__item"));
    const imgs = items.map((it) => it.querySelector("img"));
    let current = 0;

    const render = () => {
      const img = imgs[current];
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
      if (counter) counter.textContent = current + 1 + " / " + imgs.length;
    };
    const open = (i) => {
      current = i;
      render();
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const hide = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const step = (dir) => {
      current = (current + dir + imgs.length) % imgs.length;
      render();
    };

    items.forEach((item, i) => item.addEventListener("click", () => open(i)));
    closeBtn.addEventListener("click", hide);
    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); step(1); });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) hide(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") hide();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  // Hero slideshow
  const heroSlides = Array.from(document.querySelectorAll(".hero__slide"));
  const dotsWrap = document.getElementById("hero-dots");
  if (heroSlides.length > 1) {
    let active = 0;
    const INTERVAL = 5500;
    let timer;

    // build dots
    const dots = heroSlides.map((_, i) => {
      const b = document.createElement("button");
      b.className = "hero__dot" + (i === 0 ? " active" : "");
      b.setAttribute("aria-label", "Show slide " + (i + 1));
      b.addEventListener("click", () => {
        go(i);
        restart();
      });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    const go = (i) => {
      heroSlides[active].classList.remove("active");
      dots[active] && dots[active].classList.remove("active");
      active = (i + heroSlides.length) % heroSlides.length;
      heroSlides[active].classList.add("active");
      dots[active] && dots[active].classList.add("active");
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(active + 1), INTERVAL);
    };

    // prev / next arrows
    const prevBtn = document.getElementById("hero-prev");
    const nextBtn = document.getElementById("hero-next");
    if (prevBtn) prevBtn.addEventListener("click", () => { go(active - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { go(active + 1); restart(); });

    restart();
  }

  // Footer year
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
