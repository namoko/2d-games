import { Sprite } from '../../common/Sprite';
import { Debug } from '../../debug/debug';
import {
  getAveragePoint,
  getRectIntersections,
  getRectPoints,
  getSegmentRectIntersections,
  intersectsRect,
} from '../../geom/raycast';
import { Point, RectContact } from '../../geom/types';
import { Vector2 } from '../../geom/vector2';
import { updatePressedReleased } from '../../input';
import { GameBase } from '../GameBase';
import { Obstacle } from './Obstacle';
import { Player } from './Player';

export class PlatformerGame extends GameBase {
  // private model: GameModel = {
  //   obstacles: [],
  // }
  public debug: Debug;

  private root = document.createElement('div');

  private player: Player;

  private obs: Obstacle[] = [];

  constructor(private ctr: HTMLElement) {
    super();
    console.log('PlatformerGame.ctr()');

    this.root.className = 'game';
    ctr.appendChild(this.root);

    this.debug = new Debug(ctr);

    this.player = new Player(this.root, this);
    this.player.x = 100;
    this.player.y = 100;

    const obs1 = new Obstacle(this.root, 'transparent', 'obs1');
    obs1.x = 100;
    obs1.y = 400;
    obs1.w = 200;
    obs1.h = 20;

    const obs2 = new Obstacle(this.root, 'transparent', 'obs2');
    obs2.x = 200;
    obs2.y = 300;
    obs2.w = 200;
    obs2.h = 20;

    const obs3 = new Obstacle(this.root, 'transparent', 'obs3');
    obs3.x = 200;
    obs3.y = 500;
    obs3.w = 200;
    obs3.h = 20;

    this.obs.push(obs1, obs2, obs3);
  }

  public destroy() {
    console.log('PlatformerGame.dstr()');
    super.destroy();
    this.player.destroy();
    this.obs.forEach((o) => o.destroy());

    this.root.remove();
  }

  public get height() {
    return this.ctr.clientHeight;
  }

  public getCollisions(sprite: Sprite, kineticMoveDir: Vector2): RectContact[] {
    const spritePoints = getRectPoints(sprite);

    const ret: RectContact[] = [];
    this.obs.forEach((obs) => {
      const obsPoints = getRectPoints(obs);
      const intersections = getRectIntersections(obsPoints, spritePoints);

      if (intersections.length > 0) {
        const points = intersections.map((s) => s.point);
        // console.log('axis', axis.x, axis.y);
        const contactPoint = getAveragePoint(points);

        // console.log('moveDir1', moveDir.x, moveDir.y);
        let moveDir: Vector2;
        if (kineticMoveDir.sqrMagnitude === 0) {
          // should only happen if we inside obstacle without move, like teleport
          // moveDir = new Vector2(
          //   contactPoint.x - sprite.x,
          //   contactPoint.y - sprite.y
          // );
          moveDir = new Vector2(0, 1);
        } else {
          moveDir = kineticMoveDir;
        }

        const moveDistance = Math.max(moveDir.magnitude, sprite.w, sprite.h);
        // console.log('moveDistance', moveDistance);
        const moveDirNormalized = moveDir.normalized;
        // moveDir = moveDirNormalized.multiply(1000); // TODO size relative to move distance
        moveDir = moveDirNormalized.multiply(moveDistance);

        this.debug.drawLine(
          sprite.x,
          sprite.y,
          sprite.x + moveDirNormalized.x * 100,
          sprite.y + moveDirNormalized.y * 100,
          '#fff',
          1
        );

        let obstaclePenetration = 0;
        const obsPenetrationSegments = getSegmentRectIntersections(
          contactPoint,
          { x: contactPoint.x - moveDir.x, y: contactPoint.y - moveDir.y },
          obsPoints
        );
        if (obsPenetrationSegments.length > 0) {
          const point = obsPenetrationSegments[0].point;
          const dx = (point.x - contactPoint.x) * moveDirNormalized.x;
          const dy = (point.y - contactPoint.y) * moveDirNormalized.y;
          obstaclePenetration = Math.sqrt(dx * dx + dy * dy);

          this.debug.drawLine(
            contactPoint.x,
            contactPoint.y,
            // 0,
            // 0,
            point.x,
            point.y,
            '#ff0'
          );
        }

        let spritePenetration = 0;
        const spritePenetrationPoints = getSegmentRectIntersections(
          contactPoint,
          { x: contactPoint.x + moveDir.x, y: contactPoint.y + moveDir.y },
          spritePoints
        );
        if (spritePenetrationPoints.length > 0) {
          const point = spritePenetrationPoints[0];
          const dx = (point.point.x - contactPoint.x) * moveDirNormalized.x;
          const dy = (point.point.y - contactPoint.y) * moveDirNormalized.y;
          spritePenetration = Math.sqrt(dx * dx + dy * dy);

          this.debug.drawLine(
            contactPoint.x,
            contactPoint.y,
            // 0,
            // 0,
            point.point.x,
            point.point.y,
            '#f00'
          );
        }

        const penetration = obstaclePenetration + spritePenetration;
        const extrusion = new Vector2(
          -moveDirNormalized.x * penetration,
          -moveDirNormalized.y * penetration
        );
        const extrusionPoint: Point = {
          x: contactPoint.x + extrusion.x,
          y: contactPoint.y + extrusion.y,
        };
        // this.debug.drawLine(
        //   contactPoint.x,
        //   contactPoint.y,
        //   extrusionPoint.x,
        //   extrusionPoint.y,
        //   '#0f0'
        // );

        // this.debug.drawLine(0, 0, contactPoint.x, contactPoint.y, 'white');
        // this.debug.drawLine(
        //   contactPoint.x,
        //   contactPoint.y,
        //   contactPoint.x + moveDir.x,
        //   contactPoint.y + moveDir.y,
        //   '#0f0'
        // );

        ret.push({
          gameObject: obs,
          point: contactPoint,
          penetration,
          extrusion,
        });
      }
    });

    return ret;
  }

  protected update(dt: number) {
    updatePressedReleased();
    this.player.update(dt);
  }

  protected render() {
    this.player.render();
    this.obs.forEach((o) => o.render());
  }
}
