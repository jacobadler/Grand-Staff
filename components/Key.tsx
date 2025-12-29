
import React from 'react';
import { NoteDefinition } from '../types';

interface KeyProps {
  note: NoteDefinition;
  isPlaying: boolean;
  onPlay: (note: NoteDefinition) => void;
  isBlack: boolean;
  offsetIndex?: number; // The index of the black key in the sequence of black keys
}

const Key: React.FC<KeyProps> = ({ note, isPlaying, onPlay, isBlack, offsetIndex = 0 }) => {
  const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent ghost clicks
    onPlay(note);
  };

  if (isBlack) {
    // 2 Octaves = 14 White Keys.
    // Positions are based on the gaps between white keys (1/14th increments).
    // The gaps indices (1-based relative to white keys):
    // Octave 1: C-D(1), D-E(2), F-G(4), G-A(5), A-B(6)
    // Octave 2: C-D(8), D-E(9), F-G(11), G-A(12), A-B(13)
    const boundaryIndices = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13];
    const boundary = boundaryIndices[offsetIndex] || 0;
    
    // Calculate percentage left based on 14 white keys total width
    const leftPercentage = (boundary / 14) * 100;

    return (
      <button
        onMouseDown={handleInteract}
        onTouchStart={handleInteract}
        className={`
          absolute top-0 z-20
          w-[4.5%] h-[60%]
          rounded-b border-x border-b border-black
          transition-all duration-75 ease-out
          shadow-lg
          -translate-x-1/2
          ${isPlaying 
            ? 'bg-gray-800 -mt-1 h-[59%] shadow-inner' 
            : 'bg-black hover:bg-gray-900'
          }
        `}
        style={{ left: `${leftPercentage}%` }}
        aria-label={`Play ${note.name}`}
      >
        <span className="absolute bottom-2 left-0 right-0 text-[8px] text-gray-500 text-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          {note.name}
        </span>
      </button>
    );
  }

  // White Key
  return (
    <button
      onMouseDown={handleInteract}
      onTouchStart={handleInteract}
      className={`
        relative
        flex-1 h-full
        rounded-b border border-gray-300
        transition-all duration-100 ease-out
        active:bg-gray-100
        first:rounded-bl-md last:rounded-br-md
        flex items-end justify-center pb-4
        z-10
        ${isPlaying 
          ? 'bg-indigo-100 shadow-inner translate-y-0.5' 
          : 'bg-white shadow-[0_4px_0_#cbd5e1] hover:bg-gray-50'
        }
      `}
      aria-label={`Play ${note.name}`}
    >
      <div className="flex flex-col items-center pointer-events-none select-none">
        <span className={`text-xl font-bold ${isPlaying ? 'text-indigo-600' : 'text-gray-400'}`}>
          {note.label}
        </span>
        {isPlaying && (
          <div className="absolute bottom-12 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        )}
      </div>
    </button>
  );
};

export default Key;
