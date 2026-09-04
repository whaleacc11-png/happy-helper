import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/hb/shell";
import { DestinationPanel } from "@/components/hb/destination-panel";
import { Empty, Marker, Qty, Section, Tag } from "@/components/hb/ui";
import {
  DEST_STATE,
  activity,
  destState,
  destTotals,
  destShipments,
  destinations,
  eventById,
  shipments,
  type Destination,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Attention — HumbEE" },
      {
        name: "description",
        content:
          "Destinations blocked, unsent, delayed or awaiting organiser confirmation — the operations worklist for today.",
      },
      { property: "og:title", content: "Attention — HumbEE" },
      { property: "og:description", content: "What needs attention now, across every event destination." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Attention,
});

type Bucket = {
  key: string;
  title: string;
  why: string;
  tone: "bad" | "warn" | "info";
  rows: Destination[];
};

function Attention() {
  const [sel, setSel] = useState<Destination | null>(null);

  const exceptions = destinations.filter((d) => destState(d) === "exception");
  const unsent = destinations.filter((d) => {
    const s = destState(d);
    return s === "unshipped" || s === "partial";
  });
  const delayed = destinations.filter((d) =>
    destShipments(d.id).some((s) => s.status === "in_transit" && !!s.note),
  );
  const unconfirmed = destinations.filter((d) => destState(d) === "delivered");

  const buckets: Bucket[] = [
    { key: "exc", title: "Blocked", why: "Cannot progress without a decision", tone: "bad", rows: exceptions },
    { key: "uns", title: "Not fully sent", why: "Material still owed to the venue", tone: "warn", rows: unsent.filter((d) => destState(d) !== "exception") },
    { key: "dly", title: "At risk in transit", why: "Courier reported a delay", tone: "warn", rows: delayed },
    { key: "unc", title: "Awaiting confirmation", why: "Delivered, organiser has not signed off", tone: "info", rows: unconfirmed },
  ];

  const clear = buckets.every((b) => b.rows.length === 0);

  return (
    <Shell title="Attention" question="What needs attention now?">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          {clear && <Section flush><Empty title="Nothing needs attention" hint="Every destination is sent, delivered and confirmed." /></Section>}
          {buckets.map(
            (b) =>
              b.rows.length > 0 && (
                <Section
                  key={b.key}
                  title={b.title}
                  meta={b.why}
                  action={<span className="num text-[12px] text-subtle">{b.rows.length}</span>}
                  flush
                >
                  <ul className="divide-border divide-y">
                    {b.rows.map((d) => {
                      const t = destTotals(d);
                      const st = destState(d);
                      const ev = eventById(d.eventId);
                      return (
                        <li key={d.id}>
                          <button
                            onClick={() => setSel(d)}
                            className="hover:bg-surface-sunken grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-3 py-2.5 text-left transition-colors duration-150 md:grid-cols-[1.4fr_1fr_9rem_7rem]"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Marker tone={b.tone} />
                              <span className="truncate text-[13px] font-medium">{d.name}</span>
                              <span className="truncate text-[11.5px] text-subtle">{d.city}</span>
                            </span>
                            <span className="hidden truncate text-[12px] text-muted-foreground md:block">
                              <span className="num">{ev?.code}</span> {ev?.name}
                            </span>
                            <span className="text-right md:text-left">
                              <Qty required={t.required} sent={t.sent} remaining={t.remaining} />
                            </span>
                            <span className="hidden items-center justify-between gap-2 md:flex">
                              <Tag tone={DEST_STATE[st].tone}>{DEST_STATE[st].label}</Tag>
                              <span className="num text-[11px] text-subtle">{d.needBy}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              ),
          )}
        </div>

        <div className="space-y-4">
          <Section
            title="Today"
            flush
            action={
              <Link to="/events" className="text-primary text-[11px] hover:underline">
                Events
              </Link>
            }
          >
            <dl className="divide-border divide-y">
              {[
                { k: "Destinations open", v: destinations.filter((d) => destState(d) !== "confirmed").length },
                { k: "Shipments moving", v: shipments.filter((s) => s.status === "in_transit").length },
                { k: "Delivered, unconfirmed", v: unconfirmed.length },
                { k: "Exceptions", v: exceptions.length },
              ].map((r) => (
                <div key={r.k} className="flex items-baseline justify-between px-3 py-2">
                  <dt className="text-[12px] text-muted-foreground">{r.k}</dt>
                  <dd className={cn("num text-[13px]", r.k === "Exceptions" && r.v > 0 && "text-bad")}>{r.v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Activity" flush>
            <ol className="divide-border divide-y">
              {activity.map((a) => (
                <li key={a.id} className="flex gap-2.5 px-3 py-2">
                  <span className="num pt-[3px] text-[11px] text-subtle">{a.at}</span>
                  <Marker tone={a.tone} className="mt-[7px]" />
                  <div className="min-w-0">
                    <p className="text-[12px] leading-snug">{a.text}</p>
                    <p className="text-[11px] text-subtle">{a.actor}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>

      <DestinationPanel destination={sel} onClose={() => setSel(null)} />
    </Shell>
  );
}
