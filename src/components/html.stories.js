// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Html from './html';

storiesOf('Html', module)
  .add('Default', () => (
    <Html fontSize={20}>
      {`
    Les deux adverbes ont<s>une terminaison</s> qui se <u>prononce "ament"</u>, mais leur orthographe diffère. On écrit ainsi :
    <br/>– <i>vaill<font color="blue">a</font>mment</i>, parce que l'adverbe est formé à partir d’un <b>adjectif en <i>-ant</i></b> (<i>vaill<font color="blue">a</font>nt</i>) ;
    <br/>– <i>incid<font color="blue">e</font>mment</i>, parce que l'adverbe est formé à partir d’un <b>adjectif en <i>-ent</i></b> (<i>incid<font color="blue">e</font>nt</i>).
`}
    </Html>
  ))
  .add('WithImage', () => (
    <Html fontSize={20}>
      {`
      <center>
          <img src="https://static.coorpacademy.com/content/enjoytesting/raw/Anim_Etoile_1.gif"/>
        </center>
        On this platform, you earn 4 stars per right answer.
        If you successfully complete this level, the stars you’ve accumulated so far will be added to your score and you will rise in the ranks!
        Let’s do it! Good luck on your last question, this is a tough one!
      `}
    </Html>
  ));
