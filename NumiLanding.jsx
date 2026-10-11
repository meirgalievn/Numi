import React, { useState, useEffect, useRef } from 'react';

/**
 * NUMI — Minimalist Editorial Dark-Mode University Hub
 * - All blocks are closed by default (clean, minimal, clutter-free).
 * - Contents emerge smoothly only upon clicking a block.
 * - Prominent kinetic typography decoder scramble animation for the NUMI logo on load & hover.
 * - Wide fluid wave & water ripple background interaction responding smoothly to cursor velocity.
 */

export default function NumiLanding() {
  const [expandedCards, setExpandedCards] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    subject: '',
    service: '',
    price: '',
  });

  const [bookingForm, setBookingForm] = useState({
    studentName: '',
    contact: '',
    preferredTime: '',
  });

  const canvasRef = useRef(null);
  const heroLogoRef = useRef(null);
  const headerLogoRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openBookingModal = (subject, service, price) => {
    setModalState({
      isOpen: true,
      subject,
      service,
      price,
    });
  };

  const closeBookingModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    closeBookingModal();
    showToast(
      `Confirmed for ${bookingForm.studentName || 'Student'} (${bookingForm.contact})! Peer mentor notified.`
    );
    setBookingForm({ studentName: '', contact: '', preferredTime: '' });
  };

  const [isLogoAlive, setIsLogoAlive] = useState(false);
  const [logoChars, setLogoChars] = useState(['N', 'U', 'M', 'I']);
  const [charLocked, setCharLocked] = useState([false, false, false, false]);
  const [isRevealed, setIsRevealed] = useState(false);

  // CINEMATIC NUMI LOGO ENTRANCE & LIVING STATE
  useEffect(() => {
    const targetWord = ['N', 'U', 'M', 'I'];
    const DECODE_GLYPHS = ['0', '1', 'X', 'Z', '7', '/', '#', '>', '<', '_', '%', '&', 'Δ', 'Ξ'];
    const lockDelays = [850, 1400, 1950, 2500];
    const lockedMap = [false, false, false, false];

    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 150);

    const startTime = performance.now();
    let lastTick = 0;
    const GLYPH_INTERVAL = 65;
    let animId;

    function step(now) {
      const elapsed = now - startTime;
      const shouldTick = (now - lastTick) >= GLYPH_INTERVAL;
      if (shouldTick) lastTick = now;

      let allDone = true;
      const nextChars = [];
      const nextLocked = [...lockedMap];

      for (let i = 0; i < 4; i++) {
        if (elapsed >= lockDelays[i]) {
          nextChars.push(targetWord[i]);
          nextLocked[i] = true;
          lockedMap[i] = true;
        } else {
          allDone = false;
          nextChars.push(
            shouldTick
              ? DECODE_GLYPHS[Math.floor(Math.random() * DECODE_GLYPHS.length)]
              : targetWord[i]
          );
        }
      }

      setLogoChars(nextChars);
      setCharLocked(nextLocked);

      if (!allDone) {
        animId = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setIsLogoAlive(true);
        }, 300);
      }
    }

    animId = requestAnimationFrame(step);

    return () => {
      clearTimeout(revealTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  // MASSIVE GLYPH CURSOR TRAIL ENGINE (ZERO CIRCLES, PURE TYPOGRAPHY)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    const GLYPHS = ['>', '_', '/'];
    let glyphIndex = 0;
    const DISTANCE_THRESHOLD = 26;
    let lastSpawn = { x: -9999, y: -9999 };
    let particles = [];

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dx = mouseX - lastSpawn.x;
      const dy = mouseY - lastSpawn.y;
      const dist = Math.hypot(dx, dy);

      if (dist >= DISTANCE_THRESHOLD) {
        const angle = Math.atan2(dy, dx);
        const char = GLYPHS[glyphIndex % GLYPHS.length];
        glyphIndex++;

        // Spawn massive bold glyph
        particles.push({
          x: mouseX,
          y: mouseY,
          char: char,
          angle: angle,
          size: 46,
          vx: Math.cos(angle) * 0.8,
          vy: Math.sin(angle) * 0.8,
          opacity: 0.92,
          decay: 0.018,
        });

        lastSpawn.x = mouseX;
        lastSpawn.y = mouseY;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    function render() {
      ctx.clearRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Massive bold monospace typography
        ctx.font = `900 ${p.size}px "JetBrains Mono", monospace`;

        // Crisp glowing typography — zero background circles
        ctx.shadowColor = `rgba(255, 255, 255, ${p.opacity * 0.55})`;
        ctx.shadowBlur = 12;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;

        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const disciplines = [
    {
      id: 'card-01',
      number: '01',
      title: 'Introduction to Programming (Go / C++ / Algorithms)',
      desc: 'Procedural logic, pointers, memory models, and algorithmic complexity.',
      freeNote: 'Lecture Notes & Concurrency Cheat Sheets',
      paidService: '1-on-1 Code Review',
      price: '5,000 ₸',
    },
    {
      id: 'card-02',
      number: '02',
      title: 'Information & Communication Technologies (ICT)',
      desc: 'Networking protocols (OSI), relational databases (SQL), and cloud systems.',
      freeNote: 'Subnetting Formulas & SQL Query Guide',
      paidService: 'Lab Defense & Exam Prep',
      price: '4,500 ₸',
    },
    {
      id: 'card-03',
      number: '03',
      title: 'History of Kazakhstan',
      desc: 'Chronology of statehood, Alash Orda heritage, and state exam question pools.',
      freeNote: 'Dates & Battles Chronology Summary Table',
      paidService: 'Oral Defense Drills (500+ Qs)',
      price: '4,000 ₸',
    },
    {
      id: 'card-04',
      number: '04',
      title: 'AI Fundamentals',
      desc: 'Machine learning architectures, gradient descent, PyTorch, and transformers.',
      freeNote: 'PyTorch Cheatsheet & Calculus Math Derivations',
      paidService: 'Model Architecture Review',
      price: '6,000 ₸',
    },
    {
      id: 'card-05',
      number: '05',
      title: 'Fundamentals of Calculus',
      desc: 'Limits, partial derivatives, Riemann integration, and Taylor series.',
      freeNote: 'Formula Handbook & Derivatives Table',
      paidService: '1-on-1 Proof & Midterm Prep',
      price: '5,000 ₸',
    },
    {
      id: 'card-06',
      number: '06',
      isSpecial: true,
      title: 'Tomorrow School',
      desc: '01Edu / 42 peer model: Piscine survival guides, Quests 00–12, and mock peer audits.',
      freeNote: 'Piscine Survival Manual & Self-Audit Checklist',
      paidService: '1-on-1 Mock Peer Audit with Alum',
      price: '6,000 ₸',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#ffffff] font-sans selection:bg-white selection:text-[#0b0b0b] relative antialiased">
      {/* Fluid wave canvas overlay with pointer-events-none */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Top ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-white/[0.015] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 relative z-10">

        {/* HEADER */}
        <header className="border border-[#262626] bg-[#141414]/80 backdrop-blur-md mb-8 sm:mb-12 sticky top-4 z-40">
          <div className="flex items-center justify-between px-6 py-4 sm:px-8">
            <a
              href="#"
              className="flex items-center gap-3 group select-none"
            >
              <span
                ref={headerLogoRef}
                className="font-black text-xl sm:text-2xl tracking-[0.25em] text-white transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.45)]"
              >
                NUMI
              </span>
              <span className="hidden md:inline-block font-mono text-[9px] tracking-widest text-[#737373] uppercase pl-2 border-l border-[#262626]">
                Academia • Hub
              </span>
            </a>

            <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-[0.15em] uppercase text-[#a1a1a1]">
              <a href="#curriculum" className="hover:text-white transition-colors duration-200">Curriculum</a>
              <a
                href="#curriculum"
                onClick={() => setExpandedCards((prev) => ({ ...prev, 'card-06': true }))}
                className="hover:text-white transition-colors duration-200 text-white font-medium"
              >
                Tomorrow School
              </a>
              <a href="#pro-pass" className="hover:text-white transition-colors duration-200">PRO Pass</a>
              <a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a>
            </nav>

            <button
              onClick={() => openBookingModal('General Campus', 'Student Membership', 'Free')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono tracking-wider uppercase text-white bg-[#0b0b0b] border border-[#262626] hover:border-white transition-all duration-300 group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">Join Hub</span>
              <span className="ml-2 text-[#737373] group-hover:text-white transition-colors">&rarr;</span>
            </button>
          </div>
        </header>

        {/* HERO SECTION (.01) */}
        <section className="relative mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[50px_1fr] gap-6 items-start">
            <div className="hidden lg:flex flex-col items-center pt-8 text-[#737373] font-mono select-none">
              <span className="text-xs tracking-[0.22em] text-[#a1a1a1] font-medium">.01</span>
              <div className="w-[1px] h-24 bg-[#262626] my-4" />
              <span className="[writing-mode:vertical-lr] text-[10px] tracking-[0.3em] uppercase text-[#737373]">
                HERO
              </span>
            </div>

            <div className="border border-[#262626] bg-[#141414] relative p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-8 sm:mb-12 border-b border-[#262626] text-[11px] font-mono tracking-widest text-[#737373] uppercase">
                <div className="flex items-center space-x-2.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[#a1a1a1]">ACADEMIC HUB // EST. 2026</span>
                </div>
                <span>PEER ACCELERATION</span>
              </div>

              <div className="flex flex-col items-center text-center px-2 sm:px-6">
                <div className="inline-flex items-center px-3 py-1 mb-6 border border-[#262626] bg-[#0b0b0b]/60 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#a1a1a1]">
                  <span>PEER-TO-PEER UNIVERSITY NETWORK</span>
                </div>

                {/* HERO LOGO: NUMI (Cinematic One-Time Entrance -> Living Permanent State) */}
                <div className="relative py-2 my-2 select-none">
                  <h1
                    className={`text-7xl sm:text-9xl md:text-[10rem] lg:text-[11.5rem] font-black tracking-[-0.06em] leading-none inline-flex items-center justify-center transition-all duration-700 ${
                      isLogoAlive
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400'
                        : 'text-white'
                    }`}
                    style={{
                      filter: isLogoAlive
                        ? 'drop-shadow(0 0 35px rgba(255, 255, 255, 0.35)) drop-shadow(0 0 80px rgba(255, 255, 255, 0.12))'
                        : undefined,
                    }}
                  >
                    {logoChars.map((char, idx) => (
                      <span
                        key={idx}
                        className={`inline-block transition-all duration-300 ${
                          !isRevealed ? 'opacity-0 blur-sm translate-y-4' : 'opacity-100 blur-0 translate-y-0'
                        } ${charLocked[idx] ? 'brightness-150 scale-105' : ''}`}
                      >
                        {char}
                      </span>
                    ))}
                  </h1>
                </div>

                <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg font-normal text-neutral-200 leading-relaxed tracking-tight">
                  Academic roadmaps, subject mastery, and Tomorrow School accelerators.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
                  <a
                    href="#curriculum"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-white text-[#0b0b0b] font-mono text-xs font-semibold tracking-wider uppercase hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    Explore Tracks
                  </a>
                  <a
                    href="#curriculum"
                    onClick={() => setExpandedCards((prev) => ({ ...prev, 'card-06': true }))}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-[#0b0b0b] text-white border border-[#262626] font-mono text-xs tracking-wider uppercase hover:border-white transition-all group"
                  >
                    <span>Tomorrow School</span>
                    <span className="ml-2 text-[#737373] group-hover:text-white transition-colors">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM SECTION (.02) */}
        <section id="curriculum" className="relative mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[50px_1fr] gap-6 items-start">
            <div className="hidden lg:flex flex-col items-center pt-8 text-[#737373] font-mono select-none sticky top-24">
              <span className="text-xs tracking-[0.22em] text-[#a1a1a1] font-medium">.02</span>
              <div className="w-[1px] h-24 bg-[#262626] my-4" />
              <span className="[writing-mode:vertical-lr] text-[10px] tracking-[0.3em] uppercase text-[#737373]">
                CURRICULUM
              </span>
            </div>

            <div className="border border-[#262626] bg-[#141414] relative p-6 sm:p-10 lg:p-12 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 border-b border-[#262626] gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-[#737373] uppercase mb-1">.02 // DISCIPLINES</div>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase">Curriculum</h2>
                </div>
                <div className="text-xs font-mono text-[#737373]">
                  <span>6 BLOCKS</span> &bull; <span className="text-[#a1a1a1]">CLICK ANY BLOCK TO EXPAND</span>
                </div>
              </div>

              <div className="space-y-3">
                {disciplines.map((item) => {
                  const isOpen = !!expandedCards[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`border transition-all duration-300 relative ${
                        item.isSpecial
                          ? 'border-2 border-white/80 bg-[#0f0f0f] shadow-[0_0_35px_-8px_rgba(255,255,255,0.08)]'
                          : isOpen
                          ? 'border-white/70 bg-[#0b0b0b]'
                          : 'border-[#262626] bg-[#0b0b0b] hover:border-neutral-500'
                      }`}
                    >
                      {item.isSpecial && (
                        <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-white text-[#0b0b0b] font-mono text-[8px] font-black uppercase tracking-wider">
                          INTENSIVE TRACK
                        </div>
                      )}

                      <button
                        onClick={() => toggleCard(item.id)}
                        className={`w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none group ${
                          item.isSpecial ? 'pt-6' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className={`font-mono text-xs ${item.isSpecial ? 'text-white font-bold' : 'text-[#737373]'}`}>
                            {item.number}
                          </span>
                          <div className="font-bold text-base sm:text-lg text-white group-hover:text-neutral-200 transition-colors flex items-center gap-2">
                            {item.title}
                            {item.isSpecial && (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${
                            item.isSpecial ? 'text-white font-bold' : 'text-[#737373] group-hover:text-white'
                          }`}>
                            {isOpen ? 'CLOSE −' : 'OPEN +'}
                          </span>
                          <span className={`font-mono text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                            &darr;
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-6 sm:px-6 border-t border-[#262626] pt-5 space-y-4">
                          <p className="text-xs text-neutral-300">{item.desc}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-[#262626] bg-[#111111] flex flex-col justify-between">
                              <div>
                                <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-1.5">// FREE COMMONS</div>
                                <div className="text-xs text-white font-medium">{item.freeNote}</div>
                              </div>
                              <button
                                onClick={() => showToast(`Downloaded: ${item.freeNote}`)}
                                className="mt-4 text-left font-mono text-[11px] text-white hover:underline"
                              >
                                Download Notes &darr;
                              </button>
                            </div>
                            <div className="p-4 border border-[#262626] bg-[#0b0b0b] flex flex-col justify-between">
                              <div>
                                <div className="font-mono text-[10px] text-[#a1a1a1] uppercase tracking-widest mb-1.5">// PEER MENTORING</div>
                                <div className="text-xs text-white font-medium flex items-center justify-between">
                                  <span>{item.paidService}</span>
                                  <span className="font-mono font-bold">{item.price}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => openBookingModal(item.title, item.paidService, item.price)}
                                className="mt-4 px-3 py-1.5 bg-white text-[#0b0b0b] font-mono text-[10px] font-bold uppercase hover:bg-neutral-200 transition-colors self-start"
                              >
                                Book Session &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* PRO PASS SECTION (.03) */}
        <section id="pro-pass" className="relative mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[50px_1fr] gap-6 items-start">
            <div className="hidden lg:flex flex-col items-center pt-8 text-[#737373] font-mono select-none sticky top-24">
              <span className="text-xs tracking-[0.22em] text-[#a1a1a1] font-medium">.03</span>
              <div className="w-[1px] h-24 bg-[#262626] my-4" />
              <span className="[writing-mode:vertical-lr] text-[10px] tracking-[0.3em] uppercase text-[#737373]">
                TIERS
              </span>
            </div>

            <div className="border border-[#262626] bg-[#141414] relative p-6 sm:p-10 lg:p-12 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#262626] gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-[#737373] uppercase mb-1">.03 // MEMBERSHIP</div>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase">NUMI PRO Pass</h2>
                </div>
                <div className="text-xs font-mono text-[#737373]">
                  SELECT TIER TO VIEW PRIVILEGES
                </div>
              </div>

              <div className="space-y-4">
                {/* Campus Free Tier Block */}
                <div className={`border transition-all duration-300 ${expandedCards['tier-free'] ? 'border-white/70 bg-[#0b0b0b]' : 'border-[#262626] bg-[#0b0b0b] hover:border-neutral-500'}`}>
                  <button
                    onClick={() => toggleCard('tier-free')}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#737373]">TIER 01</span>
                      <div className="text-base sm:text-lg font-bold text-white">Campus Free Tier</div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono font-bold text-sm text-neutral-300">0 ₸</span>
                      <span className="font-mono text-[10px] tracking-wider uppercase text-[#737373] group-hover:text-white">
                        {expandedCards['tier-free'] ? 'CLOSE −' : 'DETAILS +'}
                      </span>
                    </div>
                  </button>

                  {expandedCards['tier-free'] && (
                    <div className="px-5 pb-6 sm:px-6 border-t border-[#262626] pt-5 space-y-4">
                      <div className="space-y-2 text-xs text-neutral-300">
                        <div className="flex items-center gap-2"><span className="text-emerald-400 font-mono">&check;</span> Public lecture summaries &amp; cheatsheets</div>
                        <div className="flex items-center gap-2"><span className="text-emerald-400 font-mono">&check;</span> Open student community Telegram &amp; Discord</div>
                        <div className="flex items-center gap-2"><span className="text-emerald-400 font-mono">&check;</span> Shared syllabus links &amp; readings</div>
                      </div>
                      <button
                        onClick={() => showToast('Currently active: Campus Free Tier')}
                        className="py-2 px-4 border border-[#262626] text-[#a1a1a1] hover:text-white font-mono text-xs uppercase transition-colors"
                      >
                        Current Active Tier
                      </button>
                    </div>
                  )}
                </div>

                {/* NUMI PRO Tier Block */}
                <div className="border-2 border-white bg-[#0e0e0e] shadow-[0_0_35px_-10px_rgba(255,255,255,0.12)] transition-all duration-300">
                  <button
                    onClick={() => toggleCard('tier-pro')}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-white font-bold">TIER 02</span>
                      <div className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                        NUMI PRO
                        <span className="text-[9px] px-2 py-0.5 bg-white text-[#0b0b0b] font-mono font-bold">ALL ACCESS</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-black text-base sm:text-lg text-white">9,900 ₸</span>
                        <span className="hidden sm:inline font-mono text-[9px] text-[#737373]"> / SEMESTER</span>
                      </div>
                      <span className="font-mono text-[10px] tracking-wider uppercase text-white font-bold">
                        {expandedCards['tier-pro'] ? 'CLOSE −' : 'DETAILS +'}
                      </span>
                    </div>
                  </button>

                  {expandedCards['tier-pro'] && (
                    <div className="px-5 pb-6 sm:px-6 border-t border-neutral-700 pt-5 space-y-4">
                      <div className="space-y-2 text-xs text-white font-medium">
                        <div className="flex items-center gap-2"><span className="font-mono text-white">&check;</span> All assignment solution breakdowns &amp; test suites</div>
                        <div className="flex items-center gap-2"><span className="font-mono text-white">&check;</span> Tomorrow School Quest Walkthroughs (Quests 00–12)</div>
                        <div className="flex items-center gap-2"><span className="font-mono text-white">&check;</span> 1-on-1 mentor booking discounts (30% off)</div>
                        <div className="flex items-center gap-2"><span className="font-mono text-white">&check;</span> 5-year past university exam archives with steps</div>
                      </div>
                      <button
                        onClick={() => openBookingModal('NUMI PRO Pass', 'All-Access Semester Pass', '9,900 ₸')}
                        className="py-3 px-6 bg-white text-[#0b0b0b] hover:bg-neutral-200 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                      >
                        <span>Get Pro Access</span> &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION (.04) */}
        <section id="contact" className="relative mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[50px_1fr] gap-6 items-start">
            <div className="hidden lg:flex flex-col items-center pt-8 text-[#737373] font-mono select-none">
              <span className="text-xs tracking-editorial text-secondaryText font-medium">.04</span>
              <div className="w-[1px] h-24 bg-borderDim my-4"></div>
              <span className="vertical-lr text-[10px] tracking-[0.3em] uppercase text-mutedText">CONTACT</span>
            </div>

            <div className="editorial-border bg-charcoal relative p-6 sm:p-10 lg:p-12 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-borderDim gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-editorial text-mutedText uppercase mb-1">.04 // CONTACT</div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">Get in Touch</h2>
                </div>
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer" class="px-3 py-1 border border-[#262626] hover:border-white text-[#a1a1a1] hover:text-white transition-colors">Telegram</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="px-3 py-1 border border-[#262626] hover:border-white text-[#a1a1a1] hover:text-white transition-colors">GitHub</a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" class="px-3 py-1 border border-[#262626] hover:border-white text-[#a1a1a1] hover:text-white transition-colors">Discord</a>
                </div>
              </div>

              <div className="border border-[#262626] bg-[#0b0b0b] p-5 sm:p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262626] text-xs font-mono">
                  <span className="text-white uppercase font-semibold">DIRECT INQUIRY DESK</span>
                  <span className="text-[#737373]">support@numi.edu</span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('Inquiry dispatched! We will reply via Telegram.');
                    e.target.reset();
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" required placeholder="Your Name" className="w-full bg-[#121212] border border-[#262626] px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono" />
                    <input type="text" required placeholder="Telegram @handle or Email" className="w-full bg-[#121212] border border-[#262626] px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono" />
                  </div>
                  <textarea rows={2} required placeholder="Your request or question..." className="w-full bg-[#121212] border border-[#262626] px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono resize-none" />
                  <button type="submit" className="w-full py-2.5 bg-white text-[#0b0b0b] hover:bg-neutral-200 font-mono text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5">
                    <span>Send Message</span> &rarr;
                  </button>
                </form>
              </div>

              <div className="mt-8 pt-6 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#737373] gap-2">
                <div className="text-white font-bold tracking-widest">NUMI • UNIVERSITY HUB</div>
                <div>&copy; 2026. All rights reserved.</div>
                <div>.01 — .02 — .03 — .04</div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* BOOKING MODAL */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0b]/80 backdrop-blur-md">
          <div className="border border-[#262626] bg-[#141414] w-full max-w-md p-6 relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white" />
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 w-7 h-7 border border-[#262626] hover:border-white flex items-center justify-center font-mono text-xs text-[#737373] hover:text-white transition-colors"
            >
              &times;
            </button>

            <div className="pb-4 mb-4 border-b border-[#262626] pr-6">
              <div className="font-mono text-[9px] tracking-widest text-emerald-400 uppercase mb-0.5">DISPATCH READY</div>
              <h3 className="text-lg font-bold text-white tracking-tight">{modalState.service}</h3>
              <div className="flex items-center gap-2 mt-1 font-mono text-xs">
                <span className="px-2 py-0.5 border border-[#262626] text-[#a1a1a1] text-[9px]">{modalState.subject}</span>
                <span className="font-bold text-white">{modalState.price}</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block font-mono text-[9px] text-[#737373] uppercase mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={bookingForm.studentName}
                  onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                  placeholder="e.g. Alikhan"
                  className="w-full bg-[#0b0b0b] border border-[#262626] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-[#737373] uppercase mb-1">Telegram @handle or Email</label>
                <input
                  type="text"
                  required
                  value={bookingForm.contact}
                  onChange={(e) => setBookingForm({ ...bookingForm, contact: e.target.value })}
                  placeholder="@username or student@nu.edu.kz"
                  className="w-full bg-[#0b0b0b] border border-[#262626] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-[#737373] uppercase mb-1">Preferred Time</label>
                <input
                  type="text"
                  required
                  value={bookingForm.preferredTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                  placeholder="e.g. Tomorrow at 18:00"
                  className="w-full bg-[#0b0b0b] border border-[#262626] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-[#0b0b0b] hover:bg-neutral-200 font-mono text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Confirm &amp; Contact Mentor</span> &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-[#0b0b0b] px-4 py-2.5 border border-neutral-300 shadow-xl flex items-center gap-2.5 font-mono text-xs transition-all">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
