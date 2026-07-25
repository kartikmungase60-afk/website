'use client';

import { useState, useEffect } from "react";
import Lenis from "lenis";
import uiConfig from "../config/sections/ui.json";
import type { UIConfig } from "../types/ui";
import AOS from "aos";
import "aos/dist/aos.css";

const config = uiConfig as UIConfig;

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-white/20 dark:border-white/20 rounded-full animate-spin border-t-gray-300 dark:border-t-gray-300"></div>
          <div className="absolute inset-2 w-8 h-8 border-2 border-white/20 dark:border-white/20 rounded-full animate-spin border-t-gray-400 dark:border-t-gray-400 animate-reverse"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg text-gray-900 dark:text-white orbitron-font">
            Nova
          </span>
        </div>
      </div>
    </div>
  );
}

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(config.loading.enableLoadingScreen);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (config.loading.enableLoadingScreen) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, config.loading.loadingDuration);
    }

    // Initialize Lenis for buttery smooth inertia scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initialize AOS for smooth scroll reveals
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 50,
    });

    // Sync AOS recalculations with Lenis smooth scroll frame updates
    lenis.on('scroll', () => {
      AOS.refresh();
    });

    // Refresh AOS position calculations after initial layout renders
    const refreshTimer = setTimeout(() => {
      AOS.refresh();
    }, 400);

    return () => {
      if (timer) clearTimeout(timer);
      clearTimeout(refreshTimer);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {isLoading && config.loading.enableLoadingScreen && <LoadingScreen />}
      <div className={`transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}

