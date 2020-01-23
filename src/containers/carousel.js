// @flow strict

import * as React from 'react';

import CarouselComponent from '../components/carousel';
import type {Props as CarouselProps} from '../components/carousel';

type State = {|
  currentIndex: number
|};

export type Props<ItemT> = $Rest<
  CarouselProps<ItemT>,
  {|
    currentIndex: $PropertyType<CarouselProps<ItemT>, 'currentIndex'>,
    onChange: $PropertyType<CarouselProps<ItemT>, 'onChange'>
  |}
> & {|
  currentIndex?: $PropertyType<CarouselProps<ItemT>, 'currentIndex'>,
  onChange?: $PropertyType<CarouselProps<ItemT>, 'onChange'>
|};

class Carousel<ItemT> extends React.PureComponent<$ReadOnly<Props<ItemT>>, State> {
  props: $ReadOnly<Props<ItemT>>;

  state: State = {
    currentIndex: this.props.currentIndex || 0
  };

  handleChange = (index: number) => {
    const {onChange} = this.props;

    this.setState(
      {
        currentIndex: index
      },
      () => {
        onChange && onChange(index);
      }
    );
  };

  render() {
    const {currentIndex} = this.state;

    return (
      <CarouselComponent {...this.props} currentIndex={currentIndex} onChange={this.handleChange} />
    );
  }
}

export default Carousel;
