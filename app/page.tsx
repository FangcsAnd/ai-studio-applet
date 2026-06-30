'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Bluetooth, BatteryFull, BatteryMedium, BatteryLow, 
  Clock, Moon, Sun, Plane, Plus, Settings2,
  Wind, Sparkles, Activity
} from 'lucide-react';

const MODES = [
  { 
    id: 'mindfulness', name: '正念模式', desc: '柔和的光波助你进入冥想状态', icon: Sparkles, 
    colors: ['#ff6b35', '#f7c948', '#ff8c69', '#ffd700', '#ff6347', '#ffa07a', '#ffb347'],
    breath: { inhale: 4, exhale: 6 }
  },
  { 
    id: 'resonance', name: '共振呼吸', desc: '引导 5.5 秒的吸气与呼气节奏', icon: Activity, 
    colors: ['#00b4d8', '#0077b6', '#48cae4', '#0096c7', '#00a8cc', '#0284c7', '#0ea5e9'],
    breath: { inhale: 5.5, exhale: 5.5 }
  },
  { 
    id: '478', name: '4-7-8 呼吸', desc: '深度放松，快速平复心率准备入眠', icon: Wind, 
    colors: ['#6366f1', '#8b5cf6', '#a855f7', '#7c3aed', '#6d28d9', '#c084fc', '#a78bfa'],
    breath: { inhale: 4, hold: 7, exhale: 8 }
  },
];

const TABS = [
  { id: 'control', label: '控制', icon: Sparkles },
  { id: 'alarm', label: '闹钟', icon: Clock },
  { id: 'jetlag', label: '时差', icon: Plane },
  { id: 'settings', label: '设置', icon: Settings2 },
];

export default function AuraMaskApp() {
  const [connected, setConnected] = useState(true);
  const [battery] = useState(85);
  const [activeTab, setActiveTab] = useState('control');
  const [activeMode, setActiveMode] = useState<string | null>('mindfulness');
  const [timer, setTimer] = useState(30);

  return (
    <main className="relative min-h-[100dvh] w-full font-sans text-white selection:bg-white/10">
      <Background modeId={activeMode} />
      
      <div className="relative w-full min-h-[100dvh] flex flex-col mx-auto" style={{ maxWidth: 480 }}>
        {/* Header */}
        <header className="px-6 pt-14 pb-4 flex items-center justify-between z-20 shrink-0">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setConnected(!connected)}
          >
            <div 
              className="p-2 rounded-full transition-all duration-700"
              style={{ 
                background: connected ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              }}
            >
              <Bluetooth className={`w-3.5 h-3.5 transition-colors duration-500 ${connected ? 'text-blue-400' : 'text-white/40'}`} />
            </div>
            <span className="text-[11px] font-medium text-white/50 transition-colors group-hover:text-white/90">{connected ? '已连接' : '未连接'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-white/40">{battery}%</span>
            {battery > 80 ? <BatteryFull className="w-4 h-4 text-white/40" /> : battery > 30 ? <BatteryMedium className="w-4 h-4 text-white/40" /> : <BatteryLow className="w-4 h-4 text-red-400/60" />}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 no-scrollbar relative z-10 pb-16">
        {activeTab === 'control' && <ControlTab key="control" activeMode={activeMode} setActiveMode={setActiveMode} timer={timer} setTimer={setTimer} />}
        {activeTab === 'alarm' && <AlarmTab key="alarm" />}
        {activeTab === 'jetlag' && <JetLagTab key="jetlag" />}
        {activeTab === 'settings' && <SettingsTab key="settings" />}
        </div>

        {/* Bottom Navigation - compact floating pill */}
        <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 w-full z-30 pointer-events-none" style={{ maxWidth: 480 }}>
          <div className="flex items-center justify-center">
            <div 
              className="flex items-center justify-around rounded-full px-2 py-1.5 gap-0.5 pointer-events-auto"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {TABS.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="relative px-3.5 py-2 flex items-center justify-center rounded-full transition-colors outline-none"
                >
                  {activeTab === t.id && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className="absolute inset-0.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    />
                  )}
                  <t.icon className={`w-4 h-4 relative z-10 transition-colors duration-500 ${activeTab === t.id ? 'text-white' : 'text-white/40'}`} />
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </main>
  );
}

// Subcomponents

function Background({ modeId }: { modeId: string | null }) {
  const mode = MODES.find(m => m.id === modeId) || MODES[0];
  const isOff = !modeId;
  
  const orbs = useMemo(() => {
    const orbConfigs = [
      { size: 55, blur: 90, x: 15, y: 20, colIdx: 0, op: 0.18, dur: 20 },
      { size: 45, blur: 100, x: 70, y: 15, colIdx: 1, op: 0.14, dur: 23 },
      { size: 60, blur: 80, x: 40, y: 60, colIdx: 2, op: 0.15, dur: 25 },
      { size: 50, blur: 95, x: 80, y: 50, colIdx: 3, op: 0.12, dur: 19 },
      { size: 40, blur: 75, x: 25, y: 70, colIdx: 4, op: 0.15, dur: 22 },
      { size: 55, blur: 85, x: 55, y: 35, colIdx: 5, op: 0.11, dur: 27 },
      { size: 35, blur: 65, x: 85, y: 75, colIdx: 1, op: 0.14, dur: 18 },
      { size: 50, blur: 90, x: 10, y: 50, colIdx: 0, op: 0.1, dur: 24 },
    ];
    if (isOff) return orbConfigs.slice(0, 2).map(o => ({ ...o, op: 0.02 }));
    return orbConfigs;
  }, [isOff]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: '#000000' }}>
      {/* Barely visible base tint */}
      {!isOff && (
        <div 
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 35%, ${mode.colors[0]}02 0%, #000000 60%)` }}
        />
      )}

      {/* Breathing color wave */}
      {!isOff && (
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
            background: [
              `radial-gradient(ellipse at 25% 30%, ${mode.colors[0]} 0%, transparent 50%), radial-gradient(ellipse at 75% 65%, ${mode.colors[2]} 0%, transparent 50%)`,
              `radial-gradient(ellipse at 60% 25%, ${mode.colors[3]} 0%, transparent 55%), radial-gradient(ellipse at 35% 70%, ${mode.colors[1]} 0%, transparent 55%)`,
              `radial-gradient(ellipse at 50% 45%, ${mode.colors[4]} 0%, transparent 50%), radial-gradient(ellipse at 55% 55%, ${mode.colors[0]} 0%, transparent 50%)`,
              `radial-gradient(ellipse at 40% 65%, ${mode.colors[5]} 0%, transparent 48%), radial-gradient(ellipse at 65% 35%, ${mode.colors[2]} 0%, transparent 48%)`,
              `radial-gradient(ellipse at 25% 30%, ${mode.colors[0]} 0%, transparent 50%), radial-gradient(ellipse at 75% 65%, ${mode.colors[2]} 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: 'blur(80px)' }}
        />
      )}

      {/* Breathing orbs */}
      {orbs.map((orb, i) => {
        const breatheDur = 16 + i * 1.2;
        const color = mode.colors[orb.colIdx % mode.colors.length];
        return (
          <motion.div
            key={`orb-${modeId}-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${orb.size}vh`,
              height: `${orb.size}vh`,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              background: color,
              filter: `blur(${orb.blur}px)`,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform, opacity',
            }}
            animate={{
              opacity: [orb.op * 0.3, orb.op, orb.op * 0.2, orb.op * 0.9, orb.op * 0.3],
              scale: [1, 1.3, 0.92, 1.2, 1],
              x: [0, 40, -25, 20, 0],
              y: [0, -30, 40, -20, 0],
            }}
            transition={{
              duration: breatheDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        );
      })}

      {/* Rising sparkle particles - bubble style */}
      {!isOff && Array.from({ length: 70 }).map((_, i) => {
        const size = 3 + Math.random() * 5;
        const dur = 2 + Math.random() * 4;
        const col = mode.colors[i % mode.colors.length];
        return (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: col,
              boxShadow: `0 0 ${size * 4}px ${col}, 0 0 ${size * 2}px ${col}80`,
              left: `${Math.random() * 100}%`,
              top: `${85 + Math.random() * 15}%`,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [0, -120 - Math.random() * 200],
              x: [0, (Math.random() - 0.5) * 30],
              scale: [0.3, 1, 0.5],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay: Math.random() * dur,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 90%)',
        }}
      />

      {/* Noise */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} 
      />
    </div>
  )
}

function ControlTab({ activeMode, setActiveMode, timer, setTimer }: any) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  const mainColor = mode.colors[0];
  const isOff = !activeMode;
  const breath = mode.breath;
  
  // Breathing animation state
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>(0);
  
  useEffect(() => {
    if (isOff) return;
    const total = breath.hold 
      ? breath.inhale + breath.hold + breath.exhale 
      : breath.inhale + breath.exhale;
    let start = performance.now();
    
    const tick = (now: number) => {
      let elapsed = ((now - start) / 1000) % total;
      let p: number, ph: 'inhale' | 'hold' | 'exhale';
      
      if (elapsed < breath.inhale) {
        p = elapsed / breath.inhale;
        ph = 'inhale';
      } else if (breath.hold && elapsed < breath.inhale + breath.hold) {
        p = (elapsed - breath.inhale) / breath.hold;
        ph = 'hold';
      } else {
        elapsed -= breath.inhale + (breath.hold || 0);
        p = elapsed / breath.exhale;
        ph = 'exhale';
      }
      setProgress(p);
      setPhase(ph);
      animRef.current = requestAnimationFrame(tick);
    };
    
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isOff, breath]);
  
  // Breathing animation scale: 0.5 → 1.0 for inhale, 1.0 for hold, 1.0 → 0.5 for exhale
  const rings = [0, 1, 2, 3, 4, 5];
  const getRingScale = (ring: number) => {
    const ringOffset = ring * 0.15;
    if (phase === 'inhale') return 0.4 + ringOffset + progress * 0.6;
    if (phase === 'hold') return 1.0 + ringOffset;
    return 1.0 + ringOffset - progress * 0.6;
  };
  
  const phaseLabel = phase === 'inhale' ? '吸气' : phase === 'hold' ? '屏息' : '呼气';
  const phaseColor = phase === 'inhale' ? mode.colors[0] : phase === 'hold' ? mode.colors[3] : mode.colors[5];
  
  return (
    <div className="flex flex-col items-center px-6 pt-2" style={{ opacity: 1 }}>
      {/* Central Visualizer */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-6">
        {/* Breathing glow orbs behind */}
        {!isOff && (
          <>
            <motion.div
              animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: breath.inhale + breath.exhale + (breath.hold || 0), repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: mainColor }}
            />
            <motion.div
              animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: breath.inhale + breath.exhale + (breath.hold || 0), repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute inset-4 rounded-full blur-2xl"
              style={{ background: mode.colors[2] }}
            />
          </>
        )}
        
        {/* Breathing concentric rings */}
        {!isOff && rings.map((ring) => (
          <div
            key={`ring-${ring}`}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: `${44 + ring * 28}px`,
              height: `${44 + ring * 28}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              className="rounded-full w-full h-full"
              style={{
                borderColor: mode.colors[ring % mode.colors.length],
                willChange: 'transform, opacity',
                borderWidth: ring === 0 ? '2px' : `${Math.max(0.3, 1.5 - ring * 0.2)}px`,
                borderStyle: 'solid',
              }}
              animate={{
                scale: phase === 'inhale' 
                  ? 0.45 + progress * 0.7 + ring * 0.06
                  : phase === 'hold' 
                    ? 1.15 + ring * 0.06 
                    : 1.15 + ring * 0.06 - progress * 0.7,
                opacity: phase === 'hold' ? 0.6 - ring * 0.08 : 0.45 - ring * 0.06,
              }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </div>
        ))}

        {/* Rotating orbit ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-4px] rounded-full"
          style={{ 
            border: !isOff ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.01)',
          }}
        />

        {/* Center frosted glass circle with icon */}
        {isOff ? (
          <div className="relative z-10 w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
        ) : (
          <div className="relative z-10 w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `0 0 40px ${mainColor}10`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <mode.icon className="w-12 h-12 text-white/80 relative z-10" strokeWidth={1} />
          </div>
        )}
        
        {/* Phase label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-16 pointer-events-none">
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase whitespace-nowrap">{isOff ? '已关闭' : mode.name}</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="w-full flex gap-2 py-3">
        {MODES.map(m => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(isActive ? null : m.id)}
              className="flex-1 p-3 rounded-[24px] flex flex-col items-center gap-3 transition-all duration-700 outline-none"
              style={{
                background: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                border: 'none',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: isActive ? `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)` : 'none',
              }}
            >
              <div 
                className="p-2 rounded-full transition-all duration-700"
                style={{
                  background: isActive ? `${m.colors[0]}30` : 'rgba(255,255,255,0.04)',
                  color: isActive ? m.colors[0] : 'rgba(255,255,255,0.4)',
                }}
              >
                <m.icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p 
                  className="font-medium text-xs transition-colors duration-700"
                  style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}
                >{m.name}</p>
                <p className="text-[9px] mt-1 text-white/50 line-clamp-2 leading-relaxed">{m.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Timer - ultra minimal */}
      <div 
        className="w-full mt-4 p-3 rounded-[20px] transition-all duration-700"
        style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/40 font-medium tracking-widest uppercase">定时关闭</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-display font-thin text-white/80 tracking-tight">{timer}</p>
            <p className="text-[10px] text-white/40">分钟</p>
          </div>
        </div>
        <div className="relative w-full h-5 flex items-center mt-1">
          <input 
            type="range" 
            min="1" max="60" 
            value={timer} 
            onChange={e => setTimer(parseInt(e.target.value))}
            className="w-full relative z-10"
            style={{ accentColor: mainColor }}
          />
        </div>
      </div>
    </div>
  )
}

function AlarmTab() {
  const [alarms, setAlarms] = useState([
    { id: 1, time: '07:00', label: '晨间唤醒', enabled: true, days: '工作日' },
    { id: 2, time: '08:30', label: '周末赖床', enabled: false, days: '周末' }
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }} 
      className="px-6 pt-2"
    >
      <h2 className="text-3xl font-display font-thin mb-6 text-white/90 tracking-tight">光效闹钟</h2>
      
      <div className="space-y-3">
        {alarms.map((alarm) => (
          <div 
            key={alarm.id} 
            className="p-5 rounded-[28px] transition-all duration-700 flex justify-between items-center"
            style={{
              background: alarm.enabled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: alarm.enabled ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.03)',
              boxShadow: alarm.enabled ? 'inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
              opacity: alarm.enabled ? 1 : 0.4,
            }}
          >
            <div>
              <p className="text-4xl font-thin font-display tracking-tight text-white">{alarm.time}</p>
              <div className="flex gap-2 mt-3 items-center">
                <span 
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
                >{alarm.label}</span>
                <span className="text-[11px] text-white/40">{alarm.days}</span>
              </div>
            </div>
            <button 
              onClick={() => toggleAlarm(alarm.id)}
              className="w-14 h-8 rounded-full p-1 transition-all duration-500 flex items-center outline-none"
              style={{ 
                background: alarm.enabled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full shadow-sm"
                style={{ background: alarm.enabled ? '#1a1a2e' : 'rgba(255,255,255,0.6)', marginLeft: alarm.enabled ? '24px' : '0' }}
              />
            </button>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-5 py-4 rounded-[24px] flex items-center justify-center gap-2 transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium text-sm tracking-wide">添加闹钟</span>
      </button>

      <p className="text-center mt-8 text-[11px] text-white/40 leading-relaxed px-4">
        眼罩会在闹钟时间前 30 分钟逐渐亮起<br/>模拟日出自然唤醒
      </p>
    </motion.div>
  )
}

function JetLagTab() {
  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }} 
      className="px-6 pt-2 pb-12"
    >
      <h2 className="text-3xl font-display font-thin mb-6 text-white/90 tracking-tight">时差调整</h2>
      
      <div 
        className="p-6 rounded-[28px] relative overflow-hidden mb-6"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl translate-x-10 -translate-y-10" style={{ background: 'rgba(59,130,246,0.2)' }} />
        <Plane className="w-5 h-5 text-white/85 mb-4 relative z-10" />
        <h3 className="text-xl mb-1 font-medium relative z-10 text-white/90">前往：巴黎 (CDG)</h3>
        <p className="text-sm text-white/50 mb-8 relative z-10">相差 7 小时 · 3天后起飞</p>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">出发地</p>
            <p className="text-2xl font-thin text-white/80">北京</p>
            <p className="text-sm text-white/50 mt-1 font-display tracking-wide">21:00</p>
          </div>
          <div className="flex-1 px-6 flex items-center">
             <div className="h-[1px] w-full relative" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.2)', background: '#050508' }} />
             </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">目的地</p>
            <p className="text-2xl font-thin text-white/80">巴黎</p>
            <p className="text-sm mt-1 font-display tracking-wide" style={{ color: 'rgba(147,197,253,0.6)' }}>14:00</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-medium text-white/40 mb-4 px-2 tracking-widest uppercase">今日光照建议</h3>
      <div className="space-y-3">
        <div 
          className="p-5 rounded-[28px] flex gap-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="mt-1 shrink-0">
             <Sun className="w-5 h-5 text-amber-400/50" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-white/90">寻求光照</p>
              <p 
                className="text-[10px] font-display px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.1)', color: 'rgba(251,191,36,0.6)' }}
              >08:00 - 12:00</p>
            </div>
            <p className="text-[11px] text-white/50 mt-2 leading-relaxed">推荐使用眼罩的「正念模式」或前往户外接触自然光，帮助推迟生物钟。</p>
          </div>
        </div>
        <div 
          className="p-5 rounded-[28px] flex gap-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="mt-1 shrink-0">
             <Moon className="w-5 h-5 text-indigo-400/50" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-white/90">避免光照</p>
              <p 
                className="text-[10px] font-display px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(165,180,252,0.1)', color: 'rgba(165,180,252,0.6)' }}
              >20:00 - 23:00</p>
            </div>
            <p className="text-[11px] text-white/50 mt-2 leading-relaxed">佩戴眼罩遮光，或使用「4-7-8 呼吸模式」准备入睡。</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SettingsTab() {
  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }} 
      className="px-6 pt-2 pb-12"
    >
      <h2 className="text-3xl font-display font-thin mb-6 text-white/90 tracking-tight">设备设置</h2>
      
      <div className="space-y-3">
        <div 
          className="p-5 rounded-[28px] flex items-center justify-between cursor-pointer transition-all duration-500 hover:brightness-150"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div>
            <p className="font-medium text-white/90 text-[15px]">眼罩亮度上限</p>
            <p className="text-[11px] text-white/40 mt-1">控制最大亮度，保护暗适应视力</p>
          </div>
          <span className="text-sm text-white/50 font-medium">70%</span>
        </div>
        
        <div 
          className="p-5 rounded-[28px] flex items-center justify-between cursor-pointer transition-all duration-500 hover:brightness-150"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div>
            <p className="font-medium text-white/90 text-[15px]">呼吸光效平滑度</p>
            <p className="text-[11px] text-white/40 mt-1">影响光线明暗变化的曲线</p>
          </div>
          <span className="text-sm text-white/50 font-medium">自然 (正弦)</span>
        </div>

        <div 
          className="p-5 rounded-[28px] flex items-center justify-center cursor-pointer transition-all duration-500 mt-6 hover:brightness-150"
          style={{
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(239,68,68,0.1)',
          }}
        >
           <p className="font-medium text-red-400/50 text-[15px]">断开连接</p>
        </div>
      </div>
      
      <div className="mt-auto pt-16 text-center">
        <p className="text-[11px] text-white/50 font-display tracking-[0.3em]">AURA MASK OS v1.2.4</p>
      </div>
    </motion.div>
  )
}

