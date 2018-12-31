// @flow
import type {QuestionChoiceItem} from '../types';
import questionChoices from './question-choices';

const choices: Array<QuestionChoiceItem> = questionChoices.map(questionChoice => ({
  ...questionChoice,
  image: require('./image.png')
}));

export default choices;
