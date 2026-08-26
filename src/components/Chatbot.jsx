"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, LifeBuoy } from "lucide-react";
import { post } from "@/lib/api";

const SUGGESTIONS = {
  LEADER: [
    "How do I create a group?",
    "How are anomalies detected?",
    "How do I approve a loan?",
    "What is contribution prediction?",
  ],
  MEMBER: [
    "How do I make a contribution?",
    "How do I request a loan?",
    "Where do I see announcements?",
    "How do I enter my group token?",
  ],
};

// Offline fallback so the assistant still helps if the backend is unreachable.
const FAQ = [
  { k: ["create", "group", "start"], a: "Open the Create Group card, give your chama a name and purpose, set the contribution amount and cycle, then generate a join token. Share that token with members so they can join." },
  { k: ["token", "join", "enter"], a: "Members enter the 6-character group token on the member dashboard. Leaders find (and can regenerate) the token inside the Create Group and View Group cards." },
  { k: ["contribut", "pay", "mpesa", "m-pesa"], a: "Go to the Contribution card and tap ‘Make contribution’. An M-Pesa STK push is sent to your phone — enter your PIN to confirm, and you'll get an SMS receipt." },
  { k: ["loan", "borrow", "request"], a: "Use the Loans card to request a loan. The system scores default risk with AI; a leader then approves or declines it. You can track status there too." },
  { k: ["anomaly", "anomalies", "fraud", "flag"], a: "Every contribution is checked by an anomaly-detection model. Unusual amounts or timing are flagged for the leader and shown under Announcements as a flagged anomaly." },
  { k: ["predict", "forecast", "graph"], a: "The Contribution Prediction card forecasts where your group's savings are heading, based on past contributions, so you can plan ahead." },
  { k: ["emergency", "help", "urgent"], a: "Leaders can raise an emergency from the Emergency card, which instantly alerts all members by SMS." },
  { k: ["announce", "message", "notice"], a: "Announcements let leaders post notices to the group. Members see them on the Announcements card and get an SMS." },
  { k: ["calendar", "event", "meeting", "venue"], a: "The Calendar card holds meeting dates and venues. Leaders set them; members view them and receive reminders." },
];

function localAnswer(text) {
  const t = text.toLowerCase();
  const hit = FAQ.find((f) => f.k.some((w) => t.includes(w)));
  return hit ? hit.a : "I can help with groups, contributions, loans, anomalies, predictions, announcements and the calendar. Try asking about one of those, or reach a leader for group-specific questions.";
}

export default function Chatbot({ role = "MEMBER", userName = "there" }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: `Habari ${userName.split(" ")[0]}! I'm Rafiki, your Pamoja helper. Ask me anything about using the system.` },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  // Let other pages (e.g. the Help card) open the assistant.
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-rafiki", openIt);
    return () => window.removeEventListener("open-rafiki", openIt);
  }, []);

  async function send(q) {
    const question = (q ?? text).trim();
    if (!question || busy) return;
    setMsgs((m) => [...m, { from: "me", text: question }]);
    setText("");
    setBusy(true);
    try {
      const { reply } = await post("/chatbot", { message: question, role });
      setMsgs((m) => [...m, { from: "bot", text: reply || localAnswer(question) }]);
    } catch {
      setMsgs((m) => [...m, { from: "bot", text: localAnswer(question) }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open help chatbot">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <LifeBuoy size={20} />
            <div><h4>Rafiki — Help assistant</h4><div className="tiny" style={{ color: "rgba(255,255,255,.8)" }}>Always here to help</div></div>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.from === "me" ? "bubble--me" : "bubble--bot"}`}>{m.text}</div>
            ))}
            {busy && <div className="bubble bubble--bot"><span className="spinner" style={{ width: 16, height: 16 }} /></div>}
          </div>

          <div className="chat-suggest">
            {SUGGESTIONS[role].map((s) => (
              <button key={s} onClick={() => send(s)}>{s}</button>
            ))}
          </div>

          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question…" aria-label="Message" />
            <button className="btn" style={{ padding: 11, borderRadius: 999 }} aria-label="Send"><Send size={18} /></button>
          </form>
        </div>
      )}
    </>
  );
}
