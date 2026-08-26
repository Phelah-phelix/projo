"use client";
import {
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useAsync } from "@/components/feature";
import { Section, Loading, Empty, Stat } from "@/components/ui";
import { get, ksh } from "@/lib/api";

/**
 * Shared contribution-forecast view. Fetches history + AI forecast for a group
 * (and optionally a single member) and renders one combined chart.
 */
export default function PredictionView({ groupId, memberScope = false }) {
  const q = groupId ? `/predictions/contribution?groupId=${groupId}${memberScope ? "&scope=me" : ""}` : null;
  const { data, loading, error } = useAsync(
    () => (q ? get(q) : Promise.resolve(null)), [q]
  );

  if (!groupId) return <Empty icon={<Sparkles size={40} />}>Join or select a group to see its forecast.</Empty>;
  if (loading) return <Loading label="Asking the AI model…" />;
  if (error || !data) return <Empty>Could not load a forecast yet. Add a few contributions first.</Empty>;

  const history = (data.history || []).map((d) => ({ ...d, kind: "actual" }));
  const forecast = (data.forecast || []).map((d) => ({ ...d, forecast: d.amount }));
  // stitch the two series so the line connects
  const merged = [
    ...history.map((h) => ({ label: h.label, actual: h.amount })),
    ...forecast.map((f) => ({ label: f.label, forecast: f.forecast })),
  ];
  const s = data.summary || {};
  const up = (s.trend ?? 0) >= 0;

  return (
    <div className="stack" style={{ "--s": "20px" }}>
      <div className="stat-row">
        <Stat label="Next period (forecast)" value={ksh(s.nextPeriod)} foot={`${memberScope ? "your" : "group"} expected contribution`} />
        <Stat label="Trend" value={<span style={{ color: up ? "var(--green)" : "var(--spark-700)" }}>{up ? "▲" : "▼"} {Math.abs(Math.round((s.trend || 0) * 100))}%</span>} foot="vs. recent average" />
        <Stat label="Model confidence" value={`${Math.round((s.confidence ?? 0) * 100)}%`} foot={s.model || "gradient boosting"} />
      </div>

      <Section title="Contribution forecast" icon={up ? <TrendingUp size={18} className="muted" /> : <TrendingDown size={18} className="muted" />}>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={merged} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f6fb2" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1f6fb2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f0f8" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#7c93ac" }} />
              <YAxis tick={{ fontSize: 12, fill: "#7c93ac" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => ksh(v)} contentStyle={{ borderRadius: 12, border: "1px solid #d7e3f0" }} />
              <Legend />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#1f6fb2" strokeWidth={2.5} fill="url(#cActual)" />
              <Line type="monotone" dataKey="forecast" name="AI forecast" stroke="#f2a63b" strokeWidth={2.5} strokeDasharray="6 5" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="tiny" style={{ marginTop: 10 }}>
          Solid blue is what has actually been contributed; the dashed orange line is the AI model&rsquo;s
          forecast for the coming periods, so the group can plan ahead.
        </p>
      </Section>
    </div>
  );
}
