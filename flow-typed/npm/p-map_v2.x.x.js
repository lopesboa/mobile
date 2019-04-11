// flow-typed signature: a66e21580714f5defd76d8adc0e681e4
// flow-typed version: 03b59c3613/p-map_v2.x.x/flow_>=v0.70.x

declare module 'p-map' {
  declare export default function PMap<I, O>(
    input: Iterable<Promise<I> | I>,
    mapper: (input: I, index: number) => Promise<O> | O,
    options?: { concurrency?: number },
  ): Promise<Array<O>>;
}
