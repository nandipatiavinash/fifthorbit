"use client";

import { motion } from "framer-motion";

interface OrbitLogoProps {
  size?: "sm" | "lg";
}

export default function OrbitLogo({ size = "sm" }: OrbitLogoProps) {
  const isLarge = size === "lg";
  const sizePx = isLarge ? 320 : 40;

  // Orbit parameters
  const orbits = [
    { rX: isLarge ? 120 : 15, rY: isLarge ? 50 : 6, rotate: 15, duration: 12 },
    { rX: isLarge ? 140 : 17.5, rY: isLarge ? 60 : 7.5, rotate: -35, duration: 18 },
    { rX: isLarge ? 160 : 20, rY: isLarge ? 70 : 8.75, rotate: 75, duration: 24 },
  ];

  return (
    <div
      className={`relative flex items-center justify-center select-none`}
      style={{ width: sizePx, height: sizePx }}
    >
      <svg
        width={sizePx}
        height={sizePx}
        viewBox={`0 0 ${sizePx} ${sizePx}`}
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.6} />
            <stop offset="60%" stopColor="#2563EB" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isLarge ? "8" : "2"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle glow in the background for Hero */}
        {isLarge && (
          <circle
            cx={sizePx / 2}
            cy={sizePx / 2}
            r={100}
            fill="url(#coreGlow)"
            className="pointer-events-none"
          />
        )}

        {/* Orbit paths */}
        {orbits.map((orbit, index) => {
          const cx = sizePx / 2;
          const cy = sizePx / 2;

          return (
            <g key={index} transform={`rotate(${orbit.rotate} ${cx} ${cy})`}>
              {/* Ellipse path */}
              <ellipse
                cx={cx}
                cy={cy}
                rx={orbit.rX}
                ry={orbit.rY}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth={isLarge ? 1.5 : 1}
                strokeDasharray={isLarge ? "4 6" : "2 3"}
                className="opacity-70"
              />

              {/* Orbiting Node */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={isLarge ? 5 : 2}
                fill="#0A84FF"
                filter="url(#glow)"
                animate={{
                  // Approximate motion along an ellipse by animating the angle
                  cx: [
                    cx + orbit.rX,
                    cx,
                    cx - orbit.rX,
                    cx,
                    cx + orbit.rX,
                  ].map((val, i) => {
                    const angle = (i * Math.PI) / 2;
                    return cx + orbit.rX * Math.cos(angle);
                  }),
                  cy: [
                    cy,
                    cy + orbit.rY,
                    cy,
                    cy - orbit.rY,
                    cy,
                  ].map((val, i) => {
                    const angle = (i * Math.PI) / 2;
                    return cy + orbit.rY * Math.sin(angle);
                  }),
                }}
                transition={{
                  duration: orbit.duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </g>
          );
        })}

        {/* Central Core */}
        <motion.circle
          cx={sizePx / 2}
          cy={sizePx / 2}
          r={isLarge ? 24 : 6}
          fill="#0F172A"
          stroke="#0A84FF"
          strokeWidth={isLarge ? 3 : 1.5}
          animate={
            isLarge
              ? {
                  scale: [1, 1.05, 1],
                  strokeWidth: [3, 4, 3],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Intersecting technical crosshairs in the core for Hero */}
        {isLarge && (
          <g className="opacity-40">
            <line
              x1={sizePx / 2 - 32}
              y1={sizePx / 2}
              x2={sizePx / 2 + 32}
              y2={sizePx / 2}
              stroke="#0A84FF"
              strokeWidth={1}
            />
            <line
              x1={sizePx / 2}
              y1={sizePx / 2 - 32}
              x2={sizePx / 2}
              y2={sizePx / 2 + 32}
              stroke="#0A84FF"
              strokeWidth={1}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
