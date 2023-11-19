import { Game } from '../types';

export class GameBase implements Game {
  private loopFrame = 0;

  private lastFrameTime = Date.now();

  public constructor() {
    this.loopFrame = window.requestAnimationFrame(this.gameLoop);
  }

  public destroy() {
    window.cancelAnimationFrame(this.loopFrame);
  }

  private gameLoop = () => {
    this.loopFrame = window.requestAnimationFrame(this.gameLoop);

    const now = Date.now();
    const timePassed = now - this.lastFrameTime;
    this.lastFrameTime = now;
    const dt = timePassed * 0.001;

    this.update(dt);
    this.render(dt);
  };

  protected update(dt: number) {}
  protected render(dt: number) {}
}
