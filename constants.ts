
import { NoteDefinition } from './types';

// Frequencies for 2 Octaves (C3 to B4)
// C3 approx 130.81 Hz, A4 = 440 Hz
export const OCTAVE_DATA: NoteDefinition[] = [
  // Octave 3
  { name: 'C3', frequency: 130.81, type: 'white', label: 'C' },
  { name: 'C#3', frequency: 138.59, type: 'black' },
  { name: 'D3', frequency: 146.83, type: 'white', label: 'D' },
  { name: 'D#3', frequency: 155.56, type: 'black' },
  { name: 'E3', frequency: 164.81, type: 'white', label: 'E' },
  { name: 'F3', frequency: 174.61, type: 'white', label: 'F' },
  { name: 'F#3', frequency: 185.00, type: 'black' },
  { name: 'G3', frequency: 196.00, type: 'white', label: 'G' },
  { name: 'G#3', frequency: 207.65, type: 'black' },
  { name: 'A3', frequency: 220.00, type: 'white', label: 'A' },
  { name: 'A#3', frequency: 233.08, type: 'black' },
  { name: 'B3', frequency: 246.94, type: 'white', label: 'B' },

  // Octave 4
  { name: 'C4', frequency: 261.63, type: 'white', label: 'C' },
  { name: 'C#4', frequency: 277.18, type: 'black' },
  { name: 'D4', frequency: 293.66, type: 'white', label: 'D' },
  { name: 'D#4', frequency: 311.13, type: 'black' },
  { name: 'E4', frequency: 329.63, type: 'white', label: 'E' },
  { name: 'F4', frequency: 349.23, type: 'white', label: 'F' },
  { name: 'F#4', frequency: 369.99, type: 'black' },
  { name: 'G4', frequency: 392.00, type: 'white', label: 'G' },
  { name: 'G#4', frequency: 415.30, type: 'black' },
  { name: 'A4', frequency: 440.00, type: 'white', label: 'A' },
  { name: 'A#4', frequency: 466.16, type: 'black' },
  { name: 'B4', frequency: 493.88, type: 'white', label: 'B' },
];

export const MOOD_OPTIONS = [
  "Happy & Upbeat",
  "Melancholy & Slow",
  "Spooky & Mysterious",
  "Energetic & Fast",
  "Calm & Lullaby"
];
