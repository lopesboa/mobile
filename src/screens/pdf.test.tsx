import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import type {Params} from './pdf';
import Pdf from './pdf';

const createParams = (): Params => ({
  title: 'Foo bar',
  source: {uri: 'https://domain.tld/link.pdf'},
});

describe('PDF', () => {
  it('should render without error', () => {
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });

    const component = renderer.create(<Pdf navigation={navigation} route={route} />);

    const screen = component.root.find((el) => el.props.testID === 'pdf-screen');

    expect(screen).toBeDefined();
  });

  // TODO: Find a way to test this
  // it('should handle button press', () => {
  //   const Pdf = require('./pdf').default;

  //   const params = createParams();
  //   const {route, ...navigation} = createNavigation({
  //     params,
  //   });

  //   const component = renderer.create(<Pdf navigation={navigation} route={route} />);

  //   const button = component.root.find((el) => el.props.testID === 'pdf-button-close');
  //   button.props.onPress();

  //   expect(navigation.goBack).toHaveBeenCalledTimes(1);
  // });
});
