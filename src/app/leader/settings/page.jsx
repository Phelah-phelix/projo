"use client";
import { ShieldCheck } from "lucide-react";
import SettingsView from "@/components/SettingsView";
import { Section } from "@/components/ui";

export default function LeaderSettingsPage() {
  return (
    <SettingsView
      base="/leader"
      extra={
        <Section title="Leader tools" icon={<ShieldCheck size={18} className="muted" />}>
          <div className="stack" style={{ "--s": "10px" }}>
            <p className="muted" style={{ fontSize: 14.5 }}>
              As a group leader you can regenerate join tokens in <b>Create Group</b>, approve members
              in <b>View Group</b>, and issue fines under <b>Fines</b>. Keep your token private and only
              share it with people you want in the chama.
            </p>
            <div className="list-row" style={{ padding: "8px 0" }}>
              <span className="muted">Role</span><span className="badge badge--ocean">Group leader</span>
            </div>
          </div>
        </Section>
      }
    />
  );
}
