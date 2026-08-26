"use client";
import { useState } from "react";
import { Wallet, Plus, TrendingUp } from "lucide-react";
import { PageHead, useAsync, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge, Stat, Modal, useModal } from "@/components/ui";
import { useGroup } from "@/context/GroupContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { get, post, ksh } from "@/lib/api";

export default function MemberContribution() {
  const { group } = useGroup();
  const { user } = useAuth();
  const modal = useModal();
  const key = group?.id;
  const { data, loading, reload } = useAsync(
    () => (key ? get(`/contributions/mine?groupId=${key}`) : Promise.resolve({ contributions: [], total: 0 })), [key]
  );

  const rows = data?.contributions || [];
  const mine = data?.total || 0;
  const locked = group?.membershipStatus === "PENDING";

  return (
    <div className="reveal">
      <PageHead base="/member" baseLabel="Dashboard" title="Contribution"
        subtitle="View your contribution history and make a new payment via M-Pesa."
        action={<button className="btn btn--green" disabled={locked} onClick={() => modal.show()}>
          <Plus size={18} /> Make contribution
        </button>} />

      {loading ? <Loading /> : (
        <>
          <div className="stat-row">
            <Stat label="My total savings" value={ksh(mine)} foot={`${rows.length} payment(s)`} />
            <Stat label="Per cycle" value={ksh(group?.contributionAmount)} foot={(group?.cycle || "").toLowerCase()} />
            <Stat label="This cycle" value={data?.paidThisCycle ? "Paid" : "Due"} foot={data?.paidThisCycle ? "thank you" : "not yet paid"} />
          </div>

          <Section title="My contributions" icon={<Wallet size={18} className="muted" />}
            action={<Badge kind="info"><TrendingUp size={13} /> {ksh(mine)} saved</Badge>}>
            {rows.length === 0 ? <Empty>You haven't contributed yet. Tap “Make contribution” to start saving.</Empty> : (
              <table className="table">
                <thead><tr><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td className="mono">{ksh(c.amount)}</td>
                      <td>{c.method}</td>
                      <td>{fmt(c.createdAt)}</td>
                      <td><Badge kind={c.status === "PAID" ? "ok" : c.status === "PENDING" ? "warn" : "bad"}>{c.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>
        </>
      )}

      <ContributeModal m={modal} group={group} phone={user?.contact} onDone={reload} />
    </div>
  );
}

function ContributeModal({ m, group, phone: initialPhone, onDone }) {
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(initialPhone || "");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      await post("/contributions", { groupId: group.id, amount: Number(amount), phone: phone.trim() });
      toast.ok("An M-Pesa prompt has been sent to your phone. Enter your PIN to confirm.");
      m.close(); setAmount(""); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={m.open} onClose={m.close} title="Make a contribution">
      <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
        <Field label="Amount (KES)">
          <input className="input mono" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder={group ? String(group.contributionAmount) : "1000"} required />
        </Field>
        <Field label="M-Pesa phone number" hint="An STK push is sent to this number — enter your PIN to confirm.">
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="2547XXXXXXXX" required />
        </Field>
        <button className="btn btn--green btn--block" disabled={busy}>{busy ? "Sending prompt…" : "Send M-Pesa prompt"}</button>
      </form>
    </Modal>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—");
