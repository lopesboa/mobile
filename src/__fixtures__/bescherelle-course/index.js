// @flow strict

import type {BundledDiscipline, Slide} from '../../layer/data/_types';
import {successExitNode, failExitNode} from './exit-nodes';
import discipline from './discipline';
import {
  cha_41oEKnwv4,
  cha_4JSwqRvvV,
  cha_EJxlY5RPvE,
  cha_N1Iv9RvwV,
  cha_N1JKqADDE,
  cha_NJvw5CPPN,
  cha_VkbEthvwE
} from './chapters';

import * as Slides from './slides';

const slides: {[key: string]: Slide} = Object.keys(Slides).reduce((accumulator, currentValue) => {
  // eslint-disable-next-line import/namespace
  const currentItem = Slides[currentValue];
  return {
    ...accumulator,
    [currentItem.universalRef]: currentItem
  };
}, {});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    [discipline.universalRef]: discipline
  },
  chapters: {
    [cha_41oEKnwv4.universalRef]: cha_41oEKnwv4,
    [cha_4JSwqRvvV.universalRef]: cha_4JSwqRvvV,
    [cha_EJxlY5RPvE.universalRef]: cha_EJxlY5RPvE,
    [cha_N1Iv9RvwV.universalRef]: cha_N1Iv9RvwV,
    [cha_N1JKqADDE.universalRef]: cha_N1JKqADDE,
    [cha_NJvw5CPPN.universalRef]: cha_NJvw5CPPN,
    [cha_VkbEthvwE.universalRef]: cha_VkbEthvwE
  },
  slides,
  exitNodes: {
    [failExitNode.ref]: failExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};
export default bundledDiscipline;
