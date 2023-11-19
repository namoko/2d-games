import { DEG2RAD, PI2 } from './const';
import { Point, Rect, RectContact, SegmentHit } from './types';

/**
 * Simple Rect intersection calucaltion
 */
export function intersectsRect(r1: Rect, r2: Rect) {
  const ps1 = getRectPoints(r1);
  const ps2 = getRectPoints(r2);

  for (let i = 0, j = ps1.length - 1; i < ps1.length; j = i++) {
    const l1 = ps1[j];
    const l2 = ps1[i];

    if (segmentIntersectsRect(l1, l2, ps2)) return true;
  }
}

export function getRectIntersections(r1: Point[], r2: Point[]): SegmentHit[] {
  const ret: SegmentHit[] = [];

  for (let i = 0, j = r1.length - 1; i < r1.length; j = i++) {
    const l1 = r1[j];
    const l2 = r1[i];

    const points = getSegmentRectIntersections(l1, l2, r2);

    ret.push(...points);
  }

  return ret;
}

export function getAveragePoint(points: Point[]): Point {
  const l = points.length;
  if (l < 1) return null;

  let x = 0;
  let y = 0;
  points.forEach((p) => {
    x += p.x;
    y += p.y;
  });
  return {
    x: x / l,
    y: y / l,
  };
}

export function getSegmentRectIntersections(
  s1: Point,
  s2: Point,
  rect: Point[]
): SegmentHit[] {
  const ret: SegmentHit[] = [];

  for (let i = 0, j = rect.length - 1; i < rect.length; j = i++) {
    const l1 = rect[j];
    const l2 = rect[i];

    const point = findSegmentIntersection(l1, l2, s1, s2);
    if (point)
      ret.push({
        point,
        segment: [l1, l2],
      });
  }

  return ret;
}

export function segmentIntersectsRect(s1: Point, s2: Point, rect: Point[]) {
  for (let i = 0, j = rect.length - 1; i < rect.length; j = i++) {
    const l1 = rect[j];
    const l2 = rect[i];

    if (areSegmentsIntersecting(l1, l2, s1, s2)) return true;
  }
}

export function areSegmentsIntersecting(
  a1: Point,
  a2: Point,
  b1: Point,
  b2: Point
) {
  return (
    crossProduct(a1, b1, b2) * crossProduct(a2, b1, b2) <= 0 &&
    crossProduct(b1, a1, a2) * crossProduct(b2, a1, a2) <= 0
  );
}

export function findRectIntersection(r1: Rect, r2: Rect) {
  const ps1 = getRectPoints(r1);
  const ps2 = getRectPoints(r2);

  for (let i = 0, j = ps1.length - 1; i < ps1.length; j = i++) {
    const l1 = ps1[j];
    const l2 = ps1[i];

    if (segmentIntersectsRect(l1, l2, ps2)) return true;
  }
}

export function findRayRectIntersections(
  rayStart: Point,
  rayEnd: Point,
  rect: Point[]
) {
  const ret: SegmentHit[] = [];

  for (let i = 0, j = rect.length - 1; i < rect.length; j = i++) {
    const l1 = rect[j];
    const l2 = rect[i];

    const point = findSegmentIntersection(l1, l2, rayStart, rayEnd);
    if (point !== null)
      ret.push({
        point,
        segment: [l1, l2],
      });
  }

  return ret;
}

export function findSegmentIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null {
  const det = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);

  if (det === 0) {
    // The segments are parallel or coincident, no intersection
    return null;
  }

  const lambda =
    ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
  const gamma =
    ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;

  if (lambda >= 0 && lambda <= 1 && gamma >= 0 && gamma <= 1) {
    // The segments intersect
    const intersectionX = p1.x + lambda * (p2.x - p1.x);
    const intersectionY = p1.y + lambda * (p2.y - p1.y);

    return { x: intersectionX, y: intersectionY };
  } else {
    // The segments do not intersect
    return null;
  }
}

// endregion

export function getRectPoints(r: Rect): Point[] {
  const rad = r.angle * DEG2RAD;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  const { x, y } = r;
  const w2 = r.w / 2;
  const h2 = r.h / 2;

  return [
    // lu
    {
      x: x - w2 * cos + h2 * sin,
      y: y - h2 * cos - w2 * sin,
    },
    // ru
    {
      x: x + w2 * cos + h2 * sin,
      y: y - h2 * cos + w2 * sin,
    },
    // rd
    {
      x: x + w2 * cos - h2 * sin,
      y: y + h2 * cos + w2 * sin,
    },
    // ld
    {
      x: x - w2 * cos - h2 * sin,
      y: y + h2 * cos - w2 * sin,
    },
  ];
}

export function pointInsideRectPoint(p: Point, rect: Point[]) {
  for (let i = 0, j = rect.length - 1; i < rect.length; j = i++) {
    const l1 = rect[j];
    const l2 = rect[i];

    if (!isPointOnRightSide(l1, l2, p)) return false;
  }

  return true;
}

export function isPointOnRightSide(l1: Point, l2: Point, p: Point): boolean {
  const crossProduct =
    (l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x);

  return crossProduct <= 0;
}

export function crossProduct(l1: Point, l2: Point, p: Point): number {
  return (l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x);
}

export function angleMod(angle: number) {
  angle = (angle % 360) + 360;
  return ((angle + 180) % 360) - 180;
}

export function radMod(rad: number) {
  rad = (rad % PI2) + PI2;
  return ((rad + Math.PI) % PI2) - Math.PI;
}
