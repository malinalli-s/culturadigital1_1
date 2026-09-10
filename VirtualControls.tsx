import React, { useRef, useEffect } from 'react';
import { Direction } from '../types';
import { BookOpen, ClipboardList, Volume2, VolumeX, Compass } from 'lucide-react';
import { sounds } from '../audio';

interface VirtualControlsProps {
  onMove: (dir: Direction) => void;
  onStopMove: () => void;
  onAction: () => void;
  onCancel?: () => void;
  onOpenDex: () => void;
  onOpenReport: () => void;
  onToggleAudio: () => void;
  isMuted: boolean;
  currentZone: number;
  onSelectZone: (zoneId: number) => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMove,
  onStopMove,
  onAction,
  onCancel,
  onOpenDex,
  onOpenReport,
  onToggleAudio,
  isMuted,
  currentZone,
  onSelectZone
}) => {
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMoving = (dir: Direction) => {
    onMove(dir);
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = setInterval(() => {
      onMove(dir);
    }, 120);
  };

  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    onStopMove();
  };

  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-slate-900 border-t-2 border-slate-800 p-2 sm:p-3 select-none flex flex-col gap-2">
      {/* Top Bar: Quick Zone Nav + Utility shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        {/* Zone switcher tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-[10px] font-pixel text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" /> ZONAS:
          </span>
          {[1, 2, 3, 4, 5, 6, 7].map(zid => (
            <button
              key={zid}
              onClick={() => {
                sounds.playSelect();
                onSelectZone(zid);
              }}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                currentZone === zid
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={`Ir a Zona ${zid}`}
            >
              Z{zid}
            </button>
          ))}
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playSelect();
              onOpenDex();
            }}
            className="px-2.5 py-1 bg-red-800 hover:bg-red-700 border border-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
            <span>DEX-Glosario</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelect();
              onOpenReport();
            }}
            className="px-2.5 py-1 bg-indigo-800 hover:bg-indigo-700 border border-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-300" />
            <span>Bitácora</span>
          </button>

          <button
            onClick={onToggleAudio}
            className={`p-1.5 rounded-lg border text-xs ${
              isMuted
                ? 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-emerald-950 border-emerald-500 text-emerald-400'
            }`}
            title={isMuted ? 'Activar sonido retro' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Touch Controller: D-Pad on left, A & B buttons on right */}
      <div className="flex items-center justify-between px-2 sm:px-6 pt-1">
        {/* Virtual D-Pad (Game Boy style cross) */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Background Cross Plate */}
          <div className="absolute w-28 h-10 bg-slate-950 rounded-md border-2 border-slate-800 shadow-inner"></div>
          <div className="absolute w-10 h-28 bg-slate-950 rounded-md border-2 border-slate-800 shadow-inner"></div>
          <div className="absolute w-8 h-8 rounded-full bg-slate-900 border border-slate-800 z-0"></div>

          {/* UP */}
          <button
            onMouseDown={() => startMoving('up')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={e => { e.preventDefault(); startMoving('up'); }}
            onTouchEnd={e => { e.preventDefault(); stopMoving(); }}
            className="absolute top-1 w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-t-md text-white font-bold flex items-center justify-center shadow transition-all active:scale-95 z-10"
            aria-label="Arriba"
          >
            ▲
          </button>

          {/* DOWN */}
          <button
            onMouseDown={() => startMoving('down')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={e => { e.preventDefault(); startMoving('down'); }}
            onTouchEnd={e => { e.preventDefault(); stopMoving(); }}
            className="absolute bottom-1 w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-b-md text-white font-bold flex items-center justify-center shadow transition-all active:scale-95 z-10"
            aria-label="Abajo"
          >
            ▼
          </button>

          {/* LEFT */}
          <button
            onMouseDown={() => startMoving('left')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={e => { e.preventDefault(); startMoving('left'); }}
            onTouchEnd={e => { e.preventDefault(); stopMoving(); }}
            className="absolute left-1 w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-l-md text-white font-bold flex items-center justify-center shadow transition-all active:scale-95 z-10"
            aria-label="Izquierda"
          >
            ◀
          </button>

          {/* RIGHT */}
          <button
            onMouseDown={() => startMoving('right')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={e => { e.preventDefault(); startMoving('right'); }}
            onTouchEnd={e => { e.preventDefault(); stopMoving(); }}
            className="absolute right-1 w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-r-md text-white font-bold flex items-center justify-center shadow transition-all active:scale-95 z-10"
            aria-label="Derecha"
          >
            ▶
          </button>
        </div>

        {/* Center helper hint */}
        <div className="hidden sm:flex flex-col items-center text-center text-[10px] text-slate-500 font-mono">
          <span>TECLADO FÍSICO:</span>
          <span className="text-slate-400">Flechas / WASD para mover</span>
          <span className="text-slate-400">ESPACIO / ENTER = Acción</span>
        </div>

        {/* Action Buttons: A (Primary) & B (Cancel) */}
        <div className="flex items-center gap-4">
          {/* B Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sounds.playSelect();
                if (onCancel) onCancel();
              }}
              className="w-13 h-13 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border-2 border-slate-600 text-slate-300 font-pixel font-bold text-sm shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
            >
              B
            </button>
            <span className="text-[9px] font-pixel text-slate-500 mt-1">CANCEL</span>
          </div>

          {/* A Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sounds.playSelect();
                onAction();
              }}
              className="w-15 h-15 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 border-3 border-red-400 text-white font-pixel font-bold text-base shadow-[0_4px_12px_rgba(239,68,68,0.4)] active:scale-95 flex items-center justify-center cursor-pointer"
            >
              A
            </button>
            <span className="text-[9px] font-pixel text-red-400 mt-1">ACCIÓN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
