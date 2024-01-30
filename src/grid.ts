interface GridProps {
  canvasHeight: number;
  canvasWidth: number;
  gridCellDimension: number;
  context: CanvasRenderingContext2D;
}

export class Grid {
  private width: number;
  private height: number;
  private grid: string[];
  private pixelDimension: number;
  private canvasContext: CanvasRenderingContext2D;
  private maxSpeed = 8;
  private acceleration = 0;
  private velocity = 0;

  constructor(props: GridProps) {
    this.width = Math.floor(props.canvasWidth / props.gridCellDimension);
    this.height = Math.floor(props.canvasHeight / props.gridCellDimension);
    this.canvasContext = props.context;
    this.pixelDimension = props.gridCellDimension;
    this.grid = new Array<string>(this.height * this.width).fill('white');
  }

  clear() {
    this.grid = new Array<string>(this.height * this.width).fill('white');
  }

  set(x: number, y: number, color: string) {
    if (x >= this.width || x < 0 || y >= this.height || y < 0) return;

    this.grid[y * this.width + x] = color;
  }

  setCircle(
    x: number,
    y: number,
    colorFn: () => string,
    radius = 2,
    probability = 1.0
  ) {
    let radiusSq = radius * radius;
    for (let y1 = -radius; y1 <= radius; y1++) {
      for (let x1 = -radius; x1 <= radius; x1++) {
        if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
          this.set(x + x1, y + y1, colorFn());
        }
      }
    }
  }

  private swap(a: number, b: number) {
    const temp = this.grid[a];
    this.grid[a] = this.grid[b];
    this.grid[b] = temp;
  }

  private isEmpty(index: number) {
    return this.grid[index] === 'white';
  }

  draw() {
    for (let i = 0; i < this.grid.length; ++i) {
      const cellColor = this.grid[i];

      if (cellColor === 'white') continue;
      const { x, y } = this.convertIndexToCoords(i);
      this.canvasContext.save();

      this.canvasContext.fillStyle = cellColor;
      this.canvasContext.fillRect(
        x * this.pixelDimension,
        y * this.pixelDimension,
        this.pixelDimension,
        this.pixelDimension
      );

      this.canvasContext.restore();
    }

    for (let i = this.grid.length - this.width - 1; i > 0; --i) {
      this.update(i);
    }
  }

  private convertIndexToCoords(index: number) {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width),
    };
  }

  private update(index: number) {
    const below = index + this.width;
    const belowLeft = below - 1;
    const belowRight = below + 1;

    if (this.isEmpty(below)) {
      this.swap(index, below);
    } else if (this.isEmpty(belowLeft) && this.isEmpty(belowRight)) {
      const randomDir = Math.random() > 0.5 ? belowLeft : belowRight;
      this.swap(index, randomDir);
    } else if (this.isEmpty(belowLeft)) {
      this.swap(index, belowLeft);
    } else if (this.isEmpty(belowRight)) {
      this.swap(index, belowRight);
    }
  }

  private updateVelocity() {
    let newVelocity = this.velocity + this.acceleration;

    if (Math.abs(newVelocity) > this.maxSpeed) {
      newVelocity = Math.sign(newVelocity) * this.maxSpeed;
    }

    this.velocity = newVelocity;
  }

  private resetVelocity() {
    this.velocity = 0;
  }
}
