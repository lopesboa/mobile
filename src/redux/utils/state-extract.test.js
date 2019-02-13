// @flow strict

import type {OfflineContents, OfflineStatus} from '../reducers/discipline-bundle';
import {isContentReady, getContents} from './state-extract';

describe('State-extract', () => {
  describe('isContentReady', () => {
    it('should return true', () => {
      const status: OfflineStatus = {
        pending: ['en'],
        ready: ['de']
      };
      const result = isContentReady('de', status);
      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const status: OfflineStatus = {
        pending: ['en'],
        ready: ['de']
      };
      const result = isContentReady('en', status);
      expect(result).toBeFalsy();
    });
  });

  describe('getContents', () => {
    it('should return filtered contents by language', () => {
      const contents: OfflineContents = {
        ref1: {
          pending: ['en'],
          ready: ['de']
        },
        ref2: {
          pending: ['pl'],
          ready: ['en']
        },
        ref3: {
          pending: ['de'],
          ready: ['it']
        }
      };
      const result = getContents('en', contents);
      expect(result).toEqual(['ref1', 'ref2']);
    });
  });
});
