import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, Metric, Panel, Progress } from "@/components/humbee/primitives";
import { consignments } from "@/lib/humbee-data";

export const Route = createFileRoute("/transit")({
  head: () => ({
    meta: [
      { title: "In Transit — HumbEE Operations" },
      { name: "description", content: "Live courier progress, route position and delay exposure for moving consignments." },
      { property: "og:title", content: "In Transit — HumbEE Operations" },
      { property: "og:description", content: "Courier progress, route position and delay exposure." },
    ],
  }),
  component: Transit,
});

function Transit() {
  const moving = consignments.filter((c) => c.stage === "transit" || c.stage === "delivery");

  return (
    <AppShell title="In Transit" subtitle={`${moving.length} consignments on road`}>
      <div className="space-y-4">
        <Panel bodyClassName="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          <Metric label="On road" value={String(moving.length)} sub="couriers active" health="ok" />
          <Metric label="Delayed" value="1" sub="Katraj ghat · +40m" health="warn" />
          <Metric label="Boxes moving" value={String(moving.reduce((a, c) => a + c.boxes, 0))} />
          <Metric label="Next arrival" value="09:30" sub="CN-88231 · Baramati" />
        </Panel>

        <Panel title="Route progress" bodyClassName="divide-y divide-border">
          {moving.map((c) => (
            <div key={c.id} className="space-y-2 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Dot health={c.health} pulse={c.health !== "ok"} />
                <span className="num text-[12px] font-medium">{c.id}</span>
                <span className="text-[12px] text-muted-foreground">{c.courier}</span>
                <span className="num ml-auto text-[11px] text-muted-foreground">ETA {c.eta}</span>
              </div>
              <div className="relative">
                <Progress value={c.progress} health={c.health === "crit" ? "crit" : c.health === "warn" ? "warn" : "ok"} />
                <span
                  className="absolute -top-0.5 size-2.5 -translate-x-1/2 rounded-full border-2 border-background bg-primary transition-[left] duration-700"
                  style={{ left: `${c.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{c.origin}</span>
                <span className="num">{c.boxes} boxes</span>
                <span>{c.destination}</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </AppShell>
  );
}
