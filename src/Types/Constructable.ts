export type Constructable<T> = (new (...args: any[]) => object) & (new (...args: any[]) => T);
