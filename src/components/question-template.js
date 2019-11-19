// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Choice} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import {QUESTION_TYPE} from '../const';
import {parseTemplate, TEMPLATE_PART_TYPE} from '../modules/template';
import Html from './html';
import QuestionInput, {ROW_SPACE} from './question-input';

type Props = {|
  isDisabled?: boolean,
  template: string,
  items: Array<Choice>,
  userChoices: Array<string>,
  onInputChange: (item: Choice, value: string) => void
|};

const styles = StyleSheet.create({
  template: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: ROW_SPACE,
    color: theme.colors.black,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 30
  }
});

class QuestionTemplate extends React.PureComponent<Props> {
  props: Props;

  handleInputChange = (item: Choice) => (value: string) => this.props.onInputChange(item, value);

  render() {
    const {isDisabled, template, items, userChoices} = this.props;

    if (!template) {
      return null;
    }

    const parts = parseTemplate(template);
    const inputNames = items.map(item => item.name);

    return (
      <View testID="question-template" style={styles.template}>
        {parts.map((part, index) => {
          const testID = `question-part-${index + 1}`;

          if (part.type === TEMPLATE_PART_TYPE.INPUT && inputNames.includes(part.value)) {
            const itemIndex = items.findIndex(_item => _item.name === part.value);
            const item = items[itemIndex];
            const value = userChoices[itemIndex];

            if (!item || !item.type || !item.name) {
              return null;
            }

            return (
              <QuestionInput
                questionType={QUESTION_TYPE.TEMPLATE}
                isDisabled={isDisabled}
                type={item.type}
                onChange={this.handleInputChange(item)}
                items={item.items}
                value={value}
                testID={testID}
                key={testID}
                id={testID}
              />
            );
          }

          return (
            <Html
              key={testID}
              fontSize={theme.fontSize.regular}
              testID={testID}
              style={styles.text}
            >
              {part.value}
            </Html>
          );
        })}
      </View>
    );
  }
}

export default QuestionTemplate;
