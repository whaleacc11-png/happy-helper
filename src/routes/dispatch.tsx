import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/hb/shell";
import { DestinationPanel } from "@/components/hb/destination-panel";
import { Button, Empty, Marker, Qty, Section, Tag } from "@/components/hb/ui";
import {
  SHIPMENT_STATUS,
  destById,
  destState,
  destTotals,
  destinations,
  eventById,
  fmt,
  shipments,
  type Destination,
} from "@/lib/data";

export const Route = createFileRoute("/dispatch")({
  head: () => ({
    meta: [
      { title: "Dispatch — HumbEE" },
      { name: "description", content: "Material still owed to venues, ready to ship, and shipments already handed to couriers." },
      { property: "og:title", content: "Dispatch — HumbEE" },
      { property: "og:description", content: "What must be shipped and what is already moving." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dispatch,
});

function Dispatch() {
  const [sel, setSel] = useState<Destination | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  const owed = destinations
    .map((d) => ({ d, t: destTotals(d) }))
    .filter((r) => r.t.remaining > 0)
    .sort((a, b) => a.d.needBy.localeCompare(b.d.needBy));

  const moving = shipments.filter((s) => s.status === "dispatched" || s.status === "in_transit");

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const pickedUnits = owed.filter((r) => picked.includes(r.d.id)).reduce((a, r) => a + r.t.remaining, 0);

  return (
    <Shell
      title="Dispatch"
      question="What must be shipped and what is already moving?"
      toolbar={
        picked.length > 0 ? (
          <div className="anim-fade flex w-full items-center gap-3">
            <span className="text-[12px]">
              <span className="num">{picked.length}</span> destinations ·{" "}
              <span className="num">{fmt(pickedUnits)}</span> units
            </span>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" onClick={() => setPicked([])}>
                Clear
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  toast.success(`Dispatch sheet created for ${picked.length} destinations`);
                  setPicked([]);
                }}
              >
                Create dispatch sheet
              </Button>
            </div>
          </div>
        ) : (
          <span className="text-[12px] text-subtle">Select destinations to build a dispatch sheet</span>
        )
      }
    >
      <div className="space-y-4">
        <Section title="Owed to venues" meta="ordered by need-by date" flush>
          {owed.length === 0 ? (
            <Empty title="Nothing outstanding" hint="Every destination has received its full requirement." />
          ) : (
            <ul className="divide-border divide-y">
              {owed.map(({ d, t }) => {
                const ev = eventById(d.eventId);
                const on = picked.includes(d.id);
                return (
                  <li
                    key={d.id}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 px-3 py-2.5 transition-colors duration-150 ${on ? "bg-primary/[0.04]" : "hover:bg-surface-sunken"} lg:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_9rem_7rem_5rem]`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(d.id)}
                      aria-label={`Select ${d.name}`}
                      className="accent-primary size-3.5"
                    />
                    <button onClick={() => setSel(d)} className="min-w-0 text-left">
                      <span className="flex items-center gap-2">
                        <Marker tone={destState(d) === "exception" ? "bad" : "warn"} />
                        <span className="truncate text-[13px] font-medium">{d.name}</span>
                      </span>
                      <span className="block truncate text-[11.5px] text-subtle">
                        {d.city}, {d.state}
                      </span>
                    </button>
                    <span className="hidden truncate text-[12px] text-muted-foreground lg:block">
                      <span className="num">{ev?.code}</span> {ev?.name}
                    </span>
                    <span className="text-right lg:text-left">
                      <Qty required={t.required} sent={t.sent} remaining={t.remaining} />
                    </span>
                    <span className="num hidden text-[11px] text-subtle lg:block">need {d.needBy}</span>
                    <span className="hidden lg:block">
                      <Button variant="outline" onClick={() => setSel(d)}>
                        Ship
                      </Button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section title="Handed to courier" meta="already moving" flush>
          {moving.length === 0 ? (
            <Empty title="No active shipments" />
          ) : (
            <ul className="divide-border divide-y">
              {moving.map((s) => {
                const d = destById(s.destinationId);
                return (
                  <li
                    key={s.id}
                    className="hover:bg-surface-sunken grid grid-cols-2 items-center gap-x-4 gap-y-1 px-3 py-2.5 transition-colors duration-150 lg:grid-cols-[10rem_minmax(0,1.2fr)_8rem_7rem_8rem_8rem]"
                  >
                    <span className="num text-[12px] font-medium">{s.awb}</span>
                    <button
                      className="min-w-0 truncate text-left text-[12.5px]"
                      onClick={() => d && setSel(d)}
                    >
                      {d?.name}
                    </button>
                    <span className="hidden text-[12px] text-muted-foreground lg:block">{s.courier}</span>
                    <span className="num text-right text-[12px] lg:text-left">{fmt(s.qty)}</span>
                    <span className="num hidden text-[11px] text-subtle lg:block">out {s.dispatchedAt}</span>
                    <span className="hidden lg:block">
                      <Tag tone={SHIPMENT_STATUS[s.status].tone}>{SHIPMENT_STATUS[s.status].label}</Tag>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </div>

      <DestinationPanel destination={sel} onClose={() => setSel(null)} />
    </Shell>
  );
}
