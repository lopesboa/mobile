// @flow strict

export type Predicate = (key: string) => boolean;
export type Transformer = (value: string, key: string) => Promise<string> | string;

type Migration = [Predicate, Transformer];
export type PairedMigrations = [number, Migration];

export type Migrations = {
  [key: string]: Migration
};
