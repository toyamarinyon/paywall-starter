import React from "react";
import classnames from "classnames";
import { BaseLayout } from "./base";

interface SlimLayoutProps {
  children: React.ReactNode;
  size?: string;
}
export function SlimLayout({ children, size = "max-w-screen-lg" }: SlimLayoutProps) {
  return (
    <BaseLayout>
      <div className={classnames("mx-auto", size)}>{children}</div>
    </BaseLayout>
  );
}
