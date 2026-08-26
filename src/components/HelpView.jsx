"use client";
import { useState } from "react";
import { LifeBuoy, MessageCircle, ChevronDown, BookOpen } from "lucide-react";
import { PageHead } from "@/components/feature";
import { Section } from "@/components/ui";

const FAQ = {
  LEADER: [
    ["How do I create a group?", "Open Create Group, enter a name, purpose and contribution amount, then generate a token. Share the token with members so they can request to join."],
    ["How do I approve members?", "Go to View Group, enter your group token, and approve or reject each request under the members tab."],
    ["How does loan approval work?", "In Loans, each request shows an AI default-risk score (Low/Medium/High). Use it alongside your knowledge of the member to approve or decline."],
    ["What are anomalies?", "The system checks every contribution with an anomaly-detection model. Unusual amounts or timing are flagged so you can follow up early."],
    ["How do fines work?", "Under Fines, you can issue a fine for late or missed contributions, and waive it later if needed. The member is notified."],
    ["How do I raise an emergency?", "Open Emergency, choose a type, write a short message, and every member is alerted instantly by SMS."],
  ],
  MEMBER: [
    ["How do I join a group?", "Enter the token your leader gave you on the member dashboard. Once the leader approves you, you can take part."],
    ["How do I make a contribution?", "Open Contribution and tap ‘Make contribution’. An M-Pesa prompt is sent to your phone — enter your PIN to confirm."],
    ["How do I request a loan?", "Go to Loans, tap ‘Request loan’, and fill in the amount, term and purpose. Your leader reviews it with an AI risk score."],
    ["Where do I see notices?", "All group notices appear under Announcements, and you also receive them by SMS."],
    ["What is the forecast?", "Contribution Prediction shows where your savings are heading, based on your history, using an AI model."],
  ],
};

export default function HelpView({ role, base }) {
  const items = FAQ[role] || FAQ.MEMBER;
  const [open, setOpen] = useState(0);

  return (
    <div className="reveal">
      <PageHead base={base} baseLabel="Dashboard" title="Chatbot help"
        subtitle="Ask Rafiki, your Pamoja assistant, or browse the common questions below." />

      <div className="grid-lg">
        <Section title="Frequently asked" icon={<BookOpen size={18} className="muted" />}>
          <div className="stack" style={{ "--s": "8px" }}>
            {items.map(([q, a], i) => (
              <div key={i} style={{ border: "1px solid var(--line-soft)", borderRadius: 12, overflow: "hidden" }}>
                <button className="between" style={{ width: "100%", padding: "14px 16px", fontWeight: 600, color: "var(--navy)" }}
                  onClick={() => setOpen(open === i ? -1 : i)}>
                  <span style={{ textAlign: "left" }}>{q}</span>
                  <ChevronDown size={18} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: ".2s" }} />
                </button>
                {open === i && <p className="muted" style={{ padding: "0 16px 16px", fontSize: 14.5 }}>{a}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section style={{ background: "linear-gradient(160deg, var(--navy), var(--ocean))", color: "#fff" }}>
          <div className="stack center" style={{ "--s": "14px", padding: "10px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,.15)", display: "grid", placeItems: "center", margin: "0 auto" }}>
              <LifeBuoy size={30} />
            </div>
            <h3 style={{ color: "#fff", fontSize: 20 }}>Chat with Rafiki</h3>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: 14.5 }}>
              Rafiki can answer questions about contributions, loans, anomalies, predictions and more —
              any time, day or night.
            </p>
            <button className="btn btn--spark" onClick={() => window.dispatchEvent(new Event("open-rafiki"))}>
              <MessageCircle size={18} /> Open the assistant
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
