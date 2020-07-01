import initStoryshots, {multiSnapshotWithOptions} from '@storybook/addon-storyshots';

initStoryshots({
  configPath: `${__dirname}/stories.ts`,
  test: multiSnapshotWithOptions({}),
});
