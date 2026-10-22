"use client";
import { safeDOMProps } from "../utils/dom-props";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useIsPresent,
  type HTMLMotionProps,
} from "motion/react";
import { useMotionKit } from "../providers/MotionProvider";
import { useMotionPreference } from "../hooks/useMotionPreference";

export interface PresenceProps {
  children: React.ReactNode;
  show: boolean;
  mode?: "sync" | "wait";
  onExitComplete?: () => void;
}
function PresentContent({ children }: { children: React.ReactNode }) {
  const present = useIsPresent();
  const { preset } = useMotionKit();
  const reduced = useMotionPreference();
  return (
    <motion.div
      inert={!present}
      aria-hidden={!present || undefined}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : preset.duration }}
    >
      {children}
    </motion.div>
  );
}
export function Presence({ children, show, mode = "sync", onExitComplete }: PresenceProps) {
  return (
    <AnimatePresence initial={false} mode={mode} {...(onExitComplete ? { onExitComplete } : {})}>
      {show ? <PresentContent key="content">{children}</PresentContent> : null}
    </AnimatePresence>
  );
}
export interface MotionGroupProps {
  children: React.ReactNode;
  id: string;
}
export function MotionGroup({ children, id }: MotionGroupProps) {
  return <LayoutGroup id={id}>{children}</LayoutGroup>;
}
export interface PageTransitionProps extends Omit<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "exit" | "transition" | "dangerouslySetInnerHTML"
> {
  transitionKey: string;
}
function PageContent({ children, ...props }: Omit<PageTransitionProps, "transitionKey">) {
  const present = useIsPresent();
  const { preset } = useMotionKit();
  const reduced = useMotionPreference();
  return (
    <motion.div
      {...safeDOMProps(props)}
      inert={!present}
      aria-hidden={!present || undefined}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : preset.duration }}
    >
      {children}
    </motion.div>
  );
}
export function PageTransition({ children, transitionKey, ...props }: PageTransitionProps) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <PageContent key={transitionKey} {...props}>
        {children}
      </PageContent>
    </AnimatePresence>
  );
}
