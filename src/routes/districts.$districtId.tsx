import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, Metric, Panel, Ratio, Spark, StatusPill } from "@/components/humbee/primitives";
import { consignments, districts, events, fmt, STAGES } from "@/lib/humbee-data";

export const Route = createFileRoute("/districts/$districtId")({
  loader: ({ params }) => {
    const d = districts.find((x) => x.id === params.districtId);
    if (!d) throw notFound();
    return { district: d };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "District not found — HumbEE" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.district.name} — HumbEE Operations`;
    const desc = `${loaderData.district.name}: stage, completion, consignments and blockers.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: desc },
        { property: "og:title", content: t },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: DistrictDetail,
});

function DistrictDetail() {
  const { district: d } = Route.useLoaderData();
  const cns = consignments.filter((c) => c.district === d.name);
  const evs = events.filter((e) => e.district === d.name);
  const stageIdx = STAGES.findIndex((s) => s.key === d.stage);

  return (
    <AppShell
      title={d.name}
      subtitle={`${d.state} · owner ${d.owner}`}
      actions={<StatusPill health={d.health}>{STAGES[stageIdx].label}</StatusPill>}
    >
      <Link
        to="/districts"
        className="mb-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" /> Districts
      </Link>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <Panel bodyClassName="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
            <Metric label="Planned" value={fmt(d.planned)} sub="units" />
            <Metric label="Completed" value={fmt(d.done)} health="ok" trend={d.flow} />
            <Metric label="Blocked" value={d.blocked ? fmt(d.blocked) : "0"} health={d.blocked ? "crit" : "idle"} />
            <Metric label="ETA" value={d.eta.split(" · ")[1]} sub={d.eta.split(" · ")[0]} health={d.health} />
          </Panel>

          <Panel title="Chain of custody" bodyClassName="p-4 space-y-4">
            <div className="grid grid-cols-7 gap-1.5">
              {STAGES.map((s, i) => (
                <div key={s.key} className="group space-y-1.5">
                  <div
                    className={
                      i < stageIdx
                        ? "h-1.5 rounded-full bg-ok/60"
                        : i === stageIdx
                          ? "h-1.5 rounded-full bg-primary"
                          : "h-1.5 rounded-full bg-border-strong"
                    }
                  />
                  <div className="label-xs truncate">{s.short}</div>
                  <div
                    className={
                      i < stageIdx
                        ? "num text-xs text-ok"
                        : i === stageIdx
                          ? "num text-xs text-primary"
                          : "num text-xs text-muted-foreground"
                    }
                  >
                    {i < stageIdx ? "done" : i === stageIdx ? "now" : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <Ratio done={d.done} planned={d.planned} />
            </div>
          </Panel>

          <Panel title="Consignments" bodyClassName="divide-y divide-border">
            {cns.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                No consignments raised yet for this district.
              </p>
            )}
            {cns.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3">
                <Dot health={c.health} />
                <span className="num w-24 text-[12px]">{c.id}</span>
                <span className="hidden flex-1 text-[12px] text-muted-foreground md:block">
                  {c.origin} → {c.destination}
                </span>
                <span className="num text-[11px] text-muted-foreground">{c.boxes} boxes</span>
                <div className="w-24">
                  <Ratio done={c.progress} planned={100} />
                </div>
              </div>
            ))}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Throughput" bodyClassName="p-4">
            <Spark data={d.flow} className="h-24 w-full" />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>10 cycles ago</span>
              <span>now</span>
            </div>
          </Panel>

          <Panel title="Activity" bodyClassName="divide-y divide-border">
            {evs.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">Quiet — no events today.</p>
            ) : (
              evs.map((e) => (
                <div key={e.id} className="flex gap-3 px-3 py-2.5">
                  <span className="num pt-0.5 text-[11px] text-muted-foreground">{e.at}</span>
                  <Dot health={e.health} />
                  <div className="flex-1">
                    <p className="text-[12px] leading-snug">{e.text}</p>
                    <p className="text-[10px] text-muted-foreground">{e.actor}</p>
                  </div>
                </div>
              ))
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
