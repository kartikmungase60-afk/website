"use client"

import { FaDiscord } from "react-icons/fa6";

export default function DiscordBanner() {
    return (
        <div className=" py-18 px-4 sm:px-6 lg:px-8 relative">
            <div
                data-aos="fade-up"
                className="relative z-10 max-w-7xl mx-auto"
            >
                <div className="relative bg-[#5865F2] dark:bg-[#5865F2] overflow-hidden rounded-md border border-gray-600/20 dark:border-gray-400/10 p-8 md:p-12">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4">
                            <FaDiscord className="w-16 h-16 text-gray-900 dark:text-white" />
                        </div>
                        <div className="absolute top-8 right-8">
                            <FaDiscord className="w-12 h-12 text-gray-900 dark:text-white" />
                        </div>
                        <div className="absolute bottom-4 left-1/4">
                            <FaDiscord className="w-8 h-8 text-gray-900 dark:text-white" />
                        </div>
                        <div className="absolute bottom-8 right-1/4">
                            <FaDiscord className="w-10 h-10 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Left side - Text content */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <a
                                    href="https://discord.gg/97CrJNkJ2T"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center md:justify-start gap-3 "
                                >
                                    <h2 className="text-3xl md:text-4xl font-bold text-white orbitron-font">
                                        Join Hostlixo Cloud <span className="text-gray-300">on Discord</span>
                                    </h2>
                                </a>

                            </div>
                            <p className="text-xl text-white mb-2">
                                Meet Indian gamers, developers and server owners
                            </p>
                            <p className=" text-white">
                                Follow service announcements, exchange setup advice and connect with the community.
                            </p>

                        </div>

                        {/* Right side - Join button */}
                        <div className="flex-shrink-0">
                            <a
                                href="https://discord.gg/97CrJNkJ2T"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block transition duration-300 hover:scale-105 transform-gpu"
                            >
                                <img
                                    src="/joinus.png"
                                    alt="Join the Hostlixo Cloud Discord community"
                                    className="w-auto h-12 md:h-16 "
                                />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
