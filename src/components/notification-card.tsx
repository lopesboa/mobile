import * as React from 'react';
import {View, StyleSheet, Image, Text, ViewStyle} from 'react-native';

import theme from '../modules/theme';
import icon from '../assets/images/icon.png';
import Card from './card';
import Notification from './notification';
import Html from './html';

export interface Props {
  testID?: string;
  title: string;
  description: string;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
  },
  container: {
    flexDirection: 'row',
    marginLeft: theme.spacing.base,
    marginRight: theme.spacing.base,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.small,
  },
  iconContainer: {
    justifyContent: 'center',
  },
  icon: {
    height: 40,
    width: 40,
    marginRight: theme.spacing.base,
  },
  imageIcon: {
    width: 40,
    height: 40,
  },
  notification: {
    position: 'absolute',
    left: 30,
    top: -8,
  },
  content: {
    flex: 1,
  },
  bold: {
    fontWeight: theme.fontWeight.bold,
  },
  p: {
    fontSize: theme.fontSize.large,
    color: theme.colors.gray.extraDark,
  },
});

const NotificationCard = ({testID, title, description, style}: Props) => (
  <Card testID={testID} style={[styles.card, style]}>
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <Image source={icon} style={styles.imageIcon} />
          <Notification style={styles.notification} height={18} color="#FF6A6A" label="1" />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={[styles.p, styles.bold]}>{title}</Text>
        <Html fontSize={theme.fontSize.large} style={styles.p}>
          {description}
        </Html>
      </View>
    </View>
  </Card>
);

export default NotificationCard;
