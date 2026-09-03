import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/humbee/app-shell";
import { Dot, EmptyState, Panel } from "@/components/humbee/primitives";
import { events, STAGES, type Stage } from "@/lib/humbee-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — HumbEE Operations" },
      { name: "description", content: "Chronological audit stream of every stage change, hold and exception." },
      { property: "og:title", content: "Events — HumbEE Operations" },
      { property: "og:description", content: "Audit stream of stage changes, holds and exceptions." },
    ],
  }),
  component: Events,
});

function Events() {
  const [stage, setStage] = useState<Stage | "all">("all");
  const rows = events.filter((e) => stage === "all" || e.stage === stage);

  return (
    <AppShell title="Events" subtitle="Audit stream · today">
      <Panel
        title="Stream"
        action={
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setStage("all")}
              className={cn(
                "rounded px-2 py-1 text-[11px] transition-colors",
                stage === "all" ? "bg-accent" : "text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
            {STAGES.map((s) => (
              <button
                key={s.key}
                onClick={() => setStage(s.key)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] transition-colors",
                  stage === s.key ? "bg-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.short}
              </button>
            ))}
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState title="No events at this stage" hint="Nothing has been recorded here today." />
        ) : (
          <ol className="relative py-2">
            <span className="absolute top-0 bottom-0 left-[4.6rem] w-px bg-border" />
            {rows.map((e) => (
              <li key={e.id} className="rise relative flex gap-4 px-4 py-2.5 transition-colors hover:bg-surface-raised">
                <span className="num w-12 pt-0.5 text-[11px] text-muted-foreground">{e.at}</span>
                <span className="relative z-10 mt-1.5">
                  <Dot health={e.health} pulse={e.health === "crit"} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug">{e.text}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {e.district} · {STAGES.find((s) => s.key === e.stage)?.label} · {e.actor}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </AppShell>
  );
}
