"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

const SOFTWARE_LIST = [
  { name: "Paper", image: "/assets/software/paper.png" },
  { name: "Spigot", image: "/assets/software/spigot.png" },
  { name: "Forge", image: "/assets/software/forge.png" },
  { name: "Fabric", image: "/assets/software/fabric.png" },
  { name: "Purpur", image: "/assets/software/purpur.png" },
  { name: "Velocity", image: "/assets/software/velocity.png" },
  { name: "Bungeecord", image: "/assets/software/bungeecord.png" },
  { name: "Pufferfish", image: "/assets/software/pufferfish.png" },
  { name: "Mohist", image: "/assets/software/mohist.png" },
  { name: "Bedrock", image: "/assets/software/bedrock.png" },
  { name: "Vanilla", image: "/assets/software/vanilla.svg" },
];

function TiltCard({ software }: { software: typeof SOFTWARE_LIST[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17deg", "-17deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17deg", "17deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="group flex flex-col items-center justify-center gap-5 cursor-pointer" style={{ perspective: "1200px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.015] shadow-2xl transition-colors duration-500 group-hover:border-[#6aa8ff]/40 group-hover:bg-[#6aa8ff]/5"
      >
        {/* Dynamic ambient glow behind the card */}
        <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 bg-[#6aa8ff]/40 group-hover:opacity-100" />

        {/* 3D Floating Content */}
        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 pointer-events-none">
          {software.image && (
            <Image
              src={software.image}
              alt={software.name}
              width={44}
              height={44}
              className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] opacity-70 group-hover:opacity-100 transition duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(106,168,255,0.4)]"
            />
          )}
        </div>

        {/* Dynamic Glassmorphism Surface Reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100 rounded-2xl pointer-events-none" style={{ transform: "translateZ(1px)" }} />

        {/* Inner Border Highlight */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{ transform: "translateZ(1px)" }} />
      </motion.div>

      {/* Software Name */}
      <span className="text-[10px] font-black tracking-[0.2em] text-neutral-600 transition-colors duration-500 group-hover:text-white uppercase drop-shadow-md">
        {software.name}
      </span>
    </div>
  );
}

export default function SupportedSoftwareMarquee() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom infinite scrolling logic so we can PAUSE it completely on hover
  // which makes interacting with the 3D cards much easier.
  const x = useMotionValue(0);
  const velocity = 0.5; // speed of marquee

  useAnimationFrame((time, delta) => {
    if (isHovered) return; // Pause on hover

    let moveBy = velocity * (delta / 16);
    let newX = x.get() - moveBy;

    // Reset position for infinite loop (approximate halfway point since we duplicate array)
    // -50% of a container that holds 2 identical arrays is when it fully loops.
    // We measure this relative to a fixed pixel width roughly, but using Framer's animate is often simpler.
    // For extreme performance & perfect 3D fidelity though, we'll use a simpler layout hack:
  });

  return (
    <section className="relative w-full overflow-hidden border-y border-white/[0.05] bg-[#07070a] py-14">
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(106,168,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Top/Bottom Fade masks for depth */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#07070a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07070a] to-transparent z-10 pointer-events-none" />

      {/* Eyebrow Label with Glow */}
      <div className="flex justify-center w-full mb-10 relative z-20">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          Supported Server Software
        </h3>
      </div>

      {/* Marquee Container */}
      <div
        className="relative flex w-full overflow-hidden z-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left/Right Fade masks for a premium seamless look */}
        <div className="absolute left-0 top-0 z-30 h-full w-[15%] bg-gradient-to-r from-[#07070a] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-30 h-full w-[15%] bg-gradient-to-l from-[#07070a] to-transparent pointer-events-none" />

        {/* Scrolling Track */}
        <motion.div
          className="flex w-max items-center gap-14 sm:gap-20 pr-14 sm:pr-20 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            repeat: Infinity,
            // Drastically slow down on hover so user can play with 3D cards
            duration: isHovered ? 200 : 45,
          }}
        >
          {/* Render list twice to create infinite looping effect */}
          {[...SOFTWARE_LIST, ...SOFTWARE_LIST].map((software, idx) => (
            <TiltCard key={`${software.name}-${idx}`} software={software} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
