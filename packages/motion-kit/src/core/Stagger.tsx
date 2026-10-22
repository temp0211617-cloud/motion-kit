"use client";

import { createContext, useContext } from "react";
import { Reveal, type RevealProps } from "./Reveal";
import { useMotionKit } from "../providers/MotionProvider";

const StaggerContext = createContext<number | null>(null);
export interface StaggerProps {
  children: React.ReactNode;
  interval?: number;
}
export function Stagger({ children, interval }: StaggerProps) {
  const { preset } = useMotionKit();
  const value =
    interval === undefined
      ? preset.stagger
      : Number.isFinite(interval)
        ? Math.max(0, interval)
        : preset.stagger;
  return <StaggerContext.Provider value={value}>{children}</StaggerContext.Provider>;
}
export interface StaggerItemProps extends Omit<RevealProps, "delay"> {
  index: number;
}
export function StaggerItem({ index, ...props }: StaggerItemProps) {
  const interval = useContext(StaggerContext);
  if (interval === null) throw new Error("StaggerItem must be used within Stagger");
  const position = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
  return <Reveal {...props} delay={position * interval} />;
}
