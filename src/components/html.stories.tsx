import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {createFakeVibration} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {Component as Html} from './html';

storiesOf('Html', module)
  .add('Default', () => (
    <Html fontSize={20} vibration={createFakeVibration()}>
      {`
    Les deux adverbes ont<s>une terminaison</s> qui se <u>prononce "ament"</u>, mais leur orthographe diffère. On écrit ainsi :
    <br/>– <i>vaill<font color="blue">a</font>mment</i>, parce que l'adverbe est formé à partir d’un <b>adjectif en <i>-ant</i></b> (<i>vaill<font color="blue">a</font>nt</i>) ;
    <br/>– <i>incid<font color="blue">e</font>mment</i>, parce que l'adverbe est formé à partir d’un <b>adjectif en <i>-ent</i></b> (<i>incid<font color="blue">e</font>nt</i>).
`}
    </Html>
  ))
  .add('WithImage', () => (
    <Html fontSize={20} vibration={createFakeVibration()}>
      {`
      <center>
          <img src="https://static.coorpacademy.com/content/enjoytesting/raw/Anim_Etoile_1.gif"/>
        </center>
        <font>On this platform</font>, you earn 4 stars per right answer.
        If you successfully complete this level, the stars you’ve accumulated so far will be added to your score and you will rise in the ranks!
        Let’s do it! Good luck on your last question, this is a tough one!
      `}
    </Html>
  ));

if (__TEST__) {
  describe('Html', () => {
    it('should handle onLinkPress', () => {
      const handleLinkPress = jest.fn();
      const vibration = createFakeVibration();
      const component = renderer.create(
        <Html fontSize={20} onLinkPress={handleLinkPress} vibration={vibration}>
          {`<a href="https://domain.tld"></a>`}
        </Html>,
      );
      const html = component.root.find((el) => el.props.testID === 'html-base');
      html.props.onLinkPress();
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handleLinkPress).toHaveBeenCalled();
    });
  });
}
