// @flow strict

// Inspired from https://raw.githubusercontent.com/sindresorhus/serialize-error/master/index.d.ts

declare module 'serialize-error' {
  declare export type ErrorObject = {|
  	name?: string;
  	stack?: string;
  	message?: string;
  	code?: string;
  |};

  declare export function serializeError<T>(error: T): ErrorObject;

  declare export function deserializeError(error: ErrorObject): Error;
}
