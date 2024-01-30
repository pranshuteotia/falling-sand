import { Particle } from 'src/particle';
import { Empty } from 'src/empty';

interface GridProps {
  canvasHeight: number;
  canvasWidth: number;
  gridCellDimension: number;
  context: CanvasRenderingContext2D;
}

export class Grid {
  private width: number;
  private height: number;
  private grid: Particle[];
  private pixelDimension: number;
  private canvasContext: CanvasRenderingContext2D;
  private rowCount: number;

  constructor(props: GridProps) {
    this.width = Math.floor(props.canvasWidth / props.gridCellDimension);
    this.height = Math.floor(props.canvasHeight / props.gridCellDimension);
    this.canvasContext = props.context;
    this.pixelDimension = props.gridCellDimension;
    this.grid = new Array<Particle>(this.height * this.width).fill(new Empty());
    this.rowCount = Math.floor(this.grid.length / this.width);
  }

  clear() {
    this.grid = new Array<Particle>(this.height * this.width).fill(new Empty());
  }

  set(x: number, y: number, particle: Particle) {
    if (x >= this.width || x < 0 || y >= this.height || y < 0) return;

    const index = this.getIndex(x, y);
    this.grid[index] = particle;
  }

  setCircle(
    x: number,
    y: number,
    createParticle: () => Particle,
    radius = 2,
    probability = 1.0
  ) {
    let radiusSq = radius * radius;
    for (let y1 = -radius; y1 <= radius; y1++) {
      for (let x1 = -radius; x1 <= radius; x1++) {
        if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
          this.set(x + x1, y + y1, createParticle());
        }
      }
    }
  }

  private swap(a: number, b: number) {
    const particleAtA = this.grid[a];
    const particleAtB = this.grid[b];

    this.setIndex(a, particleAtB);
    this.setIndex(b, particleAtA);
  }

  private isEmpty(index: number) {
    if (index < 0 || index >= this.grid.length) return false;

    return this.grid[index].isEmpty;
  }

  draw() {
    for (let i = 0; i < this.grid.length; ++i) {
      const particle = this.grid[i];

      if (particle.isEmpty) continue;
      const { x, y } = this.convertIndexToCoords(i);
      this.canvasContext.save();

      this.canvasContext.fillStyle = particle.getColor;
      this.canvasContext.fillRect(
        x * this.pixelDimension,
        y * this.pixelDimension,
        this.pixelDimension,
        this.pixelDimension
      );

      this.canvasContext.restore();
    }

    this.update();
  }

  private update() {
    for (let row = this.rowCount - 1; row >= 0; --row) {
      const rowOffset = row * this.width;
      const leftToRight = Math.random() > 0.5;
      for (let i = 0; i < this.width; ++i) {
        const columnOffset = leftToRight ? i : -i - 1 + this.width;
        this.updateParticle(rowOffset + columnOffset);
      }
    }
  }

  private convertIndexToCoords(index: number) {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width),
    };
  }

  private updateParticle(index: number) {
    const below = index + this.width;
    const belowLeft = below - 1;
    const belowRight = below + 1;

    if (this.isEmpty(below)) {
      this.swap(index, below);
    } else if (this.isEmpty(belowLeft)) {
      this.swap(index, belowLeft);
    } else if (this.isEmpty(belowRight)) {
      this.swap(index, belowRight);
    }
  }

  private getIndex(x: number, y: number) {
    return y * this.width + x;
  }

  private setIndex(index: number, particle: Particle) {
    this.grid[index] = particle;
  }
}
