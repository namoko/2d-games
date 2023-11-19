import { Game } from '../../types';
import { GameBase } from '../GameBase';
import { Car } from './Car';
import { carImages } from './config';
import { Obj } from './Obj';
import { GameModel } from './types';

export class CarGame extends GameBase {
  private gameModel: GameModel = {
    obstacles: [],
  };

  private car: Car;

  constructor(private container: HTMLElement) {
    super();
    console.log('car game', container);

    this.car = new Car(container, carImages.player, this.gameModel);

    this.car.showDebug = true;
    this.car.x = 300;
    this.car.y = 150;
    this.car.angle = 180;

    const obj1 = new Obj(container, '#f007');
    obj1.x = 100;
    obj1.y = 100;
    obj1.w = 200;
    obj1.h = 100;
    obj1.angle = 10;
    obj1.showDebug = true;
    this.gameModel.obstacles.push(obj1);

    const obj2 = new Obj(container, '#0f07');
    obj2.x = 500;
    obj2.y = 100;
    obj2.w = 50;
    obj2.h = 100;
    obj2.angle = -20;
    obj2.showDebug = true;
    this.gameModel.obstacles.push(obj2);

    const obj3 = new Obj(container, '#00f7');
    obj3.x = 300;
    obj3.y = 300;
    obj3.w = 200;
    obj3.h = 100;
    obj3.angle = 45;
    obj3.showDebug = true;
    this.gameModel.obstacles.push(obj3);
  }

  public destroy() {
    super.destroy();

    this.gameModel.obstacles.forEach((o) => o.destroy());

    this.car.destroy();
  }

  protected update(dt: number) {
    console.log('aa');
    this.car.update(dt);
  }

  protected render() {
    this.car.render();

    this.gameModel.obstacles.forEach((r) => r.render());
  }
}
