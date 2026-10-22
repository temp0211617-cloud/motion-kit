"use client";
import { createContext } from "react";
import type { ReducedMotionConfig } from "motion/react";

export const PreferenceContext = createContext<ReducedMotionConfig | undefined>(undefined);
