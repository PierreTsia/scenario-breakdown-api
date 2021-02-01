export class RandomDataFactory<T> {
  constructor(private generatorFn: (...args: any[]) => T) {}
  getOne(...args: any[]): T {
    return this.generatorFn(...args);
  }

  getArray(length: number, ...args: any[]): T[] {
    return [...Array(length).keys()].map((_: number) => this.getOne(...args));
  }
}
