import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import { GAMES } from "./games-data";
import "./games.css";

const STORAGE_KEY = "jonstuebe-games-order";
const DEFAULT_ORDER = GAMES.map((g) => g.id);
const byId = new Map(GAMES.map((g) => [g.id, g]));
const LONG_PRESS_MS = 480;
const MOVE_TOLERANCE = 10;

function loadOrder(): string[] {
  let saved: unknown = [];
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    saved = [];
  }
  if (!Array.isArray(saved)) saved = [];
  const kept = (saved as unknown[]).filter(
    (id): id is string => typeof id === "string" && byId.has(id),
  );
  const fresh = DEFAULT_ORDER.filter((id) => !kept.includes(id));
  return kept.concat(fresh);
}

function saveOrder(order: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Storage may be unavailable (private mode, blocked site data).
  }
}

type Drag = {
  el: HTMLAnchorElement;
  id: string;
  pointerId: number;
  gx: number;
  gy: number;
  x: number;
  y: number;
};

type Press = {
  el: HTMLAnchorElement;
  x: number;
  y: number;
  pointerId: number;
  lastX: number;
  lastY: number;
  timer: number;
};

type Flip = {
  rects: Map<string, DOMRect>;
  skip?: HTMLElement;
  focus?: HTMLElement;
};

export function Games() {
  const [order, setOrder] = useState(loadOrder);
  const [editing, setEditing] = useState(false);
  const [live, setLive] = useState("");

  const gridRef = useRef<HTMLElement>(null);
  const els = useRef(new Map<string, HTMLAnchorElement>());
  const orderRef = useRef(order);
  const flip = useRef<Flip | null>(null);
  const drag = useRef<Drag | null>(null);
  const press = useRef<Press | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    document.title = "Games · jonstuebe";
  }, []);

  function announce(msg: string) {
    setLive("");
    requestAnimationFrame(() => setLive(msg));
  }

  // Record where every icon is now, then change the order. The layout effect
  // below plays the FLIP animation so icons glide into their new spots.
  function commitOrder(next: string[], opts: Omit<Flip, "rects"> = {}) {
    const rects = new Map<string, DOMRect>();
    els.current.forEach((el, id) => rects.set(id, el.getBoundingClientRect()));
    flip.current = { rects, ...opts };
    orderRef.current = next;
    setOrder(next);
  }

  function placeDrag() {
    const d = drag.current;
    const grid = gridRef.current;
    if (!d || !grid) return;
    const gr = grid.getBoundingClientRect();
    const tx = d.x - gr.left - d.gx - d.el.offsetLeft;
    const ty = d.y - gr.top - d.gy - d.el.offsetTop;
    d.el.style.transform = `translate(${tx}px,${ty}px) scale(1.1)`;
  }

  useLayoutEffect(() => {
    const f = flip.current;
    if (!f) return;
    flip.current = null;
    els.current.forEach((el, id) => {
      if (el === f.skip) return;
      el.style.transition = "none";
      el.style.transform = "";
      const last = el.getBoundingClientRect();
      const first = f.rects.get(id);
      if (!first) return;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (!dx && !dy) {
        el.style.transition = "";
        return;
      }
      el.style.transform = `translate(${dx}px,${dy}px)`;
      el.getBoundingClientRect(); // force reflow before animating back
      el.style.transition = "";
      el.style.transform = "";
    });
    if (drag.current) placeDrag();
    f.focus?.focus();
  }, [order]);

  function enterEditing() {
    setEditing(true);
    announce("Rearranging. Drag icons, or focus one and use the arrow keys.");
  }

  // Escape or a click outside the icons leaves edit mode.
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest(".games-app, button")) setEditing(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [editing]);

  // A long-press starts outside edit mode, where the browser is still allowed
  // to scroll. Block the scroll once a drag is under way so the gesture carries
  // straight from "hold" into "drag" without the browser cancelling it.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const onTouchMove = (e: TouchEvent) => {
      if (drag.current) e.preventDefault();
    };
    grid.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => grid.removeEventListener("touchmove", onTouchMove);
  }, []);

  useEffect(() => {
    return () => {
      if (press.current) clearTimeout(press.current.timer);
    };
  }, []);

  function startDrag(
    el: HTMLAnchorElement,
    pointerId: number,
    x: number,
    y: number,
  ) {
    const grid = gridRef.current;
    if (!grid) return;
    const gr = grid.getBoundingClientRect();
    drag.current = {
      el,
      id: el.dataset.id ?? "",
      pointerId,
      gx: x - (gr.left + el.offsetLeft),
      gy: y - (gr.top + el.offsetTop),
      x,
      y,
    };
    try {
      el.setPointerCapture(pointerId);
    } catch {
      // Pointer may already be released.
    }
    el.classList.add("dragging");
    moveDrag(x, y);
  }

  function moveDrag(x: number, y: number) {
    const d = drag.current;
    const grid = gridRef.current;
    if (!d || !grid) return;
    d.x = x;
    d.y = y;
    placeDrag();
    // Wait for a pending reorder to land before hit-testing again, so stale
    // positions can't trigger a second swap.
    if (flip.current) return;
    const gr = grid.getBoundingClientRect();
    const cx = x - gr.left;
    const cy = y - gr.top;
    for (const [id, other] of els.current) {
      if (other === d.el) continue;
      const l = other.offsetLeft;
      const t = other.offsetTop;
      if (
        cx >= l &&
        cx <= l + other.offsetWidth &&
        cy >= t &&
        cy <= t + other.offsetHeight
      ) {
        const next = orderRef.current.slice();
        const from = next.indexOf(d.id);
        const to = next.indexOf(id);
        next.splice(from, 1);
        next.splice(to, 0, d.id);
        commitOrder(next, { skip: d.el });
        break;
      }
    }
  }

  function endDrag() {
    const d = drag.current;
    if (!d) return;
    d.el.classList.remove("dragging");
    d.el.style.transform = "";
    drag.current = null;
    saveOrder(orderRef.current);
    const g = byId.get(d.id);
    if (g) {
      announce(
        `Moved ${g.name} to spot ${orderRef.current.indexOf(d.id) + 1} of ${orderRef.current.length}.`,
      );
    }
  }

  function onPointerDown(e: ReactPointerEvent<HTMLElement>) {
    const el = (e.target as Element).closest<HTMLAnchorElement>(".games-app");
    if (!el || e.button > 0) return;
    if (editing) {
      e.preventDefault();
      startDrag(el, e.pointerId, e.clientX, e.clientY);
      return;
    }
    const p: Press = {
      el,
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      pointerId: e.pointerId,
      timer: 0,
    };
    p.timer = window.setTimeout(() => {
      if (press.current !== p) return;
      press.current = null;
      suppressClick.current = true;
      try {
        navigator.vibrate?.(12);
      } catch {
        // Vibration is optional.
      }
      enterEditing();
      startDrag(p.el, p.pointerId, p.lastX, p.lastY);
    }, LONG_PRESS_MS);
    press.current = p;
  }

  function onPointerMove(e: ReactPointerEvent<HTMLElement>) {
    const d = drag.current;
    if (d && e.pointerId === d.pointerId) {
      moveDrag(e.clientX, e.clientY);
      return;
    }
    const p = press.current;
    if (p && e.pointerId === p.pointerId) {
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_TOLERANCE) {
        clearTimeout(p.timer);
        press.current = null;
      }
    }
  }

  function onPointerRelease(e: ReactPointerEvent<HTMLElement>) {
    if (press.current) {
      clearTimeout(press.current.timer);
      press.current = null;
    }
    if (drag.current && e.pointerId === drag.current.pointerId) endDrag();
  }

  function onClick(e: ReactMouseEvent<HTMLElement>) {
    const el = (e.target as Element).closest(".games-app");
    if (!el) return;
    if (editing || suppressClick.current) {
      e.preventDefault();
      suppressClick.current = false;
    }
  }

  // Keyboard reordering while editing
  function onKeyDown(e: ReactKeyboardEvent<HTMLElement>) {
    if (!editing) return;
    const el = (e.target as Element).closest<HTMLAnchorElement>(".games-app");
    if (!el) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      return;
    }
    const current = orderRef.current;
    const firstTop = els.current.get(current[0])?.offsetTop;
    const cols = current.filter(
      (id) => els.current.get(id)?.offsetTop === firstTop,
    ).length;
    const step = (
      {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -cols,
        ArrowDown: cols,
      } as Record<string, number>
    )[e.key];
    if (!step) return;
    e.preventDefault();
    const id = el.dataset.id ?? "";
    const from = current.indexOf(id);
    const to = Math.max(0, Math.min(current.length - 1, from + step));
    if (to === from) return;
    const next = current.slice();
    next.splice(from, 1);
    next.splice(to, 0, id);
    commitOrder(next, { focus: el });
    saveOrder(next);
    announce(
      `Moved ${byId.get(id)?.name} to spot ${to + 1} of ${next.length}.`,
    );
  }

  function onReset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore unavailable storage.
    }
    commitOrder(DEFAULT_ORDER.slice());
    announce("Order reset.");
  }

  const buttonClass =
    "rounded-full px-4 py-2 text-[15px] font-semibold cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring";

  return (
    <div className="flex flex-col min-h-[100svh] pt-2 md:pt-4 pl-2 md:pl-4 pr-2 md:pr-4">
      <SiteHeader>
        <div className="flex flex-row gap-2">
          {editing && (
            <button
              type="button"
              onClick={onReset}
              className={cn(
                buttonClass,
                "bg-accent text-accent-foreground hover:bg-accent/70",
              )}
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => (editing ? setEditing(false) : enterEditing())}
            className={cn(
              buttonClass,
              editing
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-accent text-accent-foreground hover:bg-accent/70",
            )}
          >
            {editing ? "Done" : "Rearrange"}
          </button>
        </div>
      </SiteHeader>
      <main className="flex flex-1 flex-col p-4 w-full max-w-full md:max-w-2xl mx-auto">
        <div className="flex flex-col gap-2 py-12">
          <h2 className="text-left text-2xl tracking-tighter text-foreground">
            Need a break?
          </h2>
          <h1 className="text-5xl leading-11 tracking-tighter font-bold text-foreground">
            Little games{" "}
            <span className="text-accent-foreground/70">and puzzles</span>
          </h1>
          <p className="mb-8 min-h-[1.5em]">
            {editing ? (
              <>
                Drag to reorder.{" "}
                <span className="text-accent-foreground/70">
                  Your layout is saved in this browser.
                </span>
              </>
            ) : (
              <>
                Things I’ve made for fun.{" "}
                <span className="text-accent-foreground/70">
                  Tap one to play.
                </span>
              </>
            )}
          </p>
          <nav
            ref={gridRef}
            aria-label="Games"
            className={cn("games-grid", editing && "games-editing")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerRelease}
            onPointerCancel={onPointerRelease}
            onContextMenu={(e) => {
              if ((e.target as Element).closest(".games-app"))
                e.preventDefault();
            }}
            onClick={onClick}
            onKeyDown={onKeyDown}
          >
            {order.map((id) => {
              const g = byId.get(id);
              if (!g) return null;
              return (
                <a
                  key={g.id}
                  ref={(el) => {
                    if (el) els.current.set(g.id, el);
                    else els.current.delete(g.id);
                  }}
                  className="games-app"
                  href={g.href}
                  data-id={g.id}
                  draggable={false}
                >
                  <span
                    className="games-icon"
                    style={{ "--c1": g.c1, "--c2": g.c2 } as CSSProperties}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {g.glyph}
                    </svg>
                  </span>
                  <span className="games-label">{g.name}</span>
                </a>
              );
            })}
          </nav>
          <div className="sr-only" aria-live="polite">
            {live}
          </div>
        </div>
      </main>
    </div>
  );
}
