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
  onItemPress: (item: QuestionChoiceItem) => void
|};

class QuestionChoices extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: QuestionChoiceItem) => () => this.props.onItemPress(item);

  // eslint-disable-next-line react/no-unused-prop-types
  renderItem = ({item, index}: {item: QuestionChoiceItem, index: number}) => (
    <QuestionChoice
      onPress={this.handlePress(item)}
      image={item.image}
      isSelected={item.selected}
      testID={`question-choice-${index + 1}`}
    >
      {item.label}
    </QuestionChoice>
  );

  renderSpace = () => <Space />;

  getKeyExtractor = (item: QuestionChoiceItem, index: number) => index.toString();

  render() {
    return (
      <TouchableOpacity>
        {(this.props.type === QUESTION_TYPE.QCM ||
          this.props.type === QUESTION_TYPE.QCM_GRAPHIC) && (
          <FlatList
            renderItem={this.renderItem}
            data={this.props.items}
            ItemSeparatorComponent={this.renderSpace}
            keyExtractor={this.getKeyExtractor}
            testID="question-choices"
          />
        )}
      </TouchableOpacity>
    );
  }
}

export default QuestionChoices;
