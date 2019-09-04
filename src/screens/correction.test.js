// @flow strict

import {createAnswer} from '../__fixtures__/answers';
import {createQCM} from '../__fixtures__/questions';
import {createPdf} from '../__fixtures__/lessons';
import {createSlide} from '../__fixtures__/slides';
import {createContextWithImage} from '../__fixtures__/context';
import {createProgression} from '../__fixtures__/progression';
import {createNavigation} from '../__fixtures__/navigation';
import {createUiState, createDataState, createStoreState} from '../__fixtures__/store';
import {CONTENT_TYPE, ENGINE, SPECIFIC_CONTENT_REF} from '../const';
import type {ConnectedStateProps, OwnProps, Params} from './correction';

describe('Correction', () => {
  describe('Props', () => {
    const defaultProps: ConnectedStateProps = {
      question: '',
      tip: '',
      keyPoint: '',
      answers: [],
      userAnswers: []
    };

    describe('Loading', () => {
      it('should handle empty next content', () => {
        const {mapStateToProps} = require('./correction');

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

        const navigation = createNavigation({});
        const ownProps: OwnProps = {navigation};

        const result = mapStateToProps(state, ownProps);

        expect(result).toEqual(defaultProps);
      });

      it('should handle different slide than the question one', () => {
        const {mapStateToProps} = require('./correction');

        const question = createQCM({title: 'Foo bar'});
        const slide = createSlide({title: 'Foo bar', ref: 'sli_foo', chapterId: 'bar', question});

        const state = createStoreState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          progression: createProgression({
            engine: ENGINE.LEARNER,
            progressionContent: {
              type: CONTENT_TYPE.LEVEL,
              ref: 'mod_foo'
            },
            state: {
              nextContent: {
                type: CONTENT_TYPE.SLIDE,
                ref: 'sli_foo'
              }
            }
          })
        });

        const params: Params = {
          slideId: 'sli_bar'
        };
        const navigation = createNavigation({params});
        const ownProps: OwnProps = {navigation};

        const result = mapStateToProps(state, ownProps);

        expect(result).toEqual(defaultProps);
      });

      it('should handle correction loading', () => {
        const {mapStateToProps} = require('./correction');

        const question = createQCM({title: 'Foo bar'});
        const slide = createSlide({title: 'Foo bar', ref: 'sli_foo', chapterId: 'bar', question});

        const state = createStoreState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          progression: createProgression({
            engine: ENGINE.LEARNER,
            progressionContent: {
              type: CONTENT_TYPE.LEVEL,
              ref: 'mod_foo'
            },
            state: {
              nextContent: {
                type: CONTENT_TYPE.SLIDE,
                ref: 'sli_foo'
              },
              isCorrect: null
            }
          })
        });

        const params: Params = {
          slideId: 'sli_foo'
        };
        const navigation = createNavigation({params});
        const ownProps: OwnProps = {navigation};

        const result = mapStateToProps(state, ownProps);

        expect(result).toEqual(defaultProps);
      });

      it('should handle correction loading', () => {
        const {mapStateToProps} = require('./correction');

        const question = createQCM({title: 'Foo bar'});
        const slide = createSlide({title: 'Foo bar', ref: 'sli_foo', chapterId: 'bar', question});

        const state = createStoreState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          progression: createProgression({
            engine: ENGINE.LEARNER,
            progressionContent: {
              type: CONTENT_TYPE.LEVEL,
              ref: 'mod_foo'
            },
            state: {
              nextContent: {
                type: CONTENT_TYPE.SLIDE,
                ref: ''
              }
            }
          })
        });

        const params: Params = {
          slideId: 'sli_foo'
        };
        const navigation = createNavigation({params});
        const ownProps: OwnProps = {navigation};

        const result = mapStateToProps(state, ownProps);

        expect(result).toEqual(defaultProps);
      });
    });

    it('should get all props', () => {
      const {mapStateToProps} = require('./correction');

      const question = createQCM({title: 'Foo bar'});
      const context = createContextWithImage({title: 'Foo bar'});
      const lesson = createPdf({ref: 'baz'});
      const slide = createSlide({
        title: 'Foo bar',
        ref: 'sli_foo',
        chapterId: 'bar',
        question,
        context,
        lessons: [lesson]
      });
      const answer = createAnswer({});
      const progression = createProgression({
        _id: 'foobar',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_foo'
        },
        state: {
          viewedResources: [
            {
              type: CONTENT_TYPE.CHAPTER,
              ref: 'bar',
              resources: [lesson.ref]
            }
          ],
          nextContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo'
          }
        }
      });

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
        data: createDataState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          answers: answer,
          progression
        }),
        progression,
        fastSlide: true,
        godMode: true
      });

      const params: Params = {
        slideId: 'sli_foo'
      };
      const navigation = createNavigation({params});
      const ownProps: OwnProps = {navigation};

      const result = mapStateToProps(state, ownProps);

      const props: ConnectedStateProps = {
        hasConsumedExtraLife: false,
        hasContext: true,
        isCorrect: true,
        isFinished: false,
        isFastSlideEnabled: true,
        isGodModeEnabled: true,
        isResourceViewed: true,
        answers: answer,
        userAnswers: answer.concat(['Foo bar']),
        keyPoint: slide.klf,
        tip: slide.tips,
        lives: 4,
        offeringExtraLife: false,
        progressionId: 'progression1',
        // $FlowFixMe wrong type
        question: question.header,
        resources: [
          {
            ...lesson,
            url: lesson.mediaUrl,
            videoId: undefined
          }
        ]
      };

      expect(result).toEqual(props);
    });

    it('should get props without lives', () => {
      const {mapStateToProps} = require('./correction');

      const question = createQCM({title: 'Foo bar'});
      const context = createContextWithImage({title: 'Foo bar'});
      const lesson = createPdf({ref: 'baz'});
      const slide = createSlide({
        title: 'Foo bar',
        ref: 'sli_foo',
        chapterId: 'bar',
        question,
        context,
        lessons: [lesson]
      });
      const answer = createAnswer({});
      const progression = createProgression({
        _id: 'foobar',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_foo'
        },
        state: {
          livesDisabled: true,
          nextContent: {
            type: CONTENT_TYPE.EXIT_NODE,
            ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
          }
        }
      });

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
        data: createDataState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          answers: answer,
          progression
        }),
        progression,
        fastSlide: true,
        godMode: true
      });

      const params: Params = {
        slideId: 'sli_foo'
      };
      const navigation = createNavigation({params});
      const ownProps: OwnProps = {navigation};

      const result = mapStateToProps(state, ownProps);

      const props: ConnectedStateProps = {
        hasConsumedExtraLife: false,
        hasContext: false,
        isCorrect: true,
        isFinished: false,
        isFastSlideEnabled: true,
        isGodModeEnabled: true,
        isResourceViewed: false,
        answers: answer,
        userAnswers: answer.concat(['Foo bar']),
        keyPoint: slide.klf,
        tip: slide.tips,
        lives: undefined,
        offeringExtraLife: true,
        progressionId: 'progression1',
        // $FlowFixMe wrong type
        question: question.header,
        resources: [
          {
            ...lesson,
            url: lesson.mediaUrl,
            videoId: undefined
          }
        ]
      };

      expect(result).toEqual(props);
    });

    it('should get props without lessons', () => {
      const {mapStateToProps} = require('./correction');

      const question = createQCM({title: 'Foo bar'});
      const context = createContextWithImage({title: 'Foo bar'});
      const slide = createSlide({
        title: 'Foo bar',
        ref: 'sli_foo',
        chapterId: 'bar',
        question,
        context
      });
      const answer = createAnswer({});
      const progression = createProgression({
        _id: 'foobar',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_foo'
        },
        state: {
          livesDisabled: true,
          nextContent: {
            type: CONTENT_TYPE.EXIT_NODE,
            ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
          }
        }
      });

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
        data: createDataState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          answers: answer,
          progression
        }),
        progression,
        fastSlide: true,
        godMode: true
      });

      const params: Params = {
        slideId: 'sli_foo'
      };
      const navigation = createNavigation({params});
      const ownProps: OwnProps = {navigation};

      const result = mapStateToProps(state, ownProps);

      const props: ConnectedStateProps = {
        hasConsumedExtraLife: false,
        hasContext: false,
        isCorrect: true,
        isFinished: false,
        isFastSlideEnabled: true,
        isGodModeEnabled: true,
        isResourceViewed: true,
        answers: answer,
        userAnswers: answer.concat(['Foo bar']),
        keyPoint: slide.klf,
        tip: slide.tips,
        lives: undefined,
        offeringExtraLife: true,
        progressionId: 'progression1',
        // $FlowFixMe wrong type
        question: question.header,
        resources: []
      };

      expect(result).toEqual(props);
    });

    it('should get extralife props', () => {
      const {mapStateToProps} = require('./correction');

      const question = createQCM({title: 'Foo bar'});
      const context = createContextWithImage({title: 'Foo bar'});
      const lesson = createPdf({ref: 'baz'});
      const slide = createSlide({
        title: 'Foo bar',
        ref: 'sli_foo',
        chapterId: 'bar',
        question,
        context,
        lessons: [lesson]
      });
      const answer = createAnswer({});
      const progression = createProgression({
        _id: 'foobar',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_foo'
        },
        state: {
          lives: 0,
          nextContent: {
            type: CONTENT_TYPE.EXIT_NODE,
            ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
          }
        }
      });

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
        data: createDataState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          answers: answer,
          progression
        }),
        progression,
        fastSlide: true,
        godMode: true
      });

      const params: Params = {
        slideId: 'sli_foo'
      };
      const navigation = createNavigation({params});
      const ownProps: OwnProps = {navigation};

      const result = mapStateToProps(state, ownProps);

      const props: ConnectedStateProps = {
        hasConsumedExtraLife: false,
        hasContext: false,
        isCorrect: true,
        isFinished: true,
        isFastSlideEnabled: true,
        isGodModeEnabled: true,
        isResourceViewed: false,
        answers: answer,
        userAnswers: answer.concat(['Foo bar']),
        keyPoint: slide.klf,
        tip: slide.tips,
        lives: 0,
        offeringExtraLife: true,
        progressionId: 'progression1',
        // $FlowFixMe wrong type
        question: question.header,
        resources: [
          {
            ...lesson,
            url: lesson.mediaUrl,
            videoId: undefined
          }
        ]
      };

      expect(result).toEqual(props);
    });

    it('should get extralife consumed props', () => {
      const {mapStateToProps} = require('./correction');

      const question = createQCM({title: 'Foo bar'});
      const context = createContextWithImage({title: 'Foo bar'});
      const lesson = createPdf({ref: 'baz'});
      const slide = createSlide({
        title: 'Foo bar',
        ref: 'sli_foo',
        chapterId: 'bar',
        question,
        context,
        lessons: [lesson]
      });
      const answer = createAnswer({});
      const progression = createProgression({
        _id: 'foobar',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_foo'
        },
        state: {
          hasViewedAResourceAtThisStep: true,
          viewedResources: [
            {
              type: CONTENT_TYPE.CHAPTER,
              ref: 'bar',
              resources: [lesson.ref]
            }
          ],
          nextContent: {
            type: CONTENT_TYPE.EXIT_NODE,
            ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
          }
        }
      });

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
        data: createDataState({
          slides: [slide],
          levels: [],
          chapters: [],
          disciplines: [],
          answers: answer,
          progression
        }),
        progression,
        fastSlide: true,
        godMode: true
      });

      const params: Params = {
        slideId: 'sli_foo'
      };
      const navigation = createNavigation({params});
      const ownProps: OwnProps = {navigation};

      const result = mapStateToProps(state, ownProps);

      const props: ConnectedStateProps = {
        hasConsumedExtraLife: true,
        hasContext: false,
        isCorrect: true,
        isFinished: false,
        isFastSlideEnabled: true,
        isGodModeEnabled: true,
        isResourceViewed: false,
        answers: answer,
        userAnswers: answer.concat(['Foo bar']),
        keyPoint: slide.klf,
        tip: slide.tips,
        lives: 4,
        offeringExtraLife: false,
        progressionId: 'progression1',
        // $FlowFixMe wrong type
        question: question.header,
        resources: [
          {
            ...lesson,
            url: lesson.mediaUrl,
            videoId: undefined
          }
        ]
      };

      expect(result).toEqual(props);
    });
  });
});
