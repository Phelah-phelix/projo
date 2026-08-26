"use client";
import { useState, useEffect } from "react";
import { User, Lock, Bell, Save } from "lucide-react";
import { PageHead, Field } from "@/components/feature";
import { Section } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { put } from "@/lib/api";

/** Shared settings for both roles. `extra` lets a role add its own panel. */
export default function SettingsView({ base, extra }) {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [p, setP] = useState({ name: "", email: "", contact: "", monthlyIncome: "" });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [prefs, setPrefs] = useState({ sms: true, email: false, reminders: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setP({ name: user.name || "", email: user.email || "", contact: user.contact || "", monthlyIncome: user.monthlyIncome ?? "" });
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault(); setBusy(true);
    try {
      const { user: u } = await put("/users/me", { ...p, monthlyIncome: Number(p.monthlyIncome || 0) });
      setUser(u); toast.ok("Profile updated.");
    } catch (e) { toast.bad(e.message); } finally { setBusy(false); }
  }
  async function savePassword(e) {
    e.preventDefault();
    if (pw.next !== pw.confirm) return toast.bad("New passwords do not match.");
    if (pw.next.length < 6) return toast.bad("Password must be at least 6 characters.");
    try {
      await put("/users/me/password", { current: pw.current, next: pw.next });
      toast.ok("Password changed."); setPw({ current: "", next: "", confirm: "" });
    } catch (e) { toast.bad(e.message); }
  }
  async function savePrefs() {
    try { await put("/users/me/preferences", prefs); toast.ok("Notification preferences saved."); }
    catch (e) { toast.bad(e.message); }
  }

  return (
    <div className="reveal">
      <PageHead base={base} baseLabel="Dashboard" title="Settings"
        subtitle="Manage your profile, security and notifications." />

      <div className="grid-lg">
        <div className="stack" style={{ "--s": "20px" }}>
          <Section title="Profile" icon={<User size={18} className="muted" />}>
            <form onSubmit={saveProfile} className="stack" style={{ "--s": "14px" }}>
              <Field label="Full name"><input className="input" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} required /></Field>
              <div className="field-2">
                <Field label="Email"><input className="input" type="email" value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} /></Field>
                <Field label="Phone contact"><input className="input" value={p.contact} onChange={(e) => setP({ ...p, contact: e.target.value })} /></Field>
              </div>
              <Field label="Monthly income (KES)"><input className="input mono" type="number" min="0" value={p.monthlyIncome} onChange={(e) => setP({ ...p, monthlyIncome: e.target.value })} /></Field>
              <button className="btn" disabled={busy}><Save size={17} /> {busy ? "Saving…" : "Save profile"}</button>
            </form>
          </Section>

          <Section title="Change password" icon={<Lock size={18} className="muted" />}>
            <form onSubmit={savePassword} className="stack" style={{ "--s": "14px" }}>
              <Field label="Current password"><input className="input" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required /></Field>
              <div className="field-2">
                <Field label="New password"><input className="input" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required /></Field>
                <Field label="Confirm new"><input className="input" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required /></Field>
              </div>
              <button className="btn btn--ghost">Update password</button>
            </form>
          </Section>
        </div>

        <div className="stack" style={{ "--s": "20px" }}>
          <Section title="Notifications" icon={<Bell size={18} className="muted" />}>
            <div className="stack" style={{ "--s": "12px" }}>
              <Toggle label="SMS alerts" desc="Contributions, loans and emergencies" on={prefs.sms} set={(v) => setPrefs({ ...prefs, sms: v })} />
              <Toggle label="Email updates" desc="Monthly statements and summaries" on={prefs.email} set={(v) => setPrefs({ ...prefs, email: v })} />
              <Toggle label="Meeting reminders" desc="Before each calendar event" on={prefs.reminders} set={(v) => setPrefs({ ...prefs, reminders: v })} />
              <button className="btn btn--sm" onClick={savePrefs}>Save preferences</button>
            </div>
          </Section>
          {extra}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, desc, on, set }) {
  return (
    <button type="button" className="list-row" style={{ width: "100%", padding: "8px 0" }} onClick={() => set(!on)}>
      <div style={{ textAlign: "left" }}><b>{label}</b><div className="tiny">{desc}</div></div>
      <span style={{ width: 44, height: 26, borderRadius: 999, background: on ? "var(--green)" : "var(--line)", position: "relative", transition: ".15s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: ".15s", boxShadow: "var(--sh-1)" }} />
      </span>
    </button>
  );
}
