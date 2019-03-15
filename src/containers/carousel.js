// @flow

import * as React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Pagination} from 'react-native-snap-carousel';
import SideSwipe from 'react-native-sideswipe';
import CarouselCard from '../components/carousel-card';
import translations from '../translations';
import theme from '../modules/theme';

export type Item = {|
  iconName: string,
  header: string,
  description: string
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  pagination: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 2,
    padding: 0,
    margin: 0,
    backgroundColor: theme.colors.white
  },
  paginationContainer: {
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

type State = {|
  currentItemIndex: number,
  items: Array<Item>
|};

// $FlowFixMe
class Carousel extends React.PureComponent {
  state: State = {
    currentItemIndex: 0,
    items: [
      {
        header: translations.loginFirstStepHeader,
        description: translations.loginFirstStepDescription,
        iconName: 'computer'
      },
      {
        header: translations.loginSecondStepHeader,
        description: translations.loginSecondStepDescription,
        iconName: 'settings'
      },
      {
        header: translations.loginThirdStepHeader,
        description: translations.loginThirdStepDescription,
        iconName: 'qr-code'
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
    // $FlowFixMe
    this.setState({currentItemIndex: index});
  };

  _renderItem = ({item}: {item: Item}) => {
    return <CarouselCard item={item} />;
  };

  onShouldCapture = () => true;

  extractKey = (item: Item) => item.iconName;

  render() {
    const {state: {items}} = this;
    const {width} = Dimensions.get('window');
    // $FlowFixMe
    const contentOffset = (width - CarouselCard.WIDTH) / 2;
    return (
      <View style={[styles.container]} testID="carousel">
        <SideSwipe
          // $FlowFixMe
          itemWidth={CarouselCard.WIDTH}
          // $FlowFixMe
          threshold={CarouselCard.WIDTH / 4}
          shouldCapture={this.onShouldCapture}
          extractKey={this.extractKey}
          style={{width}}
          data={items}
          contentOffset={contentOffset}
          onIndexChange={this.handleItemChange}
          renderItem={this._renderItem}
        />
        {this.pagination()}
      </View>
    );
  }
}
export default Carousel;
