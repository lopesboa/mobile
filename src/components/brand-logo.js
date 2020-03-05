// @flow strict

import * as React from 'react';
import {StyleSheet} from 'react-native';

import {BrandThemeContext} from './brand-theme-provider';
import ImageBackground from './image-background';

const styles = StyleSheet.create({
  logo: {
    width: '100%'
  }
});

type Props = {|
  height: number
|};

const BrandLogo = ({height}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);

  return (
    <ImageBackground
      style={[styles.logo, {height}]}
      testID="brand-logo"
      source={{
        uri: brandTheme.images['logo-mobile']
      }}
      resizeMode="contain"
    />
  );
};

export default BrandLogo;
