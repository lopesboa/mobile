// @flow

import * as React from 'react';

import {View, Dimensions, StyleSheet} from 'react-native';
import theme from '../modules/theme';
import withLayout from '../containers/with-layout';
import {BrandThemeContext} from './brand-theme-provider';
import {STYLE as BOX_STYLE} from './box';
import Html from './html';
import Space from './space';
import StepsIcon from './steps-icon';
import type {IconName} from './steps-icon';

export type Props = {|
  item: {|
    iconName: IconName,
    header: string,
    description: string
  |}
|};

const {width: screenWidth} = Dimensions.get('window');
const width = screenWidth - 100;

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible'
  },
  cards: {
    ...BOX_STYLE,
    width: width - 22,
    height: width,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    padding: theme.spacing.small,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.white
  },
  text: {
    fontSize: theme.fontSize.large
  },
  description: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.colors.gray.dark
  }
});

class CarouselCard extends React.Component<Props> {
  // $FlowFixMe
  static WIDTH: number = width;

  render() {
    const {item} = this.props;
    return (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <View style={styles.container}>
            <View style={styles.cards}>
              <StepsIcon
                iconName={item.iconName}
                color={brandTheme.colors.primary}
                height={21}
                width={21}
              />
              <Space type="small" />
              <View>
                <Html
                  fontSize={theme.fontSize.large}
                  style={[styles.text, {color: brandTheme.colors.primary}]}
                  isTextCentered
                >
                  {item.header.toUpperCase()}
                </Html>
              </View>
              <Space type="base" />
              <Html fontSize={theme.fontSize.regular} style={styles.description} isTextCentered>
                {item.description}
              </Html>
            </View>
          </View>
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export {CarouselCard as Component};
export default withLayout(CarouselCard);
