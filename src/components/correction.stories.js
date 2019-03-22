// @flow

import * as React from 'react';
import {View, Dimensions} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {answers} from '../__fixtures__/answers';
import {createVideo, createPdf} from '../__fixtures__/lessons';
import type {Layout} from '../containers/with-layout';
import {TestContextProvider, handleFakePress} from '../utils/tests';
import {reduceToResources} from '../layer/data/mappers';
import {Component as Correction} from './correction';

// eslint-disable-next-line no-console

const lessons = [
  createVideo({ref: 'les_1'}),
  createPdf({ref: 'les_2'}),
  createVideo({ref: 'les_3'}),
  createVideo({ref: 'les_4'}),
  createVideo({ref: 'les_5'}),
  createVideo({ref: 'les_6'})
];
const resources = reduceToResources(lessons);

const question = 'Where is Waldo ?';

const window = Dimensions.get('window');
const fakeLayout: Layout = {
  width: window.width,
  height: window.height - 60
};

storiesOf('Correction', module)
  .add('Bad answer', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers.concat(['Anything else'])}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you"
          }
          isCorrect={false}
          title="Oops..."
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading={false}
          resources={[resources[0], resources[1]]}
          lives={3}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Good answer', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading={false}
          isResourceViewed={false}
          resources={[resources[0], resources[1]]}
          lives={2}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          offeringExtraLife={false}
          canGoNext={false}
        />
      </View>
    </TestContextProvider>
  ))
  .add('With plenty of user answers and questions', () => {
    const plentyOfUserAnswers = answers.concat(answers);
    return (
      <TestContextProvider>
        <View style={fakeLayout}>
          <Correction
            answers={answers}
            userAnswers={plentyOfUserAnswers}
            tip={
              "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
            }
            title="Oops..."
            isCorrect={false}
            onButtonPress={handleFakePress}
            question={question}
            subtitle="Bad Answer"
            keyPoint="The KEY POINT"
            layout={fakeLayout}
            isLoading={false}
            resources={[resources[0], resources[1]]}
            lives={2}
            onPDFButtonPress={handleFakePress}
            onVideoPlay={handleFakePress}
          />
        </View>
      </TestContextProvider>
    );
  })
  .add('With only one answer', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={[answers[0]]}
          userAnswers={[answers[0]]}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading={false}
          resources={[resources[0], resources[1]]}
          lives={3}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Last bad answer', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers.concat(['Anything else'])}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you"
          }
          isCorrect={false}
          isLoading={false}
          title="Oops..."
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          resources={[resources[0], resources[1]]}
          lives={0}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Last good answer', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading={false}
          resources={[resources[0], resources[1]]}
          lives={1}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Bad answer without lives', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers.concat(['Anything else'])}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you"
          }
          isCorrect={false}
          isResourceViewed={false}
          title="Oops..."
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          resources={[resources[0], resources[1]]}
          isLoading={false}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Good answer without lives', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          resources={[resources[0], resources[1]]}
          isLoading={false}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Last good answer without lives', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading={false}
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Next button was pressed, should be set in loading state', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Good answer and lesson was viewed (cards order 1)', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          isResourceViewed
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          canGoNext
          offeringExtraLife={false}
          showResourcesFirst={false}
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          lives={1}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Good answer and lesson was not viewed (cards order 2)', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Good job!"
          isCorrect
          isResourceViewed={false}
          offeringExtraLife={false}
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Good Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          lives={2}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Bad answer and lesson was not viewed, extralife is offered (cards order 3)', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Oops..."
          isCorrect={false}
          isResourceViewed={false}
          showResourcesFirst
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          canGoNext={false}
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          offeringExtraLife
          lives={0}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Bad answer and lesson was viewed: extralife is consumed (cards order 3)', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Oops..."
          isCorrect={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          isResourceViewed
          showResourcesFirst
          canGoNext
          offeringExtraLife={false}
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          lives={1}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Bad answer and lesson was viewed (cards order 4)', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Oops..."
          isCorrect={false}
          isResourceViewed
          offeringExtraLife={false}
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          lives={2}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Bad answer and lesson was not viewed (cards order 5)', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Oops..."
          isCorrect={false}
          isResourceViewed={false}
          offeringExtraLife={false}
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          lives={2}
        />
      </View>
    </TestContextProvider>
  ))
  .add('Bad answer and lesson was not viewed but extralife was already consumed', () => (
    <TestContextProvider>
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={answers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Oops..."
          isCorrect={false}
          isResourceViewed={false}
          showResourcesFirst={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isLoading
          canGoNext={false}
          resources={[resources[0], resources[1]]}
          onPDFButtonPress={handleFakePress}
          onVideoPlay={handleFakePress}
          offeringExtraLife={false}
          lives={0}
        />
      </View>
    </TestContextProvider>
  ));
