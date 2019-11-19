// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {assistanceEmail} from '../../app';
import {handleFakePress} from '../utils/tests';
import {ERROR_TYPE} from '../const';

describe('ErrorListener', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should handle close', () => {
    const {Component: ErrorListener} = require('./error-listener');

    const handleClose = jest.fn();
    const hideError = jest.fn();
    const signOut = jest.fn();

    const component = renderer.create(
      <ErrorListener
        type={ERROR_TYPE.NO_CONTENT_FOUND}
        onClose={handleClose}
        hideError={hideError}
        refresh={handleFakePress}
        signOut={signOut}
      />
    );

    const modal = component.root.find(el => el.props.testID === 'modal-animated');
    modal.props.onClose();

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(hideError).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('should handle modal error close', () => {
    const {Component: ErrorListener} = require('./error-listener');

    const handleClose = jest.fn();
    const hideError = jest.fn();
    const signOut = jest.fn();

    const component = renderer.create(
      <ErrorListener
        type={ERROR_TYPE.NO_CONTENT_FOUND}
        onClose={handleClose}
        hideError={hideError}
        refresh={handleFakePress}
        signOut={signOut}
      />
    );

    const modal = component.root.find(el => el.props.testID === 'modal-error');
    modal.props.onClose();

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(hideError).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('should handle modal error press on content not found', () => {
    const {Linking} = require('react-native');
    const {Component: ErrorListener} = require('./error-listener');

    const openURL = jest.spyOn(Linking, 'openURL');

    const refresh = jest.fn();

    const component = renderer.create(
      <ErrorListener
        type={ERROR_TYPE.NO_CONTENT_FOUND}
        onClose={handleFakePress}
        hideError={handleFakePress}
        refresh={refresh}
        signOut={handleFakePress}
      />
    );

    const modal = component.root.find(el => el.props.testID === 'modal-error');
    modal.props.onPress();

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledTimes(0);
  });

  it('should handle modal error press on platform not activated', () => {
    const {Linking} = require('react-native');
    const {Component: ErrorListener} = require('./error-listener');

    const openURL = jest.spyOn(Linking, 'openURL');

    const refresh = jest.fn();

    const component = renderer.create(
      <ErrorListener
        type={ERROR_TYPE.PLATFORM_NOT_ACTIVATED}
        onClose={handleFakePress}
        hideError={handleFakePress}
        refresh={refresh}
        signOut={handleFakePress}
      />
    );

    const modal = component.root.find(el => el.props.testID === 'modal-error');
    modal.props.onPress();

    expect(refresh).toHaveBeenCalledTimes(0);
    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(`mailto:${assistanceEmail}`);
  });

  it('should handle modal error assistance press', () => {
    const {Linking} = require('react-native');
    const {Component: ErrorListener} = require('./error-listener');

    const openURL = jest.spyOn(Linking, 'openURL');

    const component = renderer.create(
      <ErrorListener
        type={ERROR_TYPE.PLATFORM_NOT_ACTIVATED}
        onClose={handleFakePress}
        hideError={handleFakePress}
        refresh={handleFakePress}
        signOut={handleFakePress}
      />
    );

    const modal = component.root.find(el => el.props.testID === 'modal-error');
    modal.props.onAssistancePress();

    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(`mailto:${assistanceEmail}`);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
