// @flow strict

import {createDisciplineCard, createCardLevel, createChapterCard} from '../__fixtures__/cards';
import {uniqBy, getCurrentContent} from '.';

describe('Utils', () => {
  it('uniqBy', () => {
    expect(uniqBy(v => v.toString(), [1, 2, 2])).toEqual([1, 2]);
    expect(uniqBy(v => v.toString(), [2, 1, 2])).toEqual([2, 1]);
    expect(uniqBy(v => v, ['A', 'B', 'B'])).toEqual(['A', 'B']);
    expect(uniqBy(v => v, ['B', 'A', 'B'])).toEqual(['B', 'A']);
    expect(uniqBy(v => v.title, [{title: 'A'}, {title: 'B'}, {title: 'B'}])).toEqual([
      {title: 'A'},
      {title: 'B'}
    ]);
    expect(uniqBy(v => v.title, [{title: 'B'}, {title: 'A'}, {title: 'B'}])).toEqual([
      {title: 'B'},
      {title: 'A'}
    ]);
  });
  it('getCurrentContent', () => {
    const levelCard1 = createCardLevel({
      ref: 'mod_1',
      status: 'isActive',
      label: 'Fake level'
    });
    const levelCard2 = createCardLevel({
      ref: 'mod_2',
      status: 'isActive',
      label: 'Fake level'
    });
    const dis1 = createDisciplineCard({
      ref: 'dis1',
      completion: 0,
      levels: [levelCard1, levelCard2],
      title: 'First discipline'
    });
    const dis2 = createDisciplineCard({
      ref: 'dis2',
      completion: 0,
      levels: [levelCard2],
      title: 'First discipline'
    });
    const chapter1 = createChapterCard({
      ref: 'cha1',
      completion: 0,
      status: 'isActive',
      title: 'Chapter'
    });
    const chapter2 = createChapterCard({
      ref: 'cha2',
      completion: 0,
      status: 'isActive',
      title: 'Chapter'
    });
    const catalog = {
      entities: {
        cards: {
          dis1: {
            en: dis1
          },
          dis2: {
            fr: dis2
          },
          cha1: {
            es: chapter1
          },
          cha2: {
            pt: chapter2
          }
        },
        sections: {}
      }
    };

    const currentDiscipline = getCurrentContent(catalog, {type: 'level', ref: 'mod_2'}, 'en');
    const currentChapter = getCurrentContent(catalog, {type: 'chapter', ref: 'cha2'}, 'pt');
    // $FlowFixMe
    expect('dis1').toEqual(currentDiscipline.universalRef);
    // $FlowFixMe
    expect('cha2').toEqual(currentChapter.universalRef);
  });
});
