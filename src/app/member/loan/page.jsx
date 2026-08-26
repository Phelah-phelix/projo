"use client";
import { useState } from "react";
import { HandCoins, Plus, TrendingUp } from "lucide-react";
import { PageHead, useAsync, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, Stat, RiskBadge, Modal, useModal } from "@/components/ui";
import { useGroup } from "@/context/GroupContext";
import { useToast } from "@/context/ToastContext";
import { get, post, ksh } from "@/lib/api";

export default function MemberLoanPage() {
  const { group } = useGroup();
  const modal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/loans?groupId=${key}`) : Promise.resolve({ loans: [] })), [key]
  );
  const loans = data?.loans || [];
  const mine = loans.filter((l) => l.mine);
  const myActive = mine.filter((l) => l.status === "APPROVED").reduce((s, l) => s + l.amount, 0);
  const locked = group?.membershipStatus === "PENDING";

  return (
    <div className="reveal">
      <PageHead base="/member" baseLabel="Dashboard" title="Loans"
        subtitle="Request a loan from the group pool and track requests. Each one gets an AI default-risk score for the leader."
        action={<button className="btn btn--green" disabled={locked} onClick={() => modal.show()}><Plus size={18} /> Request loan</button>} />

      {loading ? <Loading /> : (
        <>
          <div className="stat-row">
            <Stat label="My active loan" value={ksh(myActive)} foot={`${mine.length} request(s)`} />
            <Stat label="Group loans out" value={ksh(loans.filter((l) => l.status === "APPROVED").reduce((s, l) => s + l.amount, 0))} foot="approved" />
            <Stat label="Pending review" value={loans.filter((l) => l.status === "PENDING").length} foot="awaiting leader" />
          </div>

          <Section title="My loan requests" icon={<HandCoins size={18} className="muted" />} style={{ marginBottom: 20 }}>
            {mine.length === 0 ? <Empty>You have no loan requests. Tap “Request loan” to apply.</Empty> : (
              <table className="table">
                <thead><tr><th>Amount</th><th>Term</th><th>Purpose</th><th>AI risk</th><th>Status</th></tr></thead>
                <tbody>
                  {mine.map((l) => (
                    <tr key={l.id}>
                      <td className="mono">{ksh(l.amount)}</td>
                      <td>{l.termMonths} mo</td>
                      <td>{l.purpose}</td>
                      <td><RiskBadge score={l.riskScore} band={l.riskBand} /></td>
                      <td><Badge kind={l.status === "APPROVED" ? "ok" : l.status === "PENDING" ? "warn" : l.status === "REJECTED" ? "bad" : "info"}>{l.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          <Section title="All group loans" icon={<TrendingUp size={18} className="muted" />}>
            {loans.length === 0 ? <Empty>No loans requested in the group yet.</Empty> : (
              <table className="table">
                <thead><tr><th>Member</th><th>Amount</th><th>Term</th><th>Status</th><th>Requested</th></tr></thead>
                <tbody>
                  {loans.map((l) => (
                    <tr key={l.id}>
                      <td><b>{l.mine ? "You" : l.memberName}</b></td>
                      <td className="mono">{ksh(l.amount)}</td>
                      <td>{l.termMonths} mo</td>
                      <td><Badge kind={l.status === "APPROVED" ? "ok" : l.status === "PENDING" ? "warn" : l.status === "REJECTED" ? "bad" : "info"}>{l.status}</Badge></td>
                      <td>{fmt(l.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>
        </>
      )}

      <RequestLoanModal m={modal} group={group} onDone={reload} />
    </div>
  );
}

function RequestLoanModal({ m, group, onDone }) {
  const toast = useToast();
  const [f, setF] = useState({ amount: "", termMonths: "6", purpose: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setResult(null);
    try {
      const { loan } = await post("/loans", {
        groupId: group.id, amount: Number(f.amount), termMonths: Number(f.termMonths), purpose: f.purpose.trim(),
      });
      setResult(loan);
      toast.ok("Loan requested — the leader will review it with an AI risk score.");
      setF({ amount: "", termMonths: "6", purpose: "" }); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={m.open} onClose={() => { m.close(); setResult(null); }} title="Request a loan">
      {result ? (
        <div className="stack center" style={{ "--s": "14px" }}>
          <RiskBadge score={result.riskScore} band={result.riskBand} />
          <p>Your request for <b>{ksh(result.amount)}</b> over {result.termMonths} months has been submitted.
             The leader will review it shortly.</p>
          <button className="btn" onClick={() => { m.close(); setResult(null); }}>Done</button>
        </div>
      ) : (
        <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
          <Field label="Amount (KES)"><input className="input mono" type="number" min="1" value={f.amount} onChange={set("amount")} required /></Field>
          <Field label="Repayment term">
            <select className="select" value={f.termMonths} onChange={set("termMonths")}>
              {[3, 6, 9, 12, 18, 24].map((n) => <option key={n} value={n}>{n} months</option>)}
            </select>
          </Field>
          <Field label="Purpose"><input className="input" value={f.purpose} onChange={set("purpose")} placeholder="e.g. School fees, farm inputs" required /></Field>
          <button className="btn btn--green btn--block" disabled={busy}>{busy ? "Scoring with AI…" : "Submit request"}</button>
        </form>
      )}
    </Modal>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "—");
