// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createAnswer} from '../__fixtures__/answers';
import {createVideo, createPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress, fakeLayout} from '../utils/tests';
import {reduceToResources} from '../layer/data/mappers';
import {Component as Correction} from './correction';

const lessons = [
  createVideo({ref: 'les_1'}),
  createPdf({ref: 'les_2'}),
  createVideo({ref: 'les_3', subtitleRef: 'foobarbaz'})
];
const resources = reduceToResources(lessons);

const fakeQuestion = 'Where is Waldo ?';
const fakeTip =
  "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you";
const fakeKeyPoint = 'The KEY POINT';
const answers = createAnswer({});

storiesOf('Correction', module)
  .add('Default', () => (
    <TestContextProvider>
      <Correction
        question=""
        tip=""
        keyPoint=""
        answers={[]}
        userAnswers={[]}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Right answer', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers}
        resources={resources}
        isCorrect
        lives={3}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Right answer (resource viewed)', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers}
        resources={resources}
        isCorrect
        isResourceViewed
        lives={3}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Bad answer', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        resources={resources}
        isCorrect={false}
        lives={2}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Bad answer (resource viewed)', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        resources={resources}
        isCorrect={false}
        isResourceViewed
        lives={2}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without resource', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        isCorrect={false}
        lives={2}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Extralife', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        resources={resources}
        isCorrect={false}
        offeringExtraLife
        lives={0}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Extralife consumed', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        resources={resources}
        isCorrect={false}
        hasConsumedExtraLife
        lives={0}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Game over', () => (
    <TestContextProvider>
      <Correction
        question={fakeQuestion}
        tip={fakeTip}
        keyPoint={fakeKeyPoint}
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        resources={resources}
        isCorrect={false}
        lives={0}
        layout={fakeLayout}
        onButtonPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Correction', () => {
    it('should handle video preview press', () => {
      const handleVideoPlay = jest.fn();
      const testID = `card-resource-${resources[0].ref.toLowerCase()}-resource`;
      const component = renderer.create(
        <TestContextProvider>
          <Correction
            question={fakeQuestion}
            tip={fakeTip}
            keyPoint={fakeKeyPoint}
            answers={answers}
            userAnswers={answers.concat(['Anything else'])}
            resources={[resources[0]]}
            isCorrect={false}
            lives={2}
            layout={fakeLayout}
            onButtonPress={handleFakePress}
            onPDFButtonPress={handleFakePress}
            onVideoPlay={handleVideoPlay}
          />
        </TestContextProvider>
      );

      const resource = component.root.find(el => el.props.testID === testID);
      resource.props.onPress();

      expect(handleVideoPlay).toHaveBeenCalledTimes(1);
    });

    it('should handle PDF preview press', () => {
      const handlePDFButtonPress = jest.fn();
      const testID = `card-resource-${resources[1].ref.toLowerCase()}-resource`;
      const component = renderer.create(
        <TestContextProvider>
          <Correction
            question={fakeQuestion}
            tip={fakeTip}
            keyPoint={fakeKeyPoint}
            answers={answers}
            userAnswers={answers.concat(['Anything else'])}
            resources={[resources[1]]}
            isCorrect={false}
            lives={2}
            layout={fakeLayout}
            onButtonPress={handleFakePress}
            onPDFButtonPress={handlePDFButtonPress}
            onVideoPlay={handleFakePress}
          />
        </TestContextProvider>
      );

      const resource = component.root.find(el => el.props.testID === testID);
      const fakeUrl = 'foo';
      const fakeDescription = 'bar';
      resource.props.onPress(fakeUrl, fakeDescription);

      expect(handlePDFButtonPress).toHaveBeenCalledTimes(1);
      expect(handlePDFButtonPress).toHaveBeenCalledWith(fakeUrl, fakeDescription);
    });
  });
}
