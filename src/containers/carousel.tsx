import * as React from 'react';

import CarouselComponent from '../components/carousel';
import type {Props as CarouselProps} from '../components/carousel';

type State = {
  currentIndex: number;
};

export interface Props<ItemT> {
  currentIndex?: Pick<CarouselProps<ItemT>, 'currentIndex'>;
  onChange?: Pick<CarouselProps<ItemT>, 'onChange'>;
}

class Carousel<ItemT> extends React.PureComponent<Props<ItemT>, State> {
  props: Props<ItemT>;

  state: State = {
    currentIndex: this.props.currentIndex || 0,
  };

  handleChange = (index: number) => {
    const {onChange} = this.props;

    this.setState(
      {
        currentIndex: index,
      },
      () => {
        onChange && onChange(index);
      },
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
