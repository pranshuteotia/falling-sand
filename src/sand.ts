import { Particle } from 'src/particle';

export class Sand extends Particle {
  private static SandColors = ['#eaba6b', '#ead2ac', '#f7e8a4'];

  constructor() {
    super({ color: Sand.getRandomSandColor(), empty: false });
  }

  private static getRandomSandColor() {
    return Sand.SandColors[Math.floor(Math.random() * Sand.SandColors.length)];
  }
}
