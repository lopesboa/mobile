// @flow
import {AsyncStorage} from 'react-native';

import {createProgression} from '../../__fixtures__/progression';
import {
  findById,
  getAll,
  save,
  findLast,
  buildLastProgressionKey,
  synchronize
} from './progressions';

describe('progresssion', () => {
  describe('buildLastProgressionKey', () => {
    it('should build the lastProgression Key ', () => {
      const engineRef = 'lol';
      const contentRef = 'lipop';
      expect(buildLastProgressionKey(engineRef, contentRef)).toBeDefined();
    });
  });
  describe('findById', () => {
    it('shoud find a progression by id', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(fakeProgression)));

      const result = await findById(progressionId);

      expect(result).toEqual(fakeProgression);
    });

    it("shoud throw error if progression isn't found", async () => {
      const progressionId = 'fakeProgressionId';
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve());

      await expect(findById(progressionId)).rejects.toThrowError();
    });
  });
  describe('getAll', () => {
    it('shoud get all the progression items', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.getAllKeys = jest
        .fn()
        .mockImplementation(() => Promise.resolve([`progression_${progressionId}`, 'babababa']));

      AsyncStorage.multiGet = jest.fn().mockImplementation(keys => {
        expect(keys).toEqual([`progression_${progressionId}`]);
        return Promise.resolve([[`progression_${progressionId}`, JSON.stringify(fakeProgression)]]);
      });

      const result = await getAll();

      expect(result).toEqual([fakeProgression]);
    });
  });
  describe('save', () => {
    it('shoud the progression and the last progression id simultaneously', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.setItem = jest.fn().mockImplementation(() => {});

      const result = await save(fakeProgression);

      expect(result).toEqual(fakeProgression);
    });
    it('shoud throw on progression without _id', async () => {
      const fakeProgression = createProgression({
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.setItem = jest.fn().mockImplementation(() => {});

      const result = save(fakeProgression);

      await expect(result).rejects.toBeInstanceOf(TypeError);
    });
  });
  describe('findLast', () => {
    it('shoud find the last progression', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        nextContent
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);

      expect(result).toEqual(fakeProgression);
    });

    it('shoud find the last progression -- without retrieved progression id', async () => {
      AsyncStorage.getItem = jest.fn().mockImplementation(() => null);
      const result = await findLast('tata', 'toto');
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- without retrieved progression', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `last_progression_${engine}_${progressionContent.ref}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve();
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- with success as nextContent type', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'bar',
        type: 'success'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state: {
          nextContent
        }
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- with failure as nextContent type', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'bar',
        type: 'failure'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state: {
          nextContent
        }
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- with node as nextContent type and extralife as ref', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'extraLife',
        type: 'node'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state: {
          nextContent
        }
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });
  });
  describe('synchronize', () => {
    it('should synchronize progression', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };
      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        nextContent
      });

      await expect(synchronize(fakeProgression)).resolves.toBeUndefined();
    });
    it('should support only progression with _id', async () => {
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };
      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const fakeProgression = createProgression({
        engine,
        progressionContent,
        nextContent
      });

      await expect(synchronize(fakeProgression)).rejects.toBeInstanceOf(TypeError);
    });
  });
});
