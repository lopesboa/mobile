// @flow strict

import * as React from 'react';
import {StyleSheet, Text, Dimensions} from 'react-native';

import theme from '../modules/theme';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import translations from '../translations';
import ImageBackground from './image-background';
import {BrandThemeContext} from './brand-theme-provider';
import {UserContext} from './user-provider';
import Placeholder from './placeholder';
import PlaceholderLine from './placeholder-line';

export const HEIGHT = Dimensions.get('window').height * 0.4;

type Props = {|
  ...WithLayoutProps
|};

const styles = StyleSheet.create({
  imageStyle: {
    height: HEIGHT
  },
  imageCoverGradient: {
    justifyContent: 'flex-end',
    padding: theme.spacing.base
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold
  }
});

const Hero = ({layout}: Props) => {
  const user = React.useContext(UserContext);
  const brandTheme = React.useContext(BrandThemeContext);
  return (
    <ImageBackground
      height={HEIGHT}
      width={layout && layout.width}
      style={styles.imageStyle}
      resizeMode="cover"
      source={
        layout && {
          uri: brandTheme.hero
        }
      }
      gradientStyle={styles.imageCoverGradient}
      gradient={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
    >
      {user && (
        <Text style={styles.text}>
          {translations.welcomeUser.replace(/{{displayname}}/g, user.displayName)}
        </Text>
      )}
      {(!user || !brandTheme.hero) && (
        <Placeholder>
          <PlaceholderLine size="small" width="40%" color={theme.colors.gray.lightMedium} />
        </Placeholder>
      )}
    </ImageBackground>
  );
};

export {Hero as Component};
export default withLayout(Hero);
