// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createSelectChoice} from '../__fixtures__/question-choices';
import {handleFakePress} from '../utils/tests';
import Select from './select';

const select = createSelectChoice({name: 'sel456'});
const items = select.items || [];

storiesOf('Select', module)
  .add('Default', () => (
    <Select values={items} placeholder="Foo bar baz" onChange={handleFakePress} />
  ))
  .add('Not empty', () => (
    <Select
      values={items}
      value={items[1].value}
      placeholder="Foo bar baz"
      onChange={handleFakePress}
    />
  ))
  .add('Disabled', () => (
    <Select
      values={items}
      value={items[1].value}
      placeholder="Foo bar baz"
      onChange={handleFakePress}
      isDisabled
    />
  ));
