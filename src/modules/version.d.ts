export type Version = {
  branch: string;
  commit: string;
  tag: string;
  buildType?: 'adhoc' | 'distribution';
  buildFlavor?: 'storybook' | 'e2e';
};
