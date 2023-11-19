export interface Game {
  destroy(): void;
}

export interface SpriteEntry {
  src: string;
  width: number;
  angle?: number;
  cx?: number; // percents
  cy?: number; // percents
}
