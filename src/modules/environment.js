// @flow strict

const {REACT_NATIVE_FLAVOR} = process.env;

export const __E2E__ = REACT_NATIVE_FLAVOR === 'E2E';

export default {
  __E2E__
};
