import {
  LayoutGrid, PlusCircle, Users, HandCoins, CalendarDays, Megaphone,
  TrendingUp, Siren, LifeBuoy, FileBarChart, Gavel, Settings, Wallet,
} from "lucide-react";

/**
 * Single source of truth for dashboard navigation + cards.
 * `tint`/`color` drive the coloured icon tiles. `desc` is the card blurb.
 */
export const leaderNav = [
  { href: "/leader", label: "Dashboard", icon: <LayoutGrid size={18} />, color: "var(--navy)", tint: "#e6edf6", desc: "Your chama at a glance." },
  { href: "/leader/create-group", label: "Create Group", icon: <PlusCircle size={18} />, color: "var(--ocean)", tint: "#e4f0fb", desc: "Name it, set its purpose, generate a join token and start contributions." },
  { href: "/leader/view-group", label: "View Group", icon: <Users size={18} />, color: "var(--teal)", tint: "#dcf3f2", desc: "Enter a token to approve members, contribute and view contributions." },
  { href: "/leader/loans", label: "Loans", icon: <HandCoins size={18} />, color: "var(--green)", tint: "#e6f4dd", desc: "Review anomalies, approve loans, and track every request." },
  { href: "/leader/calendar", label: "Calendar", icon: <CalendarDays size={18} />, color: "var(--ocean)", tint: "#e4f0fb", desc: "Set meeting dates and venues for the group." },
  { href: "/leader/announcements", label: "Announcements", icon: <Megaphone size={18} />, color: "var(--teal)", tint: "#dcf3f2", desc: "Post and edit notices; members are alerted by SMS." },
  { href: "/leader/prediction", label: "Contribution Prediction", icon: <TrendingUp size={18} />, color: "var(--navy)", tint: "#e6edf6", desc: "See where your group's savings are heading." },
  { href: "/leader/emergency", label: "Emergency", icon: <Siren size={18} />, color: "var(--spark)", tint: "#fdf0d8", desc: "Raise an urgent alert to every member instantly." },
  { href: "/leader/reports", label: "Reports", icon: <FileBarChart size={18} />, color: "var(--ocean)", tint: "#e4f0fb", desc: "Financial statements for the group and each member." },
  { href: "/leader/fines", label: "Fines", icon: <Gavel size={18} />, color: "var(--green)", tint: "#e6f4dd", desc: "Issue and waive fines for late or missed contributions." },
  { href: "/leader/help", label: "Chatbot help", icon: <LifeBuoy size={18} />, color: "var(--teal)", tint: "#dcf3f2", desc: "Ask Rafiki anything about running your chama." },
  { href: "/leader/settings", label: "Settings", icon: <Settings size={18} />, color: "var(--navy)", tint: "#e6edf6", desc: "Manage your profile, password and notifications." },
];

export const memberNav = [
  { href: "/member", label: "Dashboard", icon: <LayoutGrid size={18} />, color: "var(--navy)", tint: "#e6edf6", desc: "Your savings at a glance." },
  { href: "/member/view-group", label: "View Group", icon: <Users size={18} />, color: "var(--teal)", tint: "#dcf3f2", desc: "See who is in your chama." },
  { href: "/member/contribution", label: "Contribution", icon: <Wallet size={18} />, color: "var(--green)", tint: "#e6f4dd", desc: "View your contributions and make a new one via M-Pesa." },
  { href: "/member/announcements", label: "Announcements", icon: <Megaphone size={18} />, color: "var(--ocean)", tint: "#e4f0fb", desc: "Read notices, post your own, and see flagged anomalies." },
  { href: "/member/calendar", label: "Calendar", icon: <CalendarDays size={18} />, color: "var(--teal)", tint: "#dcf3f2", desc: "View upcoming events and venues." },
  { href: "/member/prediction", label: "Contribution Prediction", icon: <TrendingUp size={18} />, color: "var(--navy)", tint: "#e6edf6", desc: "Forecast your and the group's contributions." },
  { href: "/member/loan", label: "Loans", icon: <HandCoins size={18} />, color: "var(--green)", tint: "#e6f4dd", desc: "View requested loans and request a new one." },
  { href: "/member/help", label: "Chatbot help", icon: <LifeBuoy size={18} />, color: "var(--ocean)", tint: "#e4f0fb", desc: "Ask Rafiki for help using Pamoja." },
  { href: "/member/settings", label: "Settings", icon: <Settings size={18} />, color: "var(--navy)", tint: "#e6edf6", desc: "Manage your profile, password and group." },
];
