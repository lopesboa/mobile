import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import type {Params} from './browser';
import Browser from './browser';

const createParams = (): Params => ({
  url: 'https://domain.tld/link.pdf',
});

describe('Browser', () => {
  it('should render without error', () => {
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });

    const component = renderer.create(<Browser navigation={navigation} route={route} />);

    const screen = component.root.find((el) => el.props.testID === 'browser-screen');

    expect(screen).toBeDefined();
  });

  // TODO: Find a way to test this
  // it('should handle button press', () => {
  //   const Browser = require('./browser').default;

  //   const params = createParams();
  //   const {route, ...navigation} = createNavigation({
  //     params,
  //   });
  //   const component = renderer.create(<Browser navigation={navigation} route={route} />);

  //   const button = component.root.find((el) => el.props.testID === 'browser-button-close');
  //   button.props.onPress();

  //   expect(navigation.goBack).toHaveBeenCalledTimes(1);
  // });
});
