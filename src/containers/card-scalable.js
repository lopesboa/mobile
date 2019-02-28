// @flow

import * as React from 'react';
import {Animated, TouchableOpacity, StyleSheet, View} from 'react-native';

import Card from '../components/card';
import CardHeader from '../components/card-header';
import type {Props as CardProps} from '../components/card';
import type {Props as CardHeaderProps} from '../components/card-header';
import theme from '../modules/theme';
import Gradient from '../components/gradient';

type Props = {|
  ...CardProps,
  ...CardHeaderProps,
  height: number,
  fullScreenHeight: number,
  isFullScreen?: boolean,
  offsetBottom: number,
  fullScreenOffsetBottom: number,
  testID?: string
|};

type State = {|
  isFullScreen: boolean
|};

const styles = StyleSheet.create({
  expanded: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    borderBottomLeftRadius: theme.radius.card,
    borderBottomRightRadius: theme.radius.card,
    backgroundColor: theme.colors.white
  }
});

const ANIMATION_DURATION = 200;

class CardScalable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isFullScreen: Boolean(this.props.isFullScreen)
  };

  top: Animated.Value = new Animated.Value(0);

  height: Animated.Value = new Animated.Value(this.props.height - this.props.offsetBottom);

  componentWillReceiveProps = (props: Props) =>
    this.setState({
      isFullScreen: Boolean(props.isFullScreen)
    });

  componentWillUpdate = (nextProps: Props, nextState: State) => {
    const {offsetBottom, fullScreenOffsetBottom} = this.props;
    const {isFullScreen} = nextState;

    if (this.state.isFullScreen !== isFullScreen) {
      const {height, fullScreenHeight} = this.props;

      Animated.parallel([
        Animated.timing(this.top, {
          toValue: isFullScreen ? -((fullScreenHeight - height + fullScreenOffsetBottom) / 2) : 0,
          duration: ANIMATION_DURATION
        }),
        Animated.timing(this.height, {
          toValue: isFullScreen ? fullScreenHeight : height - offsetBottom,
          duration: ANIMATION_DURATION
        })
      ]).start();
    }
  };

  handlePress = () =>
    this.setState((state: State) => ({
      isFullScreen: !state.isFullScreen
    }));

  render() {
    const {type, title, children, style, testID} = this.props;
    return (
      <Animated.View style={{...style, height: this.height, top: this.top}}>
        <TouchableOpacity onPress={this.handlePress} activeOpacity={1} style={styles.expanded}>
          <Card testID={testID} isDeckCard>
            <CardHeader type={type} title={title} />
            <View style={styles.content}>
              {children}
              <Gradient height={theme.spacing.large} color={theme.colors.white} />
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default CardScalable;
