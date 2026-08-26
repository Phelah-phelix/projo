"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { get } from "@/lib/api";

/** Breadcrumb + title block used at the top of every feature page. */
export function PageHead({ base, baseLabel, title, subtitle, action }) {
  return (
    <>
      <div className="crumb">
        <Link href={base}>{baseLabel}</Link>
        <ChevronRight size={14} />
        <span style={{ color: "var(--ink)" }}>{title}</span>
      </div>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
    </>
  );
}

/**
 * Fetch-on-mount hook. `fn` is an async function; returns { data, loading,
 * error, reload, setData }. Reruns when any dep changes.
 */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fn());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { data, loading, error, reload: run, setData };
}

/** Labelled input helper. */
export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <div className="field__hint">{hint}</div>}
    </div>
  );
}

/**
 * Loads the leader's groups and returns a selector. Most leader pages operate
 * on one group at a time, so this keeps a single selected group in state.
 * Returns { group, groups, loading, picker } — render `picker` in the UI.
 */
export function useGroupPicker() {
  const { data, loading } = useAsync(() => get("/groups/mine").catch(() => ({ groups: [] })), []);
  const groups = data?.groups || [];
  const [id, setId] = useState(null);
  const selectedId = id || groups[0]?.id || null;
  const group = groups.find((g) => g.id === selectedId) || null;

  const picker =
    groups.length === 0 ? (
      <div className="panel row" style={{ gap: 10, color: "var(--ink-2)" }}>
        <Users size={18} /> You have no groups yet.{" "}
        <Link href="/leader/create-group" style={{ color: "var(--ocean)", fontWeight: 600 }}>Create one first.</Link>
      </div>
    ) : groups.length === 1 ? null : (
      <div className="field" style={{ maxWidth: 320, marginBottom: 18 }}>
        <label>Group</label>
        <select className="select" value={selectedId || ""} onChange={(e) => setId(Number(e.target.value))}>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
    );

  return { group, groups, loading, picker };
}
