// @flow

import * as React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import type {Choice} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import Modal from './modal';
import ModalSelectItem from './modal-select-item';

type ChoiceValue = $NonMaybeType<$PropertyType<Choice, 'value'>>;
type ChoiceItem = $ElementType<$NonMaybeType<$PropertyType<Choice, 'items'>>, 0>;

export type Props = {|
  value?: ChoiceValue,
  values: Array<ChoiceItem>,
  onChange: ChoiceValue => void,
  onClose: () => void,
  testID?: string
|};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0
  },
  separator: {
    borderTopWidth: 1,
    borderColor: theme.colors.border
  },
  list: {
    width: '100%'
  }
});

class ModalSelect extends React.PureComponent<Props> {
  props: Props;

  keyExtractor = (item: ChoiceItem, index: number) => `modal-select-item-${index + 1}`;

  handleChange = (value: ChoiceValue) => () => this.props.onChange(value);

  renderItem = ({item, index}: {item: ChoiceItem, index: number}) => {
    const {value, testID = 'modal-select'} = this.props;

    return (
      <ModalSelectItem
        onPress={this.handleChange(item.text)}
        isSelected={value === item.text}
        testID={`${testID}-item-${index + 1}`}
      >
        {item.text}
      </ModalSelectItem>
    );
  };

  renderSeparator = () => <View style={styles.separator} />;

  render() {
    const {values, onClose, testID = 'modal-select'} = this.props;

    return (
      <Modal onClose={onClose} contentStyle={styles.content} testID={testID}>
        <FlatList
          data={values}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.renderSeparator}
          style={styles.list}
          testID={`${testID}-items`}
        />
      </Modal>
    );
  }
}

export default ModalSelect;
