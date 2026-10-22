# Signature showcase upgrade

User references: the rich editorial preview in [Motion's ticker docs](https://motion.dev/docs/react-ticker), animated site navigation, rolling statistics, and the four spatial gallery arrangements on [Motion+](https://motion.dev/plus). This implementation uses original code and original generated artwork.

## Delivered interactions

- Global navigation: staggered rolling letters on mouse hover and keyboard focus; shared active-link underline. Reduced motion keeps the labels static. All fifteen route links remain available.
- Statistics: rolling digits for the actual 153 public package components, 12 collections, 6 playground studies and 4 gallery layouts. Accessible values stay constant while decorative digits move. These are separate quantities; the reference's example count is not our component count.
- Spatial gallery on the homepage and /showcase: eight artworks, Helix/Barrel/Ring/Sphere arrangements, CSS perspective, MotionValue rotation and springs, drag snapping, keyboard arrows, previous/next buttons, pause/play, native vertical touch panning, and a static reduced-motion presentation. Only the visible foreground gallery runs its animation driver. Pointer motion does not update React state or repeatedly measure layout.
- Category-page preview: four photographic tiles reshape the grid on activation. Focus and item identity are preserved, with a static reduced-motion transition. The same preview is available on /showcase.

Package APIs and the 153-component catalog are unchanged. These are docs compositions. The private rc.2 tarball is unchanged. No Three.js, WebGL or GSAP dependency was introduced.

## Security maintenance

A fresh registry audit during the build reported two critical and one high advisory against Next.js 16.4.0. The docs app and lockfile now pin the compatible 16.4.2 security patch. Peer/dependency requirements were reviewed; installation scripts stayed disabled, the frozen-lockfile install succeeded, and the fresh audit reports zero known vulnerabilities. The package itself has no new dependency. A full production Turbopack build succeeded with the patch.

## Artwork and performance

Generated with the built-in imagegen tool, then copied into the project as `apps/docs/public/gallery-atlas.png` (1536 × 1024, 2,129,716 bytes). The eight portraits share one cached local atlas. Images use native lazy loading; CSS crops preserve the source aspect ratio. No third-party image or font requests are required. The full atlas is a deliberate image-payload cost, separate from JavaScript bundle budgets.

Final generation prompt:

> Use case: product-mockup. Create ONE high-resolution landscape image atlas for an interactive 3D gallery: an exact edge-to-edge grid of FOUR columns and TWO rows, eight equally sized portrait panels, no gutters, no borders. Overall aspect ratio 3:2, ideally 1536x1024. Each panel is a premium studio product photograph of a single imaginative sculptural fruit ice lolly centered on its wooden stick, fully visible with generous margin. Reading left to right top row: a folded mango ribbon on soft violet; a strawberry-and-cream marbled arch on turquoise; a translucent kiwi spiral on pale peach; a red watermelon wedge on butter yellow. Bottom row: a stacked blueberry triple sphere on dusty pink; a lemon zigzag on cobalt blue; a coral raspberry ridged oval on mint green; a clear orange citrus bar on soft lavender. Each panel has one clean solid pastel backdrop, tangible frosty texture, soft directional studio shadows, realistic translucent fruit and creamy materials. Editorial still-life quality with beautiful natural imperfections. Original artwork, do not imitate any branded product or website artwork. No typography, letters, logos, watermarks, prices, UI or frame. Strict grid alignment; no objects crossing panel boundaries.

## Verification

Local evidence uses the `artifacts/signature-*` prefix. Browser checks cover the four layouts at all twelve required widths, pointer snapping, native touch activation, offscreen pause, live reduced motion, truthful accessible counters, menu hover/focus, preview expansion and axe. Desktop/mobile captures are reviewed. Final result is recorded in the latest checkpoint. Firefox/WebKit host limitations remain deferred; no broad compatibility or stable-release claim is made. This update is local and has not been synchronized to the private GitHub baseline.
