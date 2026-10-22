"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { progress, type Layer, type Scene } from "../../lib/scene";
function SceneLayer({
  layer,
  time,
  selected,
  onSelect,
}: {
  layer: Layer;
  time: MotionValue<number>;
  selected?: boolean;
  onSelect?: (() => void) | undefined;
}) {
  const reduced = useMotionPreference();
  const x = useTransform(() =>
    reduced ? layer.to.x : layer.from.x + (layer.to.x - layer.from.x) * progress(time.get(), layer),
  );
  const y = useTransform(() =>
    reduced ? layer.to.y : layer.from.y + (layer.to.y - layer.from.y) * progress(time.get(), layer),
  );
  const scale = useTransform(() =>
    reduced
      ? layer.to.scale
      : layer.from.scale + (layer.to.scale - layer.from.scale) * progress(time.get(), layer),
  );
  const rotate = useTransform(() =>
    reduced
      ? layer.to.rotate
      : layer.from.rotate + (layer.to.rotate - layer.from.rotate) * progress(time.get(), layer),
  );
  const opacity = useTransform(() =>
    reduced
      ? layer.to.opacity
      : layer.from.opacity + (layer.to.opacity - layer.from.opacity) * progress(time.get(), layer),
  );
  return (
    <motion.div
      className={`studio-object object-${layer.shape} colour-${layer.colour} ${selected ? "object-selected" : ""}`}
      style={{ x, y, scale, rotate, opacity }}
      onClick={onSelect}
      aria-hidden="true"
    >
      {layer.text}
    </motion.div>
  );
}
export function ScenePreview({
  scene,
  time,
  selected,
  onSelect,
}: {
  scene: Scene;
  time: MotionValue<number>;
  selected?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className="studio-preview"
      role="img"
      aria-label={`Animation preview: ${scene.name}. ${scene.layers
        .map((l) => l.text)
        .filter(Boolean)
        .join(". ")}`}
    >
      <span className="studio-cross" aria-hidden="true">
        +
      </span>
      {scene.layers.map((layer) => (
        <SceneLayer
          key={layer.id}
          layer={layer}
          time={time}
          selected={selected === layer.id}
          onSelect={onSelect ? () => onSelect(layer.id) : undefined}
        />
      ))}
    </div>
  );
}
