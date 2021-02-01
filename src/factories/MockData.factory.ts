export class MockDataFactory<T> {
  constructor(private generatorFn: (options: any) => T) {}

  getSingleRecord(options: any = {}, override: any = {}): T {
    return {
      ...this.generatorFn(options),
      ...override,
    };
  }

  getArrayRecords(
    length: number,
    options: any = {},
    overrides: any[] = [],
  ): T[] {
    return [...Array(length).keys()].map((i) =>
      this.getSingleRecord(options, overrides[i]),
    );
  }
}
