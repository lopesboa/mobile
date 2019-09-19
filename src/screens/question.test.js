// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import {createAnswer} from '../__fixtures__/answers';
import {
  createQCM,
  createQCMGraphic,
  createTemplate,
  createSlider,
  createQCMDrag,
  createBasicQuestion
} from '../__fixtures__/questions';
import {choices} from '../__fixtures__/question-choices';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import {createUiState, createStoreState} from '../__fixtures__/store';
import {CONTENT_TYPE, ENGINE} from '../const';
import type {ConnectedStateProps} from './question';

describe('Question', () => {
  describe('Props', () => {
    const defaultProps: ConnectedStateProps = {
      type: undefined,
      header: undefined,
      explanation: undefined,
      template: undefined,
      choices: undefined,
      unit: undefined,
      userChoices: undefined,
      media: undefined,
      min: undefined,
      slideId: undefined,
      max: undefined,
      step: undefined,
      value: 0
    };

    describe('Loading', () => {
      it('should handle empty next content', () => {
        const {mapStateToProps} = require('./question');

        const state = createStoreState({
          slides: [],
          levels: [],
          chapters: [],
          disciplines: [],
          progression: createProgression({
            engine: ENGINE.LEARNER,
            progressionContent: {
              type: CONTENT_TYPE.LEVEL,
              ref: 'foo'
            }
          })
        });

        const result = mapStateToProps(state);

        expect(result).toEqual(defaultProps);
      });

      it('should handle empty next content', () => {
        const {mapStateToProps} = require('./question');

        const state = createStoreState({
          slides: [],
          levels: [],
          chapters: [],
          disciplines: [],
          progression: createProgression({
            engine: ENGINE.LEARNER,
            progressionContent: {
              type: CONTENT_TYPE.LEVEL,
              ref: 'foo'
            },
            state: {
              nextContent: {
                type: CONTENT_TYPE.CHAPTER,
                ref: 'bar'
              }
            }
          })
        });

        const result = mapStateToProps(state);

        expect(result).toEqual(defaultProps);
      });
    });

    it('should get QCM props', () => {
      const {mapStateToProps} = require('./question');

      const question = createQCM({title: 'Foo bar'});
      const slide = createSlide({title: 'Foo bar', ref: 'foo', chapterId: 'bar', question});
      const answer = createAnswer({});

      const state = createStoreState({
        slides: [slide],
        levels: [],
        chapters: [],
        disciplines: [],
        ui: createUiState({
          answers: {
            progression1: {
              value: answer
            }
          }
        }),
        progression: createProgression({
          engine: ENGINE.LEARNER,
          progressionContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: 'foo'
          },
          state: {
            nextContent: {
              type: CONTENT_TYPE.SLIDE,
              ref: slide.universalRef
            }
          }
        })
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        ...defaultProps,
        slideId: slide.universalRef,
        type: question.type,
        header: question.header,
        explanation: question.explanation,
        template: undefined,
        choices: question.content.choices,
        userChoices: answer,
        value: 0
      };

      expect(result).toEqual(expected);
    });

    it('should get QCM graphic props', () => {
      const {mapStateToProps} = require('./question');

      const question = createQCMGraphic({title: 'Foo bar'});
      const slide = createSlide({title: 'Foo bar', ref: 'foo', chapterId: 'bar', question});
      const answer = createAnswer({});

      const state = createStoreState({
        slides: [slide],
        levels: [],
        chapters: [],
        disciplines: [],
        ui: createUiState({
          answers: {
            progression1: {
              value: answer
            }
          }
        }),
        progression: createProgression({
          engine: ENGINE.LEARNER,
          progressionContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: 'foo'
          },
          state: {
            nextContent: {
              type: CONTENT_TYPE.SLIDE,
              ref: slide.universalRef
            }
          }
        })
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        ...defaultProps,
        slideId: slide.universalRef,
        type: question.type,
        header: question.header,
        explanation: question.explanation,
        template: undefined,
        // $FlowFixMe wrong type
        choices: question.content.choices,
        userChoices: answer,
        value: 0
      };

      expect(result).toEqual(expected);
    });

    it('should get template props', () => {
      const {mapStateToProps} = require('./question');

      const question = createTemplate({title: 'Foo bar'});
      const slide = createSlide({title: 'Foo bar', ref: 'foo', chapterId: 'bar', question});
      const answer = createAnswer({});

      const state = createStoreState({
        slides: [slide],
        levels: [],
        chapters: [],
        disciplines: [],
        ui: createUiState({
          answers: {
            progression1: {
              value: answer
            }
          }
        }),
        progression: createProgression({
          engine: ENGINE.LEARNER,
          progressionContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: 'foo'
          },
          state: {
            nextContent: {
              type: CONTENT_TYPE.SLIDE,
              ref: slide.universalRef
            }
          }
        })
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        ...defaultProps,
        slideId: slide.universalRef,
        type: question.type,
        header: question.header,
        explanation: question.explanation,
        template: "L'app de {{inp123456}} est sur {{sel123456}}.",
        choices: question.content.choices,
        userChoices: answer,
        value: 0
      };

      expect(result).toEqual(expected);
    });

    it('should get slider props', () => {
      const {mapStateToProps} = require('./question');

      const question = createSlider({min: 13, max: 37, defaultValue: 15, answers: []});
      const slide = createSlide({title: 'Foo bar', ref: 'foo', chapterId: 'bar', question});
      const answer = createAnswer({values: ['42']});

      const state = createStoreState({
        slides: [slide],
        levels: [],
        chapters: [],
        disciplines: [],
        ui: createUiState({
          answers: {
            progression1: {
              value: answer
            }
          }
        }),
        progression: createProgression({
          engine: ENGINE.LEARNER,
          progressionContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: 'foo'
          },
          state: {
            nextContent: {
              type: CONTENT_TYPE.SLIDE,
              ref: slide.universalRef
            }
          }
        })
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        ...defaultProps,
        slideId: slide.universalRef,
        type: question.type,
        header: question.header,
        explanation: question.explanation,
        // $FlowFixMe wrong type
        choices: question.content.choices,
        min: 13,
        max: 37,
        unit: '°C',
        step: 3,
        userChoices: answer,
        value: 42
      };

      expect(result).toEqual(expected);
    });

    it('should get QCM drag props', () => {
      const {mapStateToProps} = require('./question');

      const question = createQCMDrag({matchOrder: true});
      const slide = createSlide({title: 'Foo bar', ref: 'foo', chapterId: 'bar', question});
      const answer = createAnswer({});

      const state = createStoreState({
        slides: [slide],
        levels: [],
        chapters: [],
        disciplines: [],
        ui: createUiState({
          answers: {
            progression1: {
              value: answer
            }
          }
        }),
        progression: createProgression({
          engine: ENGINE.LEARNER,
          progressionContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: 'foo'
          },
          state: {
            nextContent: {
              type: CONTENT_TYPE.SLIDE,
              ref: slide.universalRef
            }
          }
        })
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        ...defaultProps,
        slideId: slide.universalRef,
        type: question.type,
        header: question.header,
        explanation: question.explanation,
        template: undefined,
        // $FlowFixMe wrong type
        choices: question.content.choices,
        userChoices: answer,
        value: 0
      };

      expect(result).toEqual(expected);
    });

    it('should get basic props', () => {
      const {mapStateToProps} = require('./question');

      const question = createBasicQuestion({});
      const slide = createSlide({title: 'Foo bar', ref: 'foo', chapterId: 'bar', question});
      const answer = createAnswer({});

      const state = createStoreState({
        slides: [slide],
        levels: [],
        chapters: [],
        disciplines: [],
        ui: createUiState({
          answers: {
            progression1: {
              value: answer
            }
          }
        }),
        progression: createProgression({
          engine: ENGINE.LEARNER,
          progressionContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: 'foo'
          },
          state: {
            nextContent: {
              type: CONTENT_TYPE.SLIDE,
              ref: slide.universalRef
            }
          }
        })
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        ...defaultProps,
        slideId: slide.universalRef,
        type: question.type,
        header: question.header,
        explanation: question.explanation,
        template: undefined,
        // $FlowFixMe wrong type
        choices: question.content.choices,
        userChoices: answer,
        value: 0
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle choice press', () => {
    const {Component: Question} = require('./question');

    const editAnswer = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(<Question navigation={navigation} editAnswer={editAnswer} />);

    const question = component.root.find(el => el.props.testID === 'question');
    question.props.onChoicePress(choices[0]);

    expect(editAnswer).toHaveBeenCalledTimes(1);
    expect(editAnswer).toHaveBeenCalledWith(choices[0]);
  });

  it('should handle slider change', () => {
    const {Component: Question} = require('./question');

    const editAnswer = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(<Question navigation={navigation} editAnswer={editAnswer} />);

    const question = component.root.find(el => el.props.testID === 'question');
    question.props.onSliderChange(42);

    expect(editAnswer).toHaveBeenCalledTimes(1);
    expect(editAnswer).toHaveBeenCalledWith('42');
  });

  it('should handle slider change', () => {
    const {Component: Question} = require('./question');

    const editAnswer = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(<Question navigation={navigation} editAnswer={editAnswer} />);

    const question = component.root.find(el => el.props.testID === 'question');
    question.props.onInputValueChange('foo');

    expect(editAnswer).toHaveBeenCalledTimes(1);
    expect(editAnswer).toHaveBeenCalledWith(['foo']);
  });

  it('should handle choice input change', () => {
    const {Component: Question} = require('./question');

    const editAnswer = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Question
        navigation={navigation}
        editAnswer={editAnswer}
        choices={choices}
        userChoices={[choices[0].value]}
      />
    );

    const question = component.root.find(el => el.props.testID === 'question');
    question.props.onChoiceInputChange(choices[2], choices[2].value);

    expect(editAnswer).toHaveBeenCalledTimes(1);
    expect(editAnswer).toHaveBeenCalledWith([choices[0].value, '', choices[2].value, '']);
  });

  it('should handle choice input change (empty props)', () => {
    const {Component: Question} = require('./question');

    const editAnswer = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(<Question navigation={navigation} editAnswer={editAnswer} />);

    const question = component.root.find(el => el.props.testID === 'question');
    question.props.onChoiceInputChange(choices[0], choices[0].value);

    expect(editAnswer).toHaveBeenCalledTimes(1);
    expect(editAnswer).toHaveBeenCalledWith([]);
  });

  it('should handle choice input change (empty props)', () => {
    const {Component: Question} = require('./question');

    const slideId = 'sli_foo';
    const validateAnswer = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Question navigation={navigation} validateAnswer={validateAnswer} slideId={slideId} />
    );

    const question = component.root.find(el => el.props.testID === 'question');
    question.props.onButtonPress();

    expect(validateAnswer).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Correction', {
      slideId
    });
  });
});
