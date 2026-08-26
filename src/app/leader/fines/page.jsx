"use client";
import { useState } from "react";
import { Gavel, Plus, Undo2 } from "lucide-react";
import { PageHead, useAsync, useGroupPicker, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, Modal, useModal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post, ksh } from "@/lib/api";

const REASONS = ["Late contribution", "Missed meeting", "Missed contribution", "Late loan repayment", "Other"];

export default function LeaderFinesPage() {
  const toast = useToast();
  const { group, picker, loading: gl } = useGroupPicker();
  const modal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/fines?groupId=${key}`) : Promise.resolve({ fines: [], members: [] })), [key]
  );

  async function waive(id) {
    try { await post(`/fines/${id}/waive`); toast.ok("Fine waived."); reload(); }
    catch (e) { toast.bad(e.message); }
  }

  const fines = data?.fines || [];
  const outstanding = fines.filter((f) => f.status === "UNPAID").reduce((s, f) => s + f.amount, 0);

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Fines"
        subtitle="Issue fines for late or missed contributions to keep the group accountable, and waive them when appropriate."
        action={group && <button className="btn" onClick={() => modal.show()}><Plus size={18} /> Issue fine</button>} />
      {picker}

      {gl || loading ? <Loading /> : !group ? null : (
        <>
          <div className="stat-row">
            <div className="stat"><div className="stat__label">Outstanding fines</div><div className="stat__value">{ksh(outstanding)}</div></div>
            <div className="stat"><div className="stat__label">Total issued</div><div className="stat__value">{fines.length}</div></div>
          </div>
          <Section title="Fines ledger" icon={<Gavel size={18} className="muted" />}>
            {fines.length === 0 ? <Empty>No fines issued. A well-run chama!</Empty> : (
              <table className="table">
                <thead><tr><th>Member</th><th>Amount</th><th>Reason</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {fines.map((f) => (
                    <tr key={f.id}>
                      <td><b>{f.memberName}</b></td>
                      <td className="mono">{ksh(f.amount)}</td>
                      <td>{f.reason}</td>
                      <td>{fmt(f.createdAt)}</td>
                      <td><Badge kind={f.status === "PAID" ? "ok" : f.status === "WAIVED" ? "muted" : "warn"}>{f.status}</Badge></td>
                      <td>{f.status === "UNPAID" && <button className="btn btn--ghost btn--sm" onClick={() => waive(f.id)}><Undo2 size={14} /> Waive</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>
        </>
      )}

      <IssueFineModal m={modal} group={group} members={data?.members || []} onDone={reload} toast={toast} />
    </div>
  );
}

function IssueFineModal({ m, group, members, onDone, toast }) {
  const [f, setF] = useState({ membershipId: "", amount: "", reason: REASONS[0] });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      await post("/fines", { groupId: group.id, membershipId: Number(f.membershipId), amount: Number(f.amount), reason: f.reason });
      toast.ok("Fine issued and the member notified.");
      m.close(); setF({ membershipId: "", amount: "", reason: REASONS[0] }); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }
  return (
    <Modal open={m.open} onClose={m.close} title="Issue a fine">
      <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
        <Field label="Member">
          <select className="select" value={f.membershipId} onChange={set("membershipId")} required>
            <option value="">Select a member…</option>
            {members.map((mm) => <option key={mm.id} value={mm.id}>{mm.name}</option>)}
          </select>
        </Field>
        <Field label="Amount (KES)"><input className="input mono" type="number" min="1" value={f.amount} onChange={set("amount")} required /></Field>
        <Field label="Reason">
          <select className="select" value={f.reason} onChange={set("reason")}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select>
        </Field>
        <button className="btn btn--block" disabled={busy}>{busy ? "Issuing…" : "Issue fine"}</button>
      </form>
    </Modal>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "—");
