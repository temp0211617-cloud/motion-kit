"use client";
import { useRef, useState } from "react";
import {
  AnimatedModal,
  AnimatedDrawer,
  SlidingTabs,
  MorphingMenu,
} from "@personal/motion-kit/navigation";
import { MotionButton } from "@personal/motion-kit/interactions";
import { EditorialSlider } from "@personal/motion-kit/editorial";
import { MotionProvider } from "@personal/motion-kit/provider";
const word = "MotionKit".repeat(12);
export function StressDemo() {
  const composedTrigger = useRef<HTMLButtonElement>(null),
    initial = useRef<HTMLTextAreaElement>(null);
  const [modal, setModal] = useState(false),
    [drawer, setDrawer] = useState(false),
    [composed, setComposed] = useState(false);
  return (
    <MotionProvider>
      <section className="section">
        <h2>Long controls and tabs</h2>
        <div className="panel navigation-panel stress-buttons">
          <MotionButton>{word}</MotionButton>
          <SlidingTabs
            label="Long chapter tabs"
            items={[
              { id: "one", label: word, children: <p>A readable selected panel.</p> },
              {
                id: "two",
                label: "A second chapter with a longer description",
                children: <p>The second chapter.</p>,
              },
            ]}
          />
        </div>
      </section>
      <section className="section">
        <h2>Long editorial titles</h2>
        <div className="panel navigation-panel">
          <EditorialSlider
            label="Long editorial"
            slides={[
              {
                id: "one",
                title: word,
                media: (
                  <img
                    className="media-image"
                    src="/media-accent.svg"
                    alt="A geometric study for long-content layout"
                    width={400}
                    height={240}
                  />
                ),
                children: <p>Reading content retains a natural flow alongside a long title.</p>,
              },
              {
                id: "two",
                title: "A second frame",
                media: <p>One static study</p>,
                children: <p>Second reading content.</p>,
              },
            ]}
          />
        </div>
      </section>
      <section className="section">
        <h2>Composed keyboard controls</h2>
        <MorphingMenu label="Dialog composition" summary="Open composition menu">
          <button ref={composedTrigger} type="button" onClick={() => setComposed(true)}>
            Open composed modal
          </button>
          <AnimatedModal
            open={composed}
            onOpenChange={setComposed}
            title="Composed form"
            initialFocusRef={initial}
            returnFocusRef={composedTrigger}
          >
            <label className="card-note">
              Initial note
              <textarea ref={initial} />
            </label>
            <input aria-label="Hidden field" hidden />
            <button disabled type="button">
              Unavailable action
            </button>
            <fieldset>
              <legend>Choose a chapter</legend>
              <label>
                <input type="radio" name="chapter" value="one" defaultChecked />
                First chapter
              </label>
              <label>
                <input type="radio" name="chapter" value="two" />
                Second chapter
              </label>
            </fieldset>
            <button type="button">Last form action</button>
          </AnimatedModal>
        </MorphingMenu>
      </section>
      <section className="section">
        <h2>Long overlay content</h2>
        <div className="control-row">
          <button type="button" onClick={() => setModal(true)}>
            Open long modal
          </button>
          <button type="button" onClick={() => setDrawer(true)}>
            Open long drawer
          </button>
        </div>
        <AnimatedModal open={modal} onOpenChange={setModal} title={word}>
          <p>{word}</p>
          <label className="card-note">
            Long form note
            <textarea rows={8} />
          </label>
          <p>End of the scrollable form.</p>
        </AnimatedModal>
        <AnimatedDrawer open={drawer} onOpenChange={setDrawer} title={word}>
          <p>{word}</p>
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index}>
              Chapter {index + 1}. A longer form stays readable and keeps its controls within the
              viewport.
            </p>
          ))}
          <label className="card-note">
            Long drawer note
            <input />
          </label>
        </AnimatedDrawer>
      </section>
    </MotionProvider>
  );
}
