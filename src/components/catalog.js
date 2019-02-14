// @flow

import * as React from 'react';
import {View} from 'react-native';

import type {Chapter, Discipline} from '../layer/data/_types';
import Button from './button';
import Space from './space';

export type Item = Discipline | Chapter;

type Props = {|
  items: Array<Item>,
  onPress: (item: Item) => void
|};

class Catalog extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: Item) => () => this.props.onPress(item);

  render() {
    const {items} = this.props;

    return (
      <View testID="catalog">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Space />}
            <Button
              onPress={this.handlePress(item)}
              testID={`catalog-item-${item.universalRef.replace(/_/g, '-')}`}
            >
              {item.name}
            </Button>
          </React.Fragment>
        ))}
      </View>
    );
  }
}

export default Catalog;
