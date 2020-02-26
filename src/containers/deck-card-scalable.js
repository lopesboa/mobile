// @flow

import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import DeckCard from '../components/deck-card';
import DeckCardHeader from '../components/deck-card-header';
import type {Props as DeckCardProps} from '../components/deck-card';
import type {Props as DeckCardHeaderProps} from '../components/deck-card-header';
import theme from '../modules/theme';
import Gradient from '../components/gradient';
import Touchable from '../components/touchable';
import {DECK_CARD_TYPE} from '../const';

type Props = $Exact<{|
  ...DeckCardProps,
  ...DeckCardHeaderProps,
  height: number,
  expandedHeight: number,
  isExpanded?: boolean,
  animationStyle?: AnimationStyleProp,
  offsetBottom: number,
  expandedOffsetBottom: number,
  style?: ViewStyleProp,
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

class DeckCardScalable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isExpanded: Boolean(this.props.isExpanded)
  };

  top: Animated.Value = new Animated.Value(0);

  height: Animated.Value = new Animated.Value(this.props.height - this.props.offsetBottom);

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
    this.setState((state: State) => ({
      isExpanded: !state.isExpanded
    }));
  };

  render() {
    const {type, title, isCorrect, children, style, testID, animationStyle} = this.props;
    const _style = {
      ...style,
      ...((!this.state.isExpanded && animationStyle) || {}),
      height: this.height,
      top: this.top
    };

    return (
      <Animated.View style={_style}>
        <Touchable
          isWithoutFeedback
          onPress={this.handlePress}
          style={styles.expanded}
          analyticsID="deck-card"
          analyticsParams={{type}}
        >
          <DeckCard testID={testID}>
            <DeckCardHeader type={type} title={title} isCorrect={isCorrect} />
            <View style={[styles.content, type === DECK_CARD_TYPE.RESOURCE && styles.noPadding]}>
              {children}
              <Gradient
                height={theme.spacing.large}
                colors={[theme.colors.white]}
                style={styles.gradient}
              />
            </View>
          </DeckCard>
        </Touchable>
      </Animated.View>
    );
  }
}

export default DeckCardScalable;
