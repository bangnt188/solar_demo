"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const ease = "cubic-bezier(.16, 1, .3, 1)";

export function MotionRuntime() {
  const pathname = usePathname();
  const heroEntered = useRef(false);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    // const nativeMacWheel = /Macintosh|Mac OS X/.test(navigator.userAgent);
    const rows = Array.from(main.querySelectorAll<HTMLElement>('[data-motion-scrub="service"]'));
    const activeRows = new Set<HTMLElement>();
    const measuredRows: HTMLElement[] = [];
    const progresses: number[] = [];
    const animations = new Map<HTMLElement, Animation>();
    const seen = new WeakSet<HTMLElement>();
    const targets = main.querySelectorAll<HTMLElement>("[data-motion]");
    const heroCopy = main.querySelector<HTMLElement>(".hero-copy");
    const heroVisual = main.querySelector<HTMLElement>(".hero-visual");
    let lenis: Lenis | null = null;
    let frameId = 0;
    let ticking = false;
    let dirty = true;
    let disposed = false;
    let importing = false;
    let importToken = 0;

    const animate = (element: HTMLElement, direction: string, hero = false) => {
      if (seen.has(element)) return;
      seen.add(element);
      if (reduced.matches || document.hidden) return;

      const bounds = element.getBoundingClientRect();
      const distance = hero || direction === "left" || direction === "right"
        ? window.innerWidth + bounds.width
        : window.innerHeight + bounds.height;
      const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
      const y = direction === "up" || direction === "fade" ? distance : 0;
      const order = Number(element.dataset.motionOrder);
      const delay = hero ? 0 : Number.isFinite(order) ? Math.min(210, Math.max(0, order * 70)) : 0;
      const durationValue = getComputedStyle(document.documentElement).getPropertyValue(hero ? "--motion-hero" : "--motion-reveal").trim();
      const duration = (Number.parseFloat(durationValue) || 2) * (durationValue.endsWith("ms") ? 1 : 1000);
      // Individual translate keeps CSS transform free for interactive card hover states.
      const animation = element.animate(
        [{ opacity: hero ? 0.9 : 0.7, translate: `${x}px ${y}px` }, { opacity: 1, translate: "0px 0px" }],
        { duration, delay, easing: ease },
      );
      animations.set(element, animation);
      animation.finished.then(() => {
        if (animations.get(element) === animation) animations.delete(element);
      }).catch(() => {}); // Cancellation restores the always-visible underlying HTML.
      return animation;
    };

    const inView = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const directArrival = !!window.location.hash || window.scrollY > 8;
    if (heroCopy || heroVisual) {
      if (!heroEntered.current && !directArrival && !document.hidden && !reduced.matches) {
        const heroAnimations: Animation[] = [];
        if (heroCopy && inView(heroCopy)) heroAnimations.push(animate(heroCopy, "left", true)!);
        if (heroVisual && inView(heroVisual)) heroAnimations.push(animate(heroVisual, "right", true)!);
        if (heroAnimations.length) {
          Promise.all(heroAnimations.map((animation) => animation.finished))
            .then(() => { heroEntered.current = true; })
            .catch(() => {}); // React's development effect replay cancels before the real mount.
        } else {
          heroEntered.current = true;
        }
      } else {
        heroEntered.current = true;
      }
      if (heroCopy) seen.add(heroCopy);
      if (heroVisual) seen.add(heroVisual);
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      if (document.hidden) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        animate(element, element.dataset.motion || "fade");
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    const skipReveal = (element: HTMLElement) => {
      seen.add(element);
      revealObserver.unobserve(element);
      animations.get(element)?.cancel();
      animations.delete(element);
    };
    const skipHashTarget = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      let target = document.getElementById(hash);
      if (!target) {
        try { target = document.getElementById(decodeURIComponent(hash)); } catch { return; }
      }
      if (!target) return;
      for (const element of targets) {
        if (target.contains(element) || element.contains(target)) skipReveal(element);
      }
    };
    if (directArrival) skipHashTarget();

    for (const element of targets) {
      if (seen.has(element)) continue;
      if (reduced.matches || (directArrival && inView(element))) seen.add(element);
      else revealObserver.observe(element);
    }

    const updateServices = () => {
      if (reduced.matches || document.hidden) return;
      const height = window.innerHeight;
      let count = 0;
      for (const row of activeRows) {
        measuredRows[count] = row;
        progresses[count] = Math.max(0, Math.min(1, (0.9 * height - row.getBoundingClientRect().top) / (0.45 * height)));
        count++;
      }
      for (let index = 0; index < count; index++) {
        const value = String(progresses[index]);
        if (measuredRows[index].style.getPropertyValue("--service-progress") !== value) {
          measuredRows[index].style.setProperty("--service-progress", value);
        }
      }
      measuredRows.length = 0;
      progresses.length = 0;
    };

    const tick = (time: number) => {
      frameId = 0;
      if (document.hidden || disposed) return;
      ticking = true;
      lenis?.raf(time);
      if (dirty) {
        dirty = false;
        updateServices();
      }
      ticking = false;
      if (lenis) frameId = requestAnimationFrame(tick);
    };
    const schedule = () => {
      dirty = true;
      if (!ticking && !frameId && !document.hidden) frameId = requestAnimationFrame(tick);
    };
    const serviceObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const row = entry.target as HTMLElement;
        if (entry.isIntersecting) activeRows.add(row);
        else activeRows.delete(row);
      }
      schedule();
    }, { rootMargin: "20% 0px 20% 0px" });
    for (const row of rows) serviceObserver.observe(row);

    const stopLenis = () => {
      ++importToken;
      importing = false;
      lenis?.destroy();
      lenis = null;
      delete document.documentElement.dataset.lenisActive;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      if (!disposed) schedule();
    };
    const syncLenis = () => {
      if (disposed || reduced.matches || !desktop.matches || document.hidden) {
        if (lenis || importing) stopLenis();
        return;
      }
      if (lenis || importing) return;
      importing = true;
      const token = ++importToken;
      import("lenis").then(({ default: Lenis }) => {
        if (disposed || token !== importToken || reduced.matches || !desktop.matches || document.hidden) return;
        importing = false;
        lenis = new Lenis({
          smoothWheel: true,
          wheelMultiplier: 0.5,
          lerp: 0.1,
          syncTouch: false,
          autoRaf: false,
          anchors: true,
          stopInertiaOnNavigate: true,
        });
        document.documentElement.dataset.lenisActive = "true";
        schedule();
      }).catch(() => { if (token === importToken) importing = false; }); // Native scrolling remains available if loading fails.
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        heroEntered.current = true;
        revealObserver.disconnect();
        for (const element of targets) seen.add(element);
        for (const animation of animations.values()) animation.cancel();
        animations.clear();
        for (const row of rows) row.style.removeProperty("--service-progress");
      } else {
        schedule();
      }
      syncLenis();
    };
    const onVisibilityChange = () => {
      if (!document.hidden) {
        // Returning to a tab must not replay entrances in front of a reader.
        for (const element of targets) {
          if (inView(element)) skipReveal(element);
        }
        schedule();
      } else {
        heroEntered.current = true;
        for (const animation of animations.values()) animation.cancel();
        animations.clear();
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
      }
      syncLenis();
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const element = target.closest<HTMLElement>("[data-motion], .hero-copy, .hero-visual");
      if (!element) return;
      skipReveal(element);
    };
    const onHistoryArrival = () => {
      skipHashTarget();
      requestAnimationFrame(() => {
        if (disposed) return;
        for (const element of targets) {
          if (inView(element)) skipReveal(element);
        }
        schedule();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("hashchange", onHistoryArrival);
    window.addEventListener("popstate", onHistoryArrival);
    main.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reduced.addEventListener("change", onReducedChange);
    desktop.addEventListener("change", syncLenis);
    syncLenis();
    schedule();

    return () => {
      disposed = true;
      revealObserver.disconnect();
      serviceObserver.disconnect();
      for (const animation of animations.values()) animation.cancel();
      for (const row of rows) row.style.removeProperty("--service-progress");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", onHistoryArrival);
      window.removeEventListener("popstate", onHistoryArrival);
      main.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reduced.removeEventListener("change", onReducedChange);
      desktop.removeEventListener("change", syncLenis);
      stopLenis();
    };
  }, [pathname]);

  return null;
}
