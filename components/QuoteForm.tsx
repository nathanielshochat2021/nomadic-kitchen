"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { useBuild } from "@/components/BuildProvider";
import { formatPrice, summaryLines } from "@/lib/configurator";
import AnimatedPrice from "@/components/motion/AnimatedPrice";
import { Stamp } from "@/components/decor/Decor";

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const { selection, total } = useBuild();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const lines = summaryLines(selection);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      location: String(data.get("location") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""), // honeypot
      selection,
      total,
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="quote" className="relative overflow-hidden bg-forest-deep py-24 text-paper sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_85%_0%,rgba(210,98,46,0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-4 flex items-center gap-3 text-ember-soft">
              <span className="h-px w-10 bg-ember" />
              <Stamp>Request a quote</Stamp>
            </div>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Let&rsquo;s build <span className="italic text-ember-soft">your</span> kitchen.
            </h2>
            <p className="mt-4 max-w-lg text-paper/70">
              Send your details and we&rsquo;ll confirm your spec, lead time and final
              pricing. Your current configuration rides along automatically.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-3xl border border-ember/40 bg-ember/10 p-7"
              >
                <h3 className="font-display text-2xl text-paper">Request received. ✓</h3>
                <p className="mt-2 text-paper/75">
                  We&rsquo;ve got your build and details — we&rsquo;ll be in touch shortly with
                  your quote and lead time.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm font-medium text-ember-soft underline-offset-4 hover:underline"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" required autoComplete="name" />
                  <Field label="Email" name="email" type="email" required autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
                  <Field label="Location" name="location" placeholder="City, State" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-paper/80">
                    Anything else?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Timeline, delivery, custom requests…"
                    className="focusable w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/40 outline-none transition focus:border-ember"
                  />
                </div>

                {/* honeypot */}
                <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="company">Company (leave blank)</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {status === "error" && (
                  <p className="text-sm text-ember-soft">
                    {error ?? "Something went wrong."} Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group relative overflow-hidden rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {status === "submitting" ? "Sending…" : "Send my request →"}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-wood-deep transition-transform duration-300 group-hover:translate-x-0" />
                </button>
              </form>
            )}
          </div>

          {/* attached build spec */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-white/10 bg-night/60 p-6 backdrop-blur-sm">
              <Stamp className="text-ember-soft">Attached spec</Stamp>
              <ul className="mt-4 space-y-2 text-sm">
                {lines.length === 0 && <li className="text-paper/40">Just the base build for now.</li>}
                {lines.map((l) => (
                  <li key={l.optionId} className="flex justify-between gap-3 text-paper/85">
                    <span>
                      <span className="text-paper/45">{l.groupName}: </span>
                      {l.optionLabel}
                    </span>
                    <span className="shrink-0 text-paper/60">
                      {l.price > 0 ? `+${formatPrice(l.price)}` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
                <Stamp className="text-paper/50">Est. total</Stamp>
                <AnimatedPrice value={total} className="font-display text-2xl text-paper" />
              </div>
              <a href="#configurator" className="mt-4 block text-sm font-medium text-ember-soft underline-offset-4 hover:underline">
                ← Edit my build
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-paper/80">
        {label}
        {required && <span className="text-ember-soft"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="focusable w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/40 outline-none transition focus:border-ember"
      />
    </div>
  );
}
