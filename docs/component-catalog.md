# Component Catalog

All 153 listed components are implemented and checked against public exports and metadata. 141 remain BUILDING pending stable release; 12 experimental patterns remain EXPERIMENTAL.

Status legend: PLANNED / BUILDING / STABLE / EXPERIMENTAL

Import mapping and demo routes are in the root README. Buttons/links use `/interactions`; generic Interaction components use `/gestures`. Every category exports separate server-safe `/metadata`. The docs app reference tables provide props/defaults/limits/examples for each name.

## Core

FadeIn, FadeUp, FadeDown, FadeLeft, FadeRight, ScaleIn, ScaleFade, SlideIn, Reveal, ScrollReveal, Stagger, StaggerItem, MotionGroup, Presence, PageTransition

## Text

SplitText, WordReveal, CharacterReveal, LineReveal, BlurText, ScrambleText, Typewriter, GradientText, ShimmerText, RollingText, FlipText, MaskedTextReveal, TextTicker, ScrollVelocityText, NumberTicker, AnimatedNumber

## Buttons / links

MotionButton, MagneticButton, ElasticButton, GlowButton, SpotlightButton, RippleButton, IconMotionButton, ArrowLink, UnderlineLink, HoverShiftLink, MorphingButton, LoadingButton

## Interaction

Pressable, HoverScale, HoverLift, HoverMagnet, CursorAttract, TiltSurface, FollowPointer, DragSurface, ElasticDrag, SwipeAction, LongPressMotion

## Cards

HoverCard, TiltCard, SpotlightCard, GlowCard, ThreeDCard, ExpandableCard, MorphingCard, HoverRevealCard, ParallaxCard, StackCard, FloatingCard, PerspectiveCard

## Scroll

ScrollProgress, ScrollSectionProgress, Parallax, ParallaxSection, StickyStory, StickyMediaStory, HorizontalScroll, ScrollMaskReveal, ScrollScale, ScrollRotate, ScrollOpacity, ScrollVelocity, PinnedSection, ChapterScroll, ScrollScene

## Ticker

LiveTicker, DraggableTicker, VerticalTicker, DualTicker, LogoTicker, ImageTicker, VelocityTicker, HoverPauseTicker, NewsTicker, EdgeFadeTicker, RulerTicker

## Carousel / media

DragCarousel, MomentumCarousel, InfiniteCarousel, SnapCarousel, FilmStrip, MediaRail, HoverMediaPreview, ImageReveal, ImageTilt, BeforeAfterSlider, VideoHoverPreview, AnimatedGallery

## Editorial

RulerScrollIndicator, HorizontalRuler, SectionCounter, SectionTracker, EditorialSlider, NumberedMediaRail, EditorialTimeline, ChapterIndicator, StoryIndex, MeasureScale, StickyChapterNav, ReadingProgressRail

## Cinematic

HeroParallax, PerspectiveHero, FloatingHeroObjects, SpotlightHero, MaskReveal, ImageMaskReveal, Curtains, IrisReveal, WipeReveal, SplitScreenReveal, LayeredParallax, CinematicGallery, ZoomScene, DepthSection, PerspectiveScroller

## Navigation / overlays

FloatingNavbar, AnimatedNavbar, MorphingMenu, DockNavigation, AnimatedTabs, SlidingTabs, AnimatedAccordion, AnimatedDrawer, AnimatedModal, SharedLayoutTabs

## Experimental

CursorFollower, CursorTrail, CursorSpotlight, ImageTrail, AuroraBackground, AnimatedGrid, ParticleField, NoiseField, MeshGradient, DistortionHover, LiquidReveal, PhysicsFollower

## Signature quality targets

LiveTicker, DraggableTicker, RulerTicker, RulerScrollIndicator, EditorialSlider, StickyStory, FilmStrip, Curtains must receive dedicated interaction, responsive, accessibility, and performance QA.
