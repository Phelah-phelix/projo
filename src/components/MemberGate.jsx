"use client";
import { useState } from "react";
import { KeyRound, LogIn, Clock, PlusCircle } from "lucide-react";
import { useGroup } from "@/context/GroupContext";
import { useToast } from "@/context/ToastContext";
import { Loading } from "@/components/ui";

/**
 * Wraps the member dashboard. A member must join a group with a token before
 * they can access any card. Once a request is pending, a banner is shown but the
 * dashboard remains browsable.
 */
export default function MemberGate({ children }) {
  const { group, loading, joinGroup } = useGroup();
  const toast = useToast();
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (token.trim().length < 4) return toast.bad("Please enter the full group token.");
    setBusy(true);
    try {
      const { membership } = await joinGroup(token);
      if (membership?.status === "ACTIVE") toast.ok("Welcome to the group!");
      else toast.info("Request sent. Your leader will approve you shortly.");
      setToken("");
    } catch (e) {
      toast.bad(e.message || "That token was not recognised.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading label="Loading your group…" />;

  // No group yet → gate.
  if (!group) {
    return (
      <div className="gate">
        <div className="gate__card reveal">
          <div className="gate__ic"><KeyRound size={30} /></div>
          <h2 style={{ fontSize: 22 }}>Enter your group token</h2>
          <p className="muted" style={{ margin: "8px 0 22px", fontSize: 14.5 }}>
            Your chama leader has a 6-character token. Enter it below to request to join.
            You'll get access once the leader approves you.
          </p>
          <form onSubmit={submit} className="stack" style={{ "--s": "14px" }}>
            <input
              className="input token-input" value={token} maxLength={8}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="e.g. PMJ7K2" autoFocus aria-label="Group token"
            />
            <button className="btn btn--lg btn--block" disabled={busy}>
              <LogIn size={18} /> {busy ? "Joining…" : "Join group"}
            </button>
          </form>
          <p className="tiny" style={{ marginTop: 18 }}>
            Don't have a token? Ask your group leader to share it, or to create a group first.
          </p>
        </div>
      </div>
    );
  }

  // Pending approval → informational banner, dashboard still visible.
  const pending = group.membershipStatus === "PENDING";

  return (
    <>
      {pending && (
        <div className="panel row reveal" style={{ gap: 12, marginBottom: 18, borderLeft: "4px solid var(--spark)" }}>
          <Clock size={20} style={{ color: "var(--spark)" }} />
          <div>
            <b>Awaiting approval</b>
            <div className="tiny">Your request to join <b>{group.name}</b> is pending. The leader will approve you soon — some actions stay locked until then.</div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
