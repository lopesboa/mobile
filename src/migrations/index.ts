import {runMigrations} from './runner';
import {
  predicate as fixProgressionsAnswersPredicate,
  transformer as fixProgressionsAnswersTransfomer,
} from './scripts/fix-progressions-answers';
import type {Migrations} from './types';

const migrations: Migrations = {
  '2': [fixProgressionsAnswersPredicate, fixProgressionsAnswersTransfomer],
};

export const migrationsRunner = (): Promise<void> => runMigrations(migrations);
