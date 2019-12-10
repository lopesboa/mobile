// @flow

export type Predicate = (key: string) => boolean;
export type Transformer = (value: string, key: string) => Promise<string>;

export type Migrations = {
  [key: string]: [Predicate, Transformer]
};
