import {Lesson, Config, Progression} from '../progression-engine';

export type AnalyticsService = {
  sendViewedMediaAnalytics: (resource: Lesson, location: string) => void;
  sendProgressionUpdated?: (currentProgression: Progression, engineConfig: Config) => void;
  sendProgressionFinished: (currentProgression: Progression, engineConfig: Config) => void;
};
