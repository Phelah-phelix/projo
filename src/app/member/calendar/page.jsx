"use client";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { PageHead, useAsync } from "@/components/feature";
import { Section, Loading, Empty, Badge } from "@/components/ui";
import { useGroup } from "@/context/GroupContext";
import { get } from "@/lib/api";

export default function MemberCalendar() {
  const { group } = useGroup();
  const key = group?.id;
  const { data, loading } = useAsync(
    () => (key ? get(`/events?groupId=${key}`) : Promise.resolve({ events: [] })), [key]
  );
  const events = data?.events || [];
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <div className="reveal">
      <PageHead base="/member" baseLabel="Dashboard" title="Calendar"
        subtitle="Upcoming meetings and venues for your chama. You'll also get an SMS reminder before each one." />

      {loading ? <Loading /> : (
        <div className="grid-lg">
          <Section title="Upcoming events" icon={<CalendarDays size={18} className="muted" />}>
            {upcoming.length === 0 ? <Empty icon={<CalendarDays size={40} />}>No upcoming events scheduled yet.</Empty> :
              upcoming.map((e) => <EventRow key={e.id} e={e} upcoming />)}
          </Section>
          <Section title="Past events" icon={<Clock size={18} className="muted" />}>
            {past.length === 0 ? <Empty>Nothing in the past yet.</Empty> : past.map((e) => <EventRow key={e.id} e={e} />)}
          </Section>
        </div>
      )}
    </div>
  );
}

function EventRow({ e, upcoming }) {
  const d = new Date(e.date);
  return (
    <div className="list-row">
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div style={{ textAlign: "center", background: "var(--mist)", borderRadius: 12, padding: "8px 12px", minWidth: 54 }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: "var(--navy)" }}>{d.getDate()}</div>
          <div className="tiny">{d.toLocaleString("en-KE", { month: "short" })}</div>
        </div>
        <div>
          <b>{e.title}</b>
          <div className="tiny row" style={{ gap: 6 }}><MapPin size={13} /> {e.venue}</div>
          <div className="tiny">{d.toLocaleString("en-KE", { weekday: "long", hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>
      {upcoming && <Badge kind="info">Upcoming</Badge>}
    </div>
  );
}
