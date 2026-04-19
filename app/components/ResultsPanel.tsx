"use client";

import type { ScoreResult, AgeResult, StageSelections } from "@/lib/data/boneAge";
import { RUS_BONE_KEYS, CARPAL_BONE_KEYS, BONE_DEFINITIONS } from "@/lib/data/boneAge";

const boneMap = Object.fromEntries(BONE_DEFINITIONS.map((b) => [b.key, b]));

interface Props {
  scores: ScoreResult;
  ages: AgeResult;
  selections: StageSelections;
  activeBoneIndices: Set<number>;
}

export default function ResultsPanel({ scores, ages, selections, activeBoneIndices }: Props) {
  const allKeys = [...RUS_BONE_KEYS, ...CARPAL_BONE_KEYS];

  const rows = [
    { label: "RUS",     score: scores.rusScore,        age: ages.rusAge,        hasAny: RUS_BONE_KEYS.some((k) => selections[k] !== undefined),  allDone: RUS_BONE_KEYS.every((k) => selections[k] !== undefined),  labelColor: "text-blue-400 dark:text-blue-500",     activeColor: "text-blue-600 dark:text-blue-400" },
    { label: "Carpal",  score: scores.carpalScore,     age: ages.carpalAge,     hasAny: CARPAL_BONE_KEYS.some((k) => selections[k] !== undefined), allDone: CARPAL_BONE_KEYS.every((k) => selections[k] !== undefined), labelColor: "text-violet-400 dark:text-violet-500", activeColor: "text-violet-600 dark:text-violet-400" },
    { label: "20-Bone", score: scores.twentyBoneScore, age: ages.twentyBoneAge, hasAny: allKeys.some((k) => selections[k] !== undefined),          allDone: allKeys.every((k) => selections[k] !== undefined),          labelColor: "text-teal-400 dark:text-teal-500",    activeColor: "text-teal-600 dark:text-teal-400" },
  ];

  return (
    <div>
      {/* Segmented progress bar — 13 RUS (blue) + 7 Carpal (violet), no gap */}
      <div className="flex items-start gap-px px-4 pt-1.5 pb-0">
        {RUS_BONE_KEYS.map((key, i) => {
          const stageIdx = selections[key];
          const stageName = stageIdx !== undefined ? boneMap[key]?.stages[stageIdx] : undefined;
          return (
            <div key={key} className="flex-1 flex flex-col items-center">
              <div className={`w-full h-1.5 rounded-sm transition-transform duration-150 ${
                activeBoneIndices.has(i) ? "scale-y-[2]" : ""
              } ${
                stageIdx !== undefined ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-200 dark:bg-gray-700"
              }`} />
              <span className={`text-[16px] leading-none mt-2 font-bold tabular-nums ${stageName ? "text-blue-500 dark:text-blue-400" : "text-transparent"}`}>
                {stageName ?? "."}
              </span>
            </div>
          );
        })}
        {CARPAL_BONE_KEYS.map((key, i) => {
          const stageIdx = selections[key];
          const stageName = stageIdx !== undefined ? boneMap[key]?.stages[stageIdx] : undefined;
          return (
            <div key={key} className="flex-1 flex flex-col items-center">
              <div className={`w-full h-1.5 rounded-sm transition-transform duration-150 ${
                activeBoneIndices.has(i + RUS_BONE_KEYS.length) ? "scale-y-[2]" : ""
              } ${
                stageIdx !== undefined ? "bg-violet-500 dark:bg-violet-400" : "bg-gray-200 dark:bg-gray-700"
              }`} />
              <span className={`text-[16px] leading-none mt-2 font-bold tabular-nums ${stageName ? "text-violet-500 dark:text-violet-400" : "text-transparent"}`}>
                {stageName ?? "."}
              </span>
            </div>
          );
        })}
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-2 grid grid-cols-3 gap-2">
        {rows.map(({ label, score, age, hasAny, allDone, labelColor, activeColor }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className={`text-xs sm:text-sm font-medium ${labelColor}`}>{label}</span>
              <span className="text-xs sm:text-sm tabular-nums text-gray-400 dark:text-gray-500">{hasAny ? `${score}pt` : "—"}</span>
            </div>
            <span className={`text-2xl sm:text-4xl font-bold tabular-nums ${allDone ? activeColor : "text-gray-300 dark:text-gray-700"}`}>
              {allDone ? `${age}歳` : "——"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
