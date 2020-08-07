import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import {createEngineConfig} from '../__fixtures__/engine-config';
import {createStoreState, createDataState} from '../__fixtures__/store';
import {createVideo, createPdf} from '../__fixtures__/lessons';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import {mapToResource} from '../layer/data/mappers';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './lesson';
import type {ConnectedStateProps} from './lesson';

const slideRef = 'dummySlideRef';
const levelRef = 'dummyLevelRef';
const chapterId = '666';

const video = createVideo({ref: 'foo'});
const pdf = createPdf({ref: 'bar'});

const level = createLevel({ref: levelRef, chapterIds: [chapterId]});
const question = createQCMGraphic({});
const lessons = [video, pdf];

const slide = createSlide({
  ref: slideRef,
  chapterId,
  question,
  lessons,
});

describe('Lesson', () => {
  describe('props', () => {
    it('should return default props', () => {
      const progression = createProgression({
        _id: 'progression1',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: slideRef,
        },
      });

      const store = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        header: undefined,
        resources: [],
        currentResource: 'foo',
        starsGranted: 0,
      };

      expect(result).toEqual(expected);
    });

    it('should return all props', () => {
      const progression = createProgression({
        _id: 'progression1',
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: slideRef,
        },
        state: {
          nextContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: slideRef,
          },
        },
      });

      const chapters = [];
      const disciplines = [];
      const levels = [level];
      const slides = [slide];
      const store = createStoreState({
        levels,
        disciplines,
        chapters,
        slides,
        progression,
        data: createDataState({
          levels,
          slides,
          chapters,
          disciplines,
          progression,
          configs: {
            'learner@2': createEngineConfig(),
          },
        }),
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        header: question.header,
        resources: slide.lessons.map(mapToResource).filter((lesson) => lesson.url),
        currentResource: 'foo',
        starsGranted: 1337,
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle pdf button press', () => {
    const {Component: Lesson} = require('./lesson');

    const url = 'https://domain.tld';
    const description = 'foo';
    const play = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Lesson navigation={navigation} play={play} starsGranted={0} resources={[]} />,
    );

    const lesson = component.root.find((el) => el.props.testID === 'lesson');
    lesson.props.onPDFButtonPress(url, description);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {
      screen: 'Pdf',
      params: {
        title: description,
        source: {uri: url},
      },
    });
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('should handle video play', () => {
    const {Component: Lesson} = require('./lesson');

    const play = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Lesson navigation={navigation} play={play} starsGranted={0} resources={[]} />,
    );

    const lesson = component.root.find((el) => el.props.testID === 'lesson');
    lesson.props.onVideoPlay();

    expect(play).toHaveBeenCalledTimes(1);
  });

  it('should handle change', () => {
    const {Component: Lesson} = require('./lesson');

    const id = 'foo';
    const selectResource = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Lesson
        navigation={navigation}
        selectResource={selectResource}
        starsGranted={0}
        resources={[pdf].map(mapToResource)}
      />,
    );

    const lesson = component.root.find((el) => el.props.testID === 'lesson');
    lesson.props.onChange(id);

    expect(selectResource).toHaveBeenCalledTimes(1);
    expect(selectResource).toHaveBeenCalledWith(id);
  });
});
