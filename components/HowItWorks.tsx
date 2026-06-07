import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stamp } from "@/components/decor/Decor";

const STEPS = [
  {
    n: "01",
    title: "Configure & request",
    body: "Build your spec in the configurator and send it over. We confirm details, lead time and final pricing.",
  },
  {
    n: "02",
    title: "Reserve with a deposit",
    body: "A 50% deposit reserves your build slot and locks your configuration. We order materials and schedule the build.",
  },
  {
    n: "03",
    title: "We build it by hand",
    body: "Your cart is built one at a time. We share progress photos along the way — no surprises.",
  },
  {
    n: "04",
    title: "Balance & delivery",
    body: "The balance is due on completion. Pick up locally or arrange delivery of your finished kitchen.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-night py-24 text-paper sm:py-32">
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 spin-slow rounded-full border border-white/5" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-4 flex items-center gap-3 text-ember-soft">
            <span className="h-px w-10 bg-ember" />
            <Stamp>The Process</Stamp>
          </div>
          <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            Made to order, <span className="italic text-ember-soft">deposit-backed.</span>
          </h2>
          <p className="mt-4 max-w-xl text-paper/70">
            Every cart is built to order — no inventory, no shortcuts. A simple,
            four-step path from idea to delivery.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <div className="group h-full bg-night p-7 transition-colors hover:bg-basalt">
                <span className="font-display text-4xl text-ember transition-transform duration-300 group-hover:-translate-y-1">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-paper/70">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
