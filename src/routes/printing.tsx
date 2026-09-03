import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, Metric, Panel, Ratio } from "@/components/humbee/primitives";
import { fmt, printLots } from "@/lib/humbee-data";

export const Route = createFileRoute("/printing")({
  head: () => ({
    meta: [
      { title: "Printing — HumbEE Operations" },
      { name: "description", content: "Press lots, slot utilisation and print completion by district." },
      { property: "og:title", content: "Printing — HumbEE Operations" },
      { property: "og:description", content: "Press lots, slot utilisation and print completion by district." },
    ],
  }),
  component: Printing,
});

function Printing() {
  const qty = printLots.reduce((a, l) => a + l.qty, 0);
  const done = printLots.reduce((a, l) => a + l.done, 0);

  return (
    <AppShell title="Printing" subtitle={`${printLots.length} lots across 3 presses`}>
      <div className="space-y-4">
        <Panel bodyClassName="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          <Metric label="Ordered" value={fmt(qty)} sub="units" />
          <Metric label="Printed" value={fmt(done)} health="ok" trend={[10, 22, 30, 44, 52, 61, 70, 78, 84, 90]} />
          <Metric label="Behind slot" value="1" sub="LP-3407 · Deccan L2" health="crit" />
          <Metric label="Presses live" value="3" sub="of 4 contracted" health="warn" />
        </Panel>

        <Panel title="Lots" bodyClassName="divide-y divide-border">
          {printLots.map((l) => (
            <div key={l.id} className="grid grid-cols-2 items-center gap-3 px-4 py-3 md:grid-cols-[8rem_1fr_10rem_14rem_6rem]">
              <div className="flex items-center gap-2.5">
                <Dot health={l.health} pulse={l.health === "crit"} />
                <span className="num text-[12px] font-medium">{l.id}</span>
              </div>
              <div className="text-[12px] text-muted-foreground">{l.press}</div>
              <div className="text-[12px]">{l.district}</div>
              <div>
                <Ratio done={l.done} planned={l.qty} />
                <div className="num mt-1 text-[10px] text-muted-foreground">
                  {fmt(l.done)} / {fmt(l.qty)}
                </div>
              </div>
              <div className="num text-right text-[11px] text-muted-foreground">{l.slot}</div>
            </div>
          ))}
        </Panel>
      </div>
    </AppShell>
  );
}
