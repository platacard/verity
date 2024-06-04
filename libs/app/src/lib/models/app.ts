export interface RawApp {
  readonly id: string;
  readonly createdAt: Date;
}

export class App {
  readonly id: string;
  readonly createdAt: Date;

  constructor(rawApp: RawApp) {
    this.id = rawApp.id;
    this.createdAt = rawApp.createdAt;
  }
}
