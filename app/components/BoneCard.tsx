"use client";

import { useRef, useState } from "react";
import type { BoneDefinition, Stage } from "@/lib/data/boneAge";
import { stageImagePath } from "@/lib/data/boneAge";

interface Props {
  bone: BoneDefinition;
  selectedStage: number | undefined;
  onSelect: (stageIndex: number) => void;
}

interface StageBtnProps {
  bone: BoneDefinition;
  stage: Stage;
  idx: number;
  active: boolean;
  onSelect: (idx: number) => void;
}

function StageButton({ bone, stage, idx, active, onSelect }: StageBtnProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [textWidth, setTextWidth] = useState(100);
  const imgSrc = stageImagePath(bone, stage);
  const criteria = bone.criteria[stage];

  return (
    <button
      onClick={() => onSelect(idx)}
      className={`flex flex-col items-center rounded-lg border-2 transition-colors shrink-0 p-1 ${
        active
          ? "border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900"
          : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
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
          const w = imgRef.current?.offsetWidth ?? 100;
          setTextWidth(Math.max(100, w));
        }}
      />

      <span
        className={`mt-1 text-sm font-bold ${
          active
            ? "text-blue-700 dark:text-blue-300"
            : "text-gray-500 dark:text-gray-400"
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

export default function BoneCard({ bone, selectedStage, onSelect }: Props) {
  const isSelected = selectedStage !== undefined;

  return (
    <div
      className={`rounded-xl border-2 p-3 transition-colors ${
        isSelected
          ? "border-blue-500 dark:border-blue-400"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
        {bone.nameJa}
        <span className="ml-1 text-sm font-normal text-gray-400 dark:text-gray-500">
          {bone.nameEn}
        </span>
      </div>

      <div className="flex gap-0.5 overflow-x-auto">
        {bone.stages.map((stage: Stage, idx: number) => (
          <StageButton
            key={stage}
            bone={bone}
            stage={stage}
            idx={idx}
            active={selectedStage === idx}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
