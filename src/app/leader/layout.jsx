import "../dashboard.css";
import DashboardShell from "@/components/DashboardShell";
import { leaderNav } from "@/lib/nav";

// The sidebar hides the Dashboard-home blurb entry's card-only siblings by simply
// listing every nav item; the home card grid is rendered by the page itself.
export default function LeaderLayout({ children }) {
  return (
    <DashboardShell role="LEADER" nav={leaderNav}>
      {children}
    </DashboardShell>
  );
}
