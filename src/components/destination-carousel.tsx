"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Arrow } from "./icons";

export function DestinationCarousel({
  children,
  itemCount,
}: {
  children: ReactNode;
  itemCount: number;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [carousel, setCarousel] = useState({
    page: 1,
    total: 2,
    start: true,
    end: false,
  });
  const updateCarousel = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const cardWidth =
      el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 12;
    const perPage = Math.max(1, Math.round(el.clientWidth / (cardWidth + gap)));
    const total = Math.ceil(itemCount / perPage);
    setCarousel({
      page: Math.min(
        total,
        Math.round(el.scrollLeft / ((cardWidth + gap) * perPage)) + 1,
      ),
      total,
      start: el.scrollLeft < 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, [itemCount]);
  useEffect(() => {
    if (!rail.current) return;
    const observer = new ResizeObserver(updateCarousel);
    observer.observe(rail.current);
    return () => observer.disconnect();
  }, [updateCarousel]);
  const move = (direction: number) => {
    const element = rail.current;
    if (element)
      element.scrollBy({
        left: direction * (element.clientWidth + 12),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <>
      <div
        ref={rail}
        className="destination-rail"
        onScroll={updateCarousel}
        tabIndex={0}
        role="region"
        aria-label="Destinos, desplazá para explorar"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {children}
      </div>
      <div className="rail-footer">
        <span>
          Destinos para empezar a imaginar. Consultá fechas y opciones.
        </span>
        <div className="rail-controls">
          <span aria-live="polite">
            {String(carousel.page).padStart(2, "0")} /{" "}
            {String(carousel.total).padStart(2, "0")}
          </span>
          <button
            disabled={carousel.start}
            onClick={() => move(-1)}
            aria-label="Destinos anteriores"
          >
            <Arrow diagonal={false} />
          </button>
          <button
            disabled={carousel.end}
            onClick={() => move(1)}
            aria-label="Destinos siguientes"
          >
            <Arrow diagonal={false} />
          </button>
        </div>
      </div>
    </>
  );
}
