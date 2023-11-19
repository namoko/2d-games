import { Sprite } from '../../common/Sprite';

export class Obstacle extends Sprite {
  constructor(container: Element, color: string, name = '') {
    super(container, { src: '', width: 0 });

    this.name = name;
    this.root.id = name;

    this.showDebug = true;
    this.debug.style.backgroundColor = color;

    this.render();
  }
}
