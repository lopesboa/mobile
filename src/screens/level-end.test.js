// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import {createStoreState, createCatalogState} from '../__fixtures__/store';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createDiscipline} from '../__fixtures__/disciplines';
import {createLevel} from '../__fixtures__/levels';
import {createChapter} from '../__fixtures__/chapters';
import {createProgression} from '../__fixtures__/progression';
import {createContextWithImage} from '../__fixtures__/context';
import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {CONTENT_TYPE, ENGINE} from '../const';
import {CARD_STATUS} from '../layer/data/_const';
import {mapToLevelAPI, mapToChapterAPI} from '../layer/data/mappers';
import type {ConnectedStateProps, Params} from './level-end';

const question = createQCMGraphic({});
const context = createContextWithImage({title: 'A beautifull rainy day'});
const slide = createSlide({
  ref: 'dummySlideRef',
  chapterId: '666',
  chapterIds: ['666'],
  question,
  context
});

const levelOne = createLevel({ref: 'mod_foo', chapterIds: ['cha_foo']});
const levelTwo = createLevel({ref: 'mod_bar', chapterIds: ['cha_bar']});
const levelThree = createLevel({ref: 'mod_baz', chapterIds: ['cha_baz']});
const levelFour = createLevel({ref: 'mod_qux', chapterIds: ['cha_qux']});
const levelFive = createLevel({ref: 'mod_quux', chapterIds: ['cha_quux']});
const chapter = createChapter({name: 'Fake chapter', ref: 'cha_foo'});
const disciplineOne = createDiscipline({
  ref: 'dis1',
  levels: [levelOne, levelTwo, levelThree],
  name: 'Fake discipline'
});
const disciplineTwo = createDiscipline({
  ref: 'dis2',
  levels: [levelFour, levelFive],
  name: 'Fake discipline'
});
const disciplineCardOne = createDisciplineCard({
  ref: disciplineOne.ref,
  completion: 0,
  levels: disciplineOne.modules.map(({ref, name}) =>
    createCardLevel({ref, label: name, status: CARD_STATUS.ACTIVE})
  ),
  title: disciplineOne.name
});
const disciplineCardTwo = createDisciplineCard({
  ref: disciplineTwo.ref,
  completion: 0,
  levels: disciplineTwo.modules.map(({ref, name}) =>
    createCardLevel({ref, label: name, status: CARD_STATUS.ACTIVE})
  ),
  title: disciplineTwo.name
});

const createParams = ({isCorrect = false}: {isCorrect?: boolean}): Params => ({
  isCorrect,
  progressionId: '42'
});

describe('LevelEnd', () => {
  describe('Props', () => {
    const catalog = createCatalogState({cards: [disciplineCardOne, disciplineCardTwo]});

    it('should have learner props', () => {
      const {mapStateToProps} = require('./level-end');

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: levelOne.ref
        },
        state: {
          nextContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: levelTwo.ref
          },
          stars: 20
        }
      });

      const state = createStoreState({
        levels: [levelOne, levelTwo, levelThree, levelFour, levelFive],
        disciplines: [disciplineOne, disciplineTwo],
        chapters: [chapter],
        slides: [slide, slide],
        progression,
        catalog,
        nextContent: mapToLevelAPI(levelTwo)
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        contentType: CONTENT_TYPE.LEVEL,
        nextContent: mapToLevelAPI(levelTwo),
        currentContent: mapToLevelAPI(levelOne),
        bestScore: 20,
        recommendation: disciplineCardTwo
      };

      expect(result).toEqual(expected);
    });

    it('should have microlearning props', () => {
      const {mapStateToProps} = require('./level-end');

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.CHAPTER,
          ref: chapter.universalRef
        },
        state: {
          nextContent: {
            type: CONTENT_TYPE.CHAPTER,
            ref: chapter.universalRef
          },
          stars: 7
        }
      });

      const state = createStoreState({
        levels: [levelOne, levelTwo, levelThree, levelFour, levelFive],
        disciplines: [disciplineOne, disciplineTwo],
        chapters: [chapter],
        slides: [slide, slide],
        progression,
        catalog,
        nextContent: mapToChapterAPI(chapter)
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        contentType: CONTENT_TYPE.CHAPTER,
        nextContent: mapToChapterAPI(chapter),
        currentContent: mapToChapterAPI(chapter),
        bestScore: 7,
        recommendation: disciplineCardOne
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle focus', () => {
    const {Component: LevelEnd} = require('./level-end');

    const params = createParams({});
    const navigation = createNavigation({params});
    const component = renderer.create(<LevelEnd navigation={navigation} />);

    const navigationEvents = component.root.find(
      el => el.props.testID === 'level-end-navigation-events'
    );
    const levelEnd = component.root.find(el => el.props.testID === 'level-end');

    expect(levelEnd.props.isFocused).toBeFalsy();

    navigationEvents.props.onDidFocus();

    expect(levelEnd.props.isFocused).toBeTruthy();
  });

  it('should handle close', () => {
    const {Component: LevelEnd} = require('./level-end');

    const params = createParams({});
    const navigation = createNavigation({params});
    const component = renderer.create(<LevelEnd navigation={navigation} />);

    const levelEnd = component.root.find(el => el.props.testID === 'level-end');
    levelEnd.props.onClose();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('should handle card press', () => {
    const {Component: LevelEnd} = require('./level-end');

    const selectCard = jest.fn();
    const params = createParams({});
    const navigation = createNavigation({params});
    const component = renderer.create(<LevelEnd navigation={navigation} selectCard={selectCard} />);

    const levelEnd = component.root.find(el => el.props.testID === 'level-end');
    levelEnd.props.onCardPress(disciplineCardOne);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Slide');
    expect(selectCard).toHaveBeenCalledTimes(1);
    expect(selectCard).toHaveBeenCalledWith(disciplineCardOne);
  });

  it('should handle button press', () => {
    const {Component: LevelEnd} = require('./level-end');

    const createNextProgression = jest.fn();
    const params = createParams({});
    const navigation = createNavigation({params});
    const component = renderer.create(
      <LevelEnd navigation={navigation} createNextProgression={createNextProgression} />
    );

    const levelEnd = component.root.find(el => el.props.testID === 'level-end');
    levelEnd.props.onButtonPress();

    expect(createNextProgression).toHaveBeenCalledTimes(0);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('should handle button press (with next level)', () => {
    const {Component: LevelEnd} = require('./level-end');

    const createNextProgression = jest.fn();
    const params = createParams({isCorrect: true});
    const navigation = createNavigation({params});
    const component = renderer.create(
      <LevelEnd
        navigation={navigation}
        createNextProgression={createNextProgression}
        nextContent={levelOne}
      />
    );

    const levelEnd = component.root.find(el => el.props.testID === 'level-end');
    levelEnd.props.onButtonPress();

    expect(createNextProgression).toHaveBeenCalledTimes(1);
    expect(createNextProgression).toHaveBeenCalledWith(CONTENT_TYPE.LEVEL, levelOne.universalRef);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Slide');
  });

  it('should handle button press (with next chapter)', () => {
    const {Component: LevelEnd} = require('./level-end');

    const createNextProgression = jest.fn();
    const params = createParams({isCorrect: true});
    const navigation = createNavigation({params});
    const component = renderer.create(
      <LevelEnd
        navigation={navigation}
        createNextProgression={createNextProgression}
        nextContent={chapter}
      />
    );

    const levelEnd = component.root.find(el => el.props.testID === 'level-end');
    levelEnd.props.onButtonPress();

    expect(createNextProgression).toHaveBeenCalledTimes(1);
    expect(createNextProgression).toHaveBeenCalledWith(CONTENT_TYPE.CHAPTER, chapter.universalRef);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Slide');
  });
});
