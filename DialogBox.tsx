import React, { useState, useEffect } from 'react';
import { sounds } from '../audio';

export interface DialogProps {
  speaker: string;
  role: string;
  text: string;
  avatar?: string;
  options?: {
    text: string;
    onSelect: () => void;
  }[];
  onNext?: () => void;
  onClose?: () => void;
}

export const DialogBox: React.FC<DialogProps> = ({
  speaker,
  role,
  text,
  avatar = 'NPC',
  options,
  onNext,
  onClose
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        if (index % 3 === 0) {
          sounds.playTextBlip();
        }
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  const handleAdvance = () => {
    if (isTyping) {
      // Fast forward text
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      sounds.playSelect();
      if (onNext) onNext();
      else if (onClose) onClose();
    }
  };

  return (
    <div
      onClick={handleAdvance}
      className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-40 bg-slate-900 border-4 border-slate-600 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] cursor-pointer select-none animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Speaker Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-800 border-2 border-white/40 flex flex-col items-center justify-center font-bold text-white shrink-0 shadow">
          <span className="text-xs font-pixel">{avatar}</span>
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-cyan-300 font-pixel">
              {speaker}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
              {role}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
            {displayedText}
          </p>

          {/* Options if provided */}
          {!isTyping && options && options.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    sounds.playSelect();
                    opt.onSelect();
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 rounded-xl text-left text-xs text-slate-200 font-bold transition-all active:scale-98"
                >
                  ▶ {opt.text}
                </button>
              ))}
            </div>
          )}

          {/* Blinking advance cursor */}
          {!isTyping && (!options || options.length === 0) && (
            <div className="text-right mt-1 text-[10px] font-pixel text-cyan-400 animate-bounce">
              ▼ [ESPACIO / CLIC]
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
