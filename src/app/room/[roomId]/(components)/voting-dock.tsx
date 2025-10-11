"use client";

import React, { useState } from "react";
import {
  Home,
  Search,
  Mail,
  Settings,
  User,
  Heart,
  Star,
  Camera,
} from "lucide-react";

interface DockItem {
  id: string;
  label: React.ReactNode;
  onClick?: () => void;
}

const dockItems: DockItem[] = [
  { id: "1", label: 1 },
  { id: "3", label: 3 },
  { id: "5", label: 5 },
  { id: "8", label: 8 },
  { id: "13", label: 13 },
  { id: "21", label: 21 },
  { id: "34", label: 34 },
  { id: "55", label: 55 },
  { id: "89", label: 89 },
  { id: "coffee", label: "☕" },
];

interface DockItemProps {
  item: DockItem;
}

const DockItemComponent: React.FC<DockItemProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative flex items-center justify-center
          w-16 h-22 rounded-xl
          bg-white/5 backdrop-blur-[2px]
          border border-white/10
          transition-all duration-300 ease-out
          cursor-pointer
          shadow-none
          active:scale-105
          active:translate-y-0.1
          ${
            isHovered
              ? "scale-110 bg-white/10 border-white/20 -translate-y-1 shadow-lg shadow-white/10"
              : "hover:scale-105 hover:bg-white/7 hover:-translate-y-0.5"
          }
        `}
        onClick={item.onClick}
        style={{
          boxShadow: isHovered
            ? "0 4px 24px 0 rgba(255,255,255,0.08)"
            : undefined,
        }}
      >
        <div
          className={`
          text-white transition-all duration-300
          ${
            isHovered
              ? "scale-105 drop-shadow-[0_1px_4px_rgba(255,255,255,0.10)]"
              : ""
          }
        `}
        >
          {item.label}
        </div>
      </div>
    </div>
  );
};

export function VotingDock() {
  return (
    <div className="relative pointer-events-auto">
      <div
        className={`
          flex items-end gap-3 p-3
          rounded-2xl
          bg-black/40 backdrop-blur-xl
          border border-white/10
          shadow-2xl
          transition-all duration-500 ease-out
        `}
      >
        {dockItems.map((item) => (
          <DockItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
