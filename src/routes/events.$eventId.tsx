import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Shell } from "@/components/hb/shell";
import { DestinationPanel } from "@/components/hb/destination-panel";
import { Empty, Fill, Marker, Qty, Section, Tag } from "@/components/hb/ui";
import {
  DEST_STATE,
  activity,
  destShipments,
  destState,
  destTotals,
  eventById,
  eventDestinations,
  eventTotals,
  type Destination,
} from "@/lib/data";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const e = eventById(params.eventId);
    if (!e) throw notFound();
    return { name: e.name, code: e.code };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Event unavailable — HumbEE" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.code} ${loaderData.name} — HumbEE`;
    const d = "Destination-by-destination status: required, sent, remaining, dispatch, courier, delivery and organiser confirmation.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const [sel, setSel] = useState<Destination | null>(null);
  const e = eventById(eventId)!;
  const dests = eventDestinations(eventId);
  const t = eventTotals(eventId);
  const feed = activity.filter((a) => a.eventId === eventId);

  return (
    <Shell
      title={`${e.code} · ${e.name}`}
      question="What is the complete operational status of this event?"
      actions={
        <Link to="/events" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[12px]">
          <ArrowLeft className="size-3.5" /> Events
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          <Section>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="eyebrow">Venue city</div>
                <div className="text-[13px]">
                  {e.city}, {e.state}
                </div>
              </div>
              <div>
                <div className="eyebrow">Starts</div>
                <div className="num text-[13px]">
                  {e.startsOn} <span className={e.daysOut <= 2 ? "text-warn" : "text-subtle"}>T−{e.daysOut}</span>
                </div>
              </div>
              <div>
                <div className="eyebrow">Owner</div>
                <div className="text-[13px]">{e.owner}</div>
              </div>
              <div>
                <div className="eyebrow">Confirmed destinations</div>
                <div className="num text-[13px]">
                  {t.confirmed}
                  <span className="text-subtle">/{t.destinations}</span>
                </div>
              </div>
            </div>
            <div className="border-border mt-3 flex items-center gap-4 border-t pt-3">
              <div className="min-w-0 flex-1">
                <div className="eyebrow mb-1">Material sent of required</div>
                <Fill sent={t.sent} required={t.required} tone={t.remaining === 0 ? "good" : "warn"} />
              </div>
              <Qty required={t.required} sent={t.sent} remaining={t.remaining} />
            </div>
          </Section>

          <Section title="Destinations" meta="required → sent → remaining → delivery → confirmation" flush>
            {dests.length === 0 ? (
              <Empty title="No destinations yet" />
            ) : (
              <ul className="divide-border divide-y">
                {dests.map((d) => {
                  const dt = destTotals(d);
                  const st = destState(d);
                  const last = destShipments(d.id).filter((s) => s.status !== "queued").slice(-1)[0];
                  return (
                    <li key={d.id}>
                      <button
                        onClick={() => setSel(d)}
                        className="hover:bg-surface-sunken grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 px-3 py-2.5 text-left transition-colors duration-150 lg:grid-cols-[minmax(0,1.3fr)_8rem_9rem_minmax(0,1fr)_8rem]"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Marker tone={DEST_STATE[st].tone} />
                          <span className="truncate text-[13px] font-medium">{d.name}</span>
                          <span className="truncate text-[11.5px] text-subtle">{d.city}</span>
                        </span>
                        <span className="text-right lg:text-left">
                          <Qty required={dt.required} sent={dt.sent} remaining={dt.remaining} />
                        </span>
                        <span className="hidden lg:block">
                          <Fill sent={dt.sent} required={dt.required} tone={dt.remaining === 0 ? "good" : "warn"} />
                        </span>
                        <span className="hidden min-w-0 truncate text-[11.5px] text-muted-foreground lg:block">
                          {last ? (
                            <>
                              <span className="num">{last.awb}</span> · {last.courier}
                              {last.deliveredAt ? ` · del ${last.deliveredAt}` : ` · eta ${last.etaAt}`}
                            </>
                          ) : (
                            "no dispatch yet"
                          )}
                        </span>
                        <span className="hidden items-center justify-between gap-2 lg:flex">
                          <Tag tone={DEST_STATE[st].tone}>{DEST_STATE[st].label}</Tag>
                          <span className="num text-[11px] text-subtle">{d.needBy}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Event activity" flush>
            {feed.length === 0 ? (
              <Empty title="No activity yet" />
            ) : (
              <ol className="divide-border divide-y">
                {feed.map((a) => (
                  <li key={a.id} className="flex gap-2.5 px-3 py-2">
                    <span className="num pt-[3px] text-[11px] text-subtle">{a.at}</span>
                    <Marker tone={a.tone} className="mt-[7px]" />
                    <div className="min-w-0">
                      <p className="text-[12px] leading-snug">{a.text}</p>
                      <p className="text-[11px] text-subtle">{a.actor}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          <Section title="Secondary" flush>
            <dl className="divide-border divide-y">
              <div className="flex items-baseline justify-between px-3 py-2">
                <dt className="text-[12px] text-muted-foreground">Participants</dt>
                <dd className="num text-[12px]">{e.participants.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-baseline justify-between px-3 py-2">
                <dt className="text-[12px] text-muted-foreground">Printing</dt>
                <dd>
                  <Link to="/printing" className="text-primary text-[12px] hover:underline">
                    open jobs
                  </Link>
                </dd>
              </div>
              <div className="flex items-baseline justify-between px-3 py-2">
                <dt className="text-[12px] text-muted-foreground">Inventory</dt>
                <dd>
                  <Link to="/inventory" className="text-primary text-[12px] hover:underline">
                    availability
                  </Link>
                </dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>

      <DestinationPanel destination={sel} onClose={() => setSel(null)} />
    </Shell>
  );
}
