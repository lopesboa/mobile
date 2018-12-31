// @flow

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type {QuestionChoiceItem} from '../types';
import type {ConnectedProps as QuestionProps, Correction} from '../screens/question';
import slides from '../__mocks__/slides';
import type {MockSlide} from '../__mocks__/slides';

export type WithSlidesProps = QuestionProps;

function withSlides<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<React$ElementConfig<React$ComponentType<WithSlidesProps & P>>> {
  type Props = $Exact<{|
    ...P,
    ...WithSlidesProps
  |}>;
  type State = {|
    slides: Array<MockSlide>,
    current?: string
  |};
  class ComponentWithSlides extends React.PureComponent<Props, State> {
    props: Props;

    state: State = {
      slides,
      current: 'slide_1'
    };

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

    getCorrection = (): Correction | void => {
      const slide = this.getCurrentSlide();
      if (!slide) {
        return;
      }

      const userAnswers: Array<QuestionChoiceItem> = slide.question.choices.filter(
        choice => choice.selected
      );
      const answers: Array<QuestionChoiceItem> = slide.question.choices.filter(choice =>
        slide.question.answers.includes(choice.value)
      );

      const isCorrect =
        JSON.stringify(userAnswers.map(userAnswer => userAnswer.value)) ===
        JSON.stringify(answers.map(answer => answer.value));

      const result: Correction = {
        isCorrect,
        tip:
          'Executorship is one of several smart-contract applications offered by Ethereum. Blockchain can guarantee transactions even if several years have passed between the instruction of the transaction and its execution.',
        keyPoint: 'A sponsored post is a small advertising insert appearing in users’ timelines.',
        answers: answers.map(answer => answer.label),
        userAnswers: userAnswers.map(userAnswer => userAnswer.label)
      };

      return result;
    };

    handleCorrectAnswer = (): boolean => {
      const nextSlide = this.getNextSlide();
      if (nextSlide) {
        this.setState({
          current: nextSlide.ref
        });
      }

      return !nextSlide;
    };

    render() {
      const currentSlide = this.getCurrentSlide();

      if (!currentSlide) {
        return null;
      }

      const {type, header, explanation, choices, media, answers} = currentSlide.question;

      return (
        <WrappedComponent
          {...this.props}
          type={type}
          header={header}
          explanation={explanation}
          choices={choices}
          media={media}
          answers={answers}
          onChoicePress={this.handleQuestionChoicePress}
          onCorrectAnswer={this.handleCorrectAnswer}
          getCorrection={this.getCorrection}
        />
      );
    }
  }

  return hoistNonReactStatic(ComponentWithSlides, WrappedComponent);
}

export default withSlides;
