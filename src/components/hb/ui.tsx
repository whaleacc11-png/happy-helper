import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmt, pct, type Tone } from "@/lib/data";

const toneText: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  info: "text-info",
  good: "text-good",
  warn: "text-warn",
  bad: "text-bad",
};

const toneBg: Record<Tone, string> = {
  neutral: "bg-line-strong",
  info: "bg-info",
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
};

/** Small square status marker. Deliberately not a coloured pill everywhere. */
export function Marker({ tone, className }: { tone: Tone; className?: string }) {
  return <span className={cn("inline-block size-1.5 shrink-0 rounded-[1px]", toneBg[tone], className)} />;
}

export function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium",
        toneText[tone],
      )}
    >
      <Marker tone={tone} />
      {children}
    </span>
  );
}

/** required / sent / remaining expressed as one line, not three numbers. */
export function Fill({
  sent,
  required,
  tone = "info",
  className,
}: {
  sent: number;
  required: number;
  tone?: Tone;
  className?: string;
}) {
  const p = Math.min(100, pct(sent, required));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", toneBg[tone])}
          style={{ width: `${p}%` }}
        />
      </div>
      <span className="num w-9 shrink-0 text-right text-[11px] text-muted-foreground">{p}%</span>
    </div>
  );
}

export function Qty({
  required,
  sent,
  remaining,
}: {
  required: number;
  sent: number;
  remaining: number;
}) {
  return (
    <span className="num text-[12px] whitespace-nowrap">
      <span className="text-foreground">{fmt(sent)}</span>
      <span className="text-subtle">/{fmt(required)}</span>
      {remaining > 0 && <span className="ml-2 text-warn">−{fmt(remaining)}</span>}
    </span>
  );
}

export function Section({
  title,
  meta,
  action,
  children,
  flush,
  className,
}: {
  title?: string;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("border-border bg-surface border", className)}>
      {(title || action) && (
        <header className="border-border flex h-9 items-center gap-3 border-b px-3">
          {title && <h2 className="eyebrow">{title}</h2>}
          {meta && <span className="text-[11px] text-subtle">{meta}</span>}
          {action && <div className="ml-auto flex items-center gap-1">{action}</div>}
        </header>
      )}
      <div className={flush ? "" : "p-3"}>{children}</div>
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="eyebrow">{label}</div>
      <div className="mt-0.5 truncate text-[13px]">{children}</div>
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="anim-fade flex flex-col items-center justify-center gap-1 px-6 py-14 text-center">
      <div className="border-line-strong mb-2 size-8 rounded-full border border-dashed" />
      <p className="text-[13px] font-medium">{title}</p>
      {hint && <p className="max-w-xs text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-border divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-3 py-2.5">
          <span className="skeleton-line h-3 w-32" />
          <span className="skeleton-line h-3 w-20" />
          <span className="skeleton-line ml-auto h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "solid" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-[12px] font-medium transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        variant === "solid" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "outline" && "border-line-strong hover:bg-surface-sunken border",
        variant === "ghost" && "text-muted-foreground hover:bg-surface-sunken hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="border-border bg-surface-sunken flex items-center gap-0.5 rounded border p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-[3px] px-2 py-1 text-[11px] font-medium transition-all duration-150",
            value === o.value
              ? "bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="num ml-1.5 text-subtle">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Right-hand detail panel — progressive disclosure, never a modal for records. */
export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="anim-fade absolute inset-0 bg-foreground/10" onClick={onClose} />
      <aside className="anim-panel border-border bg-surface relative flex h-full w-full max-w-[30rem] flex-col border-l shadow-[-8px_0_24px_-16px_rgba(0,0,0,0.35)]">
        <header className="border-border flex items-start gap-3 border-b px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold tracking-tight">{title}</div>
            {subtitle && <div className="truncate text-[12px] text-muted-foreground">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className="border-border flex items-center gap-2 border-t px-4 py-3">{footer}</footer>}
      </aside>
    </div>
  );
}

/** Compact horizontal chain: dispatch → courier → delivery → confirmation */
export function Chain({
  steps,
}: {
  steps: { label: string; value?: string; done: boolean; tone?: Tone }[];
}) {
  return (
    <ol className="flex items-stretch">
      {steps.map((s, i) => (
        <li key={s.label} className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Marker tone={s.done ? (s.tone ?? "good") : "neutral"} />
            {i < steps.length - 1 && (
              <span className={cn("h-px flex-1", s.done ? "bg-line-strong" : "bg-border")} />
            )}
          </div>
          <div className="mt-1.5 pr-3">
            <div className="eyebrow truncate">{s.label}</div>
            <div
              className={cn(
                "num truncate text-[11px]",
                s.done ? "text-foreground" : "text-subtle",
              )}
            >
              {s.value ?? "—"}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
