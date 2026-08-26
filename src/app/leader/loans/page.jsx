"use client";
import { useState } from "react";
import { HandCoins, ShieldAlert, Check, X, Plus, TrendingUp } from "lucide-react";
import { PageHead, useAsync, useGroupPicker, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, RiskBadge, Modal, useModal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post, ksh } from "@/lib/api";

export default function LeaderLoansPage() {
  const toast = useToast();
  const { group, picker, loading: gl } = useGroupPicker();
  const requestModal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/loans?groupId=${key}`) : Promise.resolve({ loans: [], anomalies: [] })),
    [key]
  );

  async function decide(id, action) {
    try { await post(`/loans/${id}/${action}`); toast.ok(`Loan ${action}d.`); reload(); }
    catch (e) { toast.bad(e.message); }
  }

  const loans = data?.loans || [];
  const anomalies = data?.anomalies || [];
  const pending = loans.filter((l) => l.status === "PENDING");
  const active = loans.filter((l) => l.status === "APPROVED");

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Loans"
        subtitle="Review anomalies, approve or decline requests, and track every loan — each scored for default risk by AI."
        action={group && <button className="btn" onClick={() => requestModal.show()}><Plus size={18} /> Request a loan</button>} />
      {picker}

      {gl || loading ? <Loading /> : !group ? null : (
        <>
          <div className="stat-row">
            <div className="stat"><div className="stat__label">Pending review</div><div className="stat__value">{pending.length}</div></div>
            <div className="stat"><div className="stat__label">Active loans</div><div className="stat__value">{ksh(active.reduce((s, l) => s + l.amount, 0))}</div></div>
            <div className="stat"><div className="stat__label">Anomalies</div><div className="stat__value" style={{ color: anomalies.length ? "var(--spark-700)" : undefined }}>{anomalies.length}</div></div>
          </div>

          {/* anomalies */}
          <Section title="Flagged anomalies" icon={<ShieldAlert size={18} className="muted" />}
            style={{ marginBottom: 20, borderLeft: "4px solid var(--spark)" }}>
            {anomalies.length === 0 ? <Empty>No anomalies detected. Everything looks healthy.</Empty> : anomalies.map((a) => (
              <div className="list-row" key={a.id}>
                <div>
                  <b>{a.memberName}</b> · <span className="mono">{ksh(a.amount)}</span>
                  <div className="tiny">{a.reason}</div>
                </div>
                <Badge kind="bad">score {a.score?.toFixed?.(2) ?? a.score}</Badge>
              </div>
            ))}
          </Section>

          {/* pending */}
          <Section title={`Awaiting approval (${pending.length})`} icon={<HandCoins size={18} className="muted" />} style={{ marginBottom: 20 }}>
            {pending.length === 0 ? <Empty>No loan requests waiting.</Empty> : (
              <table className="table">
                <thead><tr><th>Member</th><th>Amount</th><th>Term</th><th>Purpose</th><th>AI risk</th><th></th></tr></thead>
                <tbody>
                  {pending.map((l) => (
                    <tr key={l.id}>
                      <td><b>{l.memberName}</b></td>
                      <td className="mono">{ksh(l.amount)}</td>
                      <td>{l.termMonths} mo</td>
                      <td>{l.purpose}</td>
                      <td><RiskBadge score={l.riskScore} band={l.riskBand} /></td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          <button className="btn btn--green btn--sm" onClick={() => decide(l.id, "approve")}><Check size={14} /></button>
                          <button className="btn btn--ghost btn--sm" onClick={() => decide(l.id, "reject")}><X size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          {/* all loans */}
          <Section title="All loan requests" icon={<TrendingUp size={18} className="muted" />}>
            {loans.length === 0 ? <Empty>No loans requested yet.</Empty> : (
              <table className="table">
                <thead><tr><th>Member</th><th>Amount</th><th>Term</th><th>AI risk</th><th>Status</th><th>Requested</th></tr></thead>
                <tbody>
                  {loans.map((l) => (
                    <tr key={l.id}>
                      <td><b>{l.memberName}</b><div className="tiny">{l.purpose}</div></td>
                      <td className="mono">{ksh(l.amount)}</td>
                      <td>{l.termMonths} mo</td>
                      <td><RiskBadge score={l.riskScore} band={l.riskBand} /></td>
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

      <RequestLoanModal m={requestModal} group={group} onDone={reload} toast={toast} />
    </div>
  );
}

function RequestLoanModal({ m, group, onDone, toast }) {
  const [f, setF] = useState({ amount: "", termMonths: "6", purpose: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setResult(null);
    try {
      const { loan } = await post("/loans", {
        groupId: group.id, amount: Number(f.amount),
        termMonths: Number(f.termMonths), purpose: f.purpose.trim(),
      });
      setResult(loan);
      toast.ok("Loan requested — AI risk score attached for the leader.");
      onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={m.open} onClose={() => { m.close(); setResult(null); }} title="Request a loan">
      {result ? (
        <div className="stack center" style={{ "--s": "14px" }}>
          <RiskBadge score={result.riskScore} band={result.riskBand} />
          <p>Your request for <b>{ksh(result.amount)}</b> over {result.termMonths} months has been
             submitted. The AI default-risk score above will guide the leader's decision.</p>
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
          <button className="btn btn--block" disabled={busy}>{busy ? "Scoring with AI…" : "Submit request"}</button>
        </form>
      )}
    </Modal>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "—");
