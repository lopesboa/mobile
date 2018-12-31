// @flow strict

import * as React from 'react';
import {StyleSheet, ScrollView, View, SafeAreaView} from 'react-native';
import theme from '../modules/theme';

type Props = {|
  style?: GenericStyleProp,
  noScroll?: boolean,
  children: React.Node,
  testID?: string,
  onRef?: (ref: ScrollView) => void
|};

export const BACKGROUND_COLOR = theme.colors.white;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1
  },
  screenScroll: {
    flexGrow: 1
  }
});

class Screen extends React.PureComponent<Props> {
  props: Props;

  scrollView: ScrollView | null;

  handleRef = (element: ScrollView | null) => {
    this.scrollView = element;

    if (this.props.onRef && element) {
      this.props.onRef(element);
    }
  };

  render() {
    const {style, noScroll, children, testID} = this.props;

    return (
      <SafeAreaView style={[styles.screen, style]}>
        {noScroll ? (
          <View style={styles.screenScroll} testID={testID}>
            {children}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.screenScroll}
            showsHorizontalScrollIndicator={false}
            testID={testID}
            ref={this.handleRef}
          >
            {children}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

export default Screen;
