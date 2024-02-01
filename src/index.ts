import { Grid } from 'src/grid';
import { Sand } from 'src/sand';
import { Empty } from 'src/empty';

interface MousePosition {
  x: number | null;
  y: number | null;
}

function main() {
  let drawing = true;
  let currentParticle = () => new Sand();

  const CANVAS_HEIGHT = window.innerHeight - 10;
  const CANVAS_WIDTH = window.innerWidth - 10;
  const GRID_CELL_DIMENSION = 5;

  const clearButton = document.querySelector('#clear') as HTMLButtonElement;
  const pauseButton = document.querySelector('#pause') as HTMLButtonElement;
  const particleButton = document.querySelector(
    '#particle'
  ) as HTMLButtonElement;

  let mousedown = false;
  let mousePosition: MousePosition = { x: null, y: null };

  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  canvas.height = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;
  canvas.style.backgroundColor = '#000';

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  const grid = new Grid({
    context,
    canvasHeight: CANVAS_HEIGHT,
    canvasWidth: CANVAS_WIDTH,
    gridCellDimension: GRID_CELL_DIMENSION,
  });

  function animate() {
    if (!drawing) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    grid.draw();
    window.requestAnimationFrame(animate);
  }

  // EVENT LISTENERS
  particleButton.addEventListener('pointerup', () => {
    if (particleButton.textContent === 'Sand') {
      particleButton.textContent = 'Empty';
      currentParticle = () => new Sand();
    } else {
      particleButton.textContent = 'Sand';
      currentParticle = () => new Empty();
    }
  });
  clearButton.addEventListener('pointerup', () => {
    grid.clear();
  });
  pauseButton.addEventListener('pointerup', () => {
    drawing = !drawing;
    pauseButton.textContent = drawing ? 'Pause' : 'Resume';

    if (drawing) animate();
  });
  canvas.addEventListener('pointerdown', drawSand);
  canvas.addEventListener('pointerup', () => (mousedown = false));
  canvas.addEventListener('pointerout', () => (mousedown = false));
  canvas.addEventListener('pointermove', (event: MouseEvent) => {
    mousePosition = { x: event.clientX as number, y: event.clientY as number };
  });

  async function drawSand(event: MouseEvent) {
    if (!drawing) return;

    mousedown = true;

    mousePosition.x = event.clientX as number;
    mousePosition.y = event.clientY as number;

    while (mousedown) {
      await new Promise((r) => setTimeout(r, 1000 / 60));

      const x = Math.floor((mousePosition.x - 5) / GRID_CELL_DIMENSION);
      const y = Math.floor((mousePosition.y - 5) / GRID_CELL_DIMENSION);
      grid.setCircle(x, y, currentParticle, 2, 0.5);
    }
  }

  animate();
}

main();
