"use client";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { FileBarChart, Printer, Users, Wallet, HandCoins } from "lucide-react";
import { PageHead, useAsync, useGroupPicker } from "@/components/feature";
import { Section, Loading, Empty, Stat, Badge } from "@/components/ui";
import { get, ksh } from "@/lib/api";

export default function LeaderReportsPage() {
  const { group, picker, loading: gl } = useGroupPicker();
  const key = group?.id;
  const { data, loading } = useAsync(
    () => (key ? get(`/reports/summary?groupId=${key}`) : Promise.resolve(null)), [key]
  );

  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Reports"
        subtitle="Financial statements for the whole group and for each member — transparent and ready to share."
        action={<button className="btn btn--ghost" onClick={() => window.print()}><Printer size={18} /> Print / save PDF</button>} />
      {picker}

      {gl || loading ? <Loading /> : !group ? null : !data ? <Empty>No data to report yet.</Empty> : (
        <>
          <div className="stat-row">
            <Stat label="Total contributions" value={ksh(data.totals?.contributions)} foot={`${data.totals?.members || 0} members`} />
            <Stat label="Loans disbursed" value={ksh(data.totals?.loans)} foot={`${data.totals?.activeLoans || 0} active`} />
            <Stat label="Fines collected" value={ksh(data.totals?.fines)} />
            <Stat label="Net pot balance" value={ksh(data.totals?.balance)} foot="available to the group" />
          </div>

          <div className="grid-lg">
            <Section title="Monthly contributions" icon={<FileBarChart size={18} className="muted" />}>
              {(!data.monthly || data.monthly.length === 0) ? <Empty>No monthly data yet.</Empty> : (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8f0f8" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#7c93ac" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#7c93ac" }} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip formatter={(v) => ksh(v)} contentStyle={{ borderRadius: 12, border: "1px solid #d7e3f0" }} />
                      <Bar dataKey="amount" name="Contributions" fill="#1f6fb2" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Section>

            <Section title="Merry-go-round order" icon={<Users size={18} className="muted" />}>
              {(!data.rotation || data.rotation.length === 0) ? <Empty>Rotation not set yet.</Empty> : (
                <div className="stack" style={{ "--s": "10px" }}>
                  {data.rotation.map((r, i) => (
                    <div className="list-row" key={r.membershipId} style={{ padding: "10px 0" }}>
                      <div className="row"><div className="avatar-sm">{i + 1}</div><b>{r.memberName}</b></div>
                      <Badge kind={r.paidOut ? "ok" : i === data.rotationNext ? "warn" : "muted"}>
                        {r.paidOut ? "Paid out" : i === data.rotationNext ? "Next" : "Waiting"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          <div style={{ height: 20 }} />
          <Section title="Per-member statement" icon={<Wallet size={18} className="muted" />}>
            {(!data.perMember || data.perMember.length === 0) ? <Empty>No members yet.</Empty> : (
              <table className="table">
                <thead><tr><th>Member</th><th>Contributed</th><th>Loans taken</th><th>Outstanding</th><th>Fines</th></tr></thead>
                <tbody>
                  {data.perMember.map((m) => (
                    <tr key={m.membershipId}>
                      <td><b>{m.name}</b></td>
                      <td className="mono">{ksh(m.contributed)}</td>
                      <td className="mono">{ksh(m.loans)}</td>
                      <td className="mono">{ksh(m.outstanding)}</td>
                      <td className="mono">{ksh(m.fines)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
