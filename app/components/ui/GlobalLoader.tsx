"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";

export default function GlobalLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black"
      style={{ zIndex: 999999 }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Floating Logo */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-32 h-32 mb-6"
        >
          <Image
            src="/assets/branding/hostlixo-logo.png"
            alt="Hostlixo Logo"
            fill
            sizes="128px"
            className="object-contain drop-shadow-[0_0_25px_rgba(47,124,248,0.4)]"
            priority
          />
        </motion.div>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white text-xl font-bold tracking-[0.3em] uppercase mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          Hostlixo Cloud
        </motion.div>

        {/* Loading Bar Container */}
        <div className="relative w-64 h-1.5 bg-gray-800/50 rounded-full overflow-hidden border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)_inset]">
          {/* Animated Gradient Progress */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-transparent via-[#2f7cf8] to-[#975af4]"
          />
          {/* Glowing Head */}
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="absolute top-0 h-full w-4 -ml-4 bg-white rounded-full blur-[2px] shadow-[0_0_10px_#fff,0_0_20px_#975af4]"
          />
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
