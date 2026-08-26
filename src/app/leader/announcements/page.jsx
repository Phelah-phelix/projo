"use client";
import { useState, useEffect } from "react";
import { Megaphone, Plus, Pencil, ShieldAlert } from "lucide-react";
import { PageHead, useAsync, useGroupPicker, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, Modal, useModal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post, put } from "@/lib/api";

export default function LeaderAnnouncementsPage() {
  const toast = useToast();
  const { group, picker, loading: gl } = useGroupPicker();
  const modal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/announcements?groupId=${key}`) : Promise.resolve({ announcements: [], anomalies: [] })), [key]
  );
  const items = data?.announcements || [];
  const anomalies = data?.anomalies || [];

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Announcements"
        subtitle="Post and edit notices for your group. Every announcement is delivered to members by SMS."
        action={group && <button className="btn" onClick={() => modal.show()}><Plus size={18} /> New announcement</button>} />
      {picker}

      {gl || loading ? <Loading /> : !group ? null : (
        <div className="grid-lg">
          <Section title="Messages" icon={<Megaphone size={18} className="muted" />}>
            {items.length === 0 ? <Empty icon={<Megaphone size={40} />}>No announcements yet. Share your first notice with the group.</Empty> :
              items.map((a) => (
                <div className="list-row" key={a.id} style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div className="between"><b>{a.title}</b><span className="tiny">{fmt(a.createdAt)}</span></div>
                    <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>{a.body}</p>
                  </div>
                  <button className="btn btn--ghost btn--sm" onClick={() => modal.show(a)}><Pencil size={14} /> Edit</button>
                </div>
              ))}
          </Section>

          <Section title="Flagged anomalies" icon={<ShieldAlert size={18} className="muted" />} style={{ borderLeft: "4px solid var(--spark)" }}>
            {anomalies.length === 0 ? <Empty>No anomalies flagged for this group.</Empty> :
              anomalies.map((a) => (
                <div className="list-row" key={a.id} style={{ alignItems: "flex-start" }}>
                  <div>
                    <b>{a.memberName}</b>
                    <div className="tiny">{a.reason}</div>
                  </div>
                  <Badge kind="bad">flagged</Badge>
                </div>
              ))}
          </Section>
        </div>
      )}

      <AnnouncementModal m={modal} group={group} onDone={reload} toast={toast} />
    </div>
  );
}

function AnnouncementModal({ m, group, onDone, toast }) {
  const editing = m.data;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  // sync fields when the modal opens with/without an item
  useSyncFields(m.open, editing, setTitle, setBody);

  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      if (editing) { await put(`/announcements/${editing.id}`, { title: title.trim(), body: body.trim() }); toast.ok("Announcement updated."); }
      else { await post("/announcements", { groupId: group.id, title: title.trim(), body: body.trim() }); toast.ok("Announcement posted — members notified by SMS."); }
      m.close(); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={m.open} onClose={m.close} title={editing ? "Edit announcement" : "New announcement"}>
      <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
        <Field label="Title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Change of meeting venue" required /></Field>
        <Field label="Message"><textarea className="textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message to the group…" required /></Field>
        <button className="btn btn--block" disabled={busy}>{busy ? "Sending…" : editing ? "Save changes" : "Post & notify members"}</button>
      </form>
    </Modal>
  );
}

// keep controlled fields in sync with the modal payload
function useSyncFields(open, editing, setTitle, setBody) {
  useEffect(() => {
    if (open) { setTitle(editing?.title || ""); setBody(editing?.body || ""); }
  }, [open, editing, setTitle, setBody]);
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—");
