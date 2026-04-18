"use client";

import type { Sex } from "@/lib/data/boneAge";

interface Props {
  value: Sex;
  onChange: (sex: Sex) => void;
}

export default function SexSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {(["boy", "girl"] as Sex[]).map((sex) => (
        <button
          key={sex}
          onClick={() => onChange(sex)}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
            value === sex
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {sex === "boy" ? "男児" : "女児"}
        </button>
      ))}
    </div>
  );
}
