"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Monitor, Download } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// ===== EASILY MODIFIABLE CONFIGURATION =====

// Header Content Configuration
const HEADER_CONFIG = {
  badge: {
    icon: Monitor,
    text: "Operating Systems"
  },
  title: "Choose your OS",
  description: "Choose an available Linux distribution or Windows image during deployment. Image availability can vary by plan and region."
};

// OS Configuration - Easy to modify
const OPERATING_SYSTEMS = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    logo: "/assets/os/ubuntu.png",
  },
  {
    id: "windows",
    name: "Windows",
    logo: "/assets/os/windows.png",
  },
  {
    id: "fedora",
    name: "Fedora",
    logo: "/assets/os/fedora.png",
  },
  {
    id: "debian",
    name: "Debian",
    logo: "/assets/os/debian.png",
  },
  {
    id: "kali",
    name: "Kali Linux",
    logo: "/assets/os/kali.png",
  },
  {
    id: "custom",
    name: "Custom ISO",
    logo: "/assets/os/download.png",
  }
];

export default function OSSelectionSection() {
  const [selectedOS, setSelectedOS] = useState("ubuntu");

  return (
    <div className="bg-gray-50 dark:bg-[#0a0b0f] relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-end items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gray-800 dark:bg-white/20 px-4 py-2 rounded-full mb-6">
            <Monitor className="w-4 h-4 text-gray-300 dark:text-gray-300" />
            <span className="text-gray-300 dark:text-gray-300 text-sm">{HEADER_CONFIG.badge.text}</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
            {HEADER_CONFIG.title.split(' ').slice(0, -1).join(' ')} <span className="text-gray-300 dark:text-gray-300">
              {HEADER_CONFIG.title.split(' ').slice(-1)[0]}
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            {HEADER_CONFIG.description}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            {OPERATING_SYSTEMS.map((os, index) => (
              <motion.div
                key={os.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => setSelectedOS(os.id)}
                  className={`group cursor-pointer p-6 rounded-md border transition duration-300 ${
                    selectedOS === os.id
                      ? "border-white/20 dark:border-white/20 bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(156,163,175,.14)_0%,_transparent_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(156,163,175,.14)_0%,_transparent_100%)]"
                      : "border-transparent hover:border-white/20 dark:hover:border-white/20 hover:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(156,163,175,.14)_0%,_transparent_100%)] dark:hover:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(156,163,175,.14)_0%,_transparent_100%)]"
                  }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {os.id === "custom" ? (
                      <Download className="w-12 h-12 text-gray-300 dark:text-gray-300" />
                    ) : (
                      <Image
                        src={os.logo}
                        alt={`${os.name} logo`}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mt-4">
                    {os.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
