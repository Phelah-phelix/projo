"use client";
import { useState } from "react";
import { Copy, Check, PlusCircle, KeyRound, Sparkles, RefreshCw } from "lucide-react";
import { PageHead, useAsync, Field } from "@/components/feature";
import { Section, Loading, Empty, Badge } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { get, post, ksh } from "@/lib/api";

export default function CreateGroupPage() {
  const toast = useToast();
  const { data, loading, reload } = useAsync(() => get("/groups/mine").catch(() => ({ groups: [] })), []);
  const [f, setF] = useState({ name: "", purpose: "", contributionAmount: "", cycle: "MONTHLY" });
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function create(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await post("/groups", {
        name: f.name.trim(),
        purpose: f.purpose.trim(),
        contributionAmount: Number(f.contributionAmount || 0),
        cycle: f.cycle,
      });
      toast.ok("Group created — share the token with your members.");
      setF({ name: "", purpose: "", contributionAmount: "", cycle: "MONTHLY" });
      reload();
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }

  async function regenerate(id) {
    try { await post(`/groups/${id}/token/regenerate`); toast.ok("New token generated."); reload(); }
    catch (e) { toast.bad(e.message); }
  }

  function copy(token) {
    navigator.clipboard?.writeText(token);
    setCopied(token);
    toast.info("Token copied to clipboard.");
    setTimeout(() => setCopied(""), 1500);
  }

  const groups = data?.groups || [];

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Create Group"
        subtitle="Start a new chama: give it a name and purpose, set the contribution, and generate a token members use to join." />

      <div className="grid-lg">
        <Section title="New chama details" icon={<PlusCircle size={18} className="muted" />}>
          <form onSubmit={create} className="stack" style={{ "--s": "16px" }}>
            <Field label="Group name">
              <input className="input" value={f.name} onChange={set("name")} placeholder="e.g. Homa Bay Women Sacco" required />
            </Field>
            <Field label="Group purpose" hint="What is the group saving towards? Members will see this.">
              <textarea className="textarea" value={f.purpose} onChange={set("purpose")} placeholder="e.g. Table banking and school-fees savings for members' children." required />
            </Field>
            <div className="field-2">
              <Field label="Contribution amount (KES)" hint="Amount each member contributes per cycle.">
                <input className="input mono" type="number" min="0" value={f.contributionAmount} onChange={set("contributionAmount")} placeholder="e.g. 1000" required />
              </Field>
              <Field label="Contribution cycle">
                <select className="select" value={f.cycle} onChange={set("cycle")}>
                  <option value="WEEKLY">Weekly</option>
                  <option value="BIWEEKLY">Every 2 weeks</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </Field>
            </div>
            <button className="btn btn--lg" disabled={busy}>
              <Sparkles size={18} /> {busy ? "Creating…" : "Create group & generate token"}
            </button>
          </form>
        </Section>

        <Section title="How the token works" icon={<KeyRound size={18} className="muted" />} style={{ background: "linear-gradient(160deg,#fff, var(--mist))" }}>
          <ol className="stack" style={{ "--s": "14px", paddingLeft: 18, color: "var(--ink-2)", fontSize: 14.5 }}>
            <li>Create your group — Pamoja generates a unique 6-character join token.</li>
            <li>Share the token with members (in person, SMS or WhatsApp).</li>
            <li>Members enter it on their dashboard to request to join.</li>
            <li>You approve or reject each request under <b>View Group</b>.</li>
            <li>Once approved, members can contribute and take part.</li>
          </ol>
        </Section>
      </div>

      <div style={{ height: 22 }} />
      <Section title="Your groups" icon={<Users2 />}>
        {loading ? <Loading /> : groups.length === 0 ? (
          <Empty>No groups yet. Create your first chama above to get started.</Empty>
        ) : (
          <table className="table">
            <thead><tr><th>Group</th><th>Contribution</th><th>Members</th><th>Join token</th><th></th></tr></thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id}>
                  <td><b>{g.name}</b><div className="tiny">{g.purpose}</div></td>
                  <td className="mono">{ksh(g.contributionAmount)} <span className="tiny">/ {g.cycle.toLowerCase()}</span></td>
                  <td>{g.memberCount} <Badge kind="warn">{g.pendingCount} pending</Badge></td>
                  <td>
                    <button className="row" onClick={() => copy(g.token)} style={{ gap: 8 }}>
                      <code style={{ fontWeight: 800, letterSpacing: 2, color: "var(--navy)" }}>{g.token}</code>
                      {copied === g.token ? <Check size={15} color="var(--green)" /> : <Copy size={15} className="muted" />}
                    </button>
                  </td>
                  <td><button className="btn btn--ghost btn--sm" onClick={() => regenerate(g.id)}><RefreshCw size={14} /> New token</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

function Users2() { return <span style={{ width: 18 }} />; }
