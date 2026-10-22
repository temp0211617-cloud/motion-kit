import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import {
  FilmStrip,
  BeforeAfterSlider,
  ImageReveal,
  VideoHoverPreview,
  HoverMediaPreview,
  AnimatedGallery,
  MediaRail,
} from "../src/media";
import { mediaSource } from "../src/utils/media-source";
it("clamps the native rail initial index in readable server output", () => {
  const html = renderToString(
    <MediaRail label="Studies" initialIndex={999}>
      <p>One</p>
      <p>Two</p>
    </MediaRail>,
  );
  expect(html).toContain('aria-roledescription="media rail"');
  expect(html).toContain("2 / 2");
  expect(html).toContain("Next Studies");
  expect(html).not.toContain("transform:");
});
it("preserves native rail child drafts through keyed reorder", () => {
  const children = ["First", "Second"].map((label) => (
    <label key={label}>
      {label}
      <input aria-label={`${label} draft`} />
    </label>
  ));
  const { rerender } = render(<MediaRail label="Drafts">{children}</MediaRail>);
  fireEvent.change(screen.getByRole("textbox", { name: "First draft" }), {
    target: { value: "Keep my note" },
  });
  rerender(<MediaRail label="Drafts">{[...children].reverse()}</MediaRail>);
  expect(screen.getByRole("textbox", { name: "First draft" })).toHaveValue("Keep my note");
  expect(screen.getByRole("textbox", { name: "Second draft" })).toHaveValue("");
});
it.each([
  "javascript:alert(1)",
  "data:text/html,test",
  "file:///private/test",
  "https://user:example@example.invalid/frame.svg",
  "",
  "java\nscript:test",
])("rejects unsafe media source %s", (source) => {
  expect(() => mediaSource(source)).toThrow("safe URL");
});
it("keeps image content readable and escaped in SSR", () => {
  const html = renderToString(
    <MotionProvider>
      <ImageReveal
        src="/frame.svg"
        alt="Clear & readable"
        width={400}
        height={240}
        caption="A frame"
      />
    </MotionProvider>,
  );
  expect(html).toContain("Clear &amp; readable");
  expect(html).toContain('loading="lazy"');
  expect(html).not.toContain("opacity:0;");
});
it("scrubs selected frames through native range changes", () => {
  render(
    <MotionProvider reducedMotion="always">
      <FilmStrip
        label="Film"
        frames={[
          { id: "one", label: "One", thumbnail: "Thumb one", media: <p>First frame</p> },
          { id: "two", label: "Two", thumbnail: "Thumb two", media: <p>Second frame</p> },
        ]}
      />
    </MotionProvider>,
  );
  const range = screen.getByRole("slider", { name: "Film playhead" });
  fireEvent.change(range, { target: { value: "1" } });
  expect(screen.getByText("Second frame")).toBeVisible();
  expect(range).toHaveAttribute("aria-valuetext", "Frame 2: Two");
  expect(screen.getByRole("button", { name: "Select frame 2: Two" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
it("validates unambiguous film frame IDs", () => {
  const frame = { id: "same", label: "One", thumbnail: "Thumb", media: "Frame" };
  expect(() => render(<FilmStrip label="Film" frames={[frame, frame]} />)).toThrow("unique");
});
it("pauses native media before changing the selected film frame", () => {
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  render(
    <MotionProvider reducedMotion="always">
      <FilmStrip
        label="Film"
        frames={[
          { id: "video", label: "Video", thumbnail: "One", media: <video /> },
          { id: "still", label: "Still", thumbnail: "Two", media: <p>Still frame</p> },
        ]}
      />
    </MotionProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Select frame 2: Still" }));
  expect(pause).toHaveBeenCalled();
  expect(screen.getByText("Still frame")).toBeVisible();
  pause.mockRestore();
});
it("describes comparison position without exposing visual controls", () => {
  render(
    <BeforeAfterSlider
      label="Compare"
      beforeLabel="Original"
      afterLabel="Revised"
      before={<button>Hidden before action</button>}
      after={<p>After visual</p>}
    />,
  );
  expect(screen.queryByRole("button", { name: "Hidden before action" })).toBeNull();
  const range = screen.getByRole("slider", { name: "Compare" });
  fireEvent.input(range, { target: { value: "80" } });
  expect(range).toHaveAttribute("aria-valuetext", "80% Revised");
  expect(screen.getByText("80% Revised")).toBeVisible();
});
it("toggles preview with a native button and dismisses with Escape", () => {
  render(
    <HoverMediaPreview label="Preview" preview={<a href="#more">More</a>}>
      Open preview
    </HoverMediaPreview>,
  );
  const button = screen.getByRole("button", { name: "Preview" });
  fireEvent.click(button);
  expect(screen.getByRole("link", { name: "More" })).toBeVisible();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(button).toHaveAttribute("aria-expanded", "false");
});
it("keeps media playback explicit and cleans up an unmounted video", () => {
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const { unmount } = render(
    <MotionProvider reducedMotion="always">
      <VideoHoverPreview
        src="/clip.webm"
        poster="/frame.svg"
        captionSrc="/captions.vtt"
        label="Video"
      />
    </MotionProvider>,
  );
  const video = screen.getByLabelText("Video") as HTMLVideoElement;
  expect(video.controls).toBe(true);
  expect(video.muted).toBe(true);
  expect(video.preload).toBe("none");
  expect(video.querySelector("track")).toHaveAttribute("kind", "captions");
  unmount();
  expect(pause).toHaveBeenCalled();
  pause.mockRestore();
});
it("does not take ownership of already playing native video on hover", () => {
  vi.useFakeTimers();
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockReturnValue(false);
  const view = render(
    <MotionProvider reducedMotion="never">
      <VideoHoverPreview
        src="/clip.webm"
        poster="/frame.svg"
        captionSrc="/captions.vtt"
        label="Manual video"
        hoverPlay
      />
    </MotionProvider>,
  );
  try {
    const video = screen.getByLabelText("Manual video");
    const enter = new Event("pointerover", { bubbles: true });
    Object.defineProperty(enter, "pointerType", { value: "mouse" });
    fireEvent(video, enter);
    fireEvent.pointerOut(video, { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(5000));
    expect(play).not.toHaveBeenCalled();
    expect(pause).not.toHaveBeenCalled();
  } finally {
    view.unmount();
    vi.restoreAllMocks();
    vi.useRealTimers();
  }
});
it("starts a paused hover preview and still stops its owned playback on leave", () => {
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockReturnValue(true);
  const view = render(
    <MotionProvider reducedMotion="never">
      <VideoHoverPreview
        src="/clip.webm"
        poster="/frame.svg"
        captionSrc="/captions.vtt"
        label="Preview video"
        hoverPlay
      />
    </MotionProvider>,
  );
  try {
    const video = screen.getByLabelText("Preview video");
    const enter = new Event("pointerover", { bubbles: true });
    Object.defineProperty(enter, "pointerType", { value: "mouse" });
    fireEvent(video, enter);
    expect(play).toHaveBeenCalledOnce();
    fireEvent.pointerOut(video, { relatedTarget: document.body });
    expect(pause).toHaveBeenCalledOnce();
  } finally {
    view.unmount();
    vi.restoreAllMocks();
  }
});
it("gallery preserves keyed input state through reordering", () => {
  const first = <input key="first" aria-label="First note" defaultValue="" />,
    second = <input key="second" aria-label="Second note" defaultValue="" />;
  const { rerender } = render(
    <MotionProvider reducedMotion="always">
      <AnimatedGallery>{[first, second]}</AnimatedGallery>
    </MotionProvider>,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "First note" }), {
    target: { value: "Keep draft" },
  });
  rerender(
    <MotionProvider reducedMotion="always">
      <AnimatedGallery>{[second, first]}</AnimatedGallery>
    </MotionProvider>,
  );
  expect(screen.getByRole("textbox", { name: "First note" })).toHaveValue("Keep draft");
});

it("clamps displayed film selection after frames shrink without invalid range values", () => {
  const frames = [
    { id: "a", label: "First", thumbnail: "A", media: <p>First frame</p> },
    { id: "b", label: "Second", thumbnail: "B", media: <p>Second frame</p> },
  ];
  const view = (current = frames) => (
    <MotionProvider reducedMotion="always">
      <FilmStrip label="Dynamic film" initialIndex={999} frames={current} />
    </MotionProvider>
  );
  const { rerender } = render(view());
  expect(screen.getByText("Second frame")).toBeVisible();
  rerender(view([frames[0]!]));
  expect(screen.getByText("First frame")).toBeVisible();
  expect(screen.getByRole("slider", { name: "Dynamic film playhead" })).toHaveValue("0");
  expect(screen.getByRole("slider", { name: "Dynamic film playhead" })).toHaveAttribute("max", "0");
});

it("retains current comparison position and accessible value when initial props or labels change", () => {
  const view = (initial: number, afterLabel: string) => (
    <BeforeAfterSlider
      initial={initial}
      label="Dynamic comparison"
      beforeLabel="Original"
      afterLabel={afterLabel}
      before="Before"
      after="After"
    />
  );
  const { rerender } = render(view(50.4, "Revised"));
  const range = screen.getByRole("slider", { name: "Dynamic comparison" });
  expect(range).toHaveValue("50");
  fireEvent.input(range, { target: { value: "80" } });
  rerender(view(10, "Updated"));
  expect(range).toHaveValue("80");
  expect(range).toHaveAttribute("aria-valuetext", "80% Updated");
  expect(screen.getByText("80% Updated")).toBeVisible();
  fireEvent.input(range, { target: { value: "35" } });
  expect(range).toHaveAttribute("aria-valuetext", "35% Updated");
});
