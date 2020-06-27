import {$Keys} from 'utility-types';

type Operator = <T>(expectedValues: Array<T>, value: T) => boolean;

type OPERATORS = {
  BETWEEN: Operator;
  EQUALS: Operator;
  GT: Operator;
  GTE: Operator;
  IN: Operator;
  LT: Operator;
  LTE: Operator;
  NOT_BETWEEN: Operator;
  NOT_EQUALS: Operator;
  NOT_IN: Operator;
};

export type OperatorKeys = $Keys<OPERATORS>;
