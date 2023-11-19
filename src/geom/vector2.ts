import { Point } from './types';

export class Vector2 implements Point {
  constructor(public x: number, public y: number) {}

  public get sqrMagnitude() {
    return this.x * this.x + this.y * this.y;
  }

  public get magnitude() {
    return Math.sqrt(this.sqrMagnitude);
  }

  public get normalized() {
    return Vector2.normalize(this);
  }

  public add(v: Point) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  public subtract(v: Point) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  public multiply(v: number) {
    return new Vector2(this.x * v, this.y * v);
  }

  public divide(v: number) {
    return new Vector2(this.x / v, this.y / v);
  }

  public static normalize(v: Vector2) {
    const l = v.magnitude;
    if (l <= 0) return new Vector2(0, 0);

    return v.divide(l);
  }

  public static distance(p1: Point, p2: Point) {
    return Math.sqrt(Vector2.sqrDistance(p1, p2));
  }

  public static sqrDistance(p1: Point, p2: Point) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return dx * dx + dy * dy;
  }
}
