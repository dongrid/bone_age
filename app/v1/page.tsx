"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeBoneIndices, setActiveBoneIndices] = useState<Set<number>>(new Set());

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const programmaticallyScrolled = useRef<Set<number>>(new Set());

  useEffect(() => {
    const visible = new Set<number>();
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visible.add(i);
          else visible.delete(i);
          setActiveBoneIndices(new Set(visible));
        },
        { rootMargin: "-57px 0px -140px 0px", threshold: 0 }
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function handleBoneScroll(index: number) {
    if (programmaticallyScrolled.current.has(index)) {
      programmaticallyScrolled.current.delete(index);
      return;
    }
    const source = scrollRefs.current[index];
    if (!source) return;
    const maxScroll = source.scrollWidth - source.clientWidth;
    if (maxScroll <= 0) return;
    const pct = source.scrollLeft / maxScroll;
    scrollRefs.current.forEach((ref, i) => {
      if (i === index || !ref) return;
      programmaticallyScrolled.current.add(i);
      ref.scrollLeft = pct * (ref.scrollWidth - ref.clientWidth);
    });
  }

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
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                小児骨年齢
                <span className="ml-1 text-sm font-normal text-gray-400 dark:text-gray-500 hidden sm:inline">
                  TW2 法
                </span>
              </h1>
              <a
                href="/v2"
                className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                v1 → v2
              </a>
            </div>
            <SexSelector value={sex} onChange={setSex} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-14 sm:w-28 flex justify-end">
              {Object.keys(selections).length > 0 && (
                confirmReset ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelections({}); setConfirmReset(false); }}
                      className="px-1.5 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <span className="sm:hidden">✓</span>
                      <span className="hidden sm:inline">リセット</span>
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-1.5 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="sm:hidden">✕</span>
                      <span className="hidden sm:inline">戻る</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="px-2 sm:px-3 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span className="sm:hidden">↺</span>
                    <span className="hidden sm:inline">リセット</span>
                  </button>
                )
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Scrollable content — padded for header and bottom bar */}
      <div className="pt-[57px] pb-[140px] max-w-screen-xl mx-auto px-4 py-6">
        <div className="space-y-8 pt-6">
          {/* RUS bones */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 dark:text-blue-500 mb-3">
              RUS 骨（{RUS_BONES.length} 個）
            </h2>
            <div className="space-y-3">
              {RUS_BONES.map((bone, i) => (
                <div key={bone.key} ref={(el) => { cardRefs.current[i] = el; }}>
                  <BoneCard
                    bone={bone}
                    selectedStage={selections[bone.key]}
                    onSelect={(idx) => handleSelect(bone.key, idx)}
                    scrollRef={(el) => { scrollRefs.current[i] = el; }}
                    onScroll={() => handleBoneScroll(i)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Carpal bones */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-400 dark:text-violet-500 mb-3">
              手根骨（{CARPAL_BONES.length} 個）
            </h2>
            <div className="space-y-3">
              {CARPAL_BONES.map((bone, i) => (
                <div key={bone.key} ref={(el) => { cardRefs.current[RUS_BONES.length + i] = el; }}>
                  <BoneCard
                    bone={bone}
                    selectedStage={selections[bone.key]}
                    onSelect={(idx) => handleSelect(bone.key, idx)}
                    scrollRef={(el) => { scrollRefs.current[RUS_BONES.length + i] = el; }}
                    onScroll={() => handleBoneScroll(RUS_BONES.length + i)}
                    accent="violet"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom bar — fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
        <ResultsPanel scores={scores} ages={ages} selections={selections} activeBoneIndices={activeBoneIndices} />
        <div className="max-w-screen-xl mx-auto px-4 pb-1.5 text-[10px] text-gray-400 dark:text-gray-600">
          計算方法の引用元：
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
