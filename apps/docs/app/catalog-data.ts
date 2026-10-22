import { coreMetadata } from "@personal/motion-kit/core/metadata";
import { textMetadata } from "@personal/motion-kit/text/metadata";
import { interactionMetadata } from "@personal/motion-kit/interactions/metadata";
import { gestureMetadata } from "@personal/motion-kit/gestures/metadata";
import { cardMetadata } from "@personal/motion-kit/cards/metadata";
import { scrollMetadata } from "@personal/motion-kit/scroll/metadata";
import { tickerMetadata } from "@personal/motion-kit/ticker/metadata";
import { mediaMetadata } from "@personal/motion-kit/media/metadata";
import { editorialMetadata } from "@personal/motion-kit/editorial/metadata";
import { cinematicMetadata } from "@personal/motion-kit/cinematic/metadata";
import { navigationMetadata } from "@personal/motion-kit/navigation/metadata";
import { experimentalMetadata } from "@personal/motion-kit/experimental/metadata";

export const categories = [
  {
    slug: "core",
    title: "Entrances & presence",
    motif: "steps",
    description: "Make an entrance. Leave with intention.",
    items: coreMetadata,
  },
  {
    slug: "text",
    title: "Type that moves",
    motif: "type",
    description: "Split, reveal, scramble. Give words a rhythm.",
    items: textMetadata,
  },
  {
    slug: "buttons",
    title: "Buttons & links",
    motif: "press",
    description: "Small interactions. A very different feeling.",
    items: interactionMetadata,
  },
  {
    slug: "gestures",
    title: "Touch & gestures",
    motif: "orbit",
    description: "Drag, swipe, press. Put movement in your hands.",
    items: gestureMetadata,
  },
  {
    slug: "cards",
    title: "Cards & surfaces",
    motif: "cards",
    description: "Depth and light, with a little personality.",
    items: cardMetadata,
  },
  {
    slug: "scroll",
    title: "Scroll stories",
    motif: "steps",
    description: "Turn a page into a sequence of moments.",
    items: scrollMetadata,
  },
  {
    slug: "ticker",
    title: "Tickers & marquees",
    motif: "type",
    description: "Continuous rhythm. Measured, not monotonous.",
    items: tickerMetadata,
  },
  {
    slug: "media",
    title: "Galleries & media",
    motif: "gallery",
    description: "Frame the work. Let the interaction follow.",
    items: mediaMetadata,
  },
  {
    slug: "editorial",
    title: "Editorial systems",
    motif: "gallery",
    description: "Navigation, chapters, and room to explore.",
    items: editorialMetadata,
  },
  {
    slug: "cinematic",
    title: "Cinematic scenes",
    motif: "orbit",
    description: "Curtains, perspective, and a sense of scale.",
    items: cinematicMetadata,
  },
  {
    slug: "navigation",
    title: "Navigation & overlays",
    motif: "cards",
    description: "Move between ideas without losing your place.",
    items: navigationMetadata,
  },
  {
    slug: "experimental",
    title: "The experimental lab",
    motif: "orbit",
    description: "Particles, fields, and unexpected directions.",
    items: experimentalMetadata,
  },
];
