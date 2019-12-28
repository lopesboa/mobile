// @flow strict

import * as React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import theme from '../modules/theme';
import withDarkMode from '../containers/with-dark-mode';
import type {WithDarkModeProps} from '../containers/with-dark-mode';

type Props = {|
  ...WithDarkModeProps,
  style?: ViewStyleProp,
  noScroll?: boolean,
  children: React.Node,
  testID?: string,
  onRef?: (ref: KeyboardAwareScrollView) => void,
  refreshControl?: React$Element<*>,
  noSafeArea?: boolean
|};

export const BACKGROUND_COLOR = theme.colors.white;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1
  },
  screenDarkMode: {
    backgroundColor: '#121212'
  },
  screenScroll: {
    flexGrow: 1
  }
});

class Screen extends React.PureComponent<Props> {
  props: Props;

  scrollView: KeyboardAwareScrollView | null;

  handleRef = (element: KeyboardAwareScrollView | null) => {
    this.scrollView = element;

    if (this.props.onRef && element) {
      this.props.onRef(element);
    }
  };

  render() {
    const {
      style,
      noScroll,
      children,
      testID,
      noSafeArea,
      refreshControl,
      isDarkModeActivated
    } = this.props;

    const CustomView = noSafeArea ? View : SafeAreaView;

    return (
      <CustomView style={[styles.screen, style, isDarkModeActivated && styles.screenDarkMode]}>
        {noScroll ? (
          <View style={styles.screenScroll} testID={testID}>
            {children}
          </View>
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={styles.screenScroll}
            showsHorizontalScrollIndicator={false}
            refreshControl={refreshControl}
            testID={testID}
            nestedScrollEnabled
            enableOnAndroid
            // eslint-disable-next-line react/jsx-handler-names
            innerRef={this.handleRef}
          >
            {children}
          </KeyboardAwareScrollView>
        )}
      </CustomView>
    );
  }
}

export {Screen as Component};
export default withDarkMode(Screen);
