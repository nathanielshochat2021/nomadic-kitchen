"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#features", label: "The Cart" },
  { href: "#configurator", label: "Build" },
  { href: "#commission", label: "Commission" },
  { href: "#gallery", label: "Field Notes" },
  { href: "#how", label: "Process" },
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-night/85 backdrop-blur-md border-b border-white/10 text-paper"
          : "bg-transparent text-paper"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-ember/70 transition-transform duration-500 group-hover:rotate-90" />
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
          <span className="font-display text-lg tracking-tight">Nomadic Kitchen</span>
        </a>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="link-underline opacity-85 transition-opacity hover:opacity-100">
              {l.label}
            </a>
          ))}
          <a
            href="#quote"
            className="group relative overflow-hidden rounded-full bg-ember px-5 py-2 text-sm font-semibold text-white"
          >
            <span className="relative z-10">Request a quote</span>
            <span className="absolute inset-0 -translate-x-full bg-wood-deep transition-transform duration-300 group-hover:translate-x-0" />
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-night px-5 py-4 text-paper md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1 text-base">
                {l.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-ember px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Request a quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
