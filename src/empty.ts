import { Particle } from 'src/particle';

export class Empty extends Particle {
  private static baseColor = '#fff';
  constructor() {
    super({ color: Empty.baseColor, empty: true });
  }
}
