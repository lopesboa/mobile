// @flow

declare module 'react-native-exception-handler' {
  declare export type JSExceptionHandler = (?Error, ?boolean) => void;
  declare export type NativeExceptionHandler = ?string => void;

  declare export function setJSExceptionHandler(JSExceptionHandler, boolean | void): void;
  declare export function getJSExceptionHandler(): JSExceptionHandler;
  declare export function setNativeExceptionHandler(NativeExceptionHandler, boolean | void, boolean | void): void;
}
