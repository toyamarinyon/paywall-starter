import React from "react";
import { BaseLayout } from "./base";

export function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout>
      <div className="px-20">{children}</div>
    </BaseLayout>
  );
}
