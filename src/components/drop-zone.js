// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Choice} from '@coorpacademy/progression-engine';

import {QUESTION_TYPE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import withDarkMode from '../containers/with-dark-mode';
import type {WithDarkModeProps} from '../containers/with-dark-mode';
import QuestionChoice from './question-choice';
import Text from './text';

export type Props = {|
  ...withDarkModeProps,
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
  dropZoneDarMode: {
    borderColor: theme.colors.gray.dark,
    backgroundColor: '#373737'
  },
  emptyContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 60
  },
  text: {
    color: theme.colors.gray.medium
  },
  textDarkMode: {
    color: theme.colors.white
  }
});

class DropZone extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: Choice) => () => this.props.onPress(item);

  render() {
    const {choices, isDarkModeActivated} = this.props;
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
      <View
        style={[
          styles.dropZone,
          hasNoSelectedChoices && styles.emptyContent,
          isDarkModeActivated && styles.dropZoneDarMode
        ]}
      >
        {hasNoSelectedChoices && (
          <Text style={[styles.text, isDarkModeActivated && styles.textDarkMode]}>
            {translations.selectSomethingBelow}
          </Text>
        )}

        {!hasNoSelectedChoices && mappedSortedChoices}
      </View>
    );
  }
}

export default withDarkMode(DropZone);
