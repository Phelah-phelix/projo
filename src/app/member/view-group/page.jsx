"use client";
import { Users, ShieldCheck } from "lucide-react";
import { PageHead, useAsync } from "@/components/feature";
import { Section, Loading, Empty, Badge, Stat } from "@/components/ui";
import { useGroup } from "@/context/GroupContext";
import { get, ksh } from "@/lib/api";

export default function MemberViewGroup() {
  const { group } = useGroup();
  const key = group?.id;
  const { data, loading } = useAsync(
    () => (key ? get(`/groups/${key}/members`) : Promise.resolve({ members: [] })), [key]
  );
  const members = data?.members || [];
  const active = members.filter((m) => m.status === "ACTIVE");

  return (
    <div className="reveal">
      <PageHead base="/member" baseLabel="Dashboard" title="View group"
        subtitle={`The people saving alongside you in ${group?.name || "your chama"}.`} />

      {loading ? <Loading /> : (
        <>
          <div className="stat-row">
            <Stat label="Group name" value={group?.name || "—"} foot={group?.purpose} />
            <Stat label="Members" value={active.length} foot="active" />
            <Stat label="Contribution" value={ksh(group?.contributionAmount)} foot={(group?.cycle || "").toLowerCase()} />
          </div>

          <Section title="Members" icon={<Users size={18} className="muted" />}>
            {active.length === 0 ? <Empty>No members yet.</Empty> : (
              <div>
                {active.map((m) => (
                  <div className="list-row" key={m.id}>
                    <div className="row">
                      <div className="avatar-sm">{initials(m.name)}</div>
                      <div>
                        <b>{m.name}</b>
                        <div className="tiny">Joined {fmt(m.joinedAt)}</div>
                      </div>
                    </div>
                    {m.role === "LEADER"
                      ? <Badge kind="ocean"><ShieldCheck size={13} /> Leader</Badge>
                      : <Badge kind="muted">Member</Badge>}
                  </div>
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
}

const initials = (n = "?") => n.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—");
