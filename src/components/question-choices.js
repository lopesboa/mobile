// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {QuestionType, Choice} from '@coorpacademy/progression-engine';

import {QUESTION_TYPE, QUESTION_CHOICE_INPUT_TYPE} from '../const';
import theme from '../modules/theme';
import QuestionSlider from '../containers/question-slider';
import type {Props as QuestionSliderProps} from '../containers/question-slider';
import QuestionInput from './question-input';
import QuestionChoice from './question-choice';
import QuestionTemplate from './question-template';
import Space from './space';
import QuestionDraggable from './question-draggable';

export type Props = $Exact<{|
  type: QuestionType,
  isDisabled?: boolean,
  template?: string,
  items: Array<Choice>,
  userChoices: Array<string>,
  onItemPress: (item: Choice) => void,
  onSliderChange: (value: number) => void,
  min?: $PropertyType<QuestionSliderProps, 'min'>,
  max?: $PropertyType<QuestionSliderProps, 'max'>,
  step?: $PropertyType<QuestionSliderProps, 'step'>,
  value?: $PropertyType<QuestionSliderProps, 'value'>,
  onItemInputChange: (item: Choice, value: string) => void,
  onInputValueChange: (value: string) => void
|}>;

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
    fontSize: theme.fontSize.medium
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
    const {
      type,
      template,
      isDisabled,
      items,
      userChoices,
      min,
      max,
      value,
      step,
      onSliderChange,
      onInputValueChange
    } = this.props;

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
                  questionType={type}
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
              return (
                <View key={`question-choice-row-${item._id}`}>
                  {index > 0 && <Space />}
                  <View style={styles.cards}>
                    <QuestionChoice
                      onPress={this.handleItemPress(item)}
                      media={item.media}
                      isDisabled={isDisabled}
                      isSelected={isSelected(item)}
                      testID={`question-choice-${item._id}`}
                      style={styles.card}
                      questionType={type}
                    >
                      {item.label}
                    </QuestionChoice>
                    <Space />
                  </View>
                </View>
              );
            })}
          </View>
        );
      case QUESTION_TYPE.SLIDER: {
        if (!min || !max) {
          return null;
        }
        return (
          <QuestionSlider
            min={min}
            max={max}
            value={value}
            step={step}
            onChange={onSliderChange}
            testID="question-slider"
          />
        );
      }
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
      case QUESTION_TYPE.BASIC:
        return (
          <QuestionInput
            fullWitdh
            questionType={QUESTION_TYPE.BASIC}
            type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
            onChange={onInputValueChange}
          />
        );
      default:
        return null;
    }
  }
}

export default QuestionChoices;
