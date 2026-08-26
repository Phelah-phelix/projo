"use client";
import { PageHead, useGroupPicker } from "@/components/feature";
import { Loading } from "@/components/ui";
import PredictionView from "@/components/PredictionView";

export default function LeaderPredictionPage() {
  const { group, picker, loading } = useGroupPicker();
  return (
    <div className="reveal">
      <PageHead base="/leader" baseLabel="Dashboard" title="Contribution Prediction"
        subtitle="An AI forecast of your group's contributions, based on its saving history — so you can plan the months ahead." />
      {picker}
      {loading ? <Loading /> : <PredictionView groupId={group?.id} />}
    </div>
  );
}
