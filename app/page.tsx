"use client";

import { useMemo, useState } from "react";
import {
  BONE_DEFINITIONS,
  RUS_BONE_KEYS,
  CARPAL_BONE_KEYS,
  calcScores,
  calcAges,
  type Sex,
  type StageSelections,
} from "@/lib/data/boneAge";
import BoneCard from "./components/BoneCard";
import ResultsPanel from "./components/ResultsPanel";
import SexSelector from "./components/SexSelector";
import ThemeToggle from "./components/ThemeToggle";

const RUS_BONES = BONE_DEFINITIONS.filter((b) =>
  (RUS_BONE_KEYS as readonly string[]).includes(b.key)
);
const CARPAL_BONES = BONE_DEFINITIONS.filter((b) =>
  (CARPAL_BONE_KEYS as readonly string[]).includes(b.key)
);

export default function Page() {
  const [sex, setSex] = useState<Sex>("boy");
  const [selections, setSelections] = useState<StageSelections>({});

  const scores = useMemo(() => calcScores(sex, selections), [sex, selections]);
  const ages = useMemo(() => calcAges(sex, scores), [sex, scores]);

  function handleSelect(boneKey: string, stageIndex: number) {
    setSelections((prev) => {
      if (prev[boneKey] === stageIndex) {
        const next = { ...prev };
        delete next[boneKey];
        return next;
      }
      return { ...prev, [boneKey]: stageIndex };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header — fixed */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              小児骨年齢
              <span className="ml-1.5 text-sm font-normal text-gray-400 dark:text-gray-500">
                TW2 法
              </span>
            </h1>
            <SexSelector value={sex} onChange={setSex} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Scrollable content — padded for header and bottom bar */}
      <div className="pt-[57px] pb-[72px] max-w-screen-xl mx-auto px-4 py-6">
        <div className="space-y-8 pt-6">
          {/* RUS bones */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              RUS 骨（{RUS_BONES.length} 個）
            </h2>
            <div className="space-y-3">
              {RUS_BONES.map((bone) => (
                <BoneCard
                  key={bone.key}
                  bone={bone}
                  selectedStage={selections[bone.key]}
                  onSelect={(idx) => handleSelect(bone.key, idx)}
                />
              ))}
            </div>
          </section>

          {/* Carpal bones */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              手根骨（{CARPAL_BONES.length} 個）
            </h2>
            <div className="space-y-3">
              {CARPAL_BONES.map((bone) => (
                <BoneCard
                  key={bone.key}
                  bone={bone}
                  selectedStage={selections[bone.key]}
                  onSelect={(idx) => handleSelect(bone.key, idx)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom bar — fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
        <ResultsPanel scores={scores} ages={ages} selections={selections} />
        <div className="max-w-screen-xl mx-auto px-4 pb-1.5 text-[10px] text-gray-400 dark:text-gray-600">
          計算式・判定基準の引用元：
          <a href="https://www.medicalmac.com/bone.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-400 mx-1">骨年齢（男児）</a>
          /
          <a href="https://www.medicalmac.com/boneg.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-400 mx-1">骨年齢（女児）</a>
          <br className="sm:hidden" />
          <span className="whitespace-nowrap">— medical macintosh (Y. Yamamoto M.D.)</span>
        </div>
      </div>
    </div>
  );
}
