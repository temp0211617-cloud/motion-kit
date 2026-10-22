export function ArtworkImage({ index }: { index: number }) {
  return (
    <span className="atlas-image" aria-hidden="true">
      <span className="atlas-cell">
        <img
          src="/gallery-atlas.png"
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
          alt=""
          style={{ left: `${-(index % 4) * 100}%`, top: `${-Math.floor(index / 4) * 100}%` }}
        />
      </span>
    </span>
  );
}
