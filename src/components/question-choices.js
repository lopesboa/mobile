// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {QuestionType, Choice} from '@coorpacademy/progression-engine';

import {QUESTION_TYPE} from '../const';
import theme from '../modules/theme';
import QuestionChoice from './question-choice';
import QuestionTemplate from './question-template';
import Space from './space';
import QuestionDraggable from './question-draggable';

type Props = {|
  type: QuestionType,
  isDisabled?: boolean,
  template?: string,
  items: Array<Choice>,
  userChoices: Array<string>,
  onItemPress: (item: Choice) => void,
  onItemInputChange: (item: Choice, value: string) => void
|};

const PLACEHOLDER_COLOR = theme.colors.gray.medium;

const styles = StyleSheet.create({
  cards: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  card: {
    flex: 1
  },
  template: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  part: {
    padding: theme.spacing.small,
    marginBottom: theme.spacing.tiny
  },
  field: {
    borderWidth: 1,
    borderColor: theme.colors.gray.lightMedium,
    color: PLACEHOLDER_COLOR,
    fontWeight: theme.fontWeight.bold,
    borderRadius: theme.radius.common,
    backgroundColor: theme.colors.white,
    fontSize: 13
  },
  text: {
    paddingHorizontal: theme.spacing.tiny,
    color: theme.colors.black,
    fontWeight: theme.fontWeight.bold
  }
});

class QuestionChoices extends React.PureComponent<Props> {
  props: Props;

  handleItemPress = (item: Choice) => () => this.props.onItemPress(item);

  handleItemInputChange = (item: Choice, value: string) =>
    this.props.onItemInputChange(item, value);

  render() {
    const {type, template, isDisabled, items, userChoices} = this.props;

    const isSelected = (choice: Choice): boolean =>
      userChoices && userChoices.includes(choice.label);

    switch (type) {
      case QUESTION_TYPE.QCM:
        return (
          <View testID="question-choices">
            {items.map((item, index) => (
              <View key={`question-choice-${item._id}`}>
                {index > 0 && <Space />}
                <QuestionChoice
                  onPress={this.handleItemPress(item)}
                  isDisabled={isDisabled}
                  isSelected={isSelected(item)}
                  testID={`question-choice-${item._id}`}
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
                      onPress={this.handleItemPress(item)}
                      media={item.media}
                      isDisabled={isDisabled}
                      isSelected={isSelected(item)}
                      testID={`question-choice-${item._id}`}
                      style={styles.card}
                    >
                      {item.label}
                    </QuestionChoice>
                    <Space />
                    {nextItem && (
                      <QuestionChoice
                        onPress={this.handleItemPress(nextItem)}
                        media={nextItem.media}
                        isDisabled={isDisabled}
                        isSelected={isSelected(nextItem)}
                        testID={`question-choice-${nextItem._id}`}
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
      case QUESTION_TYPE.TEMPLATE:
        return (
          <View testID="question-choices">
            <QuestionTemplate
              isDisabled={isDisabled}
              template={template || ''}
              items={items}
              userChoices={userChoices}
              onInputChange={this.handleItemInputChange}
            />
          </View>
        );
      case QUESTION_TYPE.DRAG_DROP:
        return (
          <View testID="question-draggable">
            <QuestionDraggable
              choices={items}
              userChoices={userChoices}
              onPress={this.props.onItemPress}
            />
          </View>
        );
      default:
        return null;
    }
  }
}

export default QuestionChoices;
