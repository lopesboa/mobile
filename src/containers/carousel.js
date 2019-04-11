// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Pagination} from 'react-native-snap-carousel';
import SideSwipe from 'react-native-sideswipe';
import CarouselCard from '../components/carousel-card';
import translations from '../translations';
import theme from '../modules/theme';
import {SETTINGS, COMPUTER, QR_CODE} from '../components/steps-icon';
import type {IconName} from '../components/steps-icon';
import Space from '../components/space';
import {ANALYTICS_EVENT_TYPE} from '../const';
import type {Layout} from './with-layout';
import withLayout from './with-layout';
import withAnalytics from './with-analytics';
import type {WithAnalyticsProps} from './with-analytics';

export type Item = {|
  iconName: IconName,
  header: string,
  description: string
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.tiny
  },
  pagination: {
    width: 8,
    height: 8,
    borderRadius: 5,
    padding: 0,
    marginHorizontal: theme.spacing.tiny,
    margin: 0,
    backgroundColor: theme.colors.white
  },
  paginationContainer: {
    flex: 1,
    paddingVertical: 8
  },
  paginationDots: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.thumbnail
  }
});

type Props = $Exact<{|
  ...WithAnalyticsProps,
  layout?: Layout
|}>;

type State = {|
  currentItemIndex: number,
  items: Array<Item>
|};

class Carousel extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    currentItemIndex: 0,
    items: [
      {
        header: translations.loginFirstStepHeader,
        description: translations.loginFirstStepDescription,
        iconName: COMPUTER
      },
      {
        header: translations.loginSecondStepHeader,
        description: translations.loginSecondStepDescription,
        iconName: SETTINGS
      },
      {
        header: translations.loginThirdStepHeader,
        description: translations.loginThirdStepDescription,
        iconName: QR_CODE
      }
    ]
  };

  pagination = () => {
    const {items, currentItemIndex} = this.state;
    return (
      <Pagination
        dotsLength={items.length}
        containerStyle={styles.paginationContainer}
        activeDotIndex={currentItemIndex}
        dotStyle={styles.pagination}
        dotContainerStyle={styles.paginationDots}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0}
        inactiveDotScale={0.6}
      />
    );
  };

  handleItemChange = (index: number) => {
    const {analytics} = this.props;

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.SWIPE, {
        id: 'authentication-card',
        from: `${this.state.items[this.state.currentItemIndex].iconName}`,
        to: `${this.state.items[index].iconName}`
      });

    this.setState({currentItemIndex: index});
  };

  _renderItem = (width: number) => ({
    item,
    itemIndex,
    currentIndex
  }: {
    item: Item,
    itemIndex: number,
    currentIndex: number
  }) => {
    return (
      <CarouselCard width={width} item={item} itemIndex={itemIndex} currentIndex={currentIndex} />
    );
  };

  extractKey = (item: Item) => item.iconName;

  render() {
    const {
      state: {items},
      props: {layout}
    } = this;
    const layoutWidth = layout && layout.width;
    const contentOffset = theme.spacing.medium + theme.spacing.tiny;
    const width = layoutWidth && layoutWidth - contentOffset * 2;
    return (
      <View style={[styles.container]} testID="carousel">
        {width && (
          <SideSwipe
            itemWidth={width}
            threshold={width / 4}
            extractKey={this.extractKey}
            style={{width: layoutWidth}}
            data={items}
            contentOffset={contentOffset}
            onIndexChange={this.handleItemChange}
            renderItem={this._renderItem(width)}
            useVelocityForIndex={false}
          />
        )}
        <Space type="tiny" />
        {this.pagination()}
      </View>
    );
  }
}

export default withAnalytics(withLayout(Carousel));
