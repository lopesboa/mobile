import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {video, image, pdf, emptyMedia} from '../__fixtures__/medias';
import Feedback from './feedback';

const description =
  '<font color="blue">⬤</font> FOO :<br>Follow this <a href="https://onboarding.coorpacademy.com/catalog?skill=skill_foo" target="_self">link</a>.<br><br><font color="red">⬤</font> BAR :<br>For more informations, <a href="https://onboarding.coorpacademy.com/catalog?skill=skill_bar" target="_self">here</a>.';

storiesOf('Feedback', module)
  .add('Empty', () => <Feedback onPDFButtonPress={handleFakePress} onLinkPress={handleFakePress} />)
  .add('No media', () => (
    <Feedback
      title="Foo bar"
      description={description}
      onPDFButtonPress={handleFakePress}
      onLinkPress={handleFakePress}
    />
  ))
  .add('Unsupported media', () => (
    <Feedback
      title="Foo bar"
      description={description}
      media={emptyMedia}
      onPDFButtonPress={handleFakePress}
      onLinkPress={handleFakePress}
    />
  ))
  .add('Image', () => (
    <Feedback
      title="Foo bar"
      description={description}
      media={image}
      onPDFButtonPress={handleFakePress}
      onLinkPress={handleFakePress}
    />
  ))
  .add('PDF', () => (
    <Feedback
      title="Foo bar"
      description={description}
      media={pdf}
      onPDFButtonPress={handleFakePress}
      onLinkPress={handleFakePress}
    />
  ))
  .add('Video', () => (
    <Feedback
      title="Foo bar"
      description={description}
      media={video}
      onPDFButtonPress={handleFakePress}
      onLinkPress={handleFakePress}
    />
  ))
  .add('Image only', () => (
    <Feedback media={image} onPDFButtonPress={handleFakePress} onLinkPress={handleFakePress} />
  ))
  .add('Title only', () => (
    <Feedback title="Foo bar" onPDFButtonPress={handleFakePress} onLinkPress={handleFakePress} />
  ))
  .add('Description only', () => (
    <Feedback
      description={description}
      onPDFButtonPress={handleFakePress}
      onLinkPress={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('Feedback', () => {
    it('should handle onPress callback on pdf', () => {
      const handlePDFButtonPress = jest.fn();
      const pdfUrl = 'https://domain.tld';
      const pdfDescription = 'foo bar baz';

      const component = renderer.create(
        <Feedback
          title="Foo bar"
          description={description}
          media={pdf}
          onPDFButtonPress={handlePDFButtonPress}
          onLinkPress={handleFakePress}
        />,
      );

      const button = component.root.find((el) => el.props.testID === 'feedback-resource-pdf');
      button.props.onPress(pdfUrl, pdfDescription);

      expect(handlePDFButtonPress).toHaveBeenCalledTimes(1);
      expect(handlePDFButtonPress).toHaveBeenCalledWith(pdfUrl, pdfDescription);
    });

    it('should handle onPress callback -- without url', () => {
      const handlePDFButtonPress = jest.fn();

      const component = renderer.create(
        <Feedback
          title="Foo bar"
          description={description}
          media={pdf}
          onPDFButtonPress={handlePDFButtonPress}
          onLinkPress={handleFakePress}
        />,
      );

      const button = component.root.find((el) => el.props.testID === 'feedback-resource-pdf');
      button.props.onPress();

      expect(handlePDFButtonPress).toHaveBeenCalledTimes(0);
    });
  });
}
