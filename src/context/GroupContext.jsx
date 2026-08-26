"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { get, post } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/**
 * Holds the member's groups and the currently-active one. Members must join a
 * group (via token) before they can use the dashboard, so this also exposes the
 * join flow used by the token gate.
 */
const GroupCtx = createContext(null);
const ACTIVE_KEY = "pamoja_active_group";

export function GroupProvider({ children }) {
  const { user, ready } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveIdState] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { groups = [] } = await get("/groups/mine");
      setGroups(groups);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (ready && user) load();
    else if (ready && !user) setLoading(false);
  }, [ready, user, load]);

  // Restore the previously chosen group once groups load.
  useEffect(() => {
    if (groups.length === 0) return;
    const saved = typeof window !== "undefined" ? Number(localStorage.getItem(ACTIVE_KEY)) : null;
    const exists = groups.find((g) => g.id === saved);
    setActiveIdState(exists ? saved : groups[0].id);
  }, [groups]);

  const setActiveId = (id) => {
    setActiveIdState(id);
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_KEY, String(id));
  };

  async function joinGroup(token) {
    const res = await post("/memberships/join", { token: token.trim().toUpperCase() });
    await load();
    return res; // { membership: { groupId, status } }
  }

  const group = groups.find((g) => g.id === activeId) || groups[0] || null;

  return (
    <GroupCtx.Provider value={{ group, groups, loading, reload: load, setActiveId, joinGroup }}>
      {children}
    </GroupCtx.Provider>
  );
}

export function useGroup() {
  const ctx = useContext(GroupCtx);
  if (!ctx) throw new Error("useGroup must be used inside <GroupProvider>");
  return ctx;
}
