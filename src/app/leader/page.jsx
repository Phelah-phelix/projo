"use client";
import Link from "next/link";
import { ArrowRight, Users, HandCoins, Wallet, Clock } from "lucide-react";
import { leaderNav } from "@/lib/nav";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/components/feature";
import { Stat, Loading } from "@/components/ui";
import { get, ksh } from "@/lib/api";

export default function LeaderHome() {
  const { user } = useAuth();
  const { data, loading } = useAsync(() => get("/dashboard/leader").catch(() => null), []);
  const cards = leaderNav.filter((n) => n.href !== "/leader");

  const s = data?.summary || {};

  return (
    <div className="reveal">
      <div className="welcome">
        <h2>Karibu, {user?.name?.split(" ")[0]} 👋</h2>
        <p>
          Here is your chama at a glance. Create a group, welcome new members, and let Pamoja
          keep every shilling transparent and accounted for.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="stat-row">
          <Stat label="Total contributions" value={ksh(s.totalContributions)} foot={`${s.groups || 0} group(s)`} />
          <Stat label="Members" value={s.members ?? 0} foot={`${s.pendingMembers ?? 0} awaiting approval`} />
          <Stat label="Active loans" value={ksh(s.activeLoans)} foot={`${s.pendingLoans ?? 0} pending review`} />
          <Stat label="Flagged anomalies" value={s.anomalies ?? 0} foot="needs your attention" />
        </div>
      )}

      <div className="section-title">Manage your chama</div>
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
