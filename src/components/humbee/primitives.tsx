import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STAGES, type Health, type Stage, pct } from "@/lib/humbee-data";

const healthText: Record<Health, string> = {
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
  idle: "text-idle",
};

const healthBg: Record<Health, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  crit: "bg-crit",
  idle: "bg-idle",
};

export function Dot({ health, pulse }: { health: Health; pulse?: boolean }) {
  return (
    <span className={cn("relative inline-flex size-2 shrink-0 rounded-full", healthBg[health])}>
      {pulse && health !== "idle" && (
        <span
          className={cn("absolute inset-0 rounded-full", healthText[health])}
          style={{ animation: "hb-pulse-ring 2.2s ease-out infinite" }}
        />
      )}
    </span>
  );
}

export function StatusPill({
  health,
  children,
  className,
}: {
  health: Health;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight",
        "border-border bg-surface-raised",
        healthText[health],
        className,
      )}
    >
      <Dot health={health} />
      {children}
    </span>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "rise overflow-hidden rounded-lg border border-border bg-surface",
        "shadow-[0_1px_0_0_oklch(1_0_0/4%)_inset,0_10px_30px_-18px_oklch(0_0_0/70%)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex h-11 items-center justify-between gap-3 border-b border-border px-4">
          <h2 className="label-xs text-foreground/80">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn(bodyClassName)}>{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  sub,
  health,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  health?: Health;
  trend?: number[];
}) {
  return (
    <div className="group relative flex flex-col gap-1 p-4 transition-colors hover:bg-surface-raised">
      <div className="flex items-center gap-2">
        {health && <Dot health={health} pulse={health === "crit"} />}
        <span className="label-xs">{label}</span>
      </div>
      <div className="num text-2xl leading-tight font-semibold text-foreground tabular-nums">
        {value}
      </div>
      <div className="flex items-end justify-between gap-3">
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        {trend && <Spark data={trend} className="h-6 w-20 opacity-70 group-hover:opacity-100" />}
      </div>
    </div>
  );
}

export function Spark({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 28}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn("transition-opacity", className)}>
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        className="text-primary"
      />
    </svg>
  );
}

export function StageBar({ current, compact }: { current: Stage; compact?: boolean }) {
  const idx = STAGES.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1" aria-label={`Stage: ${STAGES[idx]?.label}`}>
      {STAGES.map((s, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "todo";
        return (
          <span key={s.key} className="group/stage relative flex items-center">
            <span
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                compact ? "w-4" : "w-7",
                state === "done" && "bg-ok/60",
                state === "current" && cn(compact ? "w-6" : "w-10", "bg-primary"),
                state === "todo" && "bg-border-strong",
              )}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 rounded border border-border bg-popover px-1.5 py-0.5 text-[10px] whitespace-nowrap opacity-0 transition-opacity group-hover/stage:opacity-100">
              {s.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Progress({ value, health = "ok" }: { value: number; health?: Health }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", healthBg[health])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Ratio({ done, planned }: { done: number; planned: number }) {
  const p = pct(done, planned);
  return (
    <div className="flex items-center gap-2">
      <Progress value={p} health={p > 85 ? "ok" : p > 45 ? "warn" : "crit"} />
      <span className="num w-9 shrink-0 text-right text-xs text-muted-foreground">{p}%</span>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="flex size-9 items-center justify-center rounded-md border border-dashed border-border-strong text-muted-foreground">
        —
      </div>
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="max-w-xs text-xs text-muted-foreground">{hint}</p>}
      {action}
    </div>
  );
}

export function RowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 flex-1 animate-pulse rounded bg-muted/60" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
