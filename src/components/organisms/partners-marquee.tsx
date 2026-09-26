"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import type { HomeContent } from "@/types/home-content";

type Brand = HomeContent["partners"]["brands"][number];

function brandNames(brands: Brand[]) {
  return brands.map((brand) => brand.emphasis
    ? <strong className="partners-brand" key={brand.name}>{brand.name}</strong>
    : <span className="partners-brand" key={brand.name}>{brand.name}</span>);
}

export function PartnersMarquee({ brands, label }: { brands: Brand[]; label: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const firstGroup = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  const [width, setWidth] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const group = firstGroup.current;
    const windowArea = viewport.current;
    if (!group || !windowArea) return;

    let mounted = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 700px)");
    const updateMotion = () => setReduced(motion.matches);
    const updateSize = () => setMobile(small.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    const measure = () => setWidth(group.getBoundingClientRect().width);
    const resize = new ResizeObserver(measure);
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const release = (event: PointerEvent) => {
      if (activeTouch.current !== event.pointerId) return;
      activeTouch.current = null;
      setHeld(false);
    };

    updateMotion();
    updateSize();
    updateVisibility();
    measure();
    resize.observe(group);
    resize.observe(windowArea);
    intersection.observe(windowArea);
    motion.addEventListener("change", updateMotion);
    small.addEventListener("change", updateSize);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    document.fonts.ready.then(() => { if (mounted) measure(); });

    return () => {
      mounted = false;
      resize.disconnect();
      intersection.disconnect();
      motion.removeEventListener("change", updateMotion);
      small.removeEventListener("change", updateSize);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      activeTouch.current = null;
    };
  }, []);

  const ready = brands.length >= 2 && width > 0 && !reduced;
  const running = ready && visible && pageVisible && !hovered && !held;
  const style = ready ? {
    "--marquee-distance": `${width}px`,
    "--marquee-duration": `${width / (mobile ? 20 : 28)}s`,
  } as CSSProperties : undefined;

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" || activeTouch.current !== null) return;
    activeTouch.current = event.pointerId;
    setHeld(true);
  }

  function onPointerOver(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
    if (event.target.closest(".partners-brand")) setHovered(true);
  }

  function onPointerOut(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
    if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".partners-brand")) return;
    setHovered(false);
  }

  return (
    <div className="partners-marquee">
      <div className="partners-viewport" ref={viewport} onPointerDown={onPointerDown}
        onPointerOver={onPointerOver} onPointerOut={onPointerOut} onPointerLeave={() => setHovered(false)}>
        <div className="partners-track" data-ready={ready} data-running={running} style={style}>
          <div className="partners-group" ref={firstGroup} role="group" aria-label={label}>
            {brandNames(brands)}
          </div>
          {ready && <div className="partners-group" aria-hidden="true">{brandNames(brands)}</div>}
        </div>
      </div>
    </div>
  );
}
