import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, EmptyState, Panel, StageBar, StatusPill } from "@/components/humbee/primitives";
import { consignments } from "@/lib/humbee-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dispatch")({
  head: () => ({
    meta: [
      { title: "Dispatch — HumbEE Operations" },
      { name: "description", content: "Consignments queued for gate-out: vehicles, seals, box counts and holds." },
      { property: "og:title", content: "Dispatch — HumbEE Operations" },
      { property: "og:description", content: "Vehicles, seals, box counts and holds at gate-out." },
    ],
  }),
  component: Dispatch,
});

function Dispatch() {
  const queue = consignments.filter((c) => c.stage === "dispatch" || c.stage === "allocation");
  const [selected, setSelected] = useState<string | null>(queue[0]?.id ?? null);
  const active = consignments.find((c) => c.id === selected);

  return (
    <AppShell title="Dispatch" subtitle={`${queue.length} awaiting gate-out`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel title="Gate queue" bodyClassName="divide-y divide-border">
          {queue.length === 0 ? (
            <EmptyState title="Gate is clear" hint="No consignments waiting for dispatch right now." />
          ) : (
            queue.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={cn(
                  "flex w-full items-center gap-4 px-4 py-3 text-left transition-colors",
                  selected === c.id ? "bg-surface-raised" : "hover:bg-surface-raised/60",
                )}
              >
                <Dot health={c.health} pulse={c.health === "crit"} />
                <span className="num w-24 text-[12px]">{c.id}</span>
                <span className="flex-1 truncate text-[12px]">{c.district}</span>
                <span className="num hidden text-[11px] text-muted-foreground md:inline">{c.vehicle}</span>
                <span className="num text-[11px] text-muted-foreground">{c.boxes} bx</span>
                <StageBar current={c.stage} compact />
              </button>
            ))
          )}
        </Panel>

        <Panel title={active ? active.id : "Detail"} bodyClassName="p-4 space-y-4">
          {!active ? (
            <EmptyState title="Select a consignment" hint="Pick a row to inspect seals and release it." />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <StatusPill health={active.health}>
                  {active.health === "crit" ? "held" : "ready"}
                </StatusPill>
                <span className="num text-[11px] text-muted-foreground">ETA {active.eta}</span>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-[12px]">
                {[
                  ["District", active.district],
                  ["Vehicle", active.vehicle],
                  ["Courier", active.courier],
                  ["Boxes", String(active.boxes)],
                  ["Origin", active.origin],
                  ["Destination", active.destination],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label-xs">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 rounded-md bg-primary px-3 py-2 text-[12px] font-medium text-primary-foreground transition-transform hover:brightness-105 active:scale-[0.98]">
                  Release to transit
                </button>
                <button className="rounded-md border border-border px-3 py-2 text-[12px] transition-colors hover:bg-accent active:scale-[0.98]">
                  Hold
                </button>
              </div>
            </>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
