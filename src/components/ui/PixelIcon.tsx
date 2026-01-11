"use client";

import { memo } from "react";

// Built-in icon names - users can reference these in their curriculum
// For custom icons, use one of these as a starting point or contribute new ones
export type IconName = string;

interface PixelIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Pixel art paths - 16x16 grid scaled up
// Color palette uses neon arcade theme
const iconPaths: Record<string, { path: string; color: string }> = {
  // Learning & Education
  "ai-foundations": {
    path: "M4 3h8v2h-8zM3 5h1v1h-1zM12 5h1v1h-1zM2 6h1v4h-1zM13 6h1v4h-1zM3 10h1v1h-1zM12 10h1v1h-1zM4 11h8v2h-8zM6 5h1v2h-1zM9 5h1v2h-1zM5 8h6v1h-6zM7 6h2v2h-2z",
    color: "#00FF9F", // neon green - brain/neural
  },
  "full-stack": {
    path: "M2 2h12v3h-12zM2 6h12v4h-12zM2 11h12v3h-12zM4 3h2v1h-2zM4 7h8v2h-8zM4 12h4v1h-4z",
    color: "#FF6B9D", // neon pink - stack layers
  },
  "machine-learning": {
    path: "M7 2h2v2h-2zM5 4h6v1h-6zM4 5h8v2h-8zM3 7h10v2h-10zM2 9h12v2h-12zM4 11h3v2h-3zM9 11h3v2h-3z",
    color: "#FFD93D", // neon yellow - chart/data
  },
  "generative-ai": {
    path: "M7 1h2v1h-2zM6 2h4v1h-4zM5 3h6v2h-6zM4 5h8v3h-8zM3 8h10v2h-10zM5 10h2v2h-2zM9 10h2v2h-2zM6 12h1v2h-1zM9 12h1v2h-1zM7 2h2v4h-2z",
    color: "#00D4FF", // neon cyan - sparkles/magic
  },
  "deep-learning": {
    path: "M7 1h2v2h-2zM4 4h2v2h-2zM7 4h2v2h-2zM10 4h2v2h-2zM3 7h2v2h-2zM7 7h2v2h-2zM11 7h2v2h-2zM5 10h2v2h-2zM9 10h2v2h-2zM7 13h2v2h-2zM6 3h1v2h-1zM9 3h1v2h-1zM4 6h1v2h-1zM11 6h1v2h-1zM6 9h1v2h-1zM9 9h1v2h-1z",
    color: "#A855F7", // purple - deep network
  },
  "transformers-llms": {
    path: "M3 2h10v2h-10zM5 4h6v1h-6zM7 5h2v2h-2zM4 7h8v2h-8zM6 9h4v1h-4zM5 10h6v2h-6zM3 12h10v2h-10z",
    color: "#F97316", // orange - transformer architecture
  },
  "fine-tuning": {
    path: "M7 1h2v3h-2zM6 4h4v2h-4zM7 6h2v2h-2zM3 8h10v2h-10zM5 10h6v2h-6zM4 3h1v2h-1zM11 3h1v2h-1zM2 6h2v2h-2zM12 6h2v2h-2z",
    color: "#EF4444", // red - target/bullseye
  },
  "rag-embeddings": {
    path: "M2 3h5v5h-5zM9 3h5v5h-5zM5 9h6v1h-6zM4 10h8v2h-8zM3 12h10v2h-10zM3 4h3v3h-3zM10 4h3v3h-3z",
    color: "#22D3EE", // cyan - search/magnify
  },

  // DevOps & Infrastructure
  "containers-docker": {
    path: "M1 6h3v3h-3zM4 6h3v3h-3zM7 6h3v3h-3zM10 6h3v3h-3zM4 3h3v3h-3zM7 3h3v3h-3zM7 9h3v3h-3zM13 7h2v2h-2z",
    color: "#0EA5E9", // docker blue - container boxes
  },
  kubernetes: {
    path: "M7 1h2v2h-2zM6 3h4v2h-4zM5 5h6v2h-6zM4 7h8v2h-8zM3 9h4v2h-4zM9 9h4v2h-4zM2 11h4v2h-4zM10 11h4v2h-4zM7 5h2v6h-2z",
    color: "#3B82F6", // k8s blue - helm wheel
  },
  "cloud-platforms": {
    path: "M4 4h8v2h-8zM3 6h10v3h-10zM2 9h12v2h-12zM4 11h3v2h-3zM9 11h3v2h-3zM5 5h2v2h-2zM9 5h2v2h-2z",
    color: "#8B5CF6", // violet - cloud shape
  },
  "cicd-automation": {
    path: "M7 1h2v2h-2zM11 3h2v2h-2zM12 7h2v2h-2zM11 11h2v2h-2zM7 13h2v2h-2zM3 11h2v2h-2zM2 7h2v2h-2zM3 3h2v2h-2zM5 5h6v6h-6z",
    color: "#FBBF24", // amber - circular arrows
  },
  databases: {
    path: "M3 2h10v3h-10zM3 6h10v4h-10zM3 11h10v3h-10zM5 3h6v1h-6zM5 7h6v2h-6zM5 12h3v1h-3z",
    color: "#10B981", // emerald - stacked disks
  },
  scalability: {
    path: "M2 13h2v-3h-2zM5 13h2v-5h-2zM8 13h2v-7h-2zM11 13h2v-10h-2zM1 14h14v1h-14z",
    color: "#14B8A6", // teal - growth chart
  },
  "apis-microservices": {
    path: "M2 4h4v4h-4zM10 4h4v4h-4zM2 10h4v4h-4zM10 10h4v4h-4zM6 5h4v2h-4zM6 11h4v2h-4zM7 4h2v3h-2zM7 10h2v3h-2z",
    color: "#6366F1", // indigo - connected boxes
  },
  "security-auth": {
    path: "M7 1h2v2h-2zM5 3h6v1h-6zM4 4h8v3h-8zM3 7h10v5h-10zM4 12h8v2h-8zM7 8h2v3h-2z",
    color: "#F43F5E", // rose - lock shape
  },
  "code-practice": {
    path: "M4 3l-3 4l3 4l1 -1l-2 -3l2 -3zM12 3l3 4l-3 4l-1 -1l2 -3l-2 -3zM6 13l4 -10l1 0l-4 10z",
    color: "#84CC16", // lime - code brackets
  },

  // UI Controls
  "sound-on": {
    path: "M3 5h2v6h-2zM5 4h2v8h-2zM9 4h1v1h-1zM11 3h1v1h-1zM13 2h1v1h-1zM9 6h2v4h-2zM11 5h2v6h-2zM13 4h1v8h-1z",
    color: "#00FF9F",
  },
  "sound-off": {
    path: "M3 5h2v6h-2zM5 4h2v8h-2zM9 5h1v1h-1zM11 6h1v1h-1zM13 7h1v2h-1zM11 9h1v1h-1zM9 10h1v1h-1z",
    color: "#6B7280",
  },
  trophy: {
    path: "M4 2h8v2h-8zM3 4h10v4h-10zM4 8h8v1h-8zM5 9h6v1h-6zM6 10h4v2h-4zM4 12h8v2h-8z",
    color: "#FFD93D",
  },
  "xp-star": {
    path: "M7 1h2v3h-2zM4 4h8v2h-8zM2 6h12v2h-12zM4 8h3v2h-3zM9 8h3v2h-3zM3 10h2v2h-2zM11 10h2v2h-2zM2 12h2v2h-2zM12 12h2v2h-2z",
    color: "#00FF9F",
  },
  streak: {
    path: "M8 1h2v2h-2zM7 3h3v2h-3zM6 5h4v2h-4zM5 7h5v2h-5zM4 9h6v2h-6zM5 11h4v3h-4z",
    color: "#FF6B9D",
  },
  home: {
    path: "M7 1h2v2h-2zM5 3h6v2h-6zM3 5h10v2h-10zM2 7h12v2h-12zM3 9h4v5h-4zM9 9h4v5h-4zM6 11h4v3h-4z",
    color: "#00D4FF",
  },
  play: {
    path: "M4 2h2v2h-2zM4 4h4v2h-4zM4 6h6v2h-6zM4 8h8v2h-8zM4 10h6v2h-6zM4 12h4v2h-4z",
    color: "#00FF9F",
  },
  back: {
    path: "M8 2h2v2h-2zM6 4h4v2h-4zM4 6h6v2h-6zM2 8h12v2h-12zM4 10h6v2h-6zM6 12h4v2h-4zM8 14h2v2h-2z",
    color: "#6B7280",
  },

  // Default fallback icon (question mark)
  default: {
    path: "M5 3h6v1h-6zM4 4h2v1h-2zM10 4h2v1h-2zM10 5h2v2h-2zM8 7h2v2h-2zM7 9h2v1h-2zM7 11h2v2h-2z",
    color: "#6B7280", // gray - question mark
  },
};

function PixelIconComponent({ name, size = 32, className = "" }: PixelIconProps) {
  // Look up the icon, fall back to default if not found
  const icon = iconPaths[name] || iconPaths["default"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={icon.color}
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <path d={icon.path} />
    </svg>
  );
}

export const PixelIcon = memo(PixelIconComponent);
