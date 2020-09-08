export type Predicate = (key: string) => boolean;
export type Transformer = (
  value: string,
  key: string,
) => Promise<string> | string | Promise<void> | void;

type Migration = [Predicate, Transformer];
export type PairedMigrations = [number, Migration];

export type Migrations = Record<string, Migration>;
