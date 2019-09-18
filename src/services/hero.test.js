// @flow strict

import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import service from './hero';

const level = createCardLevel({
  ref: 'mod_1',
  status: CARD_STATUS.ACTIVE,
  label: 'Fake level'
});
const card = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline'
});

describe('Hero service', () => {
  it('shoud return card', async () => {
    // $FlowFixMe
    const dataLayer: DataLayer = {};
    const _service = service(dataLayer);

    const result = await _service.get();
    const expected = card;

    expect(result).toEqual(expected);
  });
});
