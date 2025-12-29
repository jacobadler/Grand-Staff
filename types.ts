
export type NoteName = 
  | 'C3' | 'C#3' | 'D3' | 'D#3' | 'E3' | 'F3' | 'F#3' | 'G3' | 'G#3' | 'A3' | 'A#3' | 'B3'
  | 'C4' | 'C#4' | 'D4' | 'D#4' | 'E4' | 'F4' | 'F#4' | 'G4' | 'G#4' | 'A4' | 'A#4' | 'B4';

export interface NoteDefinition {
  name: NoteName;
  frequency: number;
  type: 'white' | 'black';
  label?: string; // e.g., "Do", "Re" or just "C"
  keyTrigger?: string; // Keyboard shortcut
}

export interface PlayableNote extends NoteDefinition {
  isPlaying: boolean;
}

export interface MelodyRequest {
  mood: string;
}

export interface GeneratedMelody {
  title: string;
  notes: NoteName[];
  description: string;
}
