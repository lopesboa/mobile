// @flow strict

import {createAnswer} from '../__fixtures__/answers';
import {
  createQCM,
  createQCMGraphic,
  createTemplate,
  createSlider,
  createQCMDrag,
  createBasicQuestion
} from '../__fixtures__/questions';
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
});
