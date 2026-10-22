"use client";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { LiveTicker } from "@personal/motion-kit/ticker";
import { ArtworkImage } from "../signature/ArtworkImage";
import { motionTokens } from "@personal/motion-kit/tokens";
const names = [
  "Mango ribbon",
  "Strawberry arch",
  "Kiwi spiral",
  "Watermelon slice",
  "Blueberry spheres",
  "Lemon zigzag",
  "Raspberry oval",
  "Citrus glass",
];
function Study({
  id,
  number,
  title,
  description,
  children,
  guide,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: ReactNode;
  guide: string;
}) {
  return (
    <section id={id} className="example-study">
      <header className="example-heading">
        <span className="eyebrow">{number} / LIVE EXAMPLE</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
      <details className="example-guide">
        <summary>How this example works</summary>
        <p>{guide}</p>
      </details>
    </section>
  );
}
function Trail() {
  const reduced = useMotionPreference();
  const root = useRef<HTMLDivElement>(null);
  const bounds = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, motionTokens.spring.smooth),
    sy = useSpring(y, motionTokens.spring.smooth);
  const [following, setFollowing] = useState(false);
  const [selected, setSelected] = useState(0);
  return (
    <Study
      id="trail"
      number="01"
      title="Leave a little colour."
      description="A spring-following artwork stack. Explore with a mouse, or browse with the buttons."
      guide="The pointer writes to two MotionValues; springs follow without rendering React on every move. Bounds are measured on pointer entry. Touch and reduced motion keep a static composition with native previous/next controls."
    >
      <div
        ref={root}
        className="trail-stage"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse" || reduced) return;
          bounds.current = e.currentTarget.getBoundingClientRect();
          setFollowing(true);
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || reduced) return;
          const b = bounds.current;
          x.set(e.clientX - b.left - b.width / 2);
          y.set(e.clientY - b.top - b.height / 2);
        }}
        onPointerLeave={() => {
          setFollowing(false);
          x.set(0);
          y.set(0);
        }}
      >
        <p className="stage-kicker">COLOUR STUDIES / VOL. 01</p>
        <h3>
          Follow
          <br />
          <em>your curiosity.</em>
        </h3>
        <motion.div
          className="trail-stack"
          style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
          data-following={following}
          aria-hidden="true"
        >
          {[2, 1, 0].map((n) => (
            <div
              className="trail-print"
              key={n}
              style={{ transform: `translate(${n * 18}px, ${n * -16}px) rotate(${n * 9 - 9}deg)` }}
            >
              <ArtworkImage index={(selected + n) % 8} />
            </div>
          ))}
        </motion.div>
        <p className="trail-caption">ORIGINAL OBJECTS. ENDLESS POSSIBILITIES.</p>
      </div>
      <div className="example-controls">
        <button onClick={() => setSelected((selected + 7) % 8)} aria-label="Previous trail artwork">
          ←
        </button>
        <p role="status">{names[selected]}</p>
        <button onClick={() => setSelected((selected + 1) % 8)} aria-label="Next trail artwork">
          →
        </button>
      </div>
    </Study>
  );
}
function Ticker() {
  return (
    <Study
      id="ticker-study"
      number="02"
      title="Ideas in constant motion."
      description="Two independently controlled rails. Drag to browse, hover to pause, or use the keyboard."
      guide="Both rails use the existing LiveTicker API, with opposite direction props. Its visibility observer suspends offscreen work, duplicate content is hidden from assistive technology, and reduced motion displays a wrapping static list."
    >
      <div className="editorial-ticker">
        <p className="stage-kicker">LIVE / TWO DIRECTIONS</p>
        {["forward", "reverse"].map((direction, row) => (
          <LiveTicker
            key={direction}
            label={row ? "Reverse ideas" : "Forward ideas"}
            direction={direction as "forward" | "reverse"}
            speed={35}
            autoplay
            draggable
            gap="2rem"
          >
            {["Spring", "Layout", "Scroll", "Gesture", "Stagger"].map((word, i) => (
              <span className="idea-word" key={word}>
                <span className="idea-object">
                  <ArtworkImage index={(i + row * 3) % 8} />
                </span>
                {word}
              </span>
            ))}
          </LiveTicker>
        ))}
      </div>
    </Study>
  );
}
const screens = [
  {
    name: "Overview",
    title: "Every detail, in view.",
    metric: "24,860",
    label: "Total visits",
    values: [38, 62, 45, 83, 55, 92, 72],
    note: "Your audience is finding its rhythm.",
  },
  {
    name: "Audience",
    title: "Meet your next chapter.",
    metric: "8,412",
    label: "Returning visitors",
    values: [22, 35, 65, 50, 80, 70, 95],
    note: "Good experiences bring people back.",
  },
  {
    name: "Revenue",
    title: "Small moments add up.",
    metric: "$18,420",
    label: "Monthly revenue",
    values: [15, 28, 40, 42, 66, 78, 98],
    note: "A little momentum goes a long way.",
  },
];
function Transitions() {
  const [index, setIndex] = useState(0);
  const reduced = useMotionPreference();
  const screen = screens[index] ?? screens[0]!;
  return (
    <Study
      id="transitions"
      number="03"
      title="A change of perspective."
      description="A complete miniature analytics interface, with interruptible page transitions and shared navigation."
      guide="Native navigation buttons retain focus as AnimatePresence swaps keyed dashboard content. A shared layout indicator follows the active destination. Reduced motion removes the slide and transition duration; the metric is announced after each selection."
    >
      <div className="transition-stage">
        <div className="mini-app">
          <header>
            <strong>
              pulse<span>↗</span>
            </strong>
            <span>YOUR WORKSPACE</span>
            <span className="mini-avatar">MK</span>
          </header>
          <nav aria-label="Demo dashboard">
            {screens.map((s, i) => (
              <button
                key={s.name}
                aria-current={index === i ? "page" : undefined}
                onClick={() => setIndex(i)}
              >
                {s.name}
                {index === i && (
                  <motion.span
                    className="mini-active"
                    {...(reduced ? {} : { layoutId: "mini-dashboard-active" })}
                  />
                )}
              </button>
            ))}
          </nav>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="mini-content"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -12 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
            >
              <p className="eyebrow">A CLEARER PICTURE</p>
              <h3>{screen.title}</h3>
              <p>{screen.note}</p>
              <div className="mini-metric" role="status">
                <span>{screen.label}</span>
                <strong>{screen.metric}</strong>
                <span>↑ 12.8% this month</span>
              </div>
              <div
                className="mini-chart"
                aria-label={`${screen.name} trend over seven days`}
                role="img"
              >
                {screen.values.map((v, i) => (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={{ height: `${v}%` }}
                    transition={{ duration: reduced ? 0 : 0.4 }}
                  />
                ))}
              </div>
              <footer>
                LAST 7 DAYS <span>All systems operational ●</span>
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Study>
  );
}
function Grid() {
  const reduced = useMotionPreference();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const dragged = useRef(false);
  function close() {
    dialog.current?.close();
    setOpen(false);
    opener.current?.focus();
  }
  return (
    <Study
      id="grid-study"
      number="04"
      title="The object archive."
      description="Drag the contact sheet. Select an artwork to inspect it. Eight original studies, seen from a different angle."
      guide="A bounded Motion drag moves the contact sheet using transforms. Drag gestures suppress accidental clicks. The native modal dialog provides focus containment and Escape; closing restores the selected tile. Reduced motion removes tilt and drag, leaving a responsive grid. Native direction and reset buttons are available for keyboard and touch."
    >
      <div className={`archive-stage ${reduced ? "archive-static" : ""}`}>
        <p className="stage-kicker">THE OBJECT ARCHIVE / 001—008</p>
        <motion.div
          className="archive-sheet"
          style={{ x: reduced ? 0 : x, y: reduced ? 0 : y, rotate: reduced ? 0 : -8 }}
          drag={reduced ? false : true}
          dragConstraints={{ left: -100, right: 100, top: -60, bottom: 60 }}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true;
          }}
          onPointerDownCapture={() => {
            dragged.current = false;
          }}
        >
          {names.map((name, i) => (
            <button
              className="archive-tile"
              key={name}
              onClick={(e) => {
                if (dragged.current && e.detail !== 0) return;
                opener.current = e.currentTarget;
                setSelected(i);
                setOpen(true);
                dialog.current?.showModal();
              }}
            >
              <ArtworkImage index={i} />
              <span>
                MK—0{i + 1}
                <strong>{name}</strong>
              </span>
            </button>
          ))}
        </motion.div>
      </div>
      <div className="example-controls" aria-label="Gallery position">
        <button
          disabled={reduced}
          aria-label="Move gallery left"
          onClick={() => x.set(Math.max(-100, x.get() - 40))}
        >
          ←
        </button>
        <button
          disabled={reduced}
          onClick={() => {
            x.set(0);
            y.set(0);
          }}
        >
          Reset position
        </button>
        <button
          disabled={reduced}
          aria-label="Move gallery right"
          onClick={() => x.set(Math.min(100, x.get() + 40))}
        >
          →
        </button>
      </div>
      <dialog
        ref={dialog}
        className="archive-dialog"
        aria-labelledby="archive-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => {
          setOpen(false);
          opener.current?.focus();
        }}
      >
        {open && (
          <>
            <div className="archive-inspect">
              <ArtworkImage index={selected} />
            </div>
            <h3 id="archive-title">{names[selected]}</h3>
            <p>Original colour study · MK—0{selected + 1}</p>
            <button autoFocus onClick={close}>
              Close artwork
            </button>
          </>
        )}
      </dialog>
    </Study>
  );
}
export function Examples() {
  return (
    <>
      <Trail />
      <Ticker />
      <Transitions />
      <Grid />
    </>
  );
}
