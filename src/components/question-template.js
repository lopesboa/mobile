// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import trim from 'lodash/fp/trim';
import last from 'lodash/fp/last';
import type {Choice} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import {QUESTION_TYPE} from '../const';
import {parseTemplate, TEMPLATE_PART_TYPE} from '../modules/template';
import Html from './html';
import QuestionInput, {ROW_SPACE} from './question-input';
import Space from './space';

type Props = {|
  isDisabled?: boolean,
  template: string,
  items: Array<Choice>,
  userChoices: Array<string>,
  onInputChange: (item: Choice, value: string) => void
|};

const styles = StyleSheet.create({
  section: {
    width: '100%',
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

  sectionKeyExtractor = (items: Array<Choice>, index: number) => `question-section-${index + 1}`;

  keyExtractor = (prefix: string) => (item: Choice, index: number) => `${prefix}-part-${index + 1}`;

  renderSection = ({item: items, index}: {item: Array<Choice>, index: number}) => {
    const prefix = this.sectionKeyExtractor(items, index);
    return (
      <View style={styles.section}>
        {items.map((item, id) => {
          return (
            <View key={id} style={{flexDirection: 'row'}}>
              {this.renderItem(prefix)({item: item, index: id})}
              {this.renderSeparator()}
            </View>
          );
        })}
      </View>
    );
  };

  renderItem = (prefix: string) => ({item: part, index}: {item: Choice, index: number}) => {
    const {isDisabled, items, userChoices} = this.props;
    const inputNames = items.map(item => item.name);
    const testID = this.keyExtractor(prefix)(part, index);

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
      <Html key={testID} fontSize={theme.fontSize.regular} testID={testID} style={styles.text}>
        {trim(part.value)}
      </Html>
    );
  };

  renderSeparator = () => <Space type="micro" />;

  render() {
    const {template} = this.props;

    if (!template) {
      return null;
    }

    const parts = parseTemplate(template);

    const sections: Array<Array<Choice>> = parts.reduce((result, item) => {
      const section = last(result) || [];
      return result.slice(0, -1).concat([section.concat([item])]);
    }, []);

    return (
      <View style={{flex: 1}} testID="question-template">
        {sections.map((section, index) => {
          return this.renderSection({item: section, index});
        })}
      </View>
    );
  }
}

export default QuestionTemplate;
