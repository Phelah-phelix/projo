"use client";
import { useState } from "react";
import { CalendarDays, MapPin, Plus, Clock } from "lucide-react";
import { PageHead, useAsync, useGroupPicker, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, Modal, useModal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post } from "@/lib/api";

export default function LeaderCalendarPage() {
  const toast = useToast();
  const { group, picker, loading: gl } = useGroupPicker();
  const modal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/events?groupId=${key}`) : Promise.resolve({ events: [] })), [key]
  );
  const events = data?.events || [];
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Calendar"
        subtitle="Set meeting dates and venues. Members are reminded automatically by SMS."
        action={group && <button className="btn" onClick={() => modal.show()}><Plus size={18} /> Add event</button>} />
      {picker}

      {gl || loading ? <Loading /> : !group ? null : (
        <div className="grid-lg">
          <Section title="Upcoming events" icon={<CalendarDays size={18} className="muted" />}>
            {upcoming.length === 0 ? <Empty icon={<CalendarDays size={40} />}>No upcoming events. Add one to keep the group informed.</Empty> :
              upcoming.map((e) => <EventRow key={e.id} e={e} upcoming />)}
          </Section>
          <Section title="Past events" icon={<Clock size={18} className="muted" />}>
            {past.length === 0 ? <Empty>Nothing in the past yet.</Empty> : past.map((e) => <EventRow key={e.id} e={e} />)}
          </Section>
        </div>
      )}

      <AddEventModal m={modal} group={group} onDone={reload} toast={toast} />
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

function AddEventModal({ m, group, onDone, toast }) {
  const [f, setF] = useState({ title: "", date: "", venue: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      await post("/events", { groupId: group.id, title: f.title.trim(), date: f.date, venue: f.venue.trim() });
      toast.ok("Event added — members will be reminded.");
      m.close(); setF({ title: "", date: "", venue: "" }); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }
  return (
    <Modal open={m.open} onClose={m.close} title="Add a calendar event">
      <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
        <Field label="Event title"><input className="input" value={f.title} onChange={set("title")} placeholder="e.g. Monthly contribution meeting" required /></Field>
        <Field label="Date & time"><input className="input" type="datetime-local" value={f.date} onChange={set("date")} required /></Field>
        <Field label="Venue"><input className="input" value={f.venue} onChange={set("venue")} placeholder="e.g. Chief's camp, Ndhiwa" required /></Field>
        <button className="btn btn--block" disabled={busy}>{busy ? "Saving…" : "Save event"}</button>
      </form>
    </Modal>
  );
}
