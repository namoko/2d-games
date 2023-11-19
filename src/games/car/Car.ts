import { Sprite } from '../../common/Sprite';
import {
  angleMod,
  findRayRectIntersections,
  getRectPoints,
  radMod,
} from '../../geom/raycast';
import { Point, RaycastHit } from '../../geom/types';
import { Vector2 } from '../../geom/vector2';
import { isKeyPressed } from '../../input';
import { SpriteEntry } from '../../types';
import { GameModel } from './types';

const maxForwardSpeed = 200;
const maxBackwardSpeed = -100;

const DEG2RAD = Math.PI / 180;

export class Car extends Sprite {
  private acceleration = 200;
  private deceleration = 150;
  private inertiaSpeed = 100;
  private angularSpeed = 0.5;
  private turnFriction = 30;
  private speed = new Vector2(0, 0);
  private mass = 10;

  constructor(
    container: Element,
    cfg: SpriteEntry,
    private gameModel: GameModel
  ) {
    super(container, cfg);
    this.root.classList.add('car');

    this.w = 160;
    this.h = 70;
  }

  public update(dt: number) {
    // if (isKeyPressed('ArrowLeft')) {
    //   this.angle -= this.angularSpeed * dt;
    // } else if (isKeyPressed('ArrowRight')) {
    //   this.angle += this.angularSpeed * dt;
    // }

    console.log('up', isKeyPressed('ArrowLeft'));

    // if (isKeyPressed('ArrowLeft') && isKeyPressed('Shift')) {
    if (isKeyPressed('ArrowLeft')) {
      // console.log('lll');
      this.angle -= 1;
      // } else if (isKeyPressed('ArrowRight') && isKeyPressed('Shift')) {
    } else if (isKeyPressed('ArrowRight')) {
      this.angle += 1;
    }

    // if (isKeyPressed('ArrowUp')) {
    //   this.moveSpeed = Math.min(
    //     maxForwardSpeed,
    //     (this.moveSpeed += this.acceleration * dt)
    //   );
    // } else if (isKeyPressed('ArrowDown')) {
    //   this.moveSpeed = Math.max(
    //     maxBackwardSpeed,
    //     (this.moveSpeed -= this.deceleration * dt)
    //   );
    // } else {
    //   if (this.moveSpeed > 0) {
    //     this.moveSpeed = Math.max(0, this.moveSpeed - this.inertiaSpeed * dt);
    //   } else if (this.moveSpeed < 0) {
    //     this.moveSpeed = Math.min(0, this.moveSpeed + this.inertiaSpeed * dt);
    //   }
    // }

    const inertiaDirection = Vector2.normalize(this.speed.multiply(-1));
    const inertia = inertiaDirection.multiply(this.inertiaSpeed * dt);
    this.speed = this.speed.add(inertia);

    // let collisionWith: Rect | undefined = undefined;
    // for (let i = 0; i < this.gameModel.obstacles.length; i++) {
    //   const obs = this.gameModel.obstacles[i];
    //   if (intersectsRect(this, obs)) {
    //     this.moveSpeed = -this.moveSpeed;
    //     collisionWith = obs;
    //     break;
    //   }
    // }

    // if (this.showDebug) {
    //   const points = getRectPoints(this);
    //   //console.log(JSON.stringify(points));
    //   const intersects = this.gameModel.obstacles.some((obs) =>
    //     intersectsRect(this, obs)
    //   );

    //   const ctx = this.gameModel.debugCtx;

    //   ctx.clearRect(0, 0, 1000, 1000);
    //   ctx.strokeStyle = intersects ? 'red' : 'green';
    //   ctx.lineWidth = 2;
    //   ctx.beginPath();
    //   ctx.moveTo(points[0].x, points[0].y);
    //   ctx.lineTo(points[1].x, points[1].y);
    //   ctx.lineTo(points[2].x, points[2].y);
    //   ctx.lineTo(points[3].x, points[3].y);
    //   ctx.lineTo(points[0].x, points[0].y);
    //   ctx.stroke();
    // }

    const rad = this.angle * DEG2RAD;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // if (collisionWith) {
    //   const cross = crossProduct(
    //     {
    //       x: this.x,
    //       y: this.y,
    //     },
    //     {
    //       x: this.x + dx,
    //       y: this.y + dy,
    //     },
    //     {
    //       x: collisionWith.x,
    //       y: collisionWith.y,
    //     }
    //   );
    //   console.log('onLeft =', cross < 0, cross);
    //   this.sideSpeed = (Math.abs(this.moveSpeed) / 10) * -Math.sign(cross);
    // } else {
    //   if (this.sideSpeed > 0) {
    //     this.sideSpeed = Math.max(0, this.sideSpeed - this.inertiaSpeed * dt);
    //   } else if (this.sideSpeed < 0) {
    //     this.sideSpeed = Math.min(0, this.sideSpeed + this.inertiaSpeed * dt);
    //   }
    // }

    if (this.speed.y !== 0) {
      this.y += this.speed.y * dt;
    }

    if (this.speed.x !== 0) {
      this.x += this.speed.x * dt;
    }

    if (this.angularSpeed !== 0) {
      this.angle += this.angularSpeed * dt;

      const frictionDirection = -Math.sign(this.angularSpeed);
      this.angularSpeed += frictionDirection * this.turnFriction * dt;
      // if (Math.sign(this.angularSpeed) === frictionDirection)
      //   this.angularSpeed = 0;
      // console.log('this.angularSpeed', this.angularSpeed, frictionDirection);
    }
  }

  public addImpulse(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    mass: number
  ) {
    //console.log('addImpulse', x1, y1, x2, y2, mass);

    // const deltaX = x2 - x1;
    // const deltaY = y2 - y1;
    // const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // const energy = distance * mass;

    // const impulseX = (energy * deltaX) / distance;
    // const impulseY = (energy * deltaY) / distance;

    // // Применяем импульс к линейной скорости
    // this.speed.x += impulseX / this.mass;
    // this.speed.y += impulseY / this.mass;

    // // Рассчитываем изменение угловой скорости (момента импульса)
    // const torque = deltaX * this.h * impulseY - deltaY * this.w * impulseX;
    // console.log('torque', torque);

    // // Применяем импульс к угловой скорости
    // const angSpeedDelta =
    //   torque / (this.mass * (this.w * this.w + this.h * this.h));
    // console.log('angSpeedDelta', angSpeedDelta);
    // this.angularSpeed += angSpeedDelta;

    const p1 = { x: x1, y: y1 };
    const p2 = { x: x2, y: y2 };
    const raycastHit = this.raycast(p1, p2);
    // console.log('===', intersectionPoint);

    if (raycastHit) {
      const bulletSpeed = Vector2.distance(p1, p2);

      // Calculate the distance from the center of the object to the intersection point
      const dx = raycastHit.point.x - this.x;
      const dy = raycastHit.point.y - this.y;
      // console.log('dx dy', distanceX, distanceY);

      // Calculate the angle between the direction of the force and the object's orientation
      const angle = radMod(Math.atan2(dy, dx) - this.angle * DEG2RAD);
      console.log('angle=', angleMod(angle / DEG2RAD));

      // Calculate the impulse based on the bullet's mass and speed
      const impulse = mass * bulletSpeed;
      // console.log('impulse', impulse);
      const relativeImpulse = impulse / this.mass;

      // Apply the impulse to the object
      const ix = relativeImpulse * Math.cos(angle);
      const iy = relativeImpulse * Math.sin(angle);
      // console.log('ix iy', ix, iy);
      //this.speed.x += ix;
      //this.speed.y += iy;

      const [start, end] = raycastHit.segment;
      const segmentVector = new Vector2(end.x, end.y);
      const dir = segmentVector.subtract(start);
      const normalized = new Vector2(dir.y, -dir.x).normalized.multiply(100);

      // debug.drawLine(
      //   raycastHit.point.x,
      //   raycastHit.point.y,
      //   raycastHit.point.x + normalized.x,
      //   raycastHit.point.y + normalized.y,
      //   '#0f0',
      //   1000
      // );

      // Apply angular impulse based on the perpendicular distance from the object's center
      // const perpendicularDistance = dx * Math.sin(angle) - dy * Math.cos(angle);
      // this.angularSpeed += relativeImpulse * perpendicularDistance;

      this.angularSpeed -= (relativeImpulse * angle) / DEG2RAD;
    }
  }

  private raycast = (p1: Point, p2: Point): RaycastHit | undefined => {
    const rectPoints = getRectPoints(this);

    const intersections = findRayRectIntersections(p1, p2, rectPoints);
    if (intersections.length < 1) return;

    const sorted = intersections.sort((a, b) => {
      const distA = Vector2.sqrDistance(p1, a.point);
      const distB = Vector2.sqrDistance(p1, b.point);

      return distA - distB;
    });

    const closest = sorted[0];

    return {
      gameObject: this,
      point: closest.point,
      segment: closest.segment,
    };
  };
}
