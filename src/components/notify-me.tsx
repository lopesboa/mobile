import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import theme from '../modules/theme';
import background from '../assets/images/notify-me-bg.png';
import translations from '../translations';
import Button from './button';
import ImageBackground from './image-background';
import Text from './text';
import Space from './space';
import Touchable from './touchable';
import NotificationCard from './notification-card';

interface Props {
  onNotifyMePress: () => void;
  onLaterPress: () => void;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
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
  notifications: {
    top: theme.spacing.xlarge,
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.notifications}>
        <View style={{transform: [{scale: 0.9}]}}>
          <NotificationCard
            style={{position: 'absolute', width: '100%', top: -12, opacity: 0.6}}
            title={translations.notificationSamples[0].title}
            description={translations.notificationSamples[0].description}
          />
        </View>
        <View style={{transform: [{scale: 0.94}]}}>
          <NotificationCard
            style={{position: 'absolute', top: -6, width: '100%', opacity: 0.8}}
            title={translations.notificationSamples[0].title}
            description={translations.notificationSamples[0].description}
          />
        </View>

        <NotificationCard
          title={translations.notificationSamples[0].title}
          description={translations.notificationSamples[0].description}
        />
      </View>
      <View>
        <View>
          <Text style={styles.h1}>{translations.permissionNotificationHeadline}</Text>
          <Space type="base" />
          <Text style={styles.p}>{translations.permissionNotificationDescription}</Text>
        </View>
        <Space type="large" />
        <View>
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
      </View>
    </SafeAreaView>
  </ImageBackground>
);

export default NotifyMe;
