interface ParticleProps {
  color: string;
  empty: boolean;
}

export class Particle {
  private color: string;
  private empty: boolean;

  constructor({ color, empty }: ParticleProps) {
    this.color = color;
    this.empty = empty;
  }

  get isEmpty() {
    return this.empty;
  }

  get getColor() {
    return this.color;
  }
}
