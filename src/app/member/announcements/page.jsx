"use client";
import { useState } from "react";
import { Megaphone, Plus, ShieldAlert } from "lucide-react";
import { PageHead, useAsync, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, Modal, useModal } from "@/components/ui";
import { useGroup } from "@/context/GroupContext";
import { useToast } from "@/context/ToastContext";
import { get, post } from "@/lib/api";

export default function MemberAnnouncements() {
  const { group } = useGroup();
  const modal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/announcements?groupId=${key}`) : Promise.resolve({ announcements: [], anomalies: [] })), [key]
  );
  const items = data?.announcements || [];
  const anomalies = data?.anomalies || [];
  const locked = group?.membershipStatus === "PENDING";

  return (
    <div className="reveal">
      <PageHead base="/member" baseLabel="Dashboard" title="Announcements"
        subtitle="Read notices from your group, share your own, and see anything the system has flagged."
        action={<button className="btn" disabled={locked} onClick={() => modal.show()}><Plus size={18} /> New announcement</button>} />

      {loading ? <Loading /> : (
        <div className="grid-lg">
          <Section title="Messages" icon={<Megaphone size={18} className="muted" />}>
            {items.length === 0 ? <Empty icon={<Megaphone size={40} />}>No announcements yet.</Empty> :
              items.map((a) => (
                <div className="list-row" key={a.id} style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div className="between">
                      <b>{a.title}</b>
                      <span className="tiny">{fmt(a.createdAt)}</span>
                    </div>
                    <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>{a.body}</p>
                    <div className="tiny" style={{ marginTop: 4 }}>— {a.authorName || "Leader"}</div>
                  </div>
                </div>
              ))}
          </Section>

          <Section title="Flagged anomalies" icon={<ShieldAlert size={18} className="muted" />} style={{ borderLeft: "4px solid var(--spark)" }}>
            {anomalies.length === 0 ? <Empty>Nothing flagged — all contributions look normal.</Empty> :
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

      <AnnouncementModal m={modal} group={group} onDone={reload} />
    </div>
  );
}

function AnnouncementModal({ m, group, onDone }) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      await post("/announcements", { groupId: group.id, title: title.trim(), body: body.trim() });
      toast.ok("Your announcement has been shared with the group.");
      m.close(); setTitle(""); setBody(""); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={m.open} onClose={m.close} title="New announcement">
      <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
        <Field label="Title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Suggestion for next meeting" required /></Field>
        <Field label="Message"><textarea className="textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message to the group…" required /></Field>
        <button className="btn btn--block" disabled={busy}>{busy ? "Sharing…" : "Share with group"}</button>
      </form>
    </Modal>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—");
