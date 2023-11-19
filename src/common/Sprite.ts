import { Rect } from '../geom/types';
import { SpriteEntry } from '../types';

export class Sprite implements Rect {
  public name = '';

  public x = 0;
  public y = 0;
  public angle = 0;
  public w = 10;
  public h = 10;

  public showDebug = false;

  protected root = document.createElement('div');
  protected img = document.createElement('img');
  protected debug = document.createElement('div');

  public constructor(container: Element, protected cfg: SpriteEntry) {
    container.appendChild(this.root);
    this.root.className = 'sprite';

    const img = this.img;

    this.root.appendChild(img);
    img.src = cfg.src;

    this.debug.className = 'debug';
    this.root.appendChild(this.debug);

    const cx = cfg.cx || 50;
    const cy = cfg.cy || 50;
    const angle = cfg.angle || 0;

    img.style.transform = `translate(-${cx}%,-${cy}%) rotate(${angle}deg)`;
    img.style.width = cfg.width + 'px';
  }

  public destroy() {
    this.root.remove();
  }

  public render() {
    this.root.style.left = `${this.x}px`;
    this.root.style.top = `${this.y}px`;
    this.root.style.rotate = `${this.angle}deg`;

    this.root.classList.toggle('debug', this.showDebug);
    if (this.showDebug) {
      this.debug.style.width = this.w + 'px';
      this.debug.style.height = this.h + 'px';
    }
  }
}
