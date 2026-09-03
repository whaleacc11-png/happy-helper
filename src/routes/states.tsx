import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, Panel, Ratio } from "@/components/humbee/primitives";
import { fmt, states } from "@/lib/humbee-data";

export const Route = createFileRoute("/states")({
  head: () => ({
    meta: [
      { title: "States — HumbEE Operations" },
      { name: "description", content: "State-level rollup of plan, completion and blocked volume." },
      { property: "og:title", content: "States — HumbEE Operations" },
      { property: "og:description", content: "State-level rollup of plan, completion and blocked volume." },
    ],
  }),
  component: States,
});

function States() {
  return (
    <AppShell title="States" subtitle={`${states.length} states · ${states.reduce((a, s) => a + s.districts, 0)} districts`}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {states.map((s) => (
          <Panel key={s.code} bodyClassName="p-4 space-y-3" className="transition-colors hover:border-border-strong">
            <div className="flex items-center gap-2.5">
              <Dot health={s.health} pulse={s.health === "crit"} />
              <span className="num rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {s.code}
              </span>
              <span className="text-[13px] font-medium">{s.name}</span>
              <span className="num ml-auto text-[11px] text-muted-foreground">{s.districts} dist</span>
            </div>
            <Ratio done={s.done} planned={s.planned} />
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-2.5">
              <div>
                <div className="label-xs">Planned</div>
                <div className="num text-[13px]">{fmt(s.planned)}</div>
              </div>
              <div>
                <div className="label-xs">Done</div>
                <div className="num text-[13px] text-ok">{fmt(s.done)}</div>
              </div>
              <div>
                <div className="label-xs">Blocked</div>
                <div className={s.blocked ? "num text-[13px] text-crit" : "num text-[13px] text-muted-foreground"}>
                  {s.blocked ? fmt(s.blocked) : "0"}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
