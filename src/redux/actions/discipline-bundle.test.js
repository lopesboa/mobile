// @flow strict

import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_ERROR,
  fetchRequest,
  fetchSuccess,
  fetchError
} from './discipline-bundle';
import type {Action} from './discipline-bundle';

describe('Discipline bundle', () => {
  it('fetchRequest', () => {
    const ref = 'foobarbaz';
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchRequest(ref, languages);
    const expected: Action = {
      type: FETCH_REQUEST,
      payload: {
        ref,
        languages
      }
    };
    expect(result).toEqual(expected);
  });

  it('fetchSuccess', () => {
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchSuccess(
      {dis1: languages, dis2: languages},
      {cha1: languages, cha2: languages}
    );
    const expected: Action = {
      type: FETCH_SUCCESS,
      payload: {
        disciplines: {
          dis1: languages,
          dis2: languages
        },
        chapters: {
          cha1: languages,
          cha2: languages
        }
      }
    };
    expect(result).toEqual(expected);
  });

  it('fetchError', () => {
    const ref = 'foobarbaz';
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchError(ref, languages);
    const expected: Action = {
      type: FETCH_ERROR,
      payload: {
        ref,
        languages
      }
    };
    expect(result).toEqual(expected);
  });
});
