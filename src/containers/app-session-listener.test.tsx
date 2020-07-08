import * as React from 'react';
import renderer from 'react-test-renderer';

describe('AppSessionListener', () => {
  it('default', () => {
    const {Component: AppSessionListener} = require('./app-session-listener');
    const incrementAppSession = jest.fn();
    const component = renderer.create(
      <AppSessionListener incrementAppSession={incrementAppSession} />,
    );
    component.update(<AppSessionListener incrementAppSession={incrementAppSession} />);

    expect(incrementAppSession).toHaveBeenCalledTimes(1);
  });
});
