import { Point } from '../geom/types';

interface BaseCommand {
  ttd: number;
}

interface LineCommand extends BaseCommand {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

interface PolyCommand extends BaseCommand {
  type: 'poly';
  points: Point[];
  color: string;
}

type DrawCommand = LineCommand | PolyCommand;

export class Debug {
  private cnv = document.createElement('canvas');
  private ctx = this.cnv.getContext('2d')!;
  private commands: DrawCommand[] = [];

  constructor(container: HTMLElement = document.body) {
    this.cnv.className = 'debug';
    this.cnv.style.zIndex = '1000';
    this.cnv.width = this.cnv.height = 1000;
    container.appendChild(this.cnv);

    this.onFrame();
  }

  public drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = '#f0f',
    ttl = 300
  ) => {
    this.commands.push({
      type: 'line',
      x1,
      y1,
      x2,
      y2,
      color,
      ttd: Date.now() + ttl,
    });
  };

  public drawPoly(points: Point[], color = '#f0f', ttl = 300) {
    this.commands.push({
      type: 'poly',
      points,
      color,
      ttd: Date.now() + ttl,
    });
  }

  private onFrame = () => {
    window.requestAnimationFrame(this.onFrame);
    this.render();
  };

  private render() {
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    const now = Date.now();
    for (let i = 0; i < this.commands.length; i++) {
      const cmd = this.commands[i];
      if (now >= cmd.ttd) {
        this.commands.splice(i, 1);
        i--;
        continue;
      }

      switch (cmd.type) {
        case 'line':
          this.renderLine(cmd);
          break;
        case 'poly':
          this.renderPoly(cmd);
          break;
      }
    }
  }

  private renderLine = (cmd: LineCommand) => {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = cmd.color;
    this.ctx.beginPath();
    this.ctx.moveTo(cmd.x1, cmd.y1);
    this.ctx.lineTo(cmd.x2, cmd.y2);
    this.ctx.stroke();
  };

  private renderPoly = (cmd: PolyCommand) => {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = cmd.color;
    this.ctx.beginPath();

    const start = cmd.points[0];
    this.ctx.moveTo(start.x, start.y);

    for (let i = 0; i < cmd.points.length; i++) {
      const point = cmd.points[i];
      this.ctx.lineTo(point.x, point.y);
    }
    this.ctx.lineTo(start.x, start.y);

    this.ctx.stroke();
  };
}
