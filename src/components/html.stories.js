// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Html from './html';

storiesOf('Html', module).add('Default', () => (
  <Html fontSize={20}>
    {`
    <h1>Header 1</h1>
    <h2>Header 2</h2>
    <h3>Header 3</h3>
    <h4>Header 4</h4>
    <h5>Header 5</h5>
    <h6>Header 6</h6>
    <ul>
      <li>List item</li>
    </ul>
    <br>
    <div><span>Span</span></div>
    <div><p>Paragraph</p></div>
    <div><u>underline</u></div>
    <div><i>italic</i></div>
    <div><b>bold</b></div>
    <div><s>striped</s></div>
    <div>2<sup>3</sup>=8</div>
    <div>CO<sub>2</sub></div>
`}
  </Html>
));