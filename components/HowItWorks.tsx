const STEPS = [
  {
    n: "01",
    title: "Configure & request a quote",
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
    body: "Your cart is built one at a time. We share progress along the way so there are no surprises.",
  },
  {
    n: "04",
    title: "Balance & delivery",
    body: "The remaining balance is due on completion. Pick up locally or arrange delivery of your finished kitchen.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-forest py-20 text-paper sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-paper/70">How it works</p>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">
          Made to order, deposit-backed
        </h2>
        <p className="mt-4 max-w-xl text-paper/80">
          Because every cart is built to order, we work on a simple deposit
          model — no inventory, no shortcuts.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-paper/25 pt-5">
              <span className="font-display text-3xl text-wood">{s.n}</span>
              <h3 className="mt-3 font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-paper/75">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
