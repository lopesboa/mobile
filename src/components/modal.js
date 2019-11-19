// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import theme from '../modules/theme';
import HeaderBackButton from './header-back-button';

export type Props = {|
  children: React.Node,
  headerBackgroundColor?: string,
  iconBackgroundColor?: string,
  renderIcon?: () => React.Node,
  contentStyle?: ViewStyleProp,
  onClose: () => void,
  testID?: string
|};

export const HEADER_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    backgroundColor: theme.colors.white
  },
  header: {
    backgroundColor: theme.colors.white,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.medium,
    height: HEADER_HEIGHT
  },
  content: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    alignItems: 'center'
  },
  contentWithHeader: {
    paddingTop: theme.spacing.medium
  },
  contentWithIcon: {
    paddingTop: theme.spacing.small
  },
  icon: {
    marginTop: -HEADER_HEIGHT * (3 / 4),
    padding: 5,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.thumbnail,
    alignSelf: 'center'
  },
  iconContent: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.small,
    borderRadius: theme.radius.thumbnail,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const Modal = ({
  children,
  headerBackgroundColor,
  iconBackgroundColor,
  renderIcon,
  contentStyle,
  onClose,
  testID
}: Props) => (
  <View style={styles.container} testID={testID}>
    <View style={[styles.header, {backgroundColor: headerBackgroundColor}]}>
      <HeaderBackButton
        color={theme.colors.gray.dark}
        isFloating={false}
        testID="close-modal"
        onPress={onClose}
        type="close"
      />
    </View>
    {renderIcon && (
      <View style={styles.icon}>
        <View style={[styles.iconContent, {backgroundColor: iconBackgroundColor}]}>
          {renderIcon()}
        </View>
      </View>
    )}
    <View
      style={[
        styles.content,
        headerBackgroundColor && styles.contentWithHeader,
        renderIcon && styles.contentWithIcon,
        contentStyle
      ]}
    >
      {children}
    </View>
  </View>
);

export default Modal;
