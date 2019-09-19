// @flow strict

const {REACT_NATIVE_FLAVOR} = process.env;

export const __E2E__ = REACT_NATIVE_FLAVOR === 'E2E';
export const __STORYBOOK__ = REACT_NATIVE_FLAVOR === 'STORYBOOK';

const env = process.env;
export const __ENV__ = env.NODE_ENV;
export const __TEST__ = __ENV__ === 'test';
export const __DEV__ = __ENV__ === 'development';

export default {
  __E2E__,
  __STORYBOOK__,
  __ENV__,
  __TEST__,
  __DEV__
};
