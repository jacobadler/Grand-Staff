import React, { useState, useCallback, useRef } from 'react';
import { OCTAVE_DATA } from '../constants';
import { audioService } from '../services/audioService';
import { NoteDefinition, NoteName } from '../types';
import Key from './Key';

interface PianoProps {
  onNotePlayed?: (note: NoteName) => void;
}

const Piano: React.FC<PianoProps> = ({ onNotePlayed }) => {
  const [activeNotes, setActiveNotes] = useState<Set<NoteName>>(new Set());
  const timeoutRefs = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const playNote = useCallback((note: NoteDefinition) => {
    // Audio
    audioService.playTone(note.frequency);
    
    // Visual State
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.add(note.name);
      return newSet;
    });

    // Callback for parent
    if (onNotePlayed) {
      onNotePlayed(note.name);
    }

    // Clear existing timeout for this note if rapidly clicked
    if (timeoutRefs.current[note.name]) {
      clearTimeout(timeoutRefs.current[note.name]);
    }

    // Remove active state after a short duration (visual feedback duration)
    timeoutRefs.current[note.name] = setTimeout(() => {
      setActiveNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note.name);
        return newSet;
      });
    }, 400);
  }, [onNotePlayed]);

  const whiteKeys = OCTAVE_DATA.filter(n => n.type === 'white');
  const blackKeys = OCTAVE_DATA.filter(n => n.type === 'black');

  // SVG Configuration
  // Expanded Grand Staff Logic
  // We split the rendering coordinate system at C4 to create a visual gap between staves.
  
  const getNoteY = (noteName: string) => {
    const octave = parseInt(noteName.slice(-1), 10);
    const letter = noteName.charAt(0); 
    const offsets: Record<string, number> = { 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6 };
    const letterOffset = offsets[letter];
    
    // Calculate "steps" from C4 (0 is C4, -1 is B3, 1 is D4)
    const stepsFromC4 = (octave - 4) * 7 + letterOffset;

    // Treble Staff Logic (Octave 4 and above)
    // C4 is effectively "Middle C" often written with Treble clef if leading up.
    if (stepsFromC4 >= 0) {
        // Anchor: C4 is on the first ledger line below treble staff.
        // Let's position Treble Staff Bottom (E4) at Y=100.
        // E4 is 2 steps above C4. 
        // So C4 is at Y=120.
        const C4_TREBLE_Y = 120;
        return C4_TREBLE_Y - (stepsFromC4 * 10);
    } 
    // Bass Staff Logic (Below C4)
    else {
        // Anchor: A3 is the top line of Bass Staff.
        // Let's position Bass Staff Top (A3) at Y=190. (Gap of 90px from E4 line, or 50px extra space).
        // A3 is 2 steps below C4.
        // So "Virtual C4" for Bass projection is Y=170.
        const C4_BASS_Y = 170;
        return C4_BASS_Y - (stepsFromC4 * 10);
    }
  };

  // Treble Staff Lines: F5, D5, B4, G4, E4
  // If E4 is at 100, then:
  // E4=100, G4=80, B4=60, D5=40, F5=20
  const trebleLines = [20, 40, 60, 80, 100];

  // Bass Staff Lines: A3, F3, D3, B2, G2
  // If A3 is at 190, then:
  // A3=190, F3=210, D3=230, B2=250, G2=270
  const bassLines = [190, 210, 230, 250, 270];

  return (
    <div className="flex flex-col items-center w-full max-w-6xl">
      
       {/* Dynamic SVG Grand Staff */}
       <div className="w-full bg-amber-50 rounded-t-lg border-x-4 border-t-4 border-gray-900 relative shadow-sm overflow-hidden">
          <svg 
            viewBox="0 0 1000 320" 
            className="w-full h-auto block" 
            preserveAspectRatio="none"
          >
            {/* Staff Lines */}
            <g stroke="#94a3b8" strokeWidth="2">
              {trebleLines.map(y => <line key={`t-${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
              {bassLines.map(y => <line key={`b-${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
            </g>

            {/* Brace / Connector */}
            {/* Connects top of Treble (20) to bottom of Bass (270) */}
            <line x1="2" y1="20" x2="2" y2="270" stroke="#0f172a" strokeWidth="4" />
            <path d="M2,20 Q-15,145 2,270" fill="none" stroke="#0f172a" strokeWidth="4" />

            {/* Clef Placeholders */}
            <text x="20" y="90" fontSize="75" fill="#0f172a" fontFamily="serif" fontWeight="bold">𝄞</text>
            <text x="20" y="225" fontSize="70" fill="#0f172a" fontFamily="serif" fontWeight="bold">𝄢</text>

            {/* Notes Rendering */}
            {OCTAVE_DATA.map((note) => {
               const isWhite = note.type === 'white';
               const isActive = activeNotes.has(note.name);
               const y = getNoteY(note.name);
               
               // X Calculation (Scale 0-1000)
               let x = 0;
               if (isWhite) {
                 const whiteIndex = whiteKeys.findIndex(n => n.name === note.name);
                 x = (whiteIndex + 0.5) * (1000 / 14);
               } else {
                 const blackIndex = blackKeys.findIndex(n => n.name === note.name);
                 const boundaryIndices = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13];
                 const boundary = boundaryIndices[blackIndex] || 0;
                 x = (boundary / 14) * 1000;
               }

               const showGhost = isWhite && !isActive;

               return (
                 <g key={note.name}>
                   {/* Local Ledger Lines */}
                   {(isActive || showGhost) && (
                      <>
                        {/* Middle C (C4) Ledger Line - Y=120 */}
                        {note.name === 'C4' && (
                          <line x1={x - 18} y1={y} x2={x + 18} y2={y} stroke="black" strokeWidth="2" />
                        )}
                        {/* A2 or similar low notes might need them, but C3 is within Bass staff (Space below B2 line? No.
                            Bass Lines: G2(270), B2(250), D3(230), F3(210), A3(190).
                            C3 is above B2 line, below D3 line. It's in a space. No ledger.
                        */}
                      </>
                   )}

                   {/* Ghost Note Head */}
                   {showGhost && (
                     <circle cx={x} cy={y} r="8" fill="#e2e8f0" />
                   )}

                   {/* Active Note Head */}
                   {isActive && (
                     <g>
                       <circle 
                        cx={x} 
                        cy={y} 
                        r="10" 
                        fill="#4f46e5" 
                        className="drop-shadow-sm"
                       />
                       {!isWhite && (
                         <text 
                           x={x - 18} 
                           y={y + 8} 
                           fontSize="24" 
                           fill="#4f46e5" 
                           fontWeight="bold"
                         >♯</text>
                       )}
                     </g>
                   )}
                 </g>
               );
            })}
          </svg>
       </div>

      <div className="relative w-full h-64 md:h-80 select-none">
        {/* Piano Chassis/Frame Background */}
        <div className="absolute -inset-4 top-0 bg-gray-900 rounded-b-xl shadow-2xl translate-y-2"></div>
        
        {/* Top Red Felt Strip */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-red-900 z-0 opacity-80"></div>

        {/* Keys Container */}
        <div className="relative w-full h-full bg-black rounded-b-lg overflow-hidden shadow-inner ring-4 ring-gray-900 ring-t-0 flex">
          
          {/* Render White Keys (Flex) */}
          {whiteKeys.map((note) => (
            <Key
              key={note.name}
              note={note}
              isBlack={false}
              isPlaying={activeNotes.has(note.name)}
              onPlay={playNote}
            />
          ))}

          {/* Render Black Keys (Absolute) */}
          {blackKeys.map((note, index) => (
            <Key
              key={note.name}
              note={note}
              isBlack={true}
              offsetIndex={index}
              isPlaying={activeNotes.has(note.name)}
              onPlay={playNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;