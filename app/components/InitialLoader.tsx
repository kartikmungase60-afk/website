"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import GlobalLoader from "./ui/GlobalLoader";

export default function InitialLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Handle route change completion (and initial load)
  useEffect(() => {
    // Show the splash screen for exactly 3 seconds
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle intercepting clicks on links to show loader BEFORE navigating
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Find the closest anchor tag that was clicked
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      
      const href = target.getAttribute("href");
      // If it's an internal link, not a new tab
      if (href && href.startsWith("/") && !href.startsWith("//") && target.target !== "_blank") {
        if (pathname === href) return; // Ignore if clicking current page
        
        e.preventDefault();
        
        // Show loader immediately
        setIsLoading(true);
        
        // Wait a small amount of time for the loader to fade in, then actually navigate
        setTimeout(() => {
          router.push(href);
        }, 400); // 400ms allows the framer-motion opacity transition to start covering the screen
      }
    };

    // Use capture phase to intercept before React router can
    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [pathname, router]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <GlobalLoader key="initial-loader" />}
      </AnimatePresence>
      {/* 
        We still render children immediately so the page is ready and SEO is unaffected,
        but the GlobalLoader acts as a full-screen overlay covering it until ready.
      */}
      {children}
    </>
  );
}
