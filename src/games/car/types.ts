import { Sprite } from '../../common/Sprite';

export enum CarType {
  Player = 'player',
  Red1 = 'red1',
}

export interface GameModel {
  obstacles: Sprite[];
  debugCtx?: CanvasRenderingContext2D;
}
