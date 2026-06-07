"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#features", label: "The cart" },
  { href: "#configurator", label: "Build" },
  { href: "#gallery", label: "Gallery" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-paper/90 backdrop-blur border-b border-line text-ink"
          : "bg-transparent text-paper"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${solid ? "bg-wood" : "bg-paper"}`} />
          Nomadic Kitchen
        </a>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="opacity-80 transition-opacity hover:opacity-100">
              {l.label}
            </a>
          ))}
          <a
            href="#quote"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              solid ? "bg-ink text-paper hover:bg-charcoal" : "bg-paper text-ink hover:bg-canvas"
            }`}
          >
            Request a quote
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 transition ${solid ? "bg-ink" : "bg-paper"}`} />
            <span className={`block h-0.5 w-6 transition ${solid ? "bg-ink" : "bg-paper"}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-4 text-ink md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1 text-base">
                {l.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-ink px-4 py-2.5 text-center text-sm font-medium text-paper"
            >
              Request a quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
