"use client";
import { Users2, KeyRound } from "lucide-react";
import SettingsView from "@/components/SettingsView";
import { Section } from "@/components/ui";
import { useGroup } from "@/context/GroupContext";
import { ksh } from "@/lib/api";

export default function MemberSettingsPage() {
  const { group, groups, setActiveId } = useGroup();
  return (
    <SettingsView
      base="/member"
      extra={
        <Section title="My group" icon={<Users2 size={18} className="muted" />}>
          <div className="stack" style={{ "--s": "12px" }}>
            {groups.length > 1 && (
              <div className="field">
                <label>Active group</label>
                <select className="select" value={group?.id || ""} onChange={(e) => setActiveId(Number(e.target.value))}>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
            {group ? (
              <>
                <div className="list-row" style={{ padding: "8px 0" }}><span className="muted">Group</span><b>{group.name}</b></div>
                <div className="list-row" style={{ padding: "8px 0" }}><span className="muted">Purpose</span><span>{group.purpose || "—"}</span></div>
                <div className="list-row" style={{ padding: "8px 0" }}><span className="muted">Contribution</span><span className="mono">{ksh(group.contributionAmount)} / {(group.cycle || "").toLowerCase()}</span></div>
                <div className="list-row" style={{ padding: "8px 0" }}><span className="muted">Status</span>
                  <span className={`badge ${group.membershipStatus === "PENDING" ? "badge--warn" : "badge--ok"}`}>
                    {group.membershipStatus === "PENDING" ? "Awaiting approval" : "Active"}
                  </span>
                </div>
              </>
            ) : (
              <p className="muted row" style={{ gap: 8 }}><KeyRound size={16} /> You haven't joined a group yet.</p>
            )}
          </div>
        </Section>
      }
    />
  );
}
