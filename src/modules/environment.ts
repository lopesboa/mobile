import version from './version';

const {NODE_ENV} = process.env;

// Flavors
export const __E2E__ = version.buildFlavor === 'e2e';
export const __STORYBOOK__ = version.buildFlavor === 'storybook';

// Types
export const __ADHOC__ = version.buildType === 'adhoc';
export const __DISTRIBUTION__ = version.buildType === 'distribution';

export const __TEST__ = NODE_ENV === 'test';
export const __DEV__ = NODE_ENV === 'development';
export const __PRODUCTION__ = NODE_ENV === 'production';

export default {
  __E2E__,
  __STORYBOOK__,
  __ADHOC__,
  __DISTRIBUTION__,
  __TEST__,
  __DEV__,
  __PRODUCTION__,
};
