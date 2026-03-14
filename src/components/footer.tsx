'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook, faTelegram, faGithub, faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons'
import { Shield } from 'lucide-react'

// Utility to detect if we're in a MiniApp environment
function isInMiniApp(): boolean {
  if (typeof window === 'undefined') return false
  return window.self !== window.top || !!window.ReactNativeWebView
}

const Footer = () => {
    const [isMiniApp, setIsMiniApp] = useState(false)

    useEffect(() => {
        setIsMiniApp(isInMiniApp())
    }, [])

    // Hide footer in mini app
    if (isMiniApp) {
        return null
    }

    return (
        <footer className="text-white" style={{ backgroundColor: '#141414' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Left Side - Branding */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-6 h-6 text-[#2BA3FF]" />
                            <p className="text-xl sm:text-2xl font-semibold">LiquiFi</p>
                        </div>
                        <p className="text-sm sm:text-base text-[#AAAAAA] mb-4 sm:mb-6 max-w-sm">
                            Verified savings. Earn yield while preserving your privacy.
                        </p>
                        <div className="flex items-center gap-4">
                            <a aria-label="Twitter" href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
                            </a>
                            <a aria-label="Facebook" href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                                <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
                            </a>
                            <a aria-label="Telegram" href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                                <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                            </a>
                            <a aria-label="GitHub" href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                            </a>
                        </div>
                        </div>
                     
                    {/* Right Side - Navigation and App Downloads */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                     <div>
                            <ul className="flex flex-wrap gap-4 sm:gap-6 text-white/90 text-sm sm:text-base">
                            <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                        </ul>
                        </div>
                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            <a href="#" aria-label="Download on the App Store" className="group inline-flex items-center gap-2 sm:gap-3 rounded-lg bg-white px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-xs sm:text-sm">
                                <FontAwesomeIcon icon={faApple} className="text-black w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="leading-tight">
                                    <span className="block text-[9px] sm:text-[10px] text-black/80">DOWNLOAD ON THE</span>
                                    <span className="block text-xs sm:text-sm font-medium text-black">App Store</span>
                                </span>
                            </a>
                            <a href="#" aria-label="Get it on Google Play" className="group inline-flex items-center gap-2 sm:gap-3 rounded-lg bg-white px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-xs sm:text-sm">
                                <FontAwesomeIcon icon={faGooglePlay} className="text-black w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="leading-tight">
                                    <span className="block text-[9px] sm:text-[10px] text-black/80">GET IT ON</span>
                                    <span className="block text-xs sm:text-sm font-medium text-black">Google Play</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 sm:mt-10 border-t border-white/10 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-[#AAAAAA] text-sm md:text-base">
                        © 2025 LiquiFi.
                    </p>
                    <div className="flex items-center gap-6 text-[#AAAAAA] text-sm md:text-base">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <span className="h-4 w-px bg-white/10" />
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer