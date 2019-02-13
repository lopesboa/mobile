// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createLevel} from '../__fixtures__/levels';
import {createDiscipline} from '../__fixtures__/disciplines';
import {createChapter} from '../__fixtures__/chapters';
import {handleFakePress} from '../utils/tests';
import Catalog from './catalog';

const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1']});
const discipline = createDiscipline({ref: 'dis_1', levels: [level], name: 'Fake discipline'});
const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});

storiesOf('Catalog', module).add('Default', () => (
  <Catalog items={[discipline, chapter]} onPress={handleFakePress} />
));
