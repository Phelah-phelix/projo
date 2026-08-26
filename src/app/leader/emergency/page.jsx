"use client";
import { useState } from "react";
import { Siren, AlertTriangle, Send } from "lucide-react";
import { PageHead, useAsync, useGroupPicker, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post } from "@/lib/api";

const TYPES = [
  { v: "MEDICAL", label: "Medical emergency" },
  { v: "BEREAVEMENT", label: "Bereavement" },
  { v: "SECURITY", label: "Security" },
  { v: "FINANCIAL", label: "Urgent financial need" },
  { v: "OTHER", label: "Other" },
];

export default function LeaderEmergencyPage() {
  const toast = useToast();
  const { group, picker, loading: gl } = useGroupPicker();
  const [f, setF] = useState({ type: "MEDICAL", message: "" });
  const [busy, setBusy] = useState(false);
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/emergency?groupId=${key}`) : Promise.resolve({ emergencies: [] })), [key]
  );

  async function raise(e) {
    e.preventDefault();
    if (!f.message.trim()) return toast.bad("Please describe the emergency.");
    setBusy(true);
    try {
      await post("/emergency", { groupId: group.id, type: f.type, message: f.message.trim() });
      toast.warn("Emergency raised — every member has been alerted by SMS.");
      setF({ type: "MEDICAL", message: "" }); reload();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  const items = data?.emergencies || [];

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Emergency"
        subtitle="Raise an urgent alert. Every member of the group is notified instantly by SMS." />
      {picker}

      {gl ? <Loading /> : !group ? null : (
        <div className="grid-lg">
          <Section style={{ borderLeft: "4px solid var(--spark)" }}>
            <div className="row" style={{ gap: 12, marginBottom: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: "var(--spark)", color: "#4a3105", display: "grid", placeItems: "center" }}><Siren size={22} /></div>
              <div><h3 style={{ fontSize: 18 }}>Raise an emergency</h3><p className="tiny">Use this only for genuine, time-sensitive situations.</p></div>
            </div>
            <form onSubmit={raise} className="stack" style={{ "--s": "16px" }}>
              <Field label="Type of emergency">
                <select className="select" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
                  {TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="What is happening?" hint="Keep it short and clear — it will be sent as an SMS.">
                <textarea className="textarea" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="e.g. Mama Awino is hospitalised at Homa Bay Referral and needs support today." required />
              </Field>
              <button className="btn btn--spark btn--lg btn--block" disabled={busy}>
                <Send size={18} /> {busy ? "Alerting members…" : "Alert all members now"}
              </button>
            </form>
          </Section>

          <Section title="Emergency history" icon={<AlertTriangle size={18} className="muted" />}>
            {loading ? <Loading /> : items.length === 0 ? <Empty>No emergencies raised. May it stay that way.</Empty> :
              items.map((em) => (
                <div className="list-row" key={em.id} style={{ alignItems: "flex-start" }}>
                  <div>
                    <div className="row" style={{ gap: 8 }}><Badge kind="warn">{em.type}</Badge><span className="tiny">{fmt(em.createdAt)}</span></div>
                    <p style={{ fontSize: 14, marginTop: 6 }}>{em.message}</p>
                    <div className="tiny">Notified {em.notified ?? 0} members</div>
                  </div>
                </div>
              ))}
          </Section>
        </div>
      )}
    </div>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");
