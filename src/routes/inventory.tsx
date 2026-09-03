import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/humbee/app-shell";
import { Metric, Panel, Progress, StatusPill } from "@/components/humbee/primitives";
import { fmt, inventory } from "@/lib/humbee-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — HumbEE Operations" },
      { name: "description", content: "On-hand stock, allocations and reorder thresholds across vaults and stores." },
      { property: "og:title", content: "Inventory — HumbEE Operations" },
      { property: "og:description", content: "On-hand stock, allocations and reorder thresholds by location." },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const below = inventory.filter((r) => r.onHand < r.min);
  const free = inventory.reduce((a, r) => a + Math.max(0, r.onHand - r.allocated), 0);

  return (
    <AppShell title="Inventory" subtitle="6 locations · live counts">
      <div className="space-y-4">
        <Panel bodyClassName="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          <Metric label="On hand" value={fmt(inventory.reduce((a, r) => a + r.onHand, 0))} sub="units" />
          <Metric label="Allocated" value={fmt(inventory.reduce((a, r) => a + r.allocated, 0))} health="ok" />
          <Metric label="Unallocated" value={fmt(free)} sub="available to commit" />
          <Metric label="Below minimum" value={String(below.length)} sub="reorder required" health="crit" />
        </Panel>

        <Panel title="Stock positions" bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-[13px]">
            <thead>
              <tr className="border-b border-border">
                {["SKU", "Item", "Location", "On hand", "Allocated", "Coverage"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((r, i) => {
                const low = r.onHand < r.min;
                const coverage = Math.min(100, Math.round((r.onHand / Math.max(r.min * 3, 1)) * 100));
                return (
                  <tr key={i} className="transition-colors hover:bg-surface-raised">
                    <td className="num px-4 py-2.5 text-[12px]">{r.sku}</td>
                    <td className="px-4 py-2.5">{r.item}</td>
                    <td className="px-4 py-2.5 text-[12px] text-muted-foreground">{r.location}</td>
                    <td className="num px-4 py-2.5">{fmt(r.onHand)}</td>
                    <td className="num px-4 py-2.5 text-muted-foreground">{fmt(r.allocated)}</td>
                    <td className="w-52 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Progress value={coverage} health={low ? "crit" : coverage > 60 ? "ok" : "warn"} />
                        {low && <StatusPill health="crit">low</StatusPill>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>
    </AppShell>
  );
}
