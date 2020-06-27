import * as React from 'react';
import {StyleSheet, View, SafeAreaView, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import theme from '../modules/theme';

interface Props {
  style?: ViewStyle;
  noScroll?: boolean;
  children: React.ReactNode;
  testID?: string;
  onRef?: (ref: KeyboardAwareScrollView) => void;
  refreshControl?: React.ReactElement;
  noSafeArea?: boolean;
}

export const BACKGROUND_COLOR = theme.colors.white;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    flex: 0
  },
  background: {
    backgroundColor: BACKGROUND_COLOR
  },
  content: {
    flexGrow: 1
  }
});

class Screen extends React.PureComponent<Props> {
  scrollView: KeyboardAwareScrollView | null;

  handleRef = (element: KeyboardAwareScrollView | null) => {
    this.scrollView = element;

    if (this.props.onRef && element) {
      this.props.onRef(element);
    }
  };

  renderContent = (): React.ReactNode => {
    const {noScroll, children, testID, refreshControl} = this.props;

    if (noScroll) {
      return (
        <View style={styles.content} testID={testID}>
          {children}
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
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
    );
  };

  render() {
    const {style, noSafeArea} = this.props;
    if (noSafeArea) {
      return (
        <View style={[styles.container, styles.background, style]}>{this.renderContent()}</View>
      );
    }

    return (
      <React.Fragment>
        <SafeAreaView style={[styles.statusBar, styles.background, style]} />
        <View style={[styles.container, styles.background, style]}>{this.renderContent()}</View>
      </React.Fragment>
    );
  }
}

export default Screen;
