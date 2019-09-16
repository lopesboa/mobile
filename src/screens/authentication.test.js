// @flow strict

import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './authentication';
import type {ConnectedStateProps} from './authentication';

describe('Authentication', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'foo'
      },
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'bar'
        }
      }
    });

    const store = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      isAuthenticated: true
    };
    expect(expected).toEqual(result);
  });
});
