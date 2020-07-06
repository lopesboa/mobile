import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import theme from '../modules/theme';
import background from '../assets/images/notify-me-bg.png';
import translations from '../translations';
import Button from './button';
import ImageBackground from './image-background';
import Text from './text';
import Space from './space';
import Touchable from './touchable';

interface Props {
  onNotifyMePress: () => void;
  onLaterPress: () => void;
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.base,
  },
  background: {
    position: 'absolute',
  },
  imageGradient: {
    justifyContent: 'flex-end',
    padding: theme.spacing.base,
  },
  h1: {
    fontSize: theme.fontSize.xxlarge,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },
  p: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
  },
  btn_later: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
    textAlign: 'center',
  },
});

const NotifyMe = ({onNotifyMePress, onLaterPress}: Props) => (
  <ImageBackground
    style={styles.background}
    resizeMode="cover"
    source={background}
    gradientStyle={styles.imageGradient}
    gradient={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
  >
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />
      <View>
        <Text style={styles.h1}>{translations.permissionNotificationHeadline}</Text>
        <Space type="base" />
        <Text style={styles.p}>{translations.permissionNotificationDescription}</Text>
      </View>
      <Space type="large" />
      <View style={styles.footer}>
        <Button onPress={onNotifyMePress} testID="notifyme-button" analyticsID="notifyme-button">
          {translations.yesNotifyMe}
        </Button>
        <Space type="base" />
        <Touchable
          testID="notifyme-later-button"
          analyticsID="notifyme-later-button"
          onPress={onLaterPress}
        >
          <Text style={styles.btn_later}>{translations.maybeLater}</Text>
        </Touchable>
      </View>
    </SafeAreaView>
  </ImageBackground>
);

export default NotifyMe;
