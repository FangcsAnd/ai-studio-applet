'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bluetooth, BatteryFull, BatteryMedium, BatteryLow, 
  Clock, Moon, Sun, Plane, Plus, Settings2, Power, 
  Wind, Sparkles, Activity
} from 'lucide-react';

const MODES = [
  { id: 'mindfulness', name: '正念模式', desc: '柔和的光波助你进入冥想状态', icon: Sparkles, colors: ['bg-orange-500', 'bg-amber-500', 'bg-rose-500'] },
  { id: 'resonance', name: '共振呼吸', desc: '引导 5.5 秒的吸气与呼气节奏', icon: Activity, colors: ['bg-cyan-500', 'bg-blue-500', 'bg-teal-500'] },
  { id: '478', name: '4-7-8 呼吸', desc: '深度放松，快速平复心率准备入眠', icon: Wind, colors: ['bg-indigo-500', 'bg-purple-500', 'bg-violet-500'] },
  { id: 'off', name: '关闭光效', desc: '纯粹的遮光睡眠体验', icon: Power, colors: ['bg-neutral-800', 'bg-zinc-800', 'bg-slate-800'] }
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
  const [activeMode, setActiveMode] = useState('mindfulness');
  const [timer, setTimer] = useState(30);

  return (
    <main className="relative min-h-screen w-full flex justify-center bg-black overflow-hidden font-sans text-white selection:bg-white/20">
      <Background modeId={activeMode} />
      
      <div className="relative w-full max-w-[430px] h-[100dvh] flex flex-col mx-auto sm:border-x sm:border-white/5 bg-black/20 backdrop-blur-[10px] sm:backdrop-blur-[20px]">
        {/* Header */}
        <header className="px-6 pt-12 pb-4 flex items-center justify-between z-20 shrink-0">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setConnected(!connected)}
          >
            <div className={`p-2 rounded-full transition-colors duration-500 ${connected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'}`}>
              <Bluetooth className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-white/80 transition-colors">{connected ? 'Aura Mask 已连接' : '未连接'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <span className="text-xs font-medium">{battery}%</span>
            {battery > 80 ? <BatteryFull className="w-5 h-5" /> : battery > 30 ? <BatteryMedium className="w-5 h-5" /> : <BatteryLow className="w-5 h-5 text-red-400" />}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-28">
          <AnimatePresence mode="wait">
            {activeTab === 'control' && <ControlTab key="control" activeMode={activeMode} setActiveMode={setActiveMode} timer={timer} setTimer={setTimer} />}
            {activeTab === 'alarm' && <AlarmTab key="alarm" />}
            {activeTab === 'jetlag' && <JetLagTab key="jetlag" />}
            {activeTab === 'settings' && <SettingsTab key="settings" />}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full pb-8 pt-4 px-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none">
          <div className="flex items-center justify-around bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl pointer-events-auto">
            {TABS.map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="relative px-4 py-3 flex items-center justify-center rounded-full transition-colors outline-none"
              >
                {activeTab === t.id && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/20 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                )}
                <t.icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${activeTab === t.id ? 'text-white' : 'text-white/40'}`} />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}

// Subcomponents

function Background({ modeId }: { modeId: string }) {
  const mode = MODES.find(m => m.id === modeId) || MODES[3];
  
  return (
    <div className="absolute inset-0 -z-10 bg-neutral-950 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-50 sm:opacity-60">
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, 40, 80, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] sm:w-[800px] sm:h-[800px] rounded-full blur-[100px] transition-colors duration-[3000ms] ease-in-out ${mode.colors[0]} opacity-50`}
        />
        
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, -50, -100, 0],
            scale: [1, 1.1, 1.3, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[-20%] right-[-20%] w-[140vw] h-[140vw] sm:w-[900px] sm:h-[900px] rounded-full blur-[120px] transition-colors duration-[3000ms] ease-in-out ${mode.colors[1]} opacity-40`}
        />

        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -70, 50, 0],
            scale: [1, 1.3, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[30%] left-[10%] w-[100vw] h-[100vw] sm:w-[700px] sm:h-[700px] rounded-full blur-[90px] transition-colors duration-[3000ms] ease-in-out ${mode.colors[2]} opacity-30`}
        />
      </div>
      
      {/* Subtle noise texture for premium feel */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
    </div>
  )
}

function ControlTab({ activeMode, setActiveMode, timer, setTimer }: any) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[3];
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center px-6 pt-6"
    >
      {/* Central Visualizer */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
           transition={{ duration: activeMode === 'resonance' ? 11 : activeMode === '478' ? 19 : 6, repeat: Infinity, ease: "easeInOut" }}
           className={`absolute inset-0 rounded-full blur-3xl ${mode.colors[1]} opacity-30 transition-colors duration-1000`}
        />
        <div className="relative z-10 w-48 h-48 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-xl bg-white/5 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]">
           <mode.icon className="w-16 h-16 text-white/90" strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-20 pointer-events-none">
          <p className="text-white/60 text-sm tracking-widest whitespace-nowrap">{mode.name}</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="w-full flex gap-3 overflow-x-auto no-scrollbar py-4 snap-x snap-mandatory px-1">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id)}
            className={`snap-center shrink-0 w-36 p-4 rounded-3xl border flex flex-col items-start gap-4 transition-all duration-500 outline-none
              ${activeMode === m.id ? 'bg-white/20 border-white/30 backdrop-blur-xl shadow-xl' : 'bg-white/5 border-white/5 backdrop-blur-md text-white/50 hover:bg-white/10'}`}
          >
            <div className={`p-2.5 rounded-full transition-colors duration-500 ${activeMode === m.id ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className={`font-medium text-sm transition-colors duration-500 ${activeMode === m.id ? 'text-white' : 'text-white/70'}`}>{m.name}</p>
              <p className="text-[10px] mt-1 text-white/50 line-clamp-2 leading-relaxed">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Timer Slider */}
      <div className="w-full mt-6 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-white/50 font-medium tracking-wide">定时关闭</p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-4xl font-display font-light text-white">{timer}</p>
              <p className="text-sm text-white/50">分钟</p>
            </div>
          </div>
          <Clock className="w-6 h-6 text-white/20 mb-1" strokeWidth={1.5} />
        </div>
        <div className="relative w-full h-8 flex items-center">
          <input 
            type="range" 
            min="1" max="60" 
            value={timer} 
            onChange={e => setTimer(parseInt(e.target.value))}
            className="w-full relative z-10"
          />
          {/* Custom progress fill overlay */}
          <div 
            className="absolute left-0 h-1 bg-white rounded-l-full pointer-events-none transition-all duration-75"
            style={{ width: `calc(${(timer - 1) / 59 * 100}% + 2px)` }}
          />
        </div>
      </div>
    </motion.div>
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
      initial={{ opacity: 0, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="px-6 pt-6"
    >
      <h2 className="text-3xl font-display font-light mb-8">光效闹钟</h2>
      
      <div className="space-y-4">
        {alarms.map((alarm) => (
          <div key={alarm.id} className={`p-5 rounded-3xl border transition-all duration-500 flex justify-between items-center ${alarm.enabled ? 'bg-white/10 border-white/20 backdrop-blur-xl' : 'bg-white/5 border-white/5 opacity-60 backdrop-blur-md'}`}>
            <div>
              <p className="text-4xl font-light font-display tracking-tight">{alarm.time}</p>
              <div className="flex gap-2 mt-3 items-center">
                <span className="text-xs font-medium text-white/80 bg-white/10 px-2.5 py-1 rounded-full">{alarm.label}</span>
                <span className="text-xs text-white/40">{alarm.days}</span>
              </div>
            </div>
            {/* Toggle Switch */}
            <button 
              onClick={() => toggleAlarm(alarm.id)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 flex items-center outline-none ${alarm.enabled ? 'bg-white' : 'bg-white/20'}`}
            >
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full shadow-sm ${alarm.enabled ? 'bg-neutral-900 ml-6' : 'bg-white/80'}`}
              />
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-4 rounded-[1.5rem] border border-white/20 text-white/80 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors backdrop-blur-md">
        <Plus className="w-5 h-5" />
        <span className="font-medium text-sm tracking-wide">添加闹钟</span>
      </button>

      <p className="text-center mt-8 text-xs text-white/40 leading-relaxed px-4">
        眼罩会在闹钟时间前 30 分钟逐渐亮起<br/>模拟日出自然唤醒。
      </p>
    </motion.div>
  )
}

function JetLagTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="px-6 pt-6 pb-12"
    >
      <h2 className="text-3xl font-display font-light mb-8">时差调整</h2>
      
      <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/30 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
        <Plane className="w-6 h-6 text-white/90 mb-5 relative z-10" />
        <h3 className="text-xl mb-1 font-medium relative z-10">前往：巴黎 (CDG)</h3>
        <p className="text-sm text-white/60 mb-8 relative z-10">相差 7 小时 • 3天后起飞</p>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs text-white/50 mb-1">出发地</p>
            <p className="text-2xl font-light">北京</p>
            <p className="text-sm text-white/60 mt-1 font-display tracking-wide">21:00</p>
          </div>
          <div className="flex-1 px-6 flex items-center">
             <div className="h-[1px] bg-white/20 w-full relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white bg-black"></div>
             </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50 mb-1">目的地</p>
            <p className="text-2xl font-light">巴黎</p>
            <p className="text-sm text-blue-300 mt-1 font-display tracking-wide">14:00</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-medium text-white/80 mb-4 px-2 tracking-wide">今日光照建议</h3>
      <div className="space-y-3">
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex gap-4">
          <div className="mt-1 shrink-0">
             <Sun className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-white/90">寻求光照</p>
              <p className="text-xs font-display text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full">08:00 - 12:00</p>
            </div>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">推荐使用眼罩的「正念模式」或前往户外接触自然光，帮助推迟生物钟。</p>
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex gap-4">
          <div className="mt-1 shrink-0">
             <Moon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-white/90">避免光照</p>
              <p className="text-xs font-display text-indigo-400/80 bg-indigo-400/10 px-2 py-0.5 rounded-full">20:00 - 23:00</p>
            </div>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">佩戴眼罩遮光，或使用「4-7-8 呼吸模式」准备入睡。</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SettingsTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="px-6 pt-6 pb-12"
    >
      <h2 className="text-3xl font-display font-light mb-8">设备设置</h2>
      
      <div className="space-y-4">
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
          <div>
            <p className="font-medium">眼罩亮度上限</p>
            <p className="text-[11px] text-white/50 mt-1">控制最大亮度，保护暗适应视力</p>
          </div>
          <span className="text-sm text-white/80 font-medium">70%</span>
        </div>
        
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
          <div>
            <p className="font-medium">呼吸光效平滑度</p>
            <p className="text-[11px] text-white/50 mt-1">影响光线明暗变化的曲线</p>
          </div>
          <span className="text-sm text-white/80 font-medium">自然 (正弦)</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-red-500/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-red-500/10 transition-colors mt-8">
           <p className="font-medium text-red-400">断开连接</p>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-xs text-white/30 font-display">AURA MASK OS v1.2.4</p>
      </div>
    </motion.div>
  )
}

