import type { ReactNode } from "react";

export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-between">
      <a href="/" className="no-underline">
        <h3 className="text-lg leading-1 md:text-2xl font-semibold tracking-tight text-foreground">
          jon
          <span className="text-accent-foreground/70">stuebe</span>
        </h3>
      </a>
      <div className="flex flex-row gap-4 items-center">{children}</div>
    </div>
  );
}
