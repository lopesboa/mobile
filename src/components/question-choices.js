// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {QuestionType, Choice} from '@coorpacademy/progression-engine';
import type {SliderProps} from '../types';

import {QUESTION_TYPE, QUESTION_CHOICE_INPUT_TYPE} from '../const';
import theme from '../modules/theme';

import QuestionInput from './question-input';
import QuestionChoice from './question-choice';
import QuestionTemplate from './question-template';

import Space from './space';
import QuestionSlider from './question-slider';
import QuestionDraggable from './question-draggable';

type Props = {|
  type: QuestionType,
  isDisabled?: boolean,
  template?: string,
  items: Array<Choice>,
  userChoices: Array<string>,
  onItemPress: (item: Choice) => void,
  onSliderChange?: (newValue: number) => void,
  slider?: SliderProps,
  onItemInputChange: (item: Choice, value: string) => void,
  onInputValueChange: (value: string) => void
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
      slider,
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
      case QUESTION_TYPE.SLIDER: {
        const minValue = slider && slider.minValue;
        const maxValue = slider && slider.maxValue;
        const maxLabel = slider && slider.maxLabel;
        const minLabel = slider && slider.minLabel;
        const step = slider && slider.step;
        const value = slider && slider.value;
        return (
          <QuestionSlider
            minValue={minValue}
            maxValue={maxValue}
            minLabel={minLabel}
            maxLabel={maxLabel}
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
