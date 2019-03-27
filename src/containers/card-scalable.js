// @flow

import * as React from 'react';
import {Animated, TouchableOpacity, StyleSheet, View} from 'react-native';

import Card, {CARD_TYPE as CARD} from '../components/card';
import CardHeader from '../components/card-header';
import type {Props as CardProps} from '../components/card';
import type {Props as CardHeaderProps} from '../components/card-header';
import theme from '../modules/theme';
import Gradient from '../components/gradient';
import {CARD_TYPE} from '../const';

type Props = {|
  ...CardProps,
  ...CardHeaderProps,
  height: number,
  expandedHeight: number,
  isExpanded?: boolean,
  offsetBottom: number,
  expandedOffsetBottom: number,
  testID?: string
|};

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

  handlePress = () =>
    this.setState((state: State) => ({
      isExpanded: !state.isExpanded
    }));

  render() {
    const {type, title, isCorrect, children, style, testID} = this.props;

    return (
      <Animated.View style={{...style, height: this.height, top: this.top}}>
        <TouchableOpacity onPress={this.handlePress} activeOpacity={1} style={styles.expanded}>
          <Card testID={testID} type={CARD.DECK_SWIPE}>
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
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default CardScalable;
