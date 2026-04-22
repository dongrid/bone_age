"use client";

import type { ScoreResult, AgeResult, StageSelections } from "@/lib/data/boneAge";
import { RUS_BONE_KEYS, BONE_DEFINITIONS, calcMonthlyRusAge } from "@/lib/data/boneAge";

const boneMap = Object.fromEntries(BONE_DEFINITIONS.map((b) => [b.key, b]));

interface Props {
  scores: ScoreResult;
  ages: AgeResult;
  selections: StageSelections;
  activeBoneIndices: Set<number>;
  sex: "boy" | "girl";
}

export default function ResultsPanel({ scores, ages, selections, activeBoneIndices, sex }: Props) {
  const hasAny = RUS_BONE_KEYS.some((k) => selections[k] !== undefined);
  const allDone = RUS_BONE_KEYS.every((k) => selections[k] !== undefined);
  const monthlyAge = allDone ? calcMonthlyRusAge(sex, scores.rusScore) : null;

  return (
    <div>
      {/* Progress bar — 13 RUS segments */}
      <div className="flex items-start gap-px px-4 pt-1.5 pb-0">
        {RUS_BONE_KEYS.map((key, i) => {
          const stageIdx = selections[key];
          const stageName = stageIdx !== undefined ? boneMap[key]?.stages[stageIdx] : undefined;
          return (
            <div key={key} className="flex-1 flex flex-col items-center">
              <div className={`w-full h-1.5 rounded-sm transition-transform duration-150 ${
                activeBoneIndices.has(i) ? "scale-y-[2]" : ""
              } ${
                stageIdx !== undefined ? "bg-blue-500 dark:bg-blue-400" : "bg-blue-200 dark:bg-blue-900"
              }`} />
              <span className={`text-[16px] leading-none mt-2 font-bold tabular-nums ${stageName ? "text-blue-500 dark:text-blue-400" : "text-transparent"}`}>
                {stageName ?? "."}
              </span>
            </div>
          );
        })}
      </div>

      {/* Score + age */}
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-blue-400 dark:text-blue-500">RUS スコア</span>
          <span className="text-2xl sm:text-3xl font-bold tabular-nums text-gray-700 dark:text-gray-300">
            {hasAny ? `${scores.rusScore}` : "—"}
            {hasAny && <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-0.5">pt</span>}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">0.1年おき</span>
            <span className={`text-2xl sm:text-4xl font-bold tabular-nums ${allDone ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-gray-700"}`}>
              {allDone ? `${ages.rusAge}歳` : "——"}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">1ヶ月おき</span>
            <span className={`text-2xl sm:text-4xl font-bold tabular-nums ${allDone ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-gray-700"}`}>
              {monthlyAge ?? "——"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
