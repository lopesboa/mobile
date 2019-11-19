// @flow strict

import {createSections} from '../../../__fixtures__/sections';
import {createBrand} from '../../../__fixtures__/brands';
import {createAuthenticationState} from '../../../__fixtures__/store';
import {showError} from '../ui/errors';
import {ERROR_TYPE} from '../../../const';
import {fetchRequest, fetchSuccess, fetchError, fetchSections} from './sections';
import {
  fetchRequest as fetchCardsRequest,
  fetchSuccess as fetchCardsSuccess,
  DEFAULT_LIMIT
} from './cards/fetch';
import type {Action} from './sections';

const sections = createSections().slice(0, 1);
const brand = createBrand();

describe('Sections', () => {
  it('should fetch sections', async () => {
    const dispatch = jest.fn();
    const getState = () => ({
      authentication: createAuthenticationState({token: '__TOKEN__', brand}),
      catalog: {
        entities: {
          cards: {},
          sections: {
            [sections[0].key]: {en: sections[0]}
          }
        }
      }
    });
    const options = {
      services: {
        Sections: {
          find: () => ({
            sections,
            total: sections.length
          })
        },
        Cards: {
          find: () => ({
            cards: [],
            total: 42
          })
        }
      }
    };

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual(fetchRequest(0, 2, 'en'));
      return Promise.resolve(action);
    });

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual(fetchSuccess(0, 2, sections.length, sections, 'en'));
      return Promise.resolve(action);
    });

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual(fetchCardsRequest(sections[0].key, 0, DEFAULT_LIMIT, 'en'));
      return action;
    });

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual(fetchCardsSuccess(sections[0].key, 0, DEFAULT_LIMIT, 42, [], 'en'));
      return action;
    });

    // $FlowFixMe
    await fetchSections(0, 2)(dispatch, getState, options);
    expect(dispatch).toHaveBeenCalledTimes(2 + sections.length * 2);
  });

  it('should dispatch error', async () => {
    const dispatch = jest.fn();
    const getState = () => ({});
    const options = {
      services: {
        Sections: {
          find: () => sections
        }
      }
    };

    dispatch.mockImplementationOnce((action: Action) => {
      expect(action).toEqual(fetchRequest(0, 2, 'en'));
      return Promise.resolve(action);
    });

    dispatch.mockImplementationOnce((action: Action) => {
      expect(action).toEqual(fetchError(new Error('Token not defined')));
      return Promise.resolve(action);
    });

    dispatch.mockImplementationOnce((action: Action) => {
      const expected = showError({
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        // $FlowFixMe callable signature
        lastAction: expect.any(Function)
      });
      expect(expected).toEqual(action);
      return Promise.resolve(action);
    });

    // $FlowFixMe
    const result = await fetchSections(0, 2)(dispatch, getState, options);
    expect(dispatch).toHaveBeenCalledTimes(3);

    dispatch.mockImplementationOnce((action: Action) => {
      expect(action).toEqual(fetchRequest(0, 2, 'en'));
      return Promise.resolve(action);
    });

    dispatch.mockImplementationOnce((action: Action) => {
      expect(action).toEqual(fetchError(new Error('Token not defined')));
      return Promise.resolve(action);
    });

    dispatch.mockImplementationOnce((action: Action) => {
      const expected = showError({
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        // $FlowFixMe callable signature
        lastAction: expect.any(Function)
      });
      expect(expected).toEqual(action);
      return Promise.resolve(action);
    });

    const {lastAction} = result.payload;

    await lastAction()(dispatch, getState, options);
    expect(dispatch).toHaveBeenCalledTimes(6);
  });
});
