import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Shell } from "@/components/hb/shell";
import { Empty, Fill, Qty, Section, Segmented, Tag } from "@/components/hb/ui";
import { events, eventTotals } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — HumbEE" },
      {
        name: "description",
        content: "Every live event with destination coverage, material sent, remaining and organiser confirmations.",
      },
      { property: "og:title", content: "Events — HumbEE" },
      { property: "og:description", content: "Which events are fully supplied and confirmed, and which are not." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsScreen,
});

type Filter = "all" | "open" | "risk";

function EventsScreen() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = events
    .map((e) => ({ e, t: eventTotals(e.id) }))
    .filter(({ t }) =>
      filter === "all" ? true : filter === "risk" ? t.exceptions > 0 : t.confirmed < t.destinations,
    );

  return (
    <Shell
      title="Events"
      question="Which events are fully supplied and confirmed?"
      toolbar={
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: events.length },
            { value: "open", label: "Open" },
            { value: "risk", label: "With exceptions" },
          ]}
        />
      }
    >
      <Section flush>
        {rows.length === 0 ? (
          <Empty title="No events in this view" hint="Change the filter to see other events." />
        ) : (
          <ul className="divide-border divide-y">
            {rows.map(({ e, t }) => (
              <li key={e.id}>
                <Link
                  to="/events/$eventId"
                  params={{ eventId: e.id }}
                  className="hover:bg-surface-sunken group grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-2 px-3 py-3 transition-colors duration-150 lg:grid-cols-[minmax(0,1.6fr)_8rem_10rem_11rem_9rem_1.25rem]"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="num text-[11px] text-subtle">{e.code}</span>
                      <span className="truncate text-[13.5px] font-medium">{e.name}</span>
                    </div>
                    <div className="truncate text-[11.5px] text-muted-foreground">
                      {e.city}, {e.state} · {e.owner}
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="eyebrow">Starts</div>
                    <div className="num text-[12px]">
                      {e.startsOn}
                      <span className={e.daysOut <= 2 ? "text-warn ml-1.5" : "ml-1.5 text-subtle"}>
                        T−{e.daysOut}
                      </span>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="eyebrow">Destinations</div>
                    <div className="num text-[12px]">
                      {t.confirmed}
                      <span className="text-subtle">/{t.destinations} confirmed</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="eyebrow">Sent of required</div>
                    <Fill
                      sent={t.sent}
                      required={t.required}
                      tone={t.remaining === 0 ? "good" : "warn"}
                      className="mt-1"
                    />
                  </div>

                  <div className="text-right lg:text-left">
                    <div className="eyebrow hidden lg:block">Units</div>
                    <Qty required={t.required} sent={t.sent} remaining={t.remaining} />
                    {t.exceptions > 0 && (
                      <div className="mt-0.5">
                        <Tag tone="bad">
                          {t.exceptions} exception{t.exceptions > 1 ? "s" : ""}
                        </Tag>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="hidden size-4 text-subtle transition-transform duration-150 group-hover:translate-x-0.5 lg:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </Shell>
  );
}
