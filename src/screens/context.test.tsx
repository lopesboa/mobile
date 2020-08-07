import * as React from 'react';
import renderer from 'react-test-renderer';

import {createStoreState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import {createContextWithImage} from '../__fixtures__/context';
import {createNavigation} from '../__fixtures__/navigation';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './context';
import type {ConnectedStateProps} from './context';

const slideRef = 'dummySlideRef';
const levelRef = 'dummyLevelRef';
const chapterId = '666';
const level = createLevel({ref: levelRef, chapterIds: [chapterId]});
const question = createQCMGraphic({});
const context = createContextWithImage({title: 'A beautifull rainy day'});
const slide = createSlide({
  ref: slideRef,
  chapterId,
  question,
  context,
});

describe('Context', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
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

    const mockedStore = createStoreState({
      levels: [level],
      disciplines: [],
      chapters: [],
      slides: [slide, slide],
      progression,
    });

    const result = mapStateToProps(mockedStore);
    const expected: ConnectedStateProps = {
      description: context.description,
      header: context.title,
      media: {
        // @ts-ignore optional property
        ...context.media.src[0],
        type: 'img',
      },
    };
    expect(result).toEqual(expected);
  });

  it('should return default props', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: slideRef,
      },
    });
    const emptyStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression,
    });

    const result = mapStateToProps(emptyStore);
    const expected: ConnectedStateProps = {
      description: undefined,
      header: undefined,
      media: undefined,
    };
    expect(result).toEqual(expected);
  });

  it('should handle press', () => {
    const {Component: Context} = require('./context');

    const navigation = createNavigation({});
    const component = renderer.create(<Context navigation={navigation} />);

    const _context = component.root.find((el) => el.props.testID === 'context');
    _context.props.onPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Question');
  });

  it('should handle link press', () => {
    const {Component: Context} = require('./context');

    const url = 'https://domain.tld';
    const navigation = createNavigation({});
    const component = renderer.create(<Context navigation={navigation} />);

    const _context = component.root.find((el) => el.props.testID === 'context');
    _context.props.onLinkPress(url);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {
      screen: 'Browser',
      params: {
        url,
      },
    });
  });

  it('should handle pdf button press', () => {
    const {Component: Context} = require('./context');

    const url = 'https://domain.tld';
    const description = 'foo';
    const navigation = createNavigation({});
    const component = renderer.create(<Context navigation={navigation} />);

    const _context = component.root.find((el) => el.props.testID === 'context');
    _context.props.onPDFButtonPress(url, description);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {
      screen: 'Pdf',
      params: {
        title: description,
        source: {uri: url},
      },
    });
  });
});
