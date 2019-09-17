// @flow

import * as React from 'react';

import {storiesOf} from '@storybook/react-native';
import {fakeLayout, TestContextProvider} from '../utils/tests';
import {createAuthenticationState} from '../__fixtures__/store';
import {createUser} from '../__fixtures__/user';

import {Component as Hero} from './hero';

const authenticationStateWithoutUser = createAuthenticationState({user: null});
const authenticationStateWithUser = createAuthenticationState({user: createUser()});

storiesOf('Hero', module)
  .add('Default', () => (
    <TestContextProvider store={{authentication: authenticationStateWithoutUser}}>
      <Hero layout={fakeLayout} />
    </TestContextProvider>
  ))
  .add('With user', () => (
    <TestContextProvider store={{authentication: authenticationStateWithUser}}>
      <Hero layout={fakeLayout} />
    </TestContextProvider>
  ));
