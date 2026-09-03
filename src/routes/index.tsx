import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/humbee/app-shell";
import {
  Dot,
  Metric,
  Panel,
  Ratio,
  StageBar,
  StatusPill,
} from "@/components/humbee/primitives";
import { consignments, districts, events, fmt, STAGES } from "@/lib/humbee-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — HumbEE Operations" },
      {
        name: "description",
        content:
          "Live operational picture across printing, allocation, dispatch, transit and receipt for every district.",
      },
      { property: "og:title", content: "Today — HumbEE Operations" },
      {
        property: "og:description",
        content: "Where it is, what is happening, what needs attention, what to do next.",
      },
    ],
  }),
  component: Today,
});

function Today() {
  const planned = districts.reduce((a, d) => a + d.planned, 0);
  const done = districts.reduce((a, d) => a + d.done, 0);
  const blocked = districts.reduce((a, d) => a + d.blocked, 0);
  const attention = districts.filter((d) => d.health === "crit" || d.health === "warn");

  const stageLoad = STAGES.map((s) => ({
    ...s,
    n: districts.filter((d) => d.stage === s.key).length,
    units: districts.filter((d) => d.stage === s.key).reduce((a, d) => a + d.planned, 0),
  }));
  const maxUnits = Math.max(...stageLoad.map((s) => s.units), 1);

  return (
    <AppShell title="Today" subtitle="Thu 03 Sep · 16:55 IST · cycle 4 of 7">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <Panel bodyClassName="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
            <Metric
              label="Planned"
              value={fmt(planned)}
              sub="units this cycle"
              trend={[20, 30, 38, 45, 52, 60, 68, 74, 80, 88]}
            />
            <Metric
              label="Completed"
              value={fmt(done)}
              sub={`${Math.round((done / planned) * 100)}% of plan`}
              health="ok"
              trend={[10, 18, 26, 34, 41, 50, 58, 66, 72, 79]}
            />
            <Metric
              label="Blocked"
              value={fmt(blocked)}
              sub="2 districts affected"
              health="crit"
              trend={[0, 2, 2, 6, 12, 9, 14, 18, 16, 20]}
            />
            <Metric
              label="In transit"
              value={String(consignments.filter((c) => c.stage === "transit").length)}
              sub="consignments moving"
              health="warn"
              trend={[3, 4, 4, 5, 6, 6, 5, 7, 6, 6]}
            />
          </Panel>

          <Panel title="Pipeline load" action={<span className="label-xs">districts / units</span>}>
            <div className="grid grid-cols-7 gap-px bg-border">
              {stageLoad.map((s) => (
                <div
                  key={s.key}
                  className="group flex flex-col justify-end gap-2 bg-surface p-3 transition-colors hover:bg-surface-raised"
                >
                  <div className="flex h-20 items-end">
                    <div
                      className="w-full rounded-t bg-primary/25 transition-all duration-500 group-hover:bg-primary/45"
                      style={{ height: `${Math.max(6, (s.units / maxUnits) * 100)}%` }}
                    />
                  </div>
                  <div className="num text-sm font-semibold">{s.n}</div>
                  <div className="label-xs truncate">{s.short}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Needs attention"
            action={
              <Link to="/districts" className="text-[11px] text-primary hover:underline">
                All districts
              </Link>
            }
            bodyClassName="divide-y divide-border"
          >
            {attention.map((d) => (
              <Link
                key={d.id}
                to="/districts/$districtId"
                params={{ districtId: d.id }}
                className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-raised"
              >
                <Dot health={d.health} pulse={d.health === "crit"} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-[13px] font-medium">{d.name}</span>
                    <span className="truncate text-[11px] text-muted-foreground">{d.state}</span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{d.lastEvent}</p>
                </div>
                <div className="hidden w-40 md:block">
                  <Ratio done={d.done} planned={d.planned} />
                </div>
                <div className="hidden lg:block">
                  <StageBar current={d.stage} compact />
                </div>
                <span className="num w-24 text-right text-[11px] text-muted-foreground">
                  ETA {d.eta.split(" · ")[1]}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            title="Act now"
            action={<ShieldAlert className="size-3.5 text-crit" />}
            bodyClassName="divide-y divide-border"
          >
            {[
              { d: "Nagpur", t: "Re-seal & clear CN-88250", h: "crit" as const, w: "blocking 410 boxes" },
              { d: "Jaipur", t: "Approve booth list v4", h: "warn" as const, w: "holds allocation" },
              { d: "Nagpur", t: "Reorder tamper seals", h: "warn" as const, w: "900 below minimum" },
            ].map((a) => (
              <div key={a.t} className="flex items-start gap-3 p-3">
                <Dot health={a.h} pulse={a.h === "crit"} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug font-medium">{a.t}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.d} · {a.w}
                  </p>
                </div>
                <button className="rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border-strong hover:bg-accent hover:text-foreground active:scale-[0.97]">
                  Open
                </button>
              </div>
            ))}
          </Panel>

          <Panel
            title="Live feed"
            action={
              <Link to="/events" className="text-[11px] text-primary hover:underline">
                All
              </Link>
            }
            bodyClassName="divide-y divide-border"
          >
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex gap-3 px-3 py-2.5">
                <span className="num pt-0.5 text-[11px] text-muted-foreground">{e.at}</span>
                <Dot health={e.health} />
                <p className="flex-1 text-[12px] leading-snug">{e.text}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Courier status" bodyClassName="p-3 space-y-2.5">
            {consignments.slice(0, 4).map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="num text-[11px]">{c.id}</span>
                  <StatusPill health={c.health}>{c.progress}%</StatusPill>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
