// @flow

import * as React from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import type {QuestionChoiceItem, QuestionType} from '../types';
import {QUESTION_TYPE} from '../const';
import QuestionChoice from './question-choice';
import Space from './space';

type Props = {|
  type: QuestionType,
  items: Array<QuestionChoiceItem>,
  onItemPress: (item: QuestionChoiceItem) => void,
|};

class QuestionChoices extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: QuestionChoiceItem) => () => this.props.onItemPress(item);

  // eslint-disable-next-line react/no-unused-prop-types
  renderItem = ({item}: {item: QuestionChoiceItem}) => (
    <QuestionChoice onPress={this.handlePress(item)} selected={item.selected}>
      {item.label}
    </QuestionChoice>
  );

  renderSpace = () => <Space />;

  render() {
    return (
      <TouchableOpacity>
        {this.props.type === QUESTION_TYPE.QCM && (
          <FlatList
            renderItem={this.renderItem}
            data={this.props.items}
            ItemSeparatorComponent={this.renderSpace}
          />
        )}
      </TouchableOpacity>
    );
  }
}

export default QuestionChoices;
