import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import type {Params, Props} from './pdf';

const createParams = (): Params => ({
  title: 'Foo bar',
  source: {uri: 'https://domain.tld/link.pdf'},
});

describe('PDF', () => {
  it('should render without error', () => {
    const Pdf = require('./pdf').default;

    const params = createParams();
    const navigation = createNavigation({
      params,
    });

    const component = renderer.create(<Pdf navigation={navigation} />);

    const screen = component.root.find((el) => el.props.testID === 'pdf-screen');

    expect(screen).toBeDefined();
  });

  it('should handle button press', () => {
    const Browser = require('./pdf').default;

    const params = createParams();
    const navigation = createNavigation({
      params,
    });
    const props: Props = {
      navigation,
      navigationOptions: {},
    };

    const {headerLeft} = Browser.navigationOptions(props);

    const component = renderer.create(headerLeft);

    const button = component.root.find((el) => el.props.testID === 'pdf-button-close');
    button.props.onPress();

    expect(navigation.dispatch).toHaveBeenCalledTimes(1);
    expect(navigation.dispatch).toHaveBeenCalledWith('Mock$ReactNavigation$NavigationActions$Back');
  });
});
