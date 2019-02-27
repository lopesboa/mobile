// @flow

import * as React from 'react';
import {View} from 'react-native';

import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import Button from './button';
import Space from './space';

type Props = {|
  items: Array<DisciplineCard | ChapterCard>,
  onPress: (item: DisciplineCard | ChapterCard) => void
|};

class Catalog extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: DisciplineCard | ChapterCard) => () => this.props.onPress(item);

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
              {item.title}
            </Button>
          </React.Fragment>
        ))}
      </View>
    );
  }
}

export default Catalog;
