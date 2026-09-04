import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/hb/shell";
import { DestinationPanel } from "@/components/hb/destination-panel";
import { Empty, Marker, Section, Segmented, Tag } from "@/components/hb/ui";
import {
  SHIPMENT_STATUS,
  destById,
  eventById,
  fmt,
  shipments,
  type Destination,
  type Shipment,
} from "@/lib/data";

export const Route = createFileRoute("/transit")({
  head: () => ({
    meta: [
      { title: "Transit — HumbEE" },
      { name: "description", content: "Shipments in the courier network, flagged by delay, exception and time to need-by." },
      { property: "og:title", content: "Transit — HumbEE" },
      { property: "og:description", content: "Which shipments are delayed or at risk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Transit,
});

const risk = (s: Shipment) => (s.status === "exception" ? "bad" : s.note ? "warn" : "info") as const;

function Transit() {
  const [sel, setSel] = useState<Destination | null>(null);
  const [view, setView] = useState<"risk" | "all">("risk");

  const live = shipments.filter((s) => s.status === "in_transit" || s.status === "dispatched" || s.status === "exception");
  const rows = (view === "risk" ? live.filter((s) => s.status === "exception" || s.note) : live).sort(
    (a, b) => (risk(b) === "bad" ? 1 : 0) - (risk(a) === "bad" ? 1 : 0),
  );

  return (
    <Shell
      title="Transit"
      question="Which shipments are delayed or at risk?"
      toolbar={
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: "risk", label: "At risk", count: live.filter((s) => s.status === "exception" || s.note).length },
            { value: "all", label: "All moving", count: live.length },
          ]}
        />
      }
    >
      <Section flush>
        {rows.length === 0 ? (
          <Empty title="Nothing at risk" hint="Every moving shipment is running to plan." />
        ) : (
          <ul className="divide-border divide-y">
            {rows.map((s) => {
              const d = destById(s.destinationId);
              const ev = d ? eventById(d.eventId) : undefined;
              const tone = risk(s);
              return (
                <li key={s.id}>
                  <button
                    onClick={() => d && setSel(d)}
                    className="hover:bg-surface-sunken grid w-full grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-3 py-3 text-left transition-colors duration-150 lg:grid-cols-[11rem_minmax(0,1.3fr)_9rem_7rem_9rem_8rem]"
                  >
                    <span className="flex items-center gap-2">
                      <Marker tone={tone} />
                      <span className="num text-[12px] font-medium">{s.awb}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px]">{d?.name}</span>
                      <span className="block truncate text-[11.5px] text-subtle">
                        <span className="num">{ev?.code}</span> · {d?.city}, {d?.state}
                      </span>
                    </span>
                    <span className="hidden text-[12px] text-muted-foreground lg:block">{s.courier}</span>
                    <span className="num text-right text-[12px] lg:text-left">{fmt(s.qty)}</span>
                    <span className="num hidden text-[11.5px] lg:block">
                      eta {s.etaAt}
                      {d && <span className="block text-[11px] text-subtle">need {d.needBy}</span>}
                    </span>
                    <span className="hidden lg:block">
                      <Tag tone={SHIPMENT_STATUS[s.status].tone}>{SHIPMENT_STATUS[s.status].label}</Tag>
                    </span>
                    {s.note && (
                      <span className="col-span-full text-[11.5px] text-warn lg:col-start-2 lg:-mt-0.5">
                        {s.note}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <DestinationPanel destination={sel} onClose={() => setSel(null)} />
    </Shell>
  );
}
