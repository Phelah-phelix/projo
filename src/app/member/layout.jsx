import "../dashboard.css";
import DashboardShell from "@/components/DashboardShell";
import MemberGate from "@/components/MemberGate";
import { GroupProvider } from "@/context/GroupContext";
import { memberNav } from "@/lib/nav";

// Members must join a group with a token before any card is usable, so the whole
// dashboard is wrapped in a GroupProvider + MemberGate.
export default function MemberLayout({ children }) {
  return (
    <GroupProvider>
      <DashboardShell role="MEMBER" nav={memberNav}>
        <MemberGate>{children}</MemberGate>
      </DashboardShell>
    </GroupProvider>
  );
}
