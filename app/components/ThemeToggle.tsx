"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="ダークモード切り替え"
      className="rounded-full p-2 text-xl leading-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
