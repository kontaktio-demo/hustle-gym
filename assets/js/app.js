
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mqDesk = window.matchMedia("(min-width: 901px)");
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.config({ nullTargetWarn: false });

  
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  
  function startSite() {
    document.body.classList.add("ready");
    if (document.querySelector(".hero")) heroIntro();
    buildScroll();
  }
  function preloader() {
    const loader = document.getElementById("loader");
    if (!loader) { startSite(); return; }
    const word = loader.querySelector(".loader__word span");
    const bar = loader.querySelector(".loader__bar i");
    const pct = document.getElementById("pct");
    if (reduce) { loader.style.display = "none"; startSite(); return; }
    if (lenis) lenis.stop();
    const tl = gsap.timeline({ onComplete: startSite });
    tl.to(word, { y: "0%", duration: .9, ease: "expo.out" }, .1)
      .to(bar, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, .2)
      .to({ v: 0 }, { v: 100, duration: 1.3, ease: "power2.inOut",
        onUpdate() { pct.textContent = Math.round(this.targets()[0].v); } }, .2)
      .to(loader.querySelector(".loader__inner"), { y: -40, opacity: 0, duration: .6, ease: "power2.in" }, "+=.15")
      .to(loader, { yPercent: -100, duration: .9, ease: "expo.inOut",
        onStart() { if (lenis) lenis.start(); },
        onComplete() { loader.style.display = "none"; } }, "-=.2");
  }

  
  function heroIntro() {
    const lines = document.querySelectorAll(".hero__title .reveal-line > span");
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo("[data-hero-img] img", { scale: 1.18 }, { scale: 1, duration: 2.2, ease: "power2.out" }, 0)
      .from(".hero__eyebrow", { y: 16, opacity: 0, duration: .7 }, .3)
      .from(lines, { yPercent: 110, duration: 1.2, stagger: .08 }, .4)
      .from(".hero__sub", { y: 24, opacity: 0, duration: .9 }, .85)
      .from(".hero__actions > *", { y: 20, opacity: 0, duration: .8, stagger: .1 }, .95)
      .from(".nav", { yPercent: -100, opacity: 0, duration: .9 }, .4);

    if (!reduce) {
      gsap.to("[data-hero-img]", {
        yPercent: 16, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
      gsap.to(".hero__inner", {
        yPercent: -14, opacity: .35, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }
  }

  
  function maskReveal(selector) {
    if (reduce) return;
    gsap.utils.toArray(selector).forEach((el) => {
      if (el.dataset.masked) return;
      el.dataset.masked = "1";
      el.removeAttribute("data-anim");
      const inner = document.createElement("span");
      inner.className = "reveal__i";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
      el.classList.add("reveal");
      gsap.from(inner, {
        yPercent: 118, duration: 1.15, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%" }
      });
    });
  }

  function buildScroll() {
    
    maskReveal(".eyebrow-row .h-lg, .quote__big");

    
    if (!reduce) {
      gsap.set("[data-anim='fade-up']", { y: 44, opacity: 0 });
      ScrollTrigger.batch("[data-anim='fade-up']", {
        start: "top 90%",
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true })
      });
    }

    
    document.querySelectorAll("[data-words]").forEach((node) => {
      const html = node.innerHTML;

      const tmp = document.createElement("div"); tmp.innerHTML = html;
      const out = [];
      tmp.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (w.trim()) out.push(`<span class="word">${w}</span>`);
            else out.push(w);
          });
        } else {
          out.push(`<span class="word">${n.outerHTML}</span>`);
        }
      });
      node.innerHTML = out.join("");
      gsap.from(node.querySelectorAll(".word"), {
        opacity: .12, duration: 1, ease: "none", stagger: .04,
        scrollTrigger: { trigger: node, start: "top 80%", end: "top 35%", scrub: 1 }
      });
    });

    
    if (mqDesk.matches && !reduce) {
      gsap.utils.toArray(".hscroll").forEach((hscroll) => {
        const htrack = hscroll.querySelector(".hscroll__track");
        if (!htrack) return;
        const dist = () => htrack.scrollWidth - window.innerWidth + (parseFloat(getComputedStyle(htrack).paddingRight) || 0);
        gsap.to(htrack, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: hscroll, start: "top top", end: () => "+=" + dist(),
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
        gsap.from(hscroll.querySelectorAll(".hcard"), {
          opacity: 0, y: 50, duration: 1, ease: "expo.out", stagger: .08,
          scrollTrigger: { trigger: hscroll, start: "top 70%" }
        });
      });
    }

    
    gsap.utils.toArray(".wave path").forEach((p) => {
      if (reduce) return;
      gsap.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: p.closest(".wave"), start: "top 92%", end: "top 45%", scrub: true }
      });
    });

    
    if (!reduce && document.querySelector(".quote")) {
      gsap.to("[data-quote-img] img", {
        yPercent: -14, ease: "none",
        scrollTrigger: { trigger: ".quote", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    
    gsap.from(".footer__big", {
      yPercent: 24, scale: .97, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".footer", start: "top 90%" }
    });

    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 600);
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  
  const nav = document.getElementById("nav");
  let navHidden = false, prevY = 0;
  const menuIsOpen = () => { const m = document.getElementById("menu"); return !!m && m.classList.contains("open"); };
  const showNav = () => { if (!navHidden) return; navHidden = false; gsap.to(nav, { yPercent: 0, duration: .6, ease: "power3.out", overwrite: true }); };
  const hideNav = () => { if (navHidden || menuIsOpen()) return; navHidden = true; gsap.to(nav, { yPercent: -135, duration: .5, ease: "power3.inOut", overwrite: true }); };
  function tickNav() {
    const y = lenis ? lenis.animatedScroll : window.scrollY;
    nav.classList.toggle("shrink", y > 60);
    const d = y - prevY;
    if (y < 150) showNav();
    else if (d > 3) hideNav();
    else if (d < -3) showNav();
    prevY = y;
  }
  if (lenis) gsap.ticker.add(tickNav);
  else addEventListener("scroll", tickNav, { passive: true });

  const menu = document.getElementById("menu");
  const burger = document.getElementById("burger");
  const openMenu = () => { menu.classList.add("open"); gsap.to(menu, { clipPath: "inset(0 0 0% 0)", duration: .8, ease: "expo.inOut" });
    gsap.from(".menu__list li a", { y: 60, opacity: 0, duration: .7, stagger: .06, ease: "expo.out", delay: .2 });
    if (lenis) lenis.stop(); };
  const closeMenu = () => { gsap.to(menu, { clipPath: "inset(0 0 100% 0)", duration: .7, ease: "expo.inOut",
    onComplete: () => menu.classList.remove("open") }); if (lenis) lenis.start(); };
  burger?.addEventListener("click", openMenu);
  document.getElementById("menuClose")?.addEventListener("click", closeMenu);

  
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (a.hasAttribute("data-menu")) { closeMenu(); setTimeout(() => scrollTo(id), 400); }
      else scrollTo(id);
    });
  });

  
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const key = tab.dataset.tab;
      document.querySelectorAll(".pane").forEach((p) => p.classList.toggle("active", p.dataset.pane === key));
      const active = document.querySelector(`.pane[data-pane="${key}"]`);
      gsap.fromTo(active.querySelectorAll(".plan"),
        { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: "expo.out" });
      ScrollTrigger.refresh();
    });
  });

  
  document.querySelectorAll(".faq__item").forEach((item) => {
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach((o) => {
        if (o !== item) { o.classList.remove("open"); gsap.to(o.querySelector(".faq__a"), { height: 0, duration: .4, ease: "power2.inOut" }); }
      });
      if (open) { item.classList.remove("open"); gsap.to(a, { height: 0, duration: .4, ease: "power2.inOut" }); }
      else { item.classList.add("open"); gsap.set(a, { height: "auto" });
        gsap.from(a, { height: 0, duration: .5, ease: "power2.inOut", onComplete: () => ScrollTrigger.refresh() }); }
    });
  });

  
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.className = "form__msg";
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      msg.textContent = "Uzupełnij wymagane pola.";
      msg.classList.add("error"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Wpisz poprawny adres e-mail.";
      msg.classList.add("error"); return;
    }
    msg.textContent = "Dziękujemy! Twoja wiadomość została wysłana - odezwiemy się wkrótce.";
    msg.classList.add("success");
    form.reset();
    gsap.fromTo(msg, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5 });
  });

  
  if (document.readyState === "complete") preloader();
  else addEventListener("load", preloader);
  addEventListener("resize", () => ScrollTrigger.refresh());
})();
