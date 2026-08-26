"use client";
import { useState } from "react";
import { PageHead } from "@/components/feature";
import { Empty } from "@/components/ui";
import { Sparkles } from "lucide-react";
import PredictionView from "@/components/PredictionView";
import { useGroup } from "@/context/GroupContext";

export default function MemberPredictionPage() {
  const { group } = useGroup();
  const [scope, setScope] = useState("me");

  return (
    <div className="reveal">
      <PageHead base="/member" baseLabel="Dashboard" title="Contribution Prediction"
        subtitle="An AI forecast of your savings, so you can see where you're heading and plan the months ahead." />

      {!group ? (
        <Empty icon={<Sparkles size={40} />}>Join a group to see your forecast.</Empty>
      ) : (
        <>
          <div className="pill-tabs" style={{ marginBottom: 18 }}>
            <button className={scope === "me" ? "active" : ""} onClick={() => setScope("me")}>My forecast</button>
            <button className={scope === "group" ? "active" : ""} onClick={() => setScope("group")}>Group forecast</button>
          </div>
          {/* key forces a refetch when scope changes */}
          <PredictionView key={scope} groupId={group.id} memberScope={scope === "me"} />
        </>
      )}
    </div>
  );
}
