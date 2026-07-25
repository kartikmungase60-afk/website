"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface AdminLoginFormProps {
  login: (e: React.FormEvent<HTMLFormElement>) => void;
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  loginToken: string;
  setLoginToken: (value: string) => void;
  requires2FA: boolean;
  status: string | null;
  loading: boolean;
}

export default function AdminLoginForm({
  login,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginToken,
  setLoginToken,
  requires2FA,
  status,
  loading,
}: AdminLoginFormProps) {
  const [isLit, setIsLit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  
  const pullStringRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const maxPull = 50;
  const baseCordLength = 90;

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/assets/admin/switch-edited.mp3');
    musicRef.current = new Audio('/assets/admin/left-to-bloom.mp3');
    if (musicRef.current) {
      musicRef.current.loop = true;
      musicRef.current.volume = 0.5;
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let particleInterval: NodeJS.Timeout;
    if (isLit) {
      particleInterval = setInterval(() => {
        if (!particlesRef.current) return;
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * 60 + 20}%`;
        p.style.bottom = `${Math.random() * 20}%`;
        p.style.animationDuration = `${Math.random() * 4 + 4}s`;
        p.style.animationDelay = `${Math.random() * 0.5}s`;
        
        particlesRef.current.appendChild(p);
        
        setTimeout(() => {
          if (p.parentNode) p.parentNode.removeChild(p);
        }, 8000);
      }, 150);
    }
    return () => clearInterval(particleInterval);
  }, [isLit]);

  const playSwitchSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (pullStringRef.current) {
      pullStringRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;

    if (deltaY > 0) {
      const newY = Math.min(deltaY, maxPull + 20);
      setCurrentY(newY);

      if (newY >= maxPull && !isLit && !requires2FA) {
        // Prevent triggering multiple times while dragging
        // We only trigger when crossing the threshold
      }
    }
  };

  // We handle the trigger logic based on currentY state changes to avoid multiple triggers
  useEffect(() => {
    if (currentY >= maxPull && !isLit) {
      setIsLit(true);
      playSwitchSound();
      if (musicRef.current) {
        musicRef.current.currentTime = 0;
        musicRef.current.play().catch(e => console.log('Music play failed', e));
      }
    }
  }, [currentY, isLit]);

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setCurrentY(0);
  };

  // Vanilla Tilt logic in React
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  }, []);

  return (
    <>
      <style>{`
        .lamp-root {
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          background: #000;
          color: #fff;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          --bg-dark: #12100f;
          --bg-lit: #1c1916;
          --lamp-metal: #080808;
          --accent: #8b5cf6;
          --light-glow: rgba(255, 240, 180, 1);
          --light-beam: rgba(255, 245, 190, 0.45);
        }

        .bg-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 0;
          pointer-events: none;
        }

        .lamp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #000;
          transition: background 0.7s ease;
          z-index: 1;
        }

        .lamp-root.is-lit::before {
          background: rgba(0, 0, 0, 0.2);
        }

        .layout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 120px;
          width: 100%;
          max-width: 1100px;
          padding: 40px;
          position: relative;
          z-index: 10;
        }

        /* --- LEFT: LAMP SECTION --- */
        .lamp-section {
          position: relative;
          width: 450px;
          height: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .floor-lamp {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 20;
          height: 480px;
        }

        .lamp-shade {
          width: 180px;
          height: 14px;
          background: linear-gradient(to bottom, #222, #050505);
          border-top: 1px solid #333;
          border-radius: 12px 12px 6px 6px;
          box-shadow: inset 0 -2px 4px rgba(0,0,0,0.8);
          z-index: 22;
        }

        .bulb {
          width: 80px;
          height: 20px;
          background: radial-gradient(circle at 50% 20%, #333, #050505);
          border-radius: 0 0 40px 40px;
          box-shadow: inset 0 -2px 6px rgba(255,255,255,0.05);
          z-index: 21;
          transition: all 0.2s;
        }

        .lamp-root.is-lit .bulb {
          background: #fff;
          box-shadow: 0 10px 80px 30px var(--light-glow), 0 5px 25px #fff;
          animation: pulseGlow 4s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 10px 80px 30px var(--light-glow), 0 5px 25px #fff; }
          50% { box-shadow: 0 10px 95px 35px var(--light-glow), 0 5px 35px #fff; }
          100% { box-shadow: 0 10px 80px 30px var(--light-glow), 0 5px 25px #fff; }
        }

        .lamp-pole {
          width: 10px;
          flex-grow: 1;
          background: linear-gradient(to right, #050505 0%, #2a2a2a 30%, #0a0a0a 70%, #151515 100%);
          border-left: 1px solid #111;
          border-right: 1px solid #000;
          z-index: 20;
        }

        .lamp-base {
          width: 150px;
          height: 16px;
          background: linear-gradient(to bottom, #2a2a2a, #050505);
          border-radius: 15px 15px 0 0;
          border-top: 1px solid #333;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.05), 0 5px 15px rgba(0,0,0,0.5);
          z-index: 20;
        }

        /* Pull String */
        .pull-string {
          position: absolute;
          top: 12px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: grab;
          z-index: 30;
          padding: 0 15px;
        }

        .pull-string:active {
          cursor: grabbing;
        }

        .string-cord {
          width: 2px;
          background: linear-gradient(to right, #222, #555, #222);
          transform-origin: top;
          pointer-events: none;
        }

        .lamp-root.is-lit .string-cord {
          background: #777;
        }

        .string-handle {
          width: 16px;
          height: 26px;
          background: linear-gradient(to right, #8a7125 0%, #dfb83b 40%, #a88d35 80%, #5a4a15 100%);
          border-radius: 12px;
          margin-top: -2px;
          pointer-events: none;
          transition: background 0.2s;
          box-shadow: 0 3px 6px rgba(0,0,0,0.6), inset -2px -2px 5px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.3);
        }

        .lamp-root.is-lit .string-handle {
          background: linear-gradient(to right, #bda34f 0%, #ffe483 40%, #dfb83b 80%, #8a7125 100%);
          box-shadow: 0 4px 12px rgba(255, 235, 160, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.4);
        }

        /* Light Cone */
        .light-cone {
          position: absolute;
          top: 130px;
          left: 50%;
          transform: translateX(-50%);
          width: 650px;
          height: 470px;
          background: linear-gradient(to bottom, var(--light-beam) 0%, rgba(255, 235, 140, 0.05) 90%, transparent 100%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s ease;
          clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
          z-index: 5;
        }

        .lamp-root.is-lit .light-cone {
          opacity: 1;
          animation: pulseBeam 4s ease-in-out infinite alternate;
        }

        @keyframes pulseBeam {
          0% { opacity: 1; }
          50% { opacity: 0.85; }
          100% { opacity: 1; }
        }

        /* Floor reflection / shadow */
        .floor-fade {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 40px;
          background: radial-gradient(ellipse at center, rgba(255, 245, 190, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.6s;
          z-index: 4;
        }

        .lamp-root.is-lit .floor-fade {
          opacity: 1;
        }

        /* --- RIGHT: LOGIN SECTION --- */
        .login-section {
          width: 420px;
          opacity: 0;
          transform: translateX(40px);
          pointer-events: none;
          transition: opacity 0.8s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          z-index: 50;
        }

        .lamp-root.is-lit .login-section {
          opacity: 1;
          transform: translateX(0);
          pointer-events: all;
        }

        .stagger-item {
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.6s, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .lamp-root.is-lit .stagger-item {
          opacity: 1;
          transform: translateY(0);
        }
        
        .lamp-root.is-lit h2.stagger-item { transition-delay: 0.1s; }
        .lamp-root.is-lit p.stagger-item { transition-delay: 0.15s; }
        .lamp-root.is-lit .field.stagger-item:nth-of-type(1) { transition-delay: 0.2s; }
        .lamp-root.is-lit .field.stagger-item:nth-of-type(2) { transition-delay: 0.25s; }
        .lamp-root.is-lit .field.stagger-item:nth-of-type(3) { transition-delay: 0.3s; }
        .lamp-root.is-lit .forgot-link.stagger-item { transition-delay: 0.35s; }
        .lamp-root.is-lit .btn-primary.stagger-item { transition-delay: 0.4s; }

        .login-card {
          background: linear-gradient(135deg, rgba(20, 20, 25, 0.4) 0%, rgba(10, 10, 15, 0.2) 100%);
          backdrop-filter: blur(40px) saturate(150%);
          -webkit-backdrop-filter: blur(40px) saturate(150%);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
          transition: transform 0.1s ease-out;
        }

        .login-card h2 {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 8px;
          text-align: left;
          background: linear-gradient(to right, #fff, #bbb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }
        
        .subtitle {
          font-size: 14px;
          color: #a3a3a3;
          margin-bottom: 32px;
          text-align: left;
          font-weight: 300;
          letter-spacing: 0.2px;
        }

        .field {
          margin-bottom: 24px;
          position: relative;
        }

        .field input {
          width: 100%;
          padding: 20px 16px 12px 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .field input::placeholder {
          color: transparent;
        }

        .field input:focus {
          border-color: var(--accent);
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .field label {
          position: absolute;
          left: 17px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #777;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .field input:focus + label,
        .field input:not(:placeholder-shown) + label {
          top: 12px;
          font-size: 11px;
          color: var(--accent);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .forgot-link {
          display: inline-block;
          text-align: left;
          color: var(--accent);
          font-size: 13px;
          text-decoration: none;
          margin-bottom: 28px;
          margin-top: -4px;
          font-weight: 500;
          position: relative;
        }
        
        .forgot-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        
        .forgot-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .btn-primary {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #7e4ff6, #9b6ef9);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.3);
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }

        .btn-primary:hover::after {
          left: 150%;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        
        .btn-primary:active {
          transform: translateY(1px);
          box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        
        /* Particle System */
        #particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          clip-path: inherit;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 240, 180, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 240, 180, 1);
          pointer-events: none;
          animation: floatUp linear forwards;
        }
        @keyframes floatUp {
          0% { transform: translateY(100px) scale(0); opacity: 0; }
          10% { transform: translateY(0px) scale(1); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-400px) scale(0.5); opacity: 0; }
        }

        @media (max-width: 900px) {
          .layout {
            flex-direction: column;
            gap: 20px;
          }
          .lamp-section {
            height: 300px;
          }
          .floor-lamp {
            height: 250px;
          }
          .light-cone {
            top: 60px;
          }
          .login-section {
            width: 100%;
            max-width: 420px;
          }
        }
      `}</style>
      
      <div className={`lamp-root ${isLit ? 'is-lit' : ''}`}>
        <video src="/assets/admin/bg-video.mp4" autoPlay loop muted playsInline className="bg-video"></video>

        <div className="layout">
          {/* LEFT: LAMP SECTION */}
          <div className="lamp-section">
            <div className="floor-lamp">
              <div className="lamp-shade"></div>
              <div className="bulb"></div>
              <div className="lamp-pole"></div>
              <div className="lamp-base"></div>

              {/* Pull String */}
              <div 
                className="pull-string" 
                ref={pullStringRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <div 
                  className="string-cord" 
                  style={{
                    height: `${baseCordLength + currentY}px`,
                    transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.5, 2.5, 0.4, 0.8)'
                  }}
                ></div>
                <div className="string-handle"></div>
              </div>
            </div>

            <div className="light-cone">
              <div id="particles" ref={particlesRef}></div>
            </div>
            <div className="floor-fade"></div>
          </div>

          {/* RIGHT: LOGIN SECTION */}
          <div className="login-section">
            <form 
              onSubmit={login} 
              className="login-card" 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <h2 className="stagger-item">Admin Control</h2>
              <p className="subtitle stagger-item">Sign in to manage Hostlixo infrastructure.</p>

              {status && (
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 stagger-item">
                  {status}
                </div>
              )}

              <div className="field stagger-item">
                <input 
                  type="email" 
                  id="email" 
                  placeholder=" " 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="field stagger-item">
                <input 
                  type="password" 
                  id="password" 
                  placeholder=" " 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={requires2FA}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>

              {requires2FA && (
                <div className="field stagger-item">
                  <input 
                    type="text" 
                    id="token" 
                    placeholder=" " 
                    value={loginToken}
                    onChange={(e) => setLoginToken(e.target.value)}
                    required
                    maxLength={6}
                  />
                  <label htmlFor="token">2FA Authentication Code</label>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary stagger-item"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "SIGN IN"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
