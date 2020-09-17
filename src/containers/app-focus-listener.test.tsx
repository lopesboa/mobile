import * as React from 'react';
import renderer from 'react-test-renderer';
import {Component as AppFocusListener} from './app-focus-listener';

jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

describe('AppFocusListener', () => {
  it('increments the app session', () => {
    const AppState = require('react-native/Libraries/AppState/AppState');

    AppState.addEventListener = jest.fn((eventName, callbackHandler) => {
      callbackHandler('active');
    });
    const incrementAppSession = jest.fn();
    const scheduleNotifications = jest.fn();
    const unscheduleLocalNotifications = jest.fn();

    const component = renderer.create(
      <AppFocusListener
        incrementAppSession={incrementAppSession}
        scheduleNotifications={scheduleNotifications}
        unscheduleLocalNotifications={unscheduleLocalNotifications}
      />,
    );

    component.update(
      <AppFocusListener
        incrementAppSession={incrementAppSession}
        scheduleNotifications={scheduleNotifications}
        unscheduleLocalNotifications={unscheduleLocalNotifications}
      />,
    );
    expect(incrementAppSession).toHaveBeenCalledTimes(1);
  });
});

describe('AppState[Active]', () => {
  it('unschedules notifications when app is going to be on active', () => {
    const AppState = require('react-native/Libraries/AppState/AppState');

    AppState.addEventListener = jest.fn((eventName, callbackHandler) => {
      callbackHandler('active');
    });
    const incrementAppSession = jest.fn();
    const scheduleNotifications = jest.fn();
    const unscheduleLocalNotifications = jest.fn();
    const component = renderer.create(
      <AppFocusListener
        incrementAppSession={incrementAppSession}
        scheduleNotifications={scheduleNotifications}
        unscheduleLocalNotifications={unscheduleLocalNotifications}
      />,
    );
    component.update(
      <AppFocusListener
        incrementAppSession={incrementAppSession}
        scheduleNotifications={scheduleNotifications}
        unscheduleLocalNotifications={unscheduleLocalNotifications}
      />,
    );

    expect(scheduleNotifications).toHaveBeenCalledTimes(0);
    expect(unscheduleLocalNotifications).toHaveBeenCalledTimes(2);
  });
});

describe('AppState[Background]', () => {
  it('schedules notifications when app is going to be on background', () => {
    const AppState = require('react-native/Libraries/AppState/AppState');

    AppState.addEventListener = jest.fn((eventName, callbackHandler) => {
      callbackHandler('background');
    });
    const incrementAppSession = jest.fn();
    const scheduleNotifications = jest.fn();
    const unscheduleLocalNotifications = jest.fn();

    const component = renderer.create(
      <AppFocusListener
        incrementAppSession={incrementAppSession}
        scheduleNotifications={scheduleNotifications}
        unscheduleLocalNotifications={unscheduleLocalNotifications}
      />,
    );
    component.update(
      <AppFocusListener
        incrementAppSession={incrementAppSession}
        scheduleNotifications={scheduleNotifications}
        unscheduleLocalNotifications={unscheduleLocalNotifications}
      />,
    );

    expect(scheduleNotifications).toHaveBeenCalledTimes(2);
    expect(unscheduleLocalNotifications).toHaveBeenCalledTimes(0);
  });
});
