"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { MotionProvider } from "@personal/motion-kit/provider";

const studies = [
  {
    name: "Shared layout",
    note: "One selection, two places. Watch the active tile move into the spotlight.",
    code: '<motion.div layoutId="selected-art" />',
  },
  {
    name: "Spring field",
    note: "Move your pointer across the field, or use the direction buttons. Adjust the spring’s response.",
    code: "const x = useSpring(target, { stiffness, damping: 22 })",
  },
  {
    name: "Perspective deck",
    note: "Cycle through a layered stack. Every card keeps its identity as the order changes.",
    code: "animate={{ x: depth * 16, rotate: depth * 8, scale: 1 - depth * .06 }}",
  },
  {
    name: "Layout morph",
    note: "Switch between a grid, a column, and a row. The same elements travel between layouts.",
    code: '<motion.div layout transition={{ type: "spring" }} />',
  },
  {
    name: "SVG drawing",
    note: "Replay a continuous vector stroke. Change the duration and watch the path take shape.",
    code: "<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />",
  },
  {
    name: "Scroll scene",
    note: "Scroll inside the scene, or focus it and use Page Down. The sculpture follows your progress.",
    code: "const { scrollYProgress } = useScroll({ container })",
  },
] as const;

function SharedLayout({ reduced }: { reduced: boolean }) {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <div className="lab-stage shared-stage">
        <div className="shared-feature">
          <motion.div
            {...(reduced ? {} : { layoutId: `shared-${selected}` })}
            className={`shared-art palette-${selected}`}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
          >
            <span className="study-orb" />
            <strong>{["Chromatic", "Sculptural", "Electric"][selected]}</strong>
          </motion.div>
        </div>
        <div className="shared-options" role="group" aria-label="Artwork selection">
          {["Chromatic", "Sculptural", "Electric"].map((name, index) => (
            <button
              key={name}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {selected !== index && (
                <motion.span
                  {...(reduced ? {} : { layoutId: `shared-${index}` })}
                  className={`shared-swatch palette-${index}`}
                />
              )}
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="caption" role="status">
        Selected artwork: {["Chromatic", "Sculptural", "Electric"][selected]}
      </p>
    </>
  );
}

function SpringOrb({
  targetX,
  targetY,
  stiffness,
}: {
  targetX: MotionValue<number>;
  targetY: MotionValue<number>;
  stiffness: number;
}) {
  const x = useSpring(targetX, { stiffness, damping: 22 });
  const y = useSpring(targetY, { stiffness, damping: 22 });
  return <motion.div className="spring-orb" style={{ x, y }} aria-hidden="true" />;
}

function SpringField({ reduced }: { reduced: boolean }) {
  const [stiffness, setStiffness] = useState(180);
  const targetX = useMotionValue(0),
    targetY = useMotionValue(0);
  const bounds = useRef<DOMRect | null>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !bounds.current) return;
    const box = bounds.current;
    targetX.set(Math.max(-70, Math.min(70, event.clientX - box.left - box.width / 2)));
    targetY.set(Math.max(-70, Math.min(70, event.clientY - box.top - box.height / 2)));
  };
  const reset = () => {
    targetX.set(0);
    targetY.set(0);
  };
  return (
    <>
      <div
        className="lab-stage spring-field"
        onPointerEnter={(event) => {
          bounds.current = event.currentTarget.getBoundingClientRect();
        }}
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <div className="field-cross" aria-hidden="true" />
        {reduced ? (
          <motion.div
            className="spring-orb"
            style={{ x: targetX, y: targetY }}
            aria-hidden="true"
          />
        ) : (
          <SpringOrb targetX={targetX} targetY={targetY} stiffness={stiffness} />
        )}
        <span className="field-caption">FOLLOW THE FEELING</span>
      </div>
      <div className="lab-controls" role="group" aria-label="Spring direction">
        {[
          ["Left", -70, 0],
          ["Up", 0, -70],
          ["Center", 0, 0],
          ["Down", 0, 70],
          ["Right", 70, 0],
        ].map(([name, horizontal, vertical]) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              targetX.set(Number(horizontal));
              targetY.set(Number(vertical));
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <label className="lab-range" htmlFor="spring-stiffness">
        Spring stiffness <output>{stiffness}</output>
        <input
          id="spring-stiffness"
          type="range"
          min="80"
          max="400"
          step="20"
          value={stiffness}
          onChange={(event) => setStiffness(Number(event.target.value))}
        />
      </label>
    </>
  );
}

function PerspectiveDeck({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="lab-stage deck-stage">
        {[0, 1, 2, 3].map((index) => {
          const depth = (index - active + 4) % 4;
          return (
            <motion.div
              key={index}
              className={`deck-card palette-${index % 3}`}
              animate={{
                x: depth * 12,
                y: depth * -12,
                rotate: reduced ? 0 : depth * 7,
                scale: 1 - depth * 0.06,
              }}
              transition={
                reduced ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 28 }
              }
              style={{ zIndex: 4 - depth }}
              aria-hidden={depth !== 0}
            >
              <span>COLLECTION / {String(index + 1).padStart(2, "0")}</span>
              <div className="deck-symbol" aria-hidden="true">
                {["✳", "↗", "◒", "✶"][index]}
              </div>
              <strong>
                {["A new angle.", "Stay curious.", "Find a rhythm.", "Keep moving."][index]}
              </strong>
            </motion.div>
          );
        })}
      </div>
      <div className="lab-controls">
        <button type="button" onClick={() => setActive((value) => (value + 3) % 4)}>
          Previous card
        </button>
        <p role="status">Card {active + 1} of 4</p>
        <button type="button" onClick={() => setActive((value) => (value + 1) % 4)}>
          Next card
        </button>
      </div>
    </>
  );
}

function LayoutMorph({ reduced }: { reduced: boolean }) {
  const [layout, setLayout] = useState("Grid");
  return (
    <>
      <div className={`lab-stage morph-stage morph-${layout.toLowerCase()}`}>
        {["01", "02", "03", "04"].map((name, index) => (
          <motion.div
            layout={!reduced}
            key={name}
            className={`morph-tile palette-${index % 3}`}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
          >
            <span>{name}</span>
            <span aria-hidden="true">↗</span>
          </motion.div>
        ))}
      </div>
      <div className="lab-controls" role="group" aria-label="Layout arrangement">
        {["Grid", "Column", "Row"].map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={layout === name}
            onClick={() => setLayout(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}

function SvgDrawing({ reduced }: { reduced: boolean }) {
  const [replay, setReplay] = useState(0),
    [duration, setDuration] = useState(2);
  return (
    <>
      <div className="lab-stage drawing-stage">
        <svg viewBox="0 0 320 240" role="img" aria-label="Animated looping vector signature">
          <path
            d="M40 160 C40 20 160 20 160 110 S40 230 80 110 S240 30 230 130 S290 200 285 80"
            fill="none"
            className="drawing-guide"
          />
          <motion.path
            key={`${replay}-${reduced}-${duration}`}
            d="M40 160 C40 20 160 20 160 110 S40 230 80 110 S240 30 230 130 S290 200 285 80"
            fill="none"
            className="drawing-line"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : duration, ease: "easeInOut" }}
          />
        </svg>
      </div>
      <div className="lab-controls">
        <button type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay drawing
        </button>
      </div>
      <label className="lab-range" htmlFor="drawing-duration">
        Drawing duration <output>{duration}s</output>
        <input
          id="drawing-duration"
          type="range"
          min="0.5"
          max="4"
          step="0.5"
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value))}
        />
      </label>
    </>
  );
}

function ScrollScene({ reduced }: { reduced: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container });
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 135]),
    scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.65, 1, 0.65]);
  return (
    <>
      <div
        className="scroll-study"
        ref={container}
        tabIndex={0}
        role="region"
        aria-label="Scrollable sculpture scene"
      >
        <div className="scroll-study-track">
          <div className="scroll-study-sticky">
            <motion.div
              className="scroll-sculpture"
              style={{ rotate: reduced ? 0 : rotate, scale: reduced ? 1 : scale }}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </motion.div>
            <p>SCROLL TO EXPLORE ↓</p>
          </div>
          <div className="scroll-study-end">You found a different perspective.</div>
        </div>
      </div>
      <div className="lab-controls">
        <button
          type="button"
          onClick={() => container.current?.scrollTo({ top: 0, behavior: "instant" })}
        >
          Back to start
        </button>
        <button
          type="button"
          onClick={() =>
            container.current?.scrollTo({
              top: container.current.scrollHeight,
              behavior: "instant",
            })
          }
        >
          Jump to end
        </button>
      </div>
    </>
  );
}

function StudyContent({ selected }: { selected: number }) {
  const reduced = useMotionPreference();
  return (
    <div className="study-content" data-reduced-motion={reduced}>
      {selected === 0 ? (
        <SharedLayout reduced={reduced} />
      ) : selected === 1 ? (
        <SpringField reduced={reduced} />
      ) : selected === 2 ? (
        <PerspectiveDeck reduced={reduced} />
      ) : selected === 3 ? (
        <LayoutMorph reduced={reduced} />
      ) : selected === 4 ? (
        <SvgDrawing reduced={reduced} />
      ) : (
        <ScrollScene reduced={reduced} />
      )}
    </div>
  );
}

export function MotionLab() {
  const [selected, setSelected] = useState(0),
    [reduced, setReduced] = useState(false);
  const study = studies[selected]!;
  return (
    <section className="motion-lab" aria-labelledby="study-title">
      <div className="lab-selection" role="group" aria-label="Choose an advanced study">
        {studies.map((item, index) => (
          <button
            type="button"
            key={item.name}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.name}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className="lab-workbench">
        <div className="lab-workbench-header">
          <div>
            <p className="eyebrow">STUDY {String(selected + 1).padStart(3, "0")}</p>
            <h2 id="study-title">{study.name}</h2>
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={reduced}
              onChange={(event) => setReduced(event.target.checked)}
            />
            Reduce lab motion
          </label>
        </div>
        <p className="lab-description">{study.note}</p>
        <MotionProvider reducedMotion={reduced ? "always" : "user"}>
          <StudyContent key={selected} selected={selected} />
        </MotionProvider>
        <details className="study-code">
          <summary>See the motion technique</summary>
          <pre tabIndex={0}>
            <code>{study.code}</code>
          </pre>
          <p className="caption">
            Technique excerpt; the demo also provides input controls and a reduced-motion fallback.
          </p>
        </details>
      </div>
    </section>
  );
}
