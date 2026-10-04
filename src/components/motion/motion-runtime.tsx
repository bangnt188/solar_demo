"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  createRevealEngine,
  getRevealPresetForDirection,
  motionTokens,
  type RevealDirection,
} from "@solar/ui/motion";
import type Lenis from "lenis";

const legacyRevealDirections = new Set<RevealDirection>(["left", "right", "up", "fade"]);

function isRevealDirection(value: string | undefined): value is RevealDirection {
  return value !== undefined && legacyRevealDirections.has(value as RevealDirection);
}

export function MotionRuntime() {
  const pathname = usePathname();
  const heroEntered = useRef(false);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const supportsServiceTimeline = CSS.supports("animation-timeline: view(block)")
      && CSS.supports("animation-range: entry 0% exit 100%");
    const heroAnimations = new Set<Animation>();
    const legacyTargets = main.querySelectorAll<HTMLElement>("[data-motion]");
    const heroCopy = main.querySelector<HTMLElement>(".hero-copy");
    const heroVisual = main.querySelector<HTMLElement>(".hero-visual");
    let lenis: Lenis | null = null;
    let frameId = 0;
    let disposed = false;
    let importing = false;
    let importToken = 0;

    // Temporary compatibility bridge. Existing sections keep their markup while
    // @solar/ui owns the reveal engine, timing tokens and reduced-motion behavior.
    for (const element of legacyTargets) {
      if (supportsServiceTimeline && element.hasAttribute("data-motion-scroll")) continue;
      if (element.dataset.reveal || !isRevealDirection(element.dataset.motion)) continue;

      element.dataset.reveal = getRevealPresetForDirection(element.dataset.motion);
      element.dataset.revealDuration = String(motionTokens.duration.showcase);
      element.dataset.revealStartOpacity = "0.7";

      const order = Number(element.dataset.motionOrder);
      if (Number.isFinite(order)) {
        const delay = Math.min(
          motionTokens.stagger.normal,
          Math.max(0, order * motionTokens.stagger.micro),
        );
        if (delay > 0) element.dataset.revealDelay = String(delay);
      }
    }

    const revealEngine = createRevealEngine({
      rootMargin: "0px 0px -8% 0px",
      once: true,
      revealOnFocus: true,
      observeReducedMotionChanges: true,
      revealVisibleOnResume: true,
    }).start(main);

    const inView = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const animateHero = (element: HTMLElement, direction: "left" | "right") => {
      if (reduced.matches || document.hidden) return;

      const small = window.matchMedia("(max-width: 700px)").matches;
      const distance = small ? motionTokens.distance.sm : motionTokens.distance.lg;
      const x = direction === "left" ? -distance : distance;
      const animation = element.animate(
        [{ opacity: 0.9, translate: `${x}px 0px` }, { opacity: 1, translate: "0px 0px" }],
        {
          duration: motionTokens.duration.showcase,
          easing: motionTokens.easing.enter,
        },
      );

      heroAnimations.add(animation);
      animation.finished
        .then(() => heroAnimations.delete(animation))
        .catch(() => heroAnimations.delete(animation));

      return animation;
    };

    const directArrival = !!window.location.hash || window.scrollY > 8;

    const revealHashTarget = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      let target = document.getElementById(hash);
      if (!target) {
        try {
          target = document.getElementById(decodeURIComponent(hash));
        } catch {
          return;
        }
      }
      if (!target) return;

      const revealAncestor = target.closest<HTMLElement>("[data-reveal]");
      if (revealAncestor) revealEngine.revealAll(revealAncestor);
      revealEngine.revealAll(target);
    };

    if (directArrival) {
      revealHashTarget();
      revealEngine.revealVisible(main);
    }

    if (heroCopy || heroVisual) {
      if (!heroEntered.current && !directArrival && !document.hidden && !reduced.matches) {
        const running: Animation[] = [];
        if (heroCopy && inView(heroCopy)) {
          const animation = animateHero(heroCopy, "left");
          if (animation) running.push(animation);
        }
        if (heroVisual && inView(heroVisual)) {
          const animation = animateHero(heroVisual, "right");
          if (animation) running.push(animation);
        }

        if (running.length) {
          Promise.all(running.map((animation) => animation.finished))
            .then(() => { heroEntered.current = true; })
            .catch(() => {});
        } else {
          heroEntered.current = true;
        }
      } else {
        heroEntered.current = true;
      }
    }

    const tick = (time: number) => {
      frameId = 0;
      if (document.hidden || disposed) return;
      lenis?.raf(time);
      if (lenis) frameId = requestAnimationFrame(tick);
    };

    const stopLenis = () => {
      ++importToken;
      importing = false;
      lenis?.destroy();
      lenis = null;
      delete document.documentElement.dataset.lenisActive;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
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
          wheelMultiplier: 0.8,
          lerp: 0.1,
          syncTouch: false,
          autoRaf: false,
          anchors: true,
          stopInertiaOnNavigate: true,
        });
        document.documentElement.dataset.lenisActive = "true";
        frameId = requestAnimationFrame(tick);
      }).catch(() => {
        if (token === importToken) importing = false;
      });
    };

    const cancelHeroAnimations = () => {
      for (const animation of heroAnimations) animation.cancel();
      heroAnimations.clear();
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        heroEntered.current = true;
        cancelHeroAnimations();
      }
      syncLenis();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        heroEntered.current = true;
        cancelHeroAnimations();
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
      }
      syncLenis();
    };

    const onHistoryArrival = () => {
      revealHashTarget();
      requestAnimationFrame(() => {
        if (!disposed) revealEngine.revealVisible(main);
      });
    };

    window.addEventListener("hashchange", onHistoryArrival);
    window.addEventListener("popstate", onHistoryArrival);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reduced.addEventListener("change", onReducedChange);
    desktop.addEventListener("change", syncLenis);
    syncLenis();

    return () => {
      disposed = true;
      revealEngine.destroy();
      window.removeEventListener("hashchange", onHistoryArrival);
      window.removeEventListener("popstate", onHistoryArrival);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reduced.removeEventListener("change", onReducedChange);
      desktop.removeEventListener("change", syncLenis);
      cancelHeroAnimations();
      stopLenis();
    };
  }, [pathname]);

  return null;
}
