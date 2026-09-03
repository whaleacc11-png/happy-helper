import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, EmptyState, Panel, Ratio, StageBar } from "@/components/humbee/primitives";
import { districts, fmt, type Health } from "@/lib/humbee-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/districts/")({
  head: () => ({
    meta: [
      { title: "Districts — HumbEE Operations" },
      { name: "description", content: "Every district's stage, completion, blockers and owner in one dense view." },
      { property: "og:title", content: "Districts — HumbEE Operations" },
      { property: "og:description", content: "Stage, completion, blockers and owner for every district." },
    ],
  }),
  component: Districts,
});

const filters: { key: Health | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "crit", label: "Critical" },
  { key: "warn", label: "At risk" },
  { key: "ok", label: "On track" },
  { key: "idle", label: "Not started" },
];

function Districts() {
  const [f, setF] = useState<Health | "all">("all");
  const rows = districts.filter((d) => f === "all" || d.health === f);

  return (
    <AppShell title="Districts" subtitle={`${districts.length} active · 6 states`}>
      <Panel
        title="Coverage"
        action={
          <div className="flex items-center gap-1">
            {filters.map((x) => (
              <button
                key={x.key}
                onClick={() => setF(x.key)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] transition-colors",
                  f === x.key
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
        }
        bodyClassName="overflow-x-auto"
      >
        {rows.length === 0 ? (
          <EmptyState title="No districts in this state" hint="Change the filter to see other districts." />
        ) : (
          <table className="w-full min-w-[46rem] text-[13px]">
            <thead>
              <tr className="border-b border-border">
                {["District", "Stage", "Completion", "Blocked", "Owner", "ETA"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((d) => (
                <tr key={d.id} className="group transition-colors hover:bg-surface-raised">
                  <td className="px-4 py-2.5">
                    <Link
                      to="/districts/$districtId"
                      params={{ districtId: d.id }}
                      className="flex items-center gap-2.5"
                    >
                      <Dot health={d.health} pulse={d.health === "crit"} />
                      <span className="font-medium group-hover:text-primary">{d.name}</span>
                      <span className="text-[11px] text-muted-foreground">{d.state}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <StageBar current={d.stage} compact />
                  </td>
                  <td className="w-56 px-4 py-2.5">
                    <Ratio done={d.done} planned={d.planned} />
                    <div className="num mt-1 text-[10px] text-muted-foreground">
                      {fmt(d.done)} / {fmt(d.planned)}
                    </div>
                  </td>
                  <td className="num px-4 py-2.5 text-crit">{d.blocked ? fmt(d.blocked) : "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{d.owner}</td>
                  <td className="num px-4 py-2.5 text-muted-foreground">{d.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </AppShell>
  );
}
