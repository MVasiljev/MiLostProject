export interface Buildable<T> {
  build(): Promise<T>;
}
