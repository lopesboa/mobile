// @flow

import * as React from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';

import Card, {LAYOUT as CARD_LAYOUT} from '../components/card';
import CardHeader from '../components/card-header';
import type {Props as CardProps} from '../components/card';
import type {Props as CardHeaderProps} from '../components/card-header';
import theme from '../modules/theme';
import Gradient from '../components/gradient';
import Touchable from '../components/touchable';
import {CARD_TYPE} from '../const';

type Props = $Exact<{|
  ...CardProps,
  ...CardHeaderProps,
  height: number,
  expandedHeight: number,
  isExpanded?: boolean,
  hintSwipe?: boolean,
  offsetBottom: number,
  expandedOffsetBottom: number,
  testID?: string
|}>;

type State = {|
  isExpanded: boolean
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
  },
  noPadding: {paddingTop: 0, paddingHorizontal: 0},
  gradient: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0
  }
});

const ANIMATION_DURATION = 200;

class CardScalable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isExpanded: Boolean(this.props.isExpanded)
  };

  // to expand/collapse the card
  top: Animated.Value = new Animated.Value(0);

  height: Animated.Value = new Animated.Value(this.props.height - this.props.offsetBottom);

  // to simulate the swipe
  rotate: Animated.Value = new Animated.Value(0);

  translateX: Animated.Value = new Animated.Value(0);

  translateY: Animated.Value = new Animated.Value(0);

  hint = Animated.loop(
    Animated.sequence([
      Animated.delay(3000),
      Animated.timing(this.rotate, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(150),
      Animated.timing(this.rotate, {
        toValue: 2,
        duration: 400,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(150),
      Animated.timing(this.rotate, {
        toValue: 3,
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(3000)
    ])
  );

  componentDidMount = () => {
    if (!this.props.hintSwipe || this.state.isExpanded) {
      return;
    }

    this.hint.start();
  };

  componentWillReceiveProps = (props: Props) =>
    this.setState({
      isExpanded: Boolean(props.isExpanded)
    });

  componentWillUpdate = (nextProps: Props, nextState: State) => {
    const {offsetBottom, expandedOffsetBottom} = this.props;
    const {isExpanded} = nextState;

    if (this.state.isExpanded !== isExpanded) {
      const {height, expandedHeight} = this.props;

      Animated.parallel([
        Animated.timing(this.top, {
          toValue: isExpanded ? -((expandedHeight - height + expandedOffsetBottom) / 2) : 0,
          duration: ANIMATION_DURATION
        }),
        Animated.timing(this.height, {
          toValue: isExpanded ? expandedHeight : height - offsetBottom,
          duration: ANIMATION_DURATION
        })
      ]).start();
    }
  };

  handlePress = () => {
    this.hint.stop();
    this.setState((state: State) => ({
      isExpanded: !state.isExpanded
    }));
  };

  render() {
    const {type, title, isCorrect, hintSwipe, children, style, testID} = this.props;
    let transform;

    if (hintSwipe) {
      const rotate = this.rotate.interpolate({
        inputRange: [0, 1, 1.5, 2, 3],
        outputRange: ['0deg', '5deg', '0deg', '-5deg', '0deg']
      });

      const translateX = this.rotate.interpolate({
        inputRange: [0, 1, 1.5, 2, 3],
        outputRange: [0, 30, 0, -30, 0]
      });

      const translateY = this.rotate.interpolate({
        inputRange: [0, 1, 1.5, 2, 3],
        outputRange: [0, 30, 0, 30, 0]
      });

      transform = [{rotate}, {translateX}, {translateY}];
    }

    return (
      <Animated.View
        style={{
          ...style,
          height: this.height,
          top: this.top,
          transform: transform
        }}
      >
        <Touchable
          onPress={this.handlePress}
          activeOpacity={1}
          style={styles.expanded}
          analyticsID="deck-card"
          analyticsParams={{type}}
        >
          <Card testID={testID} type={CARD_LAYOUT.DECK_SWIPE}>
            <CardHeader type={type} title={title} isCorrect={isCorrect} />
            <View style={[styles.content, type === CARD_TYPE.RESOURCE && styles.noPadding]}>
              {children}
              <Gradient
                height={theme.spacing.large}
                colors={[theme.colors.white]}
                style={styles.gradient}
              />
            </View>
          </Card>
        </Touchable>
      </Animated.View>
    );
  }
}

export default CardScalable;
