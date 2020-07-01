import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Choice} from '../types/coorpacademy/progression-engine';

import {QUESTION_TYPE} from '../const';
import theme from '../modules/theme';
import QuestionChoice from './question-choice';
import DropZone from './drop-zone';

export interface Props {
  choices: Array<Choice>;
  userChoices: Array<string>;
  testID?: string;
  onPress: (item: Choice) => void;
}

const styles = StyleSheet.create({
  container: {},
  pickableChoices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choice: {
    margin: theme.spacing.micro,
  },
});

// this algo could be improve using a  single reduce fuction
export const extractSelectedChoices = (
  availableChoices: Array<Choice>,
  userChoices: Array<string>,
): Array<Array<Choice>> => {
  const selectedChoices: Array<Choice> = userChoices.reduce((accumulator, currentValue) => {
    const foundItem = availableChoices.find(
      (availableChoice) => availableChoice.label === currentValue,
    );
    if (foundItem) {
      return [...accumulator, foundItem];
    }
    return accumulator;
  }, []);

  const notSelectedChoices = availableChoices.filter(
    (availableChoice) => !userChoices.includes(availableChoice.label),
  );

  return [selectedChoices, notSelectedChoices];
};

class QuestionDraggable extends React.PureComponent<Props> {
  handlePress = (item: Choice) => () => this.props.onPress(item);

  render() {
    const {choices, onPress, testID, userChoices} = this.props;

    const [selectedChoices, notSelectedChoices] = extractSelectedChoices(choices, userChoices);

    const mappedunselectedChoices = notSelectedChoices.map((item, index) => (
      <QuestionChoice
        style={styles.choice}
        key={item._id}
        squeezed
        testID={`choice-${item._id}-unselected`}
        onPress={this.handlePress(item)}
        questionType={QUESTION_TYPE.DRAG_DROP}
      >
        {item.label}
      </QuestionChoice>
    ));

    return (
      <View style={styles.container} testID={testID}>
        <DropZone choices={selectedChoices} onPress={onPress} />
        <View style={styles.pickableChoices}>{mappedunselectedChoices}</View>
      </View>
    );
  }
}

export default QuestionDraggable;
