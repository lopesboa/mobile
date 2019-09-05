// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import image from '../__fixtures__/assets/landscape-2.jpg';
import ImageBackground from './image-background';

const uri =
  '//static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg';

storiesOf('ImageBackground', module)
  .add('Default (local)', () => <ImageBackground source={image} />)
  .add('Max width (local)', () => <ImageBackground source={image} style={{width: 200}} />)
  .add('Max height (local)', () => <ImageBackground source={image} style={{height: 200}} />)
  .add('Max width and height (local)', () => (
    <ImageBackground source={image} style={{width: 200, height: 200}} />
  ))
  .add('Contain (local)', () => (
    <ImageBackground source={image} style={{width: 200, height: 200}} resizeMode="contain" />
  ))
  .add('Gradient (local)', () => (
    <ImageBackground
      source={image}
      gradient={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
    />
  ))
  .add('Default (remote)', () => <ImageBackground source={{uri}} />)
  .add('Max width (remote)', () => <ImageBackground source={{uri}} style={{width: 200}} />)
  .add('Max height (remote)', () => <ImageBackground source={{uri}} style={{height: 200}} />)
  .add('Max width and height (remote)', () => (
    <ImageBackground source={{uri}} style={{width: 200, height: 200}} />
  ))
  .add('Contain (remote)', () => (
    <ImageBackground source={{uri}} style={{width: 200, height: 200}} resizeMode="contain" />
  ))
  .add('Gradient (remote)', () => (
    <ImageBackground
      source={{uri}}
      gradient={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
    />
  ));

if (__TEST__) {
  const encodedUri =
    'https%3A%2F%2Fstatic.coorpacademy.com%2Fcontent%2FCoorpAcademy%2Fcontent-eyrolles%2Fcockpit-eyrolles%2Fdefault%2Fshutterstock_123603871-1-1545058448041.jpg';

  describe('ImageBackground', () => {
    it('should use original url', () => {
      const component = renderer.create(<ImageBackground source={{uri}} />);
      const children = component.root.find(el => el.props.testID === 'image-background');
      expect(children.props.source.uri).toEqual(`https:${uri}`);
    });

    it('should resize by width', () => {
      const component = renderer.create(<ImageBackground source={{uri}} style={{width: 200}} />);
      const children = component.root.find(el => el.props.testID === 'image-background');
      expect(children.props.source.uri).toEqual(
        `https://api.coorpacademy.com/api-service/medias?url=${encodedUri}&m=crop&q=90&w=400`
      );
    });

    it('should resize by height', () => {
      const component = renderer.create(<ImageBackground source={{uri}} style={{height: 200}} />);
      const children = component.root.find(el => el.props.testID === 'image-background');
      expect(children.props.source.uri).toEqual(
        `https://api.coorpacademy.com/api-service/medias?url=${encodedUri}&m=crop&q=90&h=400`
      );
    });

    it('should resize by width and height', () => {
      const component = renderer.create(
        <ImageBackground source={{uri}} style={{width: 200, height: 200}} />
      );
      const children = component.root.find(el => el.props.testID === 'image-background');
      expect(children.props.source.uri).toEqual(
        `https://api.coorpacademy.com/api-service/medias?url=${encodedUri}&m=crop&q=90&w=400&h=400`
      );
    });

    it('should resize by width and height in contain mode', () => {
      const component = renderer.create(
        <ImageBackground source={{uri}} style={{width: 200, height: 200}} resizeMode="contain" />
      );
      const children = component.root.find(el => el.props.testID === 'image-background');
      expect(children.props.source.uri).toEqual(
        `https://api.coorpacademy.com/api-service/medias?url=${encodedUri}&m=contain&q=90&w=400&h=400`
      );
    });
  });
}
