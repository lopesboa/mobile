// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Choice} from '@coorpacademy/progression-engine';

import {QUESTION_TYPE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import QuestionChoice from './question-choice';
import Text from './text';

export type Props = {|
  choices: Array<Choice>,
  onPress: (item: Choice) => void
|};

const styles = StyleSheet.create({
  choice: {
    margin: theme.spacing.micro
  },
  dropZone: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderStyle: 'dashed',
    borderWidth: 2,
    padding: theme.spacing.micro,
    borderColor: theme.colors.gray.light,
    backgroundColor: theme.colors.gray.extra,
    borderRadius: theme.radius.common,
    marginBottom: theme.spacing.tiny
  },
  emptyContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 60
  },
  text: {
    color: theme.colors.gray.medium
  }
});

class DropZone extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: Choice) => () => this.props.onPress(item);

  render() {
    const {choices} = this.props;
    const mappedSortedChoices = choices.map(item => (
      <QuestionChoice
        style={styles.choice}
        key={item._id}
        squeezed
        isSelected
        testID={`choice-${item._id}`}
        onPress={this.handlePress(item)}
        questionType={QUESTION_TYPE.DRAG_DROP}
      >
        {item.label}
      </QuestionChoice>
    ));

    const hasNoSelectedChoices = mappedSortedChoices.length === 0;

    return (
      <View style={[styles.dropZone, hasNoSelectedChoices && styles.emptyContent]}>
        {hasNoSelectedChoices && (
          <Text style={styles.text}>{translations.selectSomethingBelow}</Text>
        )}

        {!hasNoSelectedChoices && mappedSortedChoices}
      </View>
    );
  }
}

export default DropZone;
