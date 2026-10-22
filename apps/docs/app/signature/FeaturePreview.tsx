"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { motionTokens } from "@personal/motion-kit/tokens";
import { artworkNames } from "./artwork-data";
import { ArtworkImage } from "./ArtworkImage";

function PreviewContent({ standalone }: { standalone: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const reduced = useMotionPreference();
  return (
    <aside
      className={`feature-preview ${standalone ? "" : "shell"}`}
      aria-label="Interactive collection preview"
    >
      <div className="feature-preview-grid">
        {[0, 1, 2, 3].map((index) => (
          <motion.button
            type="button"
            layout={!reduced}
            key={index}
            className="feature-preview-tile"
            data-expanded={selected === index}
            aria-pressed={selected === index}
            aria-label={`Expand ${artworkNames[index]} preview`}
            onClick={() => setSelected((value) => (value === index ? null : index))}
            transition={reduced ? { duration: 0 } : motionTokens.spring.soft}
          >
            <ArtworkImage index={index} />
            <span>{artworkNames[index]}</span>
            <span aria-hidden="true">↗</span>
          </motion.button>
        ))}
      </div>
      <div className="feature-preview-copy">
        <div>
          <p className="eyebrow">BUILT TO BE INTERACTIVE</p>
          <h2>Go beyond the first frame.</h2>
          <p>
            Tap a tile to reshape the composition. Explore the full spatial gallery, then bring the
            idea into your own interface.
          </p>
        </div>
        <Link className="action-primary" href="/showcase">
          Explore the showcase ↗
        </Link>
      </div>
    </aside>
  );
}
export function FeaturePreview({ standalone = false }: { standalone?: boolean }) {
  return <PreviewContent standalone={standalone} />;
}
