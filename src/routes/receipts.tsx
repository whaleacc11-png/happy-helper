import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/humbee/app-shell";
import { Metric, Panel, StatusPill } from "@/components/humbee/primitives";
import { receipts, type Health } from "@/lib/humbee-data";

export const Route = createFileRoute("/receipts")({
  head: () => ({
    meta: [
      { title: "Receipts — HumbEE Operations" },
      { name: "description", content: "Signed, pending and disputed delivery receipts with box variance." },
      { property: "og:title", content: "Receipts — HumbEE Operations" },
      { property: "og:description", content: "Signed, pending and disputed receipts with variance." },
    ],
  }),
  component: Receipts,
});

const map: Record<string, Health> = { signed: "ok", pending: "warn", disputed: "crit" };

function Receipts() {
  return (
    <AppShell title="Receipts" subtitle={`${receipts.length} in current cycle`}>
      <div className="space-y-4">
        <Panel bodyClassName="grid grid-cols-3 divide-x divide-border">
          <Metric label="Signed" value={String(receipts.filter((r) => r.status === "signed").length)} health="ok" />
          <Metric label="Pending" value={String(receipts.filter((r) => r.status === "pending").length)} health="warn" />
          <Metric label="Disputed" value={String(receipts.filter((r) => r.status === "disputed").length)} health="crit" sub="variance -3 boxes" />
        </Panel>

        <Panel title="Ledger" bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-[13px]">
            <thead>
              <tr className="border-b border-border">
                {["Receipt", "Consignment", "District", "Signed by", "Time", "Boxes", "Variance", "Status"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {receipts.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-surface-raised">
                  <td className="num px-4 py-2.5">{r.id}</td>
                  <td className="num px-4 py-2.5 text-muted-foreground">{r.consignment}</td>
                  <td className="px-4 py-2.5">{r.district}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.signedBy}</td>
                  <td className="num px-4 py-2.5 text-muted-foreground">{r.at}</td>
                  <td className="num px-4 py-2.5">{r.boxes}</td>
                  <td className={r.variance ? "num px-4 py-2.5 text-crit" : "num px-4 py-2.5 text-muted-foreground"}>
                    {r.variance || "0"}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusPill health={map[r.status] ?? "idle"}>{r.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AppShell>
  );
}
