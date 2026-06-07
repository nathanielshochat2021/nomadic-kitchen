"use client";

import { useState, type FormEvent } from "react";
import { useBuild } from "@/components/BuildProvider";
import { formatPrice, summaryLines } from "@/lib/configurator";

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
      // Honeypot — real users never fill this.
      company: String(data.get("company") ?? ""),
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
    <section id="quote" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-wood-deep">
              Request a quote
            </p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              Let&rsquo;s build your kitchen
            </h2>
            <p className="mt-4 max-w-lg text-stone">
              Send your details and we&rsquo;ll confirm your spec, lead time and
              final pricing. Your current configuration is attached automatically.
            </p>

            {status === "success" ? (
              <div className="mt-8 rounded-2xl border border-forest/30 bg-forest/5 p-6">
                <h3 className="font-display text-xl text-forest-deep">
                  Thanks — we&rsquo;ve got your request.
                </h3>
                <p className="mt-2 text-stone">
                  We&rsquo;ll be in touch shortly with your quote and lead time.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm font-medium text-wood-deep underline-offset-4 hover:underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" required autoComplete="name" />
                  <Field label="Email" name="email" type="email" required autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
                  <Field label="Location" name="location" placeholder="City, State" />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
                    Anything else?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Timeline, delivery, custom requests…"
                    className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-ink outline-none transition focus:border-wood focus:ring-1 focus:ring-wood"
                  />
                </div>

                {/* Honeypot — visually hidden, off-screen, not focusable */}
                <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="company">Company (leave blank)</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {status === "error" && (
                  <p className="text-sm text-wood-deep">
                    {error ?? "Something went wrong."} Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-charcoal disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send my request"}
                </button>
              </form>
            )}
          </div>

          {/* Attached build spec */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-canvas p-6">
              <h3 className="font-display text-lg text-ink">Attached to your request</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {lines.length === 0 && (
                  <li className="text-mist">Just the base build for now.</li>
                )}
                {lines.map((l) => (
                  <li key={l.optionId} className="flex justify-between gap-3 text-charcoal">
                    <span>
                      <span className="text-mist">{l.groupName}: </span>
                      {l.optionLabel}
                    </span>
                    <span className="shrink-0 text-stone">
                      {l.price > 0 ? `+${formatPrice(l.price)}` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-sm uppercase tracking-wide text-stone">Est. total</span>
                <span className="font-display text-xl text-ink">{formatPrice(total)}</span>
              </div>
              <a href="#configurator" className="mt-4 block text-sm font-medium text-wood-deep underline-offset-4 hover:underline">
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
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-wood-deep"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-ink outline-none transition focus:border-wood focus:ring-1 focus:ring-wood"
      />
    </div>
  );
}
