"use client";

import type { ScoreResult, AgeResult, StageSelections } from "@/lib/data/boneAge";
import { RUS_BONE_KEYS, CARPAL_BONE_KEYS } from "@/lib/data/boneAge";

interface Props {
  scores: ScoreResult;
  ages: AgeResult;
  selections: StageSelections;
}

export default function ResultsPanel({ scores, ages, selections }: Props) {
  const allKeys = [...RUS_BONE_KEYS, ...CARPAL_BONE_KEYS];
  const rows = [
    { label: "RUS",     score: scores.rusScore,        age: ages.rusAge,        hasAny: RUS_BONE_KEYS.some((k) => selections[k] !== undefined),  allDone: RUS_BONE_KEYS.every((k) => selections[k] !== undefined) },
    { label: "Carpal",  score: scores.carpalScore,     age: ages.carpalAge,     hasAny: CARPAL_BONE_KEYS.some((k) => selections[k] !== undefined), allDone: CARPAL_BONE_KEYS.every((k) => selections[k] !== undefined) },
    { label: "20-Bone", score: scores.twentyBoneScore, age: ages.twentyBoneAge, hasAny: allKeys.some((k) => selections[k] !== undefined),          allDone: allKeys.every((k) => selections[k] !== undefined) },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center gap-4 sm:gap-8">
      {rows.map(({ label, score, age, hasAny, allDone }) => (
        <div key={label} className="flex items-baseline gap-1 sm:gap-1.5 shrink-0">
          <span className="text-sm text-gray-400 dark:text-gray-500">{label}</span>
          <span className="hidden sm:inline text-sm tabular-nums text-gray-400 dark:text-gray-500">{hasAny ? `${score}pt` : "—"}</span>
          <span className={`text-base sm:text-lg font-bold tabular-nums ${allDone ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-gray-700"}`}>
            {allDone ? `${age}歳` : "——"}
          </span>
        </div>
      ))}
    </div>
  );
}
