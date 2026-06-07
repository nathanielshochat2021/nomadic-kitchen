import { NextResponse } from "next/server";
import {
  formatPrice,
  specToText,
  totalPrice,
  type Selection,
  type TierSelection,
} from "@/lib/configurator";

export const runtime = "nodejs";

interface QuotePayload {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  /** Honeypot — bots fill this, humans don't. */
  company?: string;
  selection?: Selection;
  tiers?: TierSelection;
  engraving?: string;
  total?: number;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let body: QuotePayload;
  try {
    body = (await req.json()) as QuotePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: silently accept (so the bot thinks it succeeded) but do nothing.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const selection = (body.selection ?? {}) as Selection;
  const tiers = (body.tiers ?? {}) as TierSelection;
  const engraving = (body.engraving ?? "").toString().slice(0, 40);
  // Recompute the total server-side — never trust the client's number.
  const total = totalPrice(selection, tiers);
  const spec = specToText(selection, tiers, engraving);

  const summary = [
    `New Nomadic Kitchen quote request`,
    `────────────────────────────────`,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Phone:    ${body.phone || "—"}`,
    `Location: ${body.location || "—"}`,
    `Message:  ${body.message || "—"}`,
    ``,
    `Configured build`,
    `────────────────`,
    spec,
    ``,
    `Estimated total: ${formatPrice(total)}`,
  ].join("\n");

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;

  // If email isn't configured, log the lead and still return success so the
  // form works in any environment (including undeployed / preview).
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    console.log("[quote] Email not configured — logging lead:\n" + summary);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);

    const htmlSpec = escapeHtml(summary).replace(/\n/g, "<br/>");

    const { error } = await resend.emails.send({
      from: QUOTE_FROM_EMAIL,
      to: QUOTE_TO_EMAIL,
      replyTo: email,
      subject: `Quote request — ${name} (${formatPrice(total)})`,
      text: summary,
      html: `<div style="font-family:ui-monospace,monospace;font-size:14px;line-height:1.6;color:#1b1915">${htmlSpec}</div>`,
    });

    if (error) {
      console.error("[quote] Resend error:", error);
      // Still log the lead so it isn't lost.
      console.log("[quote] Lead (delivery failed):\n" + summary);
      return NextResponse.json({ ok: true, delivered: false });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[quote] Unexpected error:", err);
    console.log("[quote] Lead (delivery failed):\n" + summary);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
