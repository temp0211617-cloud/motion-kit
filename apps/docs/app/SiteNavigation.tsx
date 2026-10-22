"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { motionTokens } from "@personal/motion-kit/tokens";

export const destinations = [
  ["/", "Overview"],
  ["/showcase", "Showcase"],
  ["/examples", "Examples"],
  ["/ai-kit", "AI Kit"],
  ["/studio", "Studio"],
  ["/playground", "Playground"],
  ["/core", "Core"],
  ["/text", "Text"],
  ["/buttons", "Buttons"],
  ["/gestures", "Gestures"],
  ["/cards", "Cards"],
  ["/scroll", "Scroll"],
  ["/ticker", "Ticker"],
  ["/media", "Media"],
  ["/editorial", "Editorial"],
  ["/cinematic", "Cinematic"],
  ["/navigation", "Navigation"],
  ["/experimental", "Experimental"],
] as const;

export function SiteNavigation() {
  const pathname = usePathname();
  const reduced = useMotionPreference();
  return (
    <header className="global-header">
      <div className="global-masthead">
        <Link className="global-brand" href="/" aria-label="Motion Kit home">
          <span aria-hidden="true">m↗</span> motion kit
          <span className="brand-tag">PRIVATE LIBRARY</span>
        </Link>
        <Link className="header-cta" href="/#catalog">
          Explore 153 components <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <nav className="global-navigation" aria-label="Documentation">
        {destinations.map(([href, label]) => (
          <Link
            key={href}
            prefetch={false}
            className="animated-nav-link"
            href={href}
            aria-label={label}
            aria-current={pathname === href ? "page" : undefined}
          >
            <span className="nav-word" aria-hidden="true">
              {label.split("").map((letter, index) => (
                <span
                  className="nav-letter-window"
                  key={index}
                  style={{ "--letter-delay": `${index * 12}ms` } as CSSProperties}
                >
                  <span className="nav-letter-track">
                    <span>{letter}</span>
                    <span>{letter}</span>
                  </span>
                </span>
              ))}
            </span>
            {pathname === href && (
              <motion.span
                className="nav-active-line"
                aria-hidden="true"
                {...(reduced ? {} : { layoutId: "global-navigation-active" })}
                transition={reduced ? { duration: 0 } : motionTokens.spring.smooth}
              />
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
