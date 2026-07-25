'use client'

import { motion } from "framer-motion";
import { Shield, Lock, Check, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import legalConfig from "../config/sections/legal.json";
import type { LegalSection } from "../types/legal";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />
      
      <div className="relative overflow-hidden">
        {/* Background Image and Gradients */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/vps/vps-hero-2.webp')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/40 to-transparent dark:from-[#0a0b0f] dark:via-[#0a0b0f]/60 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/40 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/95 dark:to-[#0a0b0f]/60" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center gap-2 bg-gray-800 dark:bg-white/20 px-6 py-3 rounded-full mb-6 border border-white/20 dark:border-white/20">
                <Shield className="w-5 h-5 text-gray-300 dark:text-gray-300" />
                <span className="text-gray-300 dark:text-gray-300 text-sm font-medium">Privacy Policy</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
                Your Privacy is Our <span className="text-gray-300 dark:text-gray-300">Priority</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                We are committed to protecting your personal information and being transparent about how we use it.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {legalConfig.privacyPolicy.lastUpdated}
              </p>
            </motion.div>

            {/* Key Points Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
            >
              {[
                {
                  icon: Lock,
                  title: "Data Security",
                  description: "Your data is encrypted and stored securely on our protected servers."
                },
                {
                  icon: Shield,
                  title: "No Data Selling",
                  description: "We never sell your personal information to third parties."
                },
                {
                  icon: Check,
                  title: "Your Control",
                  description: "Access, update, or delete your data at any time."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-900/20 backdrop-blur-xl rounded-md p-6 border border-white/20 hover:border-white/20 dark:border-white/20 dark:hover:border-white/20 hover:bg-white/50 dark:hover:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(156,163,175,.14)_0%,_transparent_100%)] transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gray-800 dark:bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/20 dark:border-white/20">
                    <item.icon className="w-6 h-6 text-gray-300 dark:text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 hover:border-white/20 dark:border-white/20 rounded-md overflow-hidden dark:hover:border-white/20 hover:bg-white/50 dark:hover:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(156,163,175,.14)_0%,_transparent_100%)] transition-all duration-300"
            >
              {legalConfig.privacyPolicy.sections.map((section: LegalSection, index: number) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 border-b border-gray-200 dark:border-white/20 last:border-0"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About Our Privacy Policy?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're here to help! Contact our privacy team at:
              </p>
              <a
                href={`mailto:${legalConfig.privacyPolicy.contactEmail}`}
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-800 dark:bg-white/20 text-white dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-300 border border-white/20 dark:border-white/20 hover:border-white/20 dark:hover:border-white/20"
              >
                Contact Privacy Team
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
