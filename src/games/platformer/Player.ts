import { Sprite } from '../../common/Sprite';
import { getRectPoints } from '../../geom/raycast';
import { Vector2 } from '../../geom/vector2';
import { isKeyDown, isKeyPressed } from '../../input';
import { PlatformerGame } from './PlatformerGame';

// const MeterSize = 20; // px

const G = 200;
const terminalVelocity = 8000;

const maxJumps = 2;
const jumpDuration = 200;

export class Player extends Sprite {
  private mass = 5;
  private speedX = 0;
  private speedY = 0;

  private grounded = false;
  private jumping = false;
  private jumpEndTime = 0;
  private jumpsLeft = 0;

  constructor(container: Element, private game: PlatformerGame) {
    super(container, { src: '', width: 0 });

    this.w = 30;
    this.h = 30;
    this.showDebug = true;
    this.debug.style.backgroundColor = 'blue';

    this.render();
  }

  public update(dt: number) {
    if (isKeyDown('ArrowLeft')) {
      this.speedX = -100;
    } else if (isKeyDown('ArrowRight')) {
      this.speedX = 100;
    } else {
      this.speedX = 0;
    }

    if (isKeyPressed('ArrowUp')) {
      console.log('up');

      if (this.grounded || this.jumpsLeft > 0) {
        this.jumpsLeft--;
        this.jumping = true;
        this.jumpEndTime = Date.now() + jumpDuration;
      }
    } else {
      this.jumping = false;
    }

    if (this.jumping && Date.now() < this.jumpEndTime) {
      this.speedY = -402;
    } else {
      this.speedY += this.mass * G * dt;
      if (this.speedY > terminalVelocity) this.speedY = terminalVelocity;
    }

    const dx = this.speedX * dt;
    const dy = this.speedY * dt;

    this.x += dx;
    this.y += dy;

    this.grounded = false;

    // check collision with ground
    const feet = this.y + this.h / 2;
    if (feet >= this.game.height) {
      this.grounded = true;
      this.jumpsLeft = maxJumps;
      this.y = Math.min(this.y, this.game.height - this.h / 2);
      this.speedY = 0;
    }

    // check collision with obstacles
    const moveDir = new Vector2(dx, dy).normalized;
    const collissions = this.game.getCollisions(this, moveDir);
    if (collissions.length > 0) {
      //console.log('collissions', collissions);

      collissions.forEach((c) => {
        this.x += c.extrusion.x;
        this.y += c.extrusion.y;
        if (c.extrusion.y < 0) {
          this.speedY += c.extrusion.y / dt;
          this.grounded = true;
          this.jumpsLeft = maxJumps;
        }
      });
    }
  }
}
