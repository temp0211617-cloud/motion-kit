import type { Metadata } from "next";
import { MotionProvider } from "@personal/motion-kit/provider";
import { foundationVariables } from "@personal/motion-kit/tokens";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motion Kit",
  description: "Private motion design system documentation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={foundationVariables}>
      <body>
        <a className="skip-link" href="#main" tabIndex={0}>
          Skip to content
        </a>
        <MotionProvider preset="premium">{children}</MotionProvider>
      </body>
    </html>
  );
}
