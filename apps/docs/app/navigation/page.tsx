import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { navigationMetadata } from "@personal/motion-kit/navigation/metadata";
import { NavigationDemo } from "./NavigationDemo";
export default function NavigationPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">11 / A clear way through</p>
          <h1>Stay oriented.</h1>
          <p className="lede">Native navigation, persistent panels, and a focused place to work.</p>
        </section>
        <NavigationDemo />
        <section className="section" id="reference">
          <h2>Navigation reference</h2>
          <p>
            Import from <code>@personal/motion-kit/navigation</code> inside MotionProvider. The
            application supplies semantic link children and owns controlled dialog state.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Navigation component reference"
          >
            <table>
              <caption>Native focus · persistent panels · explicit controls</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {navigationMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {["AnimatedModal", "AnimatedDrawer"].includes(item.name)
                        ? "open, onOpenChange, title, children required; optional description/className/initialFocusRef/closeOnBackdrop (true). Drawer side left/right (default right). Native modal scope and Escape; close animation then focus restoration; shared nested scroll locks. Keep mounted while closing; unmount cleanup is supported."
                        : item.name.includes("Tabs")
                          ? "items: unique id/label/children/disabled; label required. Optional value/onValueChange or defaultValue, className.1–32 tabs with at least one enabled item. Automatic activation, Left/Right/Home/End, disabled skip. Hidden panels stay mounted. Invalid selection falls back to first enabled item."
                          : item.name === "AnimatedAccordion"
                            ? "items: unique id/title/children; label, optional className. Native details/summary; each disclosure independently opens and preserves its content."
                            : item.name === "MorphingMenu"
                              ? "children, label; optional summary (Menu)/className. Native disclosure navigation; Escape closes and restores summary focus. Use links, rather than ARIA menu items."
                              : "children and label, optional className. Native nav links; FloatingNavbar is sticky, AnimatedNavbar has a bounded viewport lift, DockNavigation adds a small pointer emphasis. Application owns link URLs and current-page indication."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Dialogs render closed in server HTML and enter native modal scope after hydration when
            requested. Parent state must accept onOpenChange(false). Native method=dialog forms also
            close and release locks. Nested overlays keep the page locked until the final owner
            closes. Each dialog restores its connected opener; supply an initialFocusRef only for a
            descendant. Application code owns navigation after destructive actions and trigger
            removal.
          </p>
          <p>
            Use valid block nesting for nav and panel wrappers. Keep focus styles visible.
            Browser-native dialog support is required; dialogs remain in their native top layer, and
            backdrop styling can be supplied with dialog::backdrop. Responsive modal height and
            drawer scrolling keep controls reachable.
          </p>
          <pre tabIndex={0} role="region" aria-label="Modal usage">
            <code>{`import { AnimatedModal } from "@personal/motion-kit/navigation";\n\n<AnimatedModal open={open} onOpenChange={setOpen} title="Project details">\n  <label>Project name<input /></label>\n</AnimatedModal>`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Navigation documentation</footer>
    </div>
  );
}
