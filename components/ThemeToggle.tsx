"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const cl = document.documentElement.classList;
    cl.toggle("dark",  next);
    cl.toggle("light", !next);
    localStorage.setItem("bx-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Kun rejimi" : "Tun rejimi"}
      className="theme-toggle"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
