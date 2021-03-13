import React from "react";
import { Logo } from "assets/logo";
import { Character } from "assets/character";
import Link from "next/link";
export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container mx-auto px-20 py-4 flex items-center">
        <section className="flex">
          <Link href="/">
            <a>
              <Logo className="mr-2" />
            </a>
          </Link>
          <Character />
        </section>
      </header>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 md:px-20 py-4">{children}</div>
      </div>
    </>
  );
}
