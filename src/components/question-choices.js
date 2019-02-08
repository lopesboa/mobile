// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Choice, QuestionType} from '@coorpacademy/progression-engine';
import {QUESTION_TYPE} from '../const';
import QuestionChoice from './question-choice';
import Space from './space';

type Props = {|
  type: QuestionType,
  isDisabled?: boolean,
  items: Array<Choice>,
  userChoices: Array<string>,
  onItemPress: (item: Choice) => void
|};

const styles = StyleSheet.create({
  cards: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  card: {
    flex: 1
  }
});

class QuestionChoices extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: Choice) => () => this.props.onItemPress(item);

  render() {
    const {type, isDisabled, items, userChoices} = this.props;

    const isSelected = (choice: Choice): boolean =>
      userChoices && userChoices.includes(choice.label);

    switch (type) {
      case QUESTION_TYPE.QCM:
        return (
          <View testID="question-choices">
            {items.map((item, index) => (
              <View key={`question-choice-${index + 1}`}>
                {index > 0 && <Space />}
                <QuestionChoice
                  onPress={this.handlePress(item)}
                  isDisabled={isDisabled}
                  isSelected={isSelected(item)}
                  testID={`question-choice-${index + 1}`}
                >
                  {item.label}
                </QuestionChoice>
              </View>
            ))}
          </View>
        );
      case QUESTION_TYPE.QCM_GRAPHIC:
        return (
          <View testID="question-choices">
            {items.map((item, index) => {
              const nextIndex = index + 1;
              const nextItem = items[nextIndex];

              if (index % 2 === 1) {
                return null;
              }

              return (
                <View key={`question-choice-row-${parseInt(index / 2) + 1}`}>
                  {index > 0 && <Space />}
                  <View style={styles.cards}>
                    <QuestionChoice
                      onPress={this.handlePress(item)}
                      media={item.media}
                      isDisabled={isDisabled}
                      isSelected={isSelected(item)}
                      testID={`question-choice-${index + 1}`}
                      style={styles.card}
                    >
                      {item.label}
                    </QuestionChoice>
                    <Space />
                    {nextItem && (
                      <QuestionChoice
                        onPress={this.handlePress(nextItem)}
                        media={nextItem.media}
                        isDisabled={isDisabled}
                        isSelected={isSelected(nextItem)}
                        testID={`question-choice-${nextIndex + 1}`}
                        style={styles.card}
                      >
                        {nextItem.label}
                      </QuestionChoice>
                    )}
                    {!nextItem && <View style={styles.card} />}
                  </View>
                </View>
              );
            })}
          </View>
        );
      default:
        return null;
    }
  }
}

export default QuestionChoices;
