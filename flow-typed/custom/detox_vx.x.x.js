// @flow
// WIP
// some are defined in jest interfaces (and looks the same)
declare function before(Function): void;
declare function after(Function): void;
type DetoxConfig = {
  // @todo
  // https://github.com/wix/detox/blob/master/docs/APIRef.Configuration.md
};
declare var detox: {
  init(DetoxConfig): void,
  cleanup(): void
};
type DetoxFakeNotification = {
  // @todo
};
declare type DetoxDevicePermissionsType = {|
  // https://github.com/wix/AppleSimulatorUtils
  calendar?: 'YES' | 'NO',
  camera?: 'YES' | 'NO',
  contacts?: 'YES' | 'NO',
  health?: 'YES' | 'NO',
  homekit?: 'YES' | 'NO',
  location?: 'always' | 'inuse' | 'never',
  medialibrary?: 'YES' | 'NO',
  microphone?: 'YES' | 'NO',
  motion?: 'YES' | 'NO',
  notifications?: 'YES' | 'NO',
  photos?: 'YES' | 'NO',
  reminders?: 'YES' | 'NO',
  siri?: 'YES' | 'NO'
|};
type DetoxLaunchAppParamsType = {|
  // https://github.com/wix/detox/blob/master/docs/APIRef.DeviceObjectAPI.md
  newInstance?: boolean,
  permissions?: DetoxDevicePermissionsType,
  url?: string,
  userNotification?: DetoxFakeNotification,
  delete?: boolean,
  launchArgs?: Object
|};
declare var device: {
  launchApp(params?: DetoxLaunchAppParamsType): void,
  terminateApp(): void,
  reloadReactNative(): void,
  sendToHome(): void,
  installApp(): void,
  uninstallApp(): void,
  openURL(string, ?Object): void,
  sendUserNotification(?DetoxFakeNotification): void,
  setOrientation('portrait' | 'landscape'): void,
  setLocation(lat: number, lon: number): void,
  setURLBlacklist([string]): void,
  enableSynchronization(): void,
  disableSynchronization(): void,
  resetContentAndSettings(): void,
  getPlatform(): 'ios' | 'android'
};
type DetoxExpectResultType = Promise<boolean>;
type DetoxExpectType = {
  ...JestExpectType,
  // https://github.com/wix/detox/blob/master/docs/APIRef.Expect.md
  not: DetoxExpectType,
  toBeVisible(): DetoxExpectResultType,
  toBeNotVisible(): DetoxExpectResultType,
  toExist(): DetoxExpectResultType,
  toNotExist(): DetoxExpectResultType,
  toHaveText(): DetoxExpectResultType,
  toHaveLabel(string): DetoxExpectResultType,
  toHaveId(): DetoxExpectResultType,
  toHaveValue(): DetoxExpectResultType
};
type DetoxElementQueryType = {
  and(DetoxElementQueryType): DetoxElementQueryType,
  withAncestor(DetoxElementQueryType): DetoxElementQueryType,
  withDescendant(DetoxElementQueryType): DetoxElementQueryType
};
declare var by: {
  // https://github.com/wix/detox/blob/master/docs/APIRef.Matchers.md
  id(string): DetoxElementQueryType,
  text(string): DetoxElementQueryType,
  label(string): DetoxElementQueryType,
  type(string): DetoxElementQueryType
};
type DetoxElementType = {
  (DetoxElementType): DetoxElementType,
  atIndex(number): DetoxElementType,
  // https://github.com/wix/detox/blob/master/docs/APIRef.ActionsOnElement.md
  tap(): void,
  longPress(): void,
  multiTap(): void,
  tapAtPoint({x: number, y: number}): void,
  typeText(string): void,
  replaceText(string): void,
  clearText(): void,
  scroll(
    pixels: number,
    direction: Direction,
    startPositionX?: number,
    startPositionY?: number
  ): Promise<Actions<R>>,
  scrollTo(direction: Direction): void,
  swipe(directionTypes, speed: speedTypes, percentage?: number): void
};
declare function element(DetoxElementQueryType): DetoxElementType;
declare type DetoxElement = typeof element;
export type DetoxExpectFunctionType = {
  /** The object that you want to make assertions against */
  (value: DetoxElementType | any): DetoxExpectType,
  // taken from jest declaration
  /** Add additional Jasmine matchers to Jest's roster */
  extend(matchers: {[name: string]: JestMatcher}): void,
  assertions(expectedAssertions: number): void,
  any(value: mixed): JestAsymmetricEqualityType,
  anything(): void,
  arrayContaining(value: Array<mixed>): void,
  objectContaining(value: Object): void,
  stringMatching(value: string | RegExp): void
};
// trick to work with jest in the same codebase, see e2e/init.js
declare var weExpect: DetoxExpectFunctionType;
type DetoxWaitForResultType = {
  withTimeout(int): Promise<boolean>
};
type DetoxWaitForType = {
  ...JestExpectType,
  // https://github.com/wix/detox/blob/master/docs/APIRef.waitFor.md
  not: DetoxWaitForType,
  toBeVisible(): DetoxWaitForResultType,
  toBeNotVisible(): DetoxWaitForResultType,
  toExist(): DetoxWaitForResultType,
  toNotExist(): DetoxWaitForResultType,
  toHaveText(): DetoxWaitForResultType,
  toHaveLabel(string): DetoxWaitForResultType,
  toHaveId(): DetoxWaitForResultType,
  toHaveValue(): DetoxWaitForResultType
};
export type DetoxWaitForFunctionType = {
  /** The object that you want to make assertions against */
  (value: DetoxElementType | any): DetoxWaitForType
};
declare var waitFor: DetoxWaitForFunctionType;
