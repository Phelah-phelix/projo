"use client";
import { useState } from "react";
import { X, Inbox } from "lucide-react";

/** Stat tile for dashboard headers. */
export function Stat({ label, value, foot }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      {foot && <div className="stat__foot">{foot}</div>}
    </div>
  );
}

/** Card with an optional title and header action. */
export function Section({ title, icon, action, children, style }) {
  return (
    <div className="card card__pad" style={style}>
      {(title || action) && (
        <div className="between" style={{ marginBottom: 16 }}>
          {title && <div className="section-title">{icon}{title}</div>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/** Empty-state placeholder — an invitation to act, per the design brief. */
export function Empty({ children, icon }) {
  return (
    <div className="empty">
      {icon || <Inbox size={40} />}
      <p>{children}</p>
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="center-load stack center" style={{ "--s": "12px" }}>
      <div className="spinner" />
      <span className="muted">{label}</span>
    </div>
  );
}

export function Badge({ kind = "muted", children }) {
  return <span className={`badge badge--${kind}`}>{children}</span>;
}

/** AI loan default-risk badge, shared by the leader and member loan views. */
export function RiskBadge({ score, band }) {
  const pct = score == null ? null : Math.round(score * 100);
  const kind = band === "HIGH" ? "bad" : band === "MEDIUM" ? "warn" : "ok";
  return <Badge kind={kind}>{band || "—"}{pct != null ? ` · ${pct}%` : ""}</Badge>;
}

/** Controlled modal. Render nothing when `open` is false. */
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__head">
          <h3 style={{ fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" className="btn--ghost" style={{ padding: 6, borderRadius: 8, display: "grid", placeItems: "center" }}>
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__head" style={{ borderTop: "1px solid var(--line-soft)", borderBottom: "none", justifyContent: "flex-end", gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

/** Tiny hook to manage modal open state + payload. */
export function useModal() {
  const [state, setState] = useState({ open: false, data: null });
  return {
    open: state.open,
    data: state.data,
    show: (data = null) => setState({ open: true, data }),
    close: () => setState({ open: false, data: null }),
  };
}
