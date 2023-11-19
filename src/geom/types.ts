import { Vector2 } from './vector2';

export interface Point {
  x: number;
  y: number;
}

export type Segment = [Point, Point];

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
}

export interface SegmentHit {
  segment: Segment;
  point: Point;
}

export interface RaycastHit {
  point: Point;
  segment: Segment;
  gameObject: Rect; // TODO
}

export interface SegmentContact {
  segment: Segment;
  point: Point;
}

export interface RectContact {
  gameObject: Rect; // TODO
  point: Point;
  penetration: number; // how deep one object enetered other
  extrusion: Vector2; // direction and force like obstacle pushes out the object
}
