// @flow strict

import {createStoreState, createPermissionsState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS} from '../const';
import {mapStateToProps} from './qr-code';
import type {ConnectedStateProps} from './qr-code';

describe('QR Code', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'foo'
      }
    });

    const store = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression,
      permissions: createPermissionsState({
        camera: PERMISSION_STATUS.AUTHORIZED
      })
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      hasPermission: true
    };

    expect(result).toEqual(expected);
  });
});
