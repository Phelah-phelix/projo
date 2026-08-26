"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, Settings, ChevronDown } from "lucide-react";
import Brand from "@/components/Brand";
import Chatbot from "@/components/Chatbot";
import { Loading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

/**
 * Shared dashboard chrome: fixed sidebar + topbar + user menu, with the help
 * chatbot floating on every page. `nav` is an array of { href, label, icon }.
 */
export default function DashboardShell({ role, nav, children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);      // mobile sidebar
  const [menu, setMenu] = useState(false);      // user dropdown

  const active = nav.find((n) => pathname === n.href) || nav.find((n) => n.href !== `/${role.toLowerCase()}` && pathname.startsWith(n.href));
  const initials = (user?.name || "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const base = `/${role.toLowerCase()}`;
  const settingsHref = `${base}/settings`;

  return (
    <RoleGuard role={role}>
      {!user ? (
        <Loading label="Preparing your dashboard…" />
      ) : (
        <div className="shell">
          <div className={`scrim-mobile ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

          {/* sidebar */}
          <aside className={`sidebar ${open ? "open" : ""}`}>
            <div className="sidebar__brand"><Brand size={38} /></div>
            <div className="sidebar__section">{role === "LEADER" ? "Leader workspace" : "Member workspace"}</div>
            {nav.map((n) => {
              const isActive = n.href === base ? pathname === base : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className={`navlink ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
                  {n.icon}<span>{n.label}</span>
                </Link>
              );
            })}
            <div className="sidebar__foot">
              <button className="navlink" onClick={logout} style={{ width: "100%" }}>
                <LogOut size={18} /><span>Log out</span>
              </button>
            </div>
          </aside>

          {/* main column */}
          <div>
            <header className="topbar">
              <div className="row">
                <button className="hamburger" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
                <div className="topbar__title">
                  <h1>{active?.label || "Dashboard"}</h1>
                  <p>{user.groupName ? user.groupName : "Pamoja Network"}</p>
                </div>
              </div>
              <div className="usermenu">
                <button className="row" onClick={() => setMenu((m) => !m)} style={{ gap: 10 }}>
                  <div className="avatar">{initials}</div>
                  <div style={{ textAlign: "left" }} className="hide-sm">
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                    <div className="tiny">{role === "LEADER" ? "Group leader" : "Member"}</div>
                  </div>
                  <ChevronDown size={16} className="muted" />
                </button>
                {menu && (
                  <div className="usermenu__pop" onMouseLeave={() => setMenu(false)}>
                    <Link href={settingsHref} onClick={() => setMenu(false)}><Settings size={16} /> Settings</Link>
                    <button onClick={logout}><LogOut size={16} /> Log out</button>
                  </div>
                )}
              </div>
            </header>

            <main className="content">{children}</main>
          </div>

          <Chatbot role={role} userName={user.name} />
        </div>
      )}
    </RoleGuard>
  );
}
