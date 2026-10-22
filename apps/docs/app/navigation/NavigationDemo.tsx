"use client";
import { useRef, useState } from "react";
import { MotionProvider } from "@personal/motion-kit/provider";
import {
  FloatingNavbar,
  AnimatedNavbar,
  MorphingMenu,
  DockNavigation,
  AnimatedTabs,
  SlidingTabs,
  SharedLayoutTabs,
  AnimatedAccordion,
  AnimatedDrawer,
  AnimatedModal,
} from "@personal/motion-kit/navigation";
const links = (
  <>
    <a href="#tabs">Chapters</a>
    <a href="#overlays">Overlays</a>
    <a href="#reference">Reference</a>
  </>
);
const tabItems = (name: string) =>
  ["Observe", "Compose", "Archive", "Respond"].map((label) => ({
    id: label.toLowerCase(),
    label,
    disabled: label === "Archive",
    children: (
      <div>
        <h3>
          {label} with {name}
        </h3>
        <p>A selected chapter with its own persistent note.</p>
        <label className="card-note">
          {name} note {label}
          <input />
        </label>
      </div>
    ),
  }));
export function NavigationDemo() {
  const modalTrigger = useRef<HTMLButtonElement>(null),
    drawerTrigger = useRef<HTMLButtonElement>(null),
    nestedTrigger = useRef<HTMLButtonElement>(null);
  const [reduced, setReduced] = useState(false),
    [modal, setModal] = useState(false),
    [drawer, setDrawer] = useState(false),
    [nested, setNested] = useState(false),
    [mounted, setMounted] = useState(true);
  const changeModal = (open: boolean) => {
    setModal(open);
    if (!open) setNested(false);
  };
  return (
    <MotionProvider reducedMotion={reduced ? "always" : "user"}>
      <label className="cinematic-control">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(event) => setReduced(event.target.checked)}
        />
        Reduce navigation motion
      </label>
      <section className="section">
        <div className="section-heading">
          <h2>Find your place.</h2>
          <p>Native links and disclosure controls keep navigation familiar.</p>
        </div>
        <div className="navigation-examples">
          <div>
            <h3>FloatingNavbar</h3>
            <FloatingNavbar label="Floating chapters">{links}</FloatingNavbar>
          </div>
          <div>
            <h3>AnimatedNavbar</h3>
            <AnimatedNavbar label="Animated chapters">{links}</AnimatedNavbar>
          </div>
          <div>
            <h3>DockNavigation</h3>
            <DockNavigation label="Chapter dock">{links}</DockNavigation>
          </div>
          <div>
            <h3>MorphingMenu</h3>
            <MorphingMenu label="More chapters" summary="Explore chapters">
              {links}
            </MorphingMenu>
          </div>
        </div>
      </section>
      <section className="section" id="tabs">
        <div className="section-heading">
          <h2>One chapter at a time.</h2>
          <p>Arrow keys move between enabled tabs. Notes remain when a panel is hidden.</p>
        </div>
        <div className="navigation-examples">
          <div className="panel navigation-panel">
            <h3>AnimatedTabs</h3>
            <AnimatedTabs label="Animated chapters tabs" items={tabItems("AnimatedTabs")} />
          </div>
          <div className="panel navigation-panel">
            <h3>SlidingTabs</h3>
            <SlidingTabs label="Sliding chapters tabs" items={tabItems("SlidingTabs")} />
          </div>
          <div className="panel navigation-panel">
            <h3>SharedLayoutTabs</h3>
            <SharedLayoutTabs label="Shared chapters tabs" items={tabItems("SharedLayoutTabs")} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>AnimatedAccordion</h2>
          <p>A native disclosure with a short entrance, and no hidden keyboard contract.</p>
        </div>
        <AnimatedAccordion
          label="Navigation questions"
          items={[
            {
              id: "keyboard",
              title: "How do I move through tabs?",
              children: (
                <p>Use Left and Right arrows, Home, or End. Tab enters the selected panel.</p>
              ),
            },
            {
              id: "motion",
              title: "Can motion stay quiet?",
              children: (
                <p>
                  System reduction keeps highlights and dialogs static. Controls remain available.
                </p>
              ),
            },
          ]}
        />
      </section>
      <section className="section" id="overlays">
        <div className="section-heading">
          <h2>Room to focus.</h2>
          <p>Native modal scope, Escape, focus restoration, and shared scroll locks.</p>
        </div>
        <div className="control-row">
          <button
            ref={modalTrigger}
            type="button"
            onClick={() => {
              setMounted(true);
              setModal(true);
            }}
          >
            Open project modal
          </button>
          <button ref={drawerTrigger} type="button" onClick={() => setDrawer(true)}>
            Open notes drawer
          </button>
        </div>
        {mounted && (
          <AnimatedModal
            open={modal}
            returnFocusRef={modalTrigger}
            onOpenChange={changeModal}
            title="Project details"
            description="Add a thought, or open the nested notes drawer."
          >
            <label className="card-note">
              Project note
              <input />
            </label>
            <div className="control-row">
              <button ref={nestedTrigger} type="button" onClick={() => setNested(true)}>
                Open nested notes
              </button>
              <button
                type="button"
                onClick={() => {
                  setMounted(false);
                  changeModal(false);
                }}
              >
                Remove modal
              </button>
            </div>
            <form method="dialog">
              <button type="submit">Finish native dialog</button>
            </form>
            <AnimatedDrawer
              open={nested}
              onOpenChange={setNested}
              title="Nested notes"
              returnFocusRef={nestedTrigger}
            >
              <label className="card-note">
                Nested note
                <input />
              </label>
            </AnimatedDrawer>
          </AnimatedModal>
        )}
        <AnimatedDrawer
          open={drawer}
          returnFocusRef={drawerTrigger}
          onOpenChange={setDrawer}
          title="Reading notes"
          description="A focused side panel with the same native dialog contract."
        >
          <label className="card-note">
            Reading note
            <textarea rows={5} />
          </label>
          <p>Close with the button, Escape, or the backdrop.</p>
        </AnimatedDrawer>
      </section>
    </MotionProvider>
  );
}
