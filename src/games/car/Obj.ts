import { Sprite } from '../../common/Sprite';

export class Obj extends Sprite {
  public constructor(container: Element, color: string) {
    super(container, { src: '', width: 0 });

    this.debug.style.backgroundColor = color;

    this.render();
  }
}
