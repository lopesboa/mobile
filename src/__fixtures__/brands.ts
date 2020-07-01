import type {Brand, ProgressionEngineVersions} from '../types';

export const createBrand = ({
  progressionEngine,
  host,
  defaultLanguage = 'en',
}: {
  progressionEngine?: ProgressionEngineVersions;
  host?: string;
  defaultLanguage?: string;
} = {}): Brand => ({
  name: 'mobile',
  host: host || 'https://mobile-staging.coorpacademy.com',
  contentCategoryName: 'Mobile',
  colors: {
    primary: '#00B0FF',
  },
  hero: 'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
  images: {
    'logo-mobile':
      'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
  },
  youtube: {
    apiKey: '7Hi5iS4f4k34P1K3Y',
  },
  progressionEngine: progressionEngine || {
    versions: {
      learner: '2',
      microlearning: '2',
    },
  },
  // @ts-ignore don't understand whats the problem
  supportedLanguages: ['fr', 'de', 'it', 'zh'],
  defaultLanguage,
  env: 'staging',
});
