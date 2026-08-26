"use client";
import { useState } from "react";
import { Users, Check, X, Wallet, KeyRound, Search, UserCheck } from "lucide-react";
import { PageHead, Field, useAsync } from "@/components/feature";
import { Section, Loading, Empty, Badge, Modal, useModal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post, ksh } from "@/lib/api";

export default function ViewGroupPage() {
  const toast = useToast();
  const [token, setToken] = useState("");
  const [group, setGroup] = useState(null);
  const [tab, setTab] = useState("members");
  const [loading, setLoading] = useState(false);
  const contributeModal = useModal();

  async function loadGroup(t = token) {
    if (!t.trim()) return;
    setLoading(true);
    try {
      const { group } = await get(`/groups/by-token/${t.trim().toUpperCase()}`);
      setGroup(group);
    } catch (e) { toast.bad(e.message); setGroup(null); } finally { setLoading(false); }
  }

  async function decide(membershipId, action) {
    try {
      await post(`/memberships/${membershipId}/${action}`);
      toast.ok(`Member ${action === "approve" ? "approved" : "rejected"}.`);
      loadGroup();
    } catch (e) { toast.bad(e.message); }
  }

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="View Group"
        subtitle="Enter a group token to manage its members, record contributions and review activity." />

      {/* token entry */}
      <Section>
        <form className="row wrap" onSubmit={(e) => { e.preventDefault(); loadGroup(); }} style={{ gap: 12 }}>
          <div className="grow" style={{ minWidth: 240 }}>
            <Field label="Group token">
              <input className="input token-input" value={token} maxLength={8}
                onChange={(e) => setToken(e.target.value.toUpperCase())} placeholder="ABC123" />
            </Field>
          </div>
          <button className="btn" style={{ alignSelf: "flex-end" }}><Search size={18} /> Load group</button>
        </form>
      </Section>

      {loading && <Loading />}

      {group && !loading && (
        <>
          <div style={{ height: 20 }} />
          <div className="welcome" style={{ background: "linear-gradient(120deg,var(--navy),var(--teal))" }}>
            <div className="between wrap">
              <div>
                <h2 style={{ fontSize: 22 }}>{group.name}</h2>
                <p>{group.purpose}</p>
              </div>
              <div className="row wrap" style={{ gap: 22 }}>
                <div><div className="tiny" style={{ color: "#cfe0f2" }}>Members</div><b style={{ fontSize: 20 }}>{group.memberCount}</b></div>
                <div><div className="tiny" style={{ color: "#cfe0f2" }}>Pot balance</div><b style={{ fontSize: 20 }}>{ksh(group.balance)}</b></div>
                <div><div className="tiny" style={{ color: "#cfe0f2" }}>Per cycle</div><b style={{ fontSize: 20 }}>{ksh(group.contributionAmount)}</b></div>
              </div>
            </div>
          </div>

          <div className="between wrap" style={{ margin: "18px 0" }}>
            <div className="pill-tabs">
              <button className={tab === "members" ? "active" : ""} onClick={() => setTab("members")}>Members</button>
              <button className={tab === "contributions" ? "active" : ""} onClick={() => setTab("contributions")}>Contributions</button>
            </div>
            <button className="btn btn--green" onClick={() => contributeModal.show()}><Wallet size={18} /> Record contribution</button>
          </div>

          {tab === "members" ? (
            <MembersTab group={group} onDecide={decide} />
          ) : (
            <ContributionsTab group={group} />
          )}
        </>
      )}

      {!group && !loading && (
        <div style={{ marginTop: 20 }}>
          <Empty icon={<KeyRound size={40} />}>Enter a group token above to view and manage it.</Empty>
        </div>
      )}

      <ContributeModal m={contributeModal} group={group} onDone={() => loadGroup()} />
    </div>
  );
}

function MembersTab({ group, onDecide }) {
  const pending = group.members.filter((m) => m.status === "PENDING");
  const active = group.members.filter((m) => m.status === "APPROVED");
  return (
    <div className="stack" style={{ "--s": "20px" }}>
      <Section title={`Awaiting approval (${pending.length})`} icon={<UserCheck size={18} className="muted" />}>
        {pending.length === 0 ? <Empty>No pending requests. Everyone is approved.</Empty> : pending.map((m) => (
          <div className="list-row" key={m.id}>
            <div className="row">
              <div className="avatar-sm">{initials(m.name)}</div>
              <div><b>{m.name}</b><div className="tiny">{m.contact} · joined {fmt(m.joinedAt)}</div></div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn--green btn--sm" onClick={() => onDecide(m.id, "approve")}><Check size={15} /> Approve</button>
              <button className="btn btn--ghost btn--sm" onClick={() => onDecide(m.id, "reject")}><X size={15} /> Reject</button>
            </div>
          </div>
        ))}
      </Section>

      <Section title={`Members (${active.length})`} icon={<Users size={18} className="muted" />}>
        {active.length === 0 ? <Empty>No approved members yet.</Empty> : (
          <table className="table">
            <thead><tr><th>Member</th><th>Contact</th><th>Contributed</th><th>Status</th></tr></thead>
            <tbody>
              {active.map((m) => (
                <tr key={m.id}>
                  <td className="row"><div className="avatar-sm">{initials(m.name)}</div> <b>{m.name}</b></td>
                  <td>{m.contact}</td>
                  <td className="mono">{ksh(m.contributed)}</td>
                  <td><Badge kind="ok">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

function ContributionsTab({ group }) {
  const { data, loading } = useAsync(
    () => get(`/contributions?groupId=${group.id}`).catch(() => ({ contributions: [], total: 0 })),
    [group.id]
  );
  if (loading) return <Loading />;
  const rows = data?.contributions || [];
  const total = data?.total || 0;
  return (
    <Section title="Contribution history" icon={<Wallet size={18} className="muted" />}
      action={<Badge kind="info">Total {ksh(total)}</Badge>}>
      {rows.length === 0 ? <Empty>No contributions recorded yet.</Empty> : (
        <table className="table">
          <thead><tr><th>Member</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td><b>{c.memberName}</b></td>
                <td className="mono">{ksh(c.amount)}</td>
                <td>{c.method}</td>
                <td>{fmt(c.createdAt)}</td>
                <td><Badge kind={c.status === "PAID" ? "ok" : c.status === "PENDING" ? "warn" : "bad"}>{c.status}</Badge>
                    {c.flagged && <Badge kind="bad">⚠ anomaly</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}

function ContributeModal({ m, group, onDone }) {
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await post("/contributions", { groupId: group.id, amount: Number(amount), phone: phone.trim() });
      toast.ok("Contribution initiated — an M-Pesa prompt has been sent.");
      m.close(); setAmount(""); setPhone(""); onDone();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={m.open} onClose={m.close} title="Record a contribution">
      <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
        <Field label="Amount (KES)"><input className="input mono" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={group ? String(group.contributionAmount) : "1000"} required /></Field>
        <Field label="M-Pesa phone number" hint="An STK push is sent to this number to confirm payment.">
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="2547XXXXXXXX" required />
        </Field>
        <button className="btn btn--green btn--block" disabled={busy}>{busy ? "Sending prompt…" : "Send M-Pesa prompt"}</button>
      </form>
    </Modal>
  );
}

const initials = (n = "?") => n.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—");
