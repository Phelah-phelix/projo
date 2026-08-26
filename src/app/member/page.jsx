"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { memberNav } from "@/lib/nav";
import { useAuth } from "@/context/AuthContext";
import { useGroup } from "@/context/GroupContext";
import { useAsync } from "@/components/feature";
import { Stat, Loading } from "@/components/ui";
import { get, ksh } from "@/lib/api";

export default function MemberHome() {
  const { user } = useAuth();
  const { group, groups, setActiveId } = useGroup();
  const key = group?.id;
  const { data, loading } = useAsync(
    () => (key ? get(`/dashboard/member?groupId=${key}`).catch(() => null) : Promise.resolve(null)), [key]
  );
  const cards = memberNav.filter((n) => n.href !== "/member");
  const s = data?.summary || {};

  return (
    <div className="reveal">
      <div className="welcome">
        <h2>Karibu, {user?.name?.split(" ")[0]} 👋</h2>
        <p>
          Welcome to <b>{group?.name}</b>. Track your savings, take part in contributions, request
          loans and stay in the loop with your chama — all in one place.
        </p>
      </div>

      {groups.length > 1 && (
        <div className="field" style={{ maxWidth: 320, marginBottom: 18 }}>
          <label>Active group</label>
          <select className="select" value={group?.id || ""} onChange={(e) => setActiveId(Number(e.target.value))}>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="stat-row">
          <Stat label="My total savings" value={ksh(s.myContributions)} foot={`${s.myCount ?? 0} contribution(s)`} />
          <Stat label="Group pool" value={ksh(s.groupPool)} foot={`${s.members ?? 0} members`} />
          <Stat label="My active loan" value={ksh(s.myActiveLoan)} foot={s.loanStatus || "none"} />
          <Stat label="Next meeting" value={s.nextEvent ? fmt(s.nextEvent) : "—"} foot={s.nextVenue || "no venue set"} />
        </div>
      )}

      <div className="section-title">Your chama tools</div>
      <div className="dash-grid">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="dash-card" style={{ "--tint": c.tint }}>
            <div className="dash-card__ic" style={{ background: c.color }}>{c.icon}</div>
            <h3>{c.label}</h3>
            <p>{c.desc}</p>
            <span className="row" style={{ color: "var(--ocean)", fontWeight: 600, fontSize: 13.5, marginTop: "auto" }}>
              Open <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const fmt = (d) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
