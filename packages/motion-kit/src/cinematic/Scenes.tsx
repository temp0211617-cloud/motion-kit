"use client";
import { Children, isValidElement, useState, type ReactNode } from "react";
import { motion, useTransform, type MotionStyle } from "motion/react";
import { useSceneController, LazyController } from "../scroll/engine";
import { useWideLayout } from "../hooks/useWideLayout";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { motionTokens } from "../tokens/motion-base";
import { spacingTokens } from "../tokens/spacing";
import { layoutTokens } from "../tokens/layout";
export interface CinematicSceneProps {
  children: ReactNode;
  className?: string;
  style?: MotionStyle;
}
type SceneKind = "hero" | "perspective" | "layer" | "zoom" | "depth" | "scroller";
function Scene({ children, className, style, kind }: CinematicSceneProps & { kind: SceneKind }) {
  const { target, inView, progress } = useSceneController();
  const reduced = useMotionPreference(),
    wide = useWideLayout();
  const [focused, setFocused] = useState(false);
  const enabled = !reduced && inView && wide && !focused;
  const y = useTransform(
    progress,
    [0, 0.5, 1],
    [motionTokens.distance.lg, 0, -motionTokens.distance.lg],
  );
  const scale = useTransform(
    progress,
    [0, 0.5, 1],
    [motionTokens.scale.press, 1, motionTokens.scale.emphasis],
  );
  const rotation = useTransform(
    progress,
    [0, 0.5, 1],
    [motionTokens.surface.tilt, 0, -motionTokens.surface.tilt],
  );
  return (
    <div
      ref={target}
      className={className}
      style={{ minWidth: 0, perspective: motionTokens.surface.perspective }}
    >
      <LazyController target={target} progress={progress} enabled={enabled} />
      <motion.div
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        style={{
          ...style,
          minWidth: 0,
          y: enabled && ["hero", "layer", "scroller"].includes(kind) ? y : 0,
          scale: enabled && ["zoom", "depth"].includes(kind) ? scale : 1,
          rotateX: enabled && ["perspective", "scroller"].includes(kind) ? rotation : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
export function HeroParallax(props: CinematicSceneProps) {
  return <Scene {...props} kind="hero" />;
}
export function PerspectiveHero(props: CinematicSceneProps) {
  return <Scene {...props} kind="perspective" />;
}
export function ZoomScene(props: CinematicSceneProps) {
  return <Scene {...props} kind="zoom" />;
}
export function DepthSection(props: CinematicSceneProps) {
  return <Scene {...props} kind="depth" />;
}
export function PerspectiveScroller(props: CinematicSceneProps) {
  return <Scene {...props} kind="scroller" />;
}
export interface LayeredParallaxProps extends CinematicSceneProps {
  background: ReactNode;
}
export function LayeredParallax({ background, children, className, style }: LayeredParallaxProps) {
  return (
    <div className={className} style={{ position: "relative", isolation: "isolate", minWidth: 0 }}>
      <div
        aria-hidden="true"
        inert
        style={{
          position: "absolute",
          inset: 0,
          overflow: "clip",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <Scene kind="layer">{background}</Scene>
      </div>
      <Scene kind="hero" {...(style ? { style } : {})}>
        {children}
      </Scene>
    </div>
  );
}
export function CinematicGallery({ children, className }: Omit<CinematicSceneProps, "style">) {
  const items = Children.toArray(children);
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${layoutTokens.gridMin}),1fr))`,
        gap: spacingTokens[8],
      }}
    >
      {items.map((child, index) =>
        items.length > 64 ? (
          child
        ) : (
          <Scene key={isValidElement(child) ? child.key : index} kind="zoom">
            {child}
          </Scene>
        ),
      )}
    </div>
  );
}
