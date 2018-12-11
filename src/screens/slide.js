// @flow strict

import * as React from 'react';
import {StyleSheet} from 'react-native';

import Text from '../components/text';
import Slide from '../components/slide';
import Screen from '../components/screen';
import theme from '../modules/theme';
import type {QuestionChoiceItem} from '../types';
import slides from '../__mocks__/slides';
import type {MockSlide} from '../__mocks__/slides';

type Props = ReactNavigation$ScreenProps;

type State = {|
  slides: Array<MockSlide>,
  current?: string,
  isCorrect?: boolean,
  isFinished?: boolean
|};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingBottom: theme.spacing.base
  },
  success: {
    color: theme.colors.positive
  },
  error: {
    color: theme.colors.negative
  }
});

class SlideScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    slides,
    current: 'slide_1'
  };

  static navigationOptions = ({navigationOptions}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      shadowColor: 'transparent',
      elevation: 0,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
      height: 0
    }
  });

  handleQuestionChoicePress = (item: QuestionChoiceItem) => {
    this.setState((state: State) => ({
      slides: state.slides.map(slide => {
        if (slide.ref === state.current) {
          return {
            ...slide,
            question: {
              ...slide.question,
              choices: slide.question.choices.map(choice => {
                if (choice.value === item.value) {
                  return {
                    ...item,
                    selected: !item.selected
                  };
                }

                return choice;
              })
            }
          };
        }

        return slide;
      })
    }));
  };

  getCurrentSlide = (): MockSlide | void =>
    this.state.slides.find(slide => slide.ref === this.state.current);

  getNextSlide = (): MockSlide | void => {
    const index = this.state.slides.findIndex(slide => slide.ref === this.state.current);
    return this.state.slides[index + 1];
  };

  handleQuestionButtonPress = () => {
    const slide = this.getCurrentSlide();
    if (!slide) {
      return;
    }

    const userAnswer: Array<string> = slide.question.choices
      .filter(choice => choice.selected)
      .map(choice => choice.value);
    const answer: Array<string> = slide.question.answer;
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(answer);

    this.setState(
      {
        isCorrect
      },
      () => {
        isCorrect && this.handleNextSlideNavigation();
      }
    );
  };

  handleNextSlideNavigation = () => {
    const nextSlide = this.getNextSlide();
    this.setState({
      current: nextSlide && nextSlide.ref,
      isFinished: !nextSlide
    });
  };

  render() {
    const currentSlide = this.getCurrentSlide();
    const question = {
      ...(currentSlide && currentSlide.question),
      onChoicePress: this.handleQuestionChoicePress,
      onButtonPress: this.handleQuestionButtonPress
    };
    const {isCorrect, isFinished} = this.state;
    const hasCorrection = !isFinished && isCorrect !== undefined;

    return (
      <Screen testID="slide-screen">
        {isFinished && (
          <Text style={[styles.text, styles.success]} testID="chapter-end">
            Well done!
          </Text>
        )}
        {hasCorrection && (
          <Text
            style={[styles.text, (isCorrect && styles.success) || styles.error]}
            testID={`correction-${(isCorrect && 'success') || 'error'}`}
          >
            {(isCorrect && 'Good job!') || 'Wrong answer...'}
          </Text>
        )}
        {!isFinished && <Slide question={question} />}
      </Screen>
    );
  }
}

export default SlideScreen;
