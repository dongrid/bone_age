"use client";

import { useRef, useState } from "react";
import type { BoneDefinition, Stage } from "@/lib/data/boneAge";
import { stageImagePath } from "@/lib/data/boneAge";

interface Props {
  bone: BoneDefinition;
  selectedStage: number | undefined;
  onSelect: (stageIndex: number) => void;
  scrollRef?: (el: HTMLDivElement | null) => void;
  onScroll?: () => void;
  onScrollStart?: () => void;
  accent?: "blue" | "violet";
}

interface StageBtnProps {
  bone: BoneDefinition;
  stage: Stage;
  idx: number;
  active: boolean;
  onSelect: (idx: number) => void;
  accent: "blue" | "violet";
}

function StageButton({ bone, stage, idx, active, onSelect, accent }: StageBtnProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [textWidth, setTextWidth] = useState(100);
  const imgSrc = stageImagePath(bone, stage);
  const criteria = bone.criteria[stage];

  const activeBtn = accent === "violet"
    ? "border-violet-500 bg-violet-100 dark:border-violet-400 dark:bg-violet-900"
    : "border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900";
  const activeLabel = accent === "violet"
    ? "text-violet-700 dark:text-violet-300"
    : "text-blue-700 dark:text-blue-300";

  return (
    <button
      onClick={() => onSelect(idx)}
      className={`flex flex-col items-center rounded-lg border-2 transition-colors shrink-0 px-0.5 py-1 ${
        active ? activeBtn : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={`${bone.nameEn} stage ${stage}`}
        className="h-32 w-auto"
        loading="lazy"
        onLoad={() => {
          const img = imgRef.current;
          if (!img || !img.naturalHeight) return;
          setTextWidth(Math.max(100, Math.round(img.naturalWidth * 128 / img.naturalHeight)));
        }}
      />

      <span
        className={`mt-1 text-sm font-bold ${
          active ? activeLabel : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {stage}
      </span>

      <span
        className="mt-0.5 text-xs leading-tight text-gray-500 dark:text-gray-400 text-center"
        style={{ width: textWidth, whiteSpace: "pre-line" }}
      >
        {criteria ? criteria.replace(/ \/ /g, "\n") : "\u00A0"}
      </span>
    </button>
  );
}

export default function BoneCard({ bone, selectedStage, onSelect, scrollRef, onScroll, onScrollStart, accent = "blue" }: Props) {
  const isSelected = selectedStage !== undefined;
  const borderActive = accent === "violet"
    ? "border-violet-500 dark:border-violet-400"
    : "border-blue-500 dark:border-blue-400";

  return (
    <div
      className={`rounded-xl border-2 p-3 transition-colors ${
        isSelected ? borderActive : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-base font-semibold text-gray-700 dark:text-gray-200">
          {bone.nameJa}
        </span>
        <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
          {bone.nameEn}
        </span>
      </div>

      <div ref={scrollRef} onScroll={onScroll} onPointerDown={onScrollStart} className="flex gap-px overflow-x-auto">
        {bone.stages.map((stage: Stage, idx: number) => (
          <StageButton
            key={stage}
            bone={bone}
            stage={stage}
            idx={idx}
            active={selectedStage === idx}
            onSelect={onSelect}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}
